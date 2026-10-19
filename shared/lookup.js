/* Bấm vào từ vựng trong bài đọc để xem nghĩa – dùng chung cho mọi bộ đề.
   Không sửa HTML bài đọc (để không đụng phần tô sáng/ghi chú); gạch chân bằng CSS Custom Highlight nếu trình duyệt hỗ trợ. */
(function () {
  'use strict';
  var m = document.title.match(/Test\s+(\d)/);
  var V = window.C20VOCAB && m && window.C20VOCAB[m[1]];
  if (!V) return;

  function clean(t) { return t.replace(/\([^)]*\)/g, '').replace(/\//g, ', ').replace(/\s+/g, ' ').trim(); }
  function slug(t) { return clean(t).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-+|-+$)/g, ''); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function forms(w) {
    var f = [w];
    if (/e$/.test(w)) f.push(w + 's', w + 'd', w.slice(0, -1) + 'ing', w + 'r', w + 'st');
    else if (/[^aeiou]y$/.test(w)) f.push(w.slice(0, -1) + 'ies', w.slice(0, -1) + 'ied', w + 'ing', w.slice(0, -1) + 'ier');
    else if (/(s|x|z|ch|sh)$/.test(w)) f.push(w + 'es', w + 'ed', w + 'ing');
    else {
      f.push(w + 's', w + 'ed', w + 'ing', w + 'er', w + 'ly');
      if (/[^aeiou][aeiou][bdgmnprt]$/.test(w)) { var d = w + w.slice(-1); f.push(d + 'ed', d + 'ing'); }
    }
    return f;
  }
  function pattern(en) {
    var words = clean(en).split(/,\s*/)[0].toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return null;
    var reEsc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "['’]"); };
    var first = '(?:' + forms(words[0]).map(reEsc).join('|') + ')';
    var rest = words.slice(1).map(function (x) { return x === 'sth' || x === 'sb' || x === 'something' || x === 'someone' ? "[\\w'’-]+" : reEsc(x); });
    var body = words.length === 1 ? '(?:' + forms(words[0]).map(reEsc).join('|') + ')' : first + rest.map(function (r) { return '\\s+' + r; }).join('');
    return new RegExp("(^|[^A-Za-z'’-])(" + body + ")(?![A-Za-z'’-])", 'gi');
  }

  var css = document.createElement('style');
  css.textContent =
    '::highlight(cam-vocab){text-decoration:underline dotted #a8691a 2px;text-underline-offset:3px;background-color:rgba(242,226,196,.45)}' +
    '.vpop{position:absolute;z-index:70;max-width:300px;background:#fff;border:1px solid #ddd7c9;border-top:3px solid #a8691a;border-radius:10px;box-shadow:0 10px 30px rgba(30,35,43,.2);padding:10px 12px;font:14px/1.45 "IBM Plex Sans",system-ui,sans-serif;color:#1e232b}' +
    '.vpop .w{font-family:Fraunces,Georgia,serif;font-size:18px;font-weight:600;color:#6b4410}' +
    '.vpop .p{color:#666e7a;font-size:12.5px;margin-left:6px}' +
    '.vpop .i{color:#666e7a;font-size:13px}' +
    '.vpop .v{margin-top:4px}' +
    '.vpop button{font:inherit;font-size:13px;border:1px solid #ddd7c9;background:#faf8f4;border-radius:7px;padding:2px 9px;cursor:pointer;margin-left:6px;vertical-align:2px}' +
    '.vpop .x{position:absolute;top:4px;right:6px;border:0;background:none;font-size:15px;color:#666e7a;padding:2px 4px}' +
    '.vhint{font-size:12.5px;color:#6b4410}';
  document.head.appendChild(css);

  var HL = (window.CSS && CSS.highlights && window.Highlight) ? new Highlight() : null;
  if (HL) CSS.highlights.set('cam-vocab', HL);
  var hits = [];

  function scan() {
    hits = []; if (HL) HL.clear();
    var pss = document.querySelectorAll('.passage');
    for (var a = 0; a < pss.length; a++) {
      var ps = pss[a], i = +String(ps.id).replace('passage', ''), list = V['R' + i];
      var box = ps.querySelector('.ptext'); if (!list || !box) continue;
      var pats = list.map(function (e) { return { e: e, re: pattern(e.en) }; }).filter(function (x) { return x.re; });
      var tw = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null), node;
      while ((node = tw.nextNode())) {
        if (node.parentElement && node.parentElement.closest('.evtag,.loc,button')) continue;
        var t = node.nodeValue; if (!t || t.length < 3) continue;
        pats.forEach(function (p) {
          p.re.lastIndex = 0; var mm;
          while ((mm = p.re.exec(t))) {
            var s = mm.index + mm[1].length, r = document.createRange();
            r.setStart(node, s); r.setEnd(node, s + mm[2].length);
            hits.push({ r: r, e: p.e }); if (HL) HL.add(r);
          }
        });
      }
    }
  }

  var pop = document.createElement('div'); pop.className = 'vpop'; pop.hidden = true; document.body.appendChild(pop);
  var au = new Audio();
  function voice() { try { var v = (JSON.parse(localStorage.getItem('summaryNew.fc.voice')) || {}).v || ''; return v.indexOf('f:') === 0 ? v.slice(2) : 'us-f'; } catch (e) { return 'us-f'; } }
  function say(en) {
    au.src = 'audio/vocab/' + voice() + '/' + slug(en) + '.mp3';
    au.play().catch(function () { try { var u = new SpeechSynthesisUtterance(clean(en)); u.lang = 'en-US'; speechSynthesis.speak(u); } catch (e) {} });
  }
  function show(h, x, y) {
    var e = h.e;
    pop.innerHTML = '<button type="button" class="x" aria-label="Đóng">✕</button><span class="w">' + esc(e.en) + '</span><span class="p">' + esc(e.pos || '') + '</span>' +
      '<div class="i">' + esc(e.ipa || '') + ' <button type="button" class="s">🔊 Nghe</button></div><div class="v">' + esc(e.vi || '') + '</div>';
    pop.hidden = false;
    pop.querySelector('.x').onclick = function () { pop.hidden = true; };
    pop.querySelector('.s').onclick = function () { say(e.en); };
    var rc = h.r.getBoundingClientRect();
    var left = Math.max(8, Math.min(window.innerWidth - pop.offsetWidth - 8, rc.left));
    var top = rc.bottom + 8 + window.scrollY;
    if (rc.bottom + pop.offsetHeight + 16 > window.innerHeight) top = rc.top - pop.offsetHeight - 8 + window.scrollY;
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }
  function caret(x, y) {
    if (document.caretPositionFromPoint) { var p = document.caretPositionFromPoint(x, y); return p && { n: p.offsetNode, o: p.offset }; }
    if (document.caretRangeFromPoint) { var r = document.caretRangeFromPoint(x, y); return r && { n: r.startContainer, o: r.startOffset }; }
    return null;
  }
  document.addEventListener('click', function (ev) {
    if (pop.contains(ev.target)) return;
    var inText = ev.target.closest && ev.target.closest('.ptext');
    if (!inText || (ev.target.closest('mark.hl,button,.loc')) || String(window.getSelection() || '').trim()) { pop.hidden = true; return; }
    var c = caret(ev.clientX, ev.clientY); if (!c) { pop.hidden = true; return; }
    for (var k = 0; k < hits.length; k++) {
      var r = hits[k].r;
      try { if (r.startContainer === c.n && c.o >= r.startOffset && c.o <= r.endOffset) { show(hits[k]); return; } } catch (e) {}
    }
    pop.hidden = true;
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.hidden = true; });
  window.addEventListener('resize', function () { pop.hidden = true; });

  function hint() {
    document.querySelectorAll('.passage .ptools').forEach(function (bar) {
      if (bar.querySelector('.vhint')) return;
      var s = document.createElement('span'); s.className = 'vhint'; s.textContent = '· Bấm vào từ gạch chân để xem nghĩa';
      var first = bar.querySelector('span'); if (first) first.insertAdjacentElement('afterend', s); else bar.appendChild(s);
    });
  }
  var tmr = null;
  function rescan() { clearTimeout(tmr); tmr = setTimeout(scan, 120); }
  function init() {
    scan(); hint();
    var mo = new MutationObserver(function (list) {
      for (var j = 0; j < list.length; j++) { var t = list[j].target; if (t.closest && t.closest('.ptext') || (t.nodeType === 3 && t.parentElement && t.parentElement.closest('.ptext'))) { rescan(); return; } }
    });
    document.querySelectorAll('.ptext').forEach(function (p) { mo.observe(p, { childList: true, subtree: true, characterData: true }); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else setTimeout(init, 0);
})();

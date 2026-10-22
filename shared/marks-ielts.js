/* Đánh dấu ☆ + ghi chú cho câu hỏi trong đề Cambridge IELTS. Lưu 'mt.marks.ielts', xem lại ở danh-dau.html */
(function () {
  'use strict';
  var KEY = 'mt.marks.ielts';
  var m = /\/((?:c|v)\d+)\/test-(\d+)\.html$/.exec(location.pathname); if (!m) return;
  var BOOK = m[1], T = +m[2], NAME = (BOOK[0] === 'v' ? 'Original Exams VOL ' : 'Cambridge IELTS ') + BOOK.slice(1) + ' · Test ' + T, PATH = BOOK + '/test-' + T + '.html';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  var css = document.createElement('style');
  css.textContent =
    '.qmk{display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;margin:0 4px;width:26px;height:26px;border-radius:50%;border:1.5px solid var(--line,#ddd7c9);background:var(--card,#fff);color:var(--dim,#8a8f99);font:600 14px/1 "IBM Plex Sans",sans-serif;cursor:pointer;padding:0;flex:none}' +
    '.qmk:hover{border-color:#e0a520;color:#e0a520}.qmk.on{background:#ffc94a;border-color:#e0a520;color:#5a3a00}.qmk.nt::after{content:"";width:6px;height:6px;border-radius:50%;background:#1f8f6c;position:relative;top:-9px;left:1px;margin-left:-6px}' +
    '.qmkp{position:absolute;z-index:85;width:min(300px,calc(100vw - 24px));background:var(--card,#fff);border:1px solid var(--line,#ddd7c9);border-radius:14px;box-shadow:0 12px 30px rgba(0,0,0,.18);padding:12px;font:14px/1.45 "IBM Plex Sans",sans-serif;color:var(--ink,#1e232b)}' +
    '.qmkp b{display:block;margin-bottom:6px}.qmkp textarea{width:100%;min-height:70px;border:1.5px dashed var(--line,#ddd7c9);border-radius:10px;padding:7px 9px;font:inherit;background:#fffdf6;color:inherit;resize:vertical}' +
    'html[data-theme=dark] .qmkp textarea{background:rgba(255,255,255,.05)}' +
    '.qmkp .r{display:flex;justify-content:space-between;align-items:center;margin-top:8px;gap:8px}.qmkp button{font:600 13px/1 "IBM Plex Sans",sans-serif;border:1.5px solid var(--line,#ddd7c9);background:var(--card,#fff);color:inherit;border-radius:999px;padding:6px 11px;cursor:pointer}' +
    '.qmkp a{font-weight:700;font-size:13px;color:var(--brand-ink,#6b4410)}' +
    '.qmk-hl{outline:3px solid #ffc94a;outline-offset:4px;border-radius:6px;transition:outline-color 1.5s}';
  document.head.appendChild(css);
  function snippet(anchor, q) {
    var c = anchor.cloneNode(true);
    [].forEach.call(c.querySelectorAll('select,input,.qmk,label.opt,.opts,ul,ol'), function (x) { x.remove(); });
    var t = c.textContent.replace(/\s+/g, ' ').trim();
    return (t || ('Câu ' + q.slice(1))).slice(0, 160);
  }
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('click', function (e) { if (pop && !pop.contains(e.target) && !e.target.classList.contains('qmk')) closePop(); });
  function decorate() {
    var M = load(), seen = {};
    [].forEach.call(document.querySelectorAll('[data-q]'), function (el) {
      var q = el.getAttribute('data-q'); if (!/^[LR]\d+$/.test(q) || seen[q]) return; seen[q] = 1;
      var byId = document.getElementById(q[0] + 'q' + q.slice(1)); var line = (byId && byId.querySelector('.qn') ? byId : null) || el.closest('.qline, li, td, p') || el.parentElement;
      var qn = line && line.querySelector('.qn');
      var b = document.createElement('button'); b.type = 'button'; b.className = 'qmk'; b.setAttribute('data-mk', q);
      var k = PATH + '#' + q, x = M[k] || {};
      paint(b, x);
      if (qn) qn.insertAdjacentElement('afterend', b);
      else el.insertAdjacentElement('afterend', b);
      b.onclick = function (e) {
        e.preventDefault(); e.stopPropagation();
        var A = load(), cur = A[k] || { book: BOOK, t: T, q: q, name: NAME, path: PATH };
        if (!cur.s && !cur.note) { cur.s = true; }
        cur.txt = snippet(line || el.parentElement, q); cur.at = Date.now(); A[k] = cur; save(A); paint(b, cur);
        openPop(b, k);
      };
    });
    var h = /^#Q-([LR]\d+)$/.exec(location.hash);
    if (h) setTimeout(function () { var t = document.querySelector('[data-mk="' + h[1] + '"]'); if (!t) return; var ln = t.closest('.qline, li, tr, p, div') || t; ln.scrollIntoView({ block: 'center' }); ln.classList.add('qmk-hl'); setTimeout(function () { ln.classList.remove('qmk-hl'); }, 2200); }, 600);
  }
  function paint(b, x) { b.classList.toggle('on', !!x.s); b.classList.toggle('nt', !!x.note); b.textContent = x.s ? '★' : '☆'; b.title = x.s ? 'Đã đánh dấu — bấm để ghi chú / bỏ' : 'Đánh dấu câu này'; b.setAttribute('aria-label', 'Đánh dấu câu ' + b.getAttribute('data-mk').slice(1)); }
  function openPop(b, k) {
    closePop();
    var x = load()[k] || {};
    pop = document.createElement('div'); pop.className = 'qmkp';
    pop.innerHTML = '<b>★ Câu ' + k.split('#')[1].slice(1) + ' (' + (k.split('#')[1][0] === 'L' ? 'Listening' : 'Reading') + ')</b><textarea placeholder="Ghi chú: bẫy, từ khoá, vì sao sai… (tự lưu)"></textarea><div class="r"><button type="button" class="un">Bỏ đánh dấu</button><a href="../danh-dau.html">Xem tất cả →</a><button type="button" class="ok">Xong</button></div>';
    document.body.appendChild(pop);
    var r = b.getBoundingClientRect(), w = pop.offsetWidth;
    pop.style.top = (window.scrollY + r.bottom + 6) + 'px';
    pop.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, window.scrollX + r.left - w / 2 + 13)) + 'px';
    var ta = pop.querySelector('textarea'); ta.value = x.note || '';
    ta.oninput = function () { var A = load(); if (!A[k]) return; A[k].note = ta.value.trim() ? ta.value : ''; save(A); paint(b, A[k]); };
    pop.querySelector('.un').onclick = function () { var A = load(); delete A[k]; save(A); paint(b, {}); closePop(); };
    pop.querySelector('.ok').onclick = closePop;
    if (!('ontouchstart' in window)) ta.focus();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(decorate, 50); }); else setTimeout(decorate, 50);
})();

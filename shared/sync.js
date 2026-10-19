/* Lời thoại chạy theo audio + 📍 phát lại đúng đoạn có đáp án.
   Dữ liệu thời gian: sync.js của từng bộ (window.CAMSYNC = {test:{part:{spanId:[start,end]}}}). */
(function () {
  'use strict';
  var m = document.title.match(/Test\s+(\d)/);
  var S = window.CAMSYNC && m && window.CAMSYNC[m[1]];
  if (!S) return;
  var EXAM = /[?&]thi=1/.test(location.search);

  var css = document.createElement('style');
  css.textContent =
    '.script-body span.kara{background:#fde7b0;border-radius:3px;box-shadow:0 0 0 2px #fde7b0}' +
    '.turnplay{font:inherit;font-size:12px;line-height:1;border:1px solid #ddd7c9;background:#faf8f4;color:#6b4410;border-radius:50%;width:22px;height:22px;cursor:pointer;margin-right:6px;vertical-align:1px;padding:0}' +
    '.turnplay:hover{background:#f2e2c4;border-color:#a8691a}' +
    '.karaopt{font-size:12.5px;color:#666e7a;display:flex;align-items:center;gap:6px;margin:4px 0 8px}' +
    '.evbar{position:fixed;left:50%;transform:translateX(-50%);bottom:14px;z-index:64;background:#1e232b;color:#fff;border-radius:12px;padding:8px 10px 8px 14px;display:flex;align-items:center;gap:8px;box-shadow:0 8px 26px rgba(0,0,0,.28);font:14px/1.3 "IBM Plex Sans",system-ui,sans-serif;max-width:calc(100% - 24px)}' +
    '.evbar button{font:inherit;font-size:13.5px;font-weight:700;border:0;border-radius:8px;padding:6px 10px;cursor:pointer;background:#f2c879;color:#1e232b;white-space:nowrap}' +
    '.evbar button.ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.35)}';
  document.head.appendChild(css);

  function partAudio(p) { var sec = document.getElementById('part' + p); return sec && sec.querySelector('audio'); }
  function sortedSpans(p) {
    var T = S[p] || {}; return Object.keys(T).map(function (id) { return { id: id, s: T[id][0], e: T[id][1] }; }).sort(function (a, b) { return a.s - b.s; });
  }

  // ---------- lời thoại chạy chữ ----------
  var follow = true; try { follow = localStorage.getItem('cam.kara.follow') !== '0'; } catch (e) {}
  Object.keys(S).forEach(function (p) {
    var au = partAudio(p), list = sortedSpans(p), sec = document.getElementById('part' + p);
    if (!au || !list.length || !sec) return;
    var body = sec.querySelector('.script-body');
    if (body && !EXAM) {
      // nút ▶ đầu mỗi lượt nói
      [].forEach.call(body.querySelectorAll('p'), function (para) {
        var sp = para.querySelector('span[id]'); if (!sp || !S[p][sp.id]) return;
        var b = document.createElement('button'); b.type = 'button'; b.className = 'turnplay'; b.title = 'Nghe từ đây'; b.textContent = '▶';
        b.onclick = function () { try { au.currentTime = Math.max(0, S[p][sp.id][0] - 0.2); } catch (e) {} au.play(); };
        para.insertBefore(b, para.firstChild);
      });
      var opt = document.createElement('label'); opt.className = 'karaopt';
      opt.innerHTML = '<input type="checkbox"' + (follow ? ' checked' : '') + '> Tự cuộn theo câu đang phát';
      opt.querySelector('input').onchange = function () { follow = this.checked; try { localStorage.setItem('cam.kara.follow', follow ? '1' : '0'); } catch (e) {} };
      body.insertBefore(opt, body.firstChild);
    }
    var cur = null;
    au.addEventListener('timeupdate', function () {
      if (EXAM) return;
      var t = au.currentTime, hit = null, lo = 0, hi = list.length - 1;
      while (lo <= hi) { var mid = (lo + hi) >> 1; if (list[mid].s <= t) { hit = list[mid]; lo = mid + 1; } else hi = mid - 1; }
      if (hit && t > hit.e + 1.5) hit = null;
      var id = hit && hit.id;
      if (id === cur) return;
      if (cur) { var o = document.getElementById(cur); if (o) o.classList.remove('kara'); }
      cur = id;
      if (!id) return;
      var el = document.getElementById(id); if (!el) return;
      el.classList.add('kara');
      var det = el.closest('details');
      if (follow && det && det.open) {
        var r = el.getBoundingClientRect();
        if (r.top < 90 || r.bottom > window.innerHeight - 80) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // ---------- 📍 phát đúng đoạn có đáp án ----------
  var bar = null, stopAt = 0, timer = null, curAu = null;
  function stop() { if (curAu) curAu.pause(); clearInterval(timer); }
  function playSeg(au, s, e) {
    stop(); curAu = au;
    try { au.currentTime = Math.max(0, s); } catch (x) {}
    stopAt = e; au.play();
    timer = setInterval(function () { if (au.currentTime >= stopAt) { au.pause(); clearInterval(timer); } }, 80);
  }
  function showBar(p, id, n) {
    var au = partAudio(p), t = S[p][id]; if (!au || !t) return;
    var sure = t[2] !== 0, pad0 = sure ? 0.3 : 3, pad1 = sure ? 1.2 : 3;   // câu ước lượng: phát rộng hơn
    if (!bar) { bar = document.createElement('div'); bar.className = 'evbar'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Nghe đoạn có đáp án'); document.body.appendChild(bar); }
    bar.innerHTML = '<span>🎧 Câu ' + n + '</span><button type="button" data-a="here">▶ Nghe đoạn đáp án</button><button type="button" data-a="pre" class="ghost">⟲ Từ 5 giây trước</button><button type="button" data-a="x" class="ghost" aria-label="Đóng">✕</button>';
    bar.hidden = false;
    bar.onclick = function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'here') playSeg(au, t[0] - pad0, t[1] + pad1);
      else if (b.dataset.a === 'pre') playSeg(au, t[0] - 5 - pad0, t[1] + pad1);
      else { stop(); bar.hidden = true; }
    };
    playSeg(au, t[0] - pad0, t[1] + pad1);
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('#sectL .loc:not(.xpb)');
    var b2 = ev.target.closest && ev.target.closest('#xpSheet .xp-ev');
    if (!b && !b2) return;
    setTimeout(function () {
      var sp = document.querySelector('#sectL .evhl'); if (!sp || !sp.id) return;
      var mm = sp.id.match(/^trL(\d)-/); if (!mm) return;
      showBar(mm[1], sp.id, sp.getAttribute('data-q') || '');
    }, 60);
  }, true);
})();

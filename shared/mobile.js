/* Tối ưu cho điện thoại: bảng cuộn ngang, phiếu trả lời gọn lại, nút nhảy giữa bài đọc và câu hỏi. */
(function () {
  'use strict';
  var css = document.createElement('style');
  css.textContent =
    '@media (max-width:700px){' +
    '.part table,.passage table,.ptext table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%}' +
    '.panel.mini .grid,.panel.mini .hint{display:none}' +
    '.panel h2 .ptog{float:right;font:600 13px/1 "IBM Plex Sans",sans-serif;border:1.5px solid #ddd7c9;background:#fff;color:#6b4410;border-radius:999px;padding:5px 10px;cursor:pointer}' +
    '.jumpq{position:fixed;left:12px;bottom:14px;z-index:60;font:700 13.5px/1 "IBM Plex Sans",sans-serif;background:#6b4410;color:#fff;border:0;border-radius:999px;padding:11px 14px;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer}' +
    'main{padding-left:12px!important;padding-right:12px!important}.part,.passage{padding:14px 13px!important}' +
    '}';
  document.head.appendChild(css);
  if (window.innerWidth > 700) return;
  // phiếu trả lời: thu gọn mặc định, vẫn giữ nút Nộp bài
  [].forEach.call(document.querySelectorAll('.panel'), function (pn) {
    var h = pn.querySelector('h2'); if (!h || h.querySelector('.ptog')) return;
    pn.classList.add('mini');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'ptog'; b.textContent = '▾ Xem các câu';
    b.onclick = function () { var m = pn.classList.toggle('mini'); b.textContent = m ? '▾ Xem các câu' : '▴ Thu gọn'; };
    h.appendChild(b);
  });
  // nút nhảy giữa bài đọc và câu hỏi (Reading)
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'jumpq'; btn.hidden = true; document.body.appendChild(btn);
  function curPassage() {
    var best = null;
    [].forEach.call(document.querySelectorAll('.passage'), function (p) { if (p.offsetParent === null) return; var r = p.getBoundingClientRect(); if (r.top < window.innerHeight * 0.6 && r.bottom > 80) best = p; });
    return best;
  }
  function upd() {
    var p = curPassage(); if (!p) { btn.hidden = true; return; }
    var q = p.querySelector('.pqs'), t = p.querySelector('.ptext'); if (!q || !t) { btn.hidden = true; return; }
    var inQ = q.getBoundingClientRect().top < window.innerHeight * 0.5;
    btn.hidden = false; btn.textContent = inQ ? '📄 Về bài đọc' : '❓ Tới câu hỏi';
    btn.onclick = function () { (inQ ? t : q).scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(upd, 600); };
  }
  window.addEventListener('scroll', function () { clearTimeout(upd.t); upd.t = setTimeout(upd, 120); }, { passive: true });
  setTimeout(upd, 500);
})();

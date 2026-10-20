/* Gắn nhãn dạng câu hỏi (kèm mẹo ngắn) vào mỗi nhóm "Questions X–Y" trong trang làm bài. */
(function () {
  'use strict';
  var bm = location.pathname.match(/\/(c\d\d)\//), tm = document.title.match(/Test\s+(\d)/);
  if (!bm || !tm) return;
  var TIPS = {
    notes: 'Đọc trước để đoán loại từ cần điền (số, tên, danh từ…). Chú ý giới hạn số từ và chính tả.',
    sentence: 'Đáp án phải khớp ngữ pháp với câu. Chú ý giới hạn số từ.',
    summary: 'Lấy đúng từ trong bài, không đổi dạng. Đọc cả câu để đoán loại từ.',
    short: 'Trả lời ngắn gọn bằng từ trong bài/audio, đúng giới hạn số từ.',
    mcq: 'Gạch từ khoá câu hỏi. Cẩn thận phương án "bẫy" chứa từ giống bài nhưng sai nghĩa.',
    choose2: 'Chọn đủ số đáp án đề yêu cầu; thứ tự không quan trọng.',
    matching: 'Đọc hết danh sách lựa chọn trước; mỗi lựa chọn có thể dùng một lần hoặc nhiều lần — xem kỹ đề.',
    map: 'Định hướng trước: lối vào, các hướng, vật mốc. Nghe từ chỉ vị trí (next to, opposite…).',
    flow: 'Làm theo thứ tự các bước; đáp án thường theo đúng trình tự trong bài.',
    tfng: 'TRUE = bài nói đúng vậy · FALSE = bài nói ngược lại · NOT GIVEN = bài không nhắc tới.',
    ynng: 'Giống T/F/NG nhưng hỏi về QUAN ĐIỂM của tác giả: YES = đồng ý · NO = ngược lại · NOT GIVEN = không nói.',
    headings: 'Đọc câu đầu/cuối mỗi đoạn để nắm ý chính; loại bỏ heading đã dùng.',
    para: 'Tìm đoạn CHỨA thông tin; một đoạn có thể dùng nhiều lần. Làm sau cùng cũng được.',
    endings: 'Nối phải đúng cả nghĩa lẫn ngữ pháp; đọc lại cả câu sau khi nối.',
    summarybox: 'Chọn từ trong khung, thường là từ đồng nghĩa với bài. Đoán loại từ trước.'
  };
  function run() {
    var C = window.CAMCATS && window.CAMCATS[bm[1]] && window.CAMCATS[bm[1]][tm[1]], NM = window.CAMCATNAMES || {};
    if (!C) return;
    var css = document.createElement('style');
    css.textContent = '.qtype{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 0 8px;vertical-align:1px}' +
      '.qtype b{font:600 12.5px/1.5 "IBM Plex Sans",sans-serif;color:#6b4410;background:#f2e2c4;border-radius:999px;padding:1px 10px}' +
      '.qtype button{font:600 12px/1 "IBM Plex Sans",sans-serif;border:1px solid #ddd7c9;background:#fff;color:#6b4410;border-radius:999px;padding:3px 8px;cursor:pointer}' +
      '.qtip{display:block;font:400 13.5px/1.5 "IBM Plex Sans",sans-serif;color:#3b4350;background:#faf6ee;border-left:3px solid #a8691a;border-radius:4px;padding:6px 10px;margin:6px 0 0}';
    document.head.appendChild(css);
    ['L', 'R'].forEach(function (S) {
      var sec = document.getElementById('sect' + S); if (!sec) return;
      [].forEach.call(sec.querySelectorAll('p > strong:first-child'), function (st) {
        var m = st.textContent.match(/^Questions?\s+(\d+)/); if (!m || st.parentNode.querySelector('.qtype')) return;
        var k = C[S + m[1]]; if (!k) return;
        var w = document.createElement('span'); w.className = 'qtype';
        w.innerHTML = '<b>' + (NM[k] || k) + '</b>' + (TIPS[k] ? '<button type="button" aria-expanded="false">💡 mẹo</button>' : '');
        st.parentNode.appendChild(w);
        var bt = w.querySelector('button');
        if (bt) bt.onclick = function () {
          var tip = st.parentNode.querySelector('.qtip');
          if (tip) { tip.remove(); bt.setAttribute('aria-expanded', 'false'); return; }
          tip = document.createElement('span'); tip.className = 'qtip'; tip.textContent = TIPS[k]; st.parentNode.appendChild(tip); bt.setAttribute('aria-expanded', 'true');
        };
      });
    });
  }
  if (window.CAMCATS) run();
  else { var s = document.createElement('script'); s.src = '../shared/cats.js'; s.onload = run; document.head.appendChild(s); }
})();

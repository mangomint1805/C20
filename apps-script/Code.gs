/**
 * Nhận kết quả luyện tập Cambridge IELTS 20 và ghi vào Google Sheet.
 * Cách cài: mở Google Sheet → Tiện ích mở rộng → Apps Script → dán toàn bộ file này →
 * chạy hàm setup() một lần → Triển khai → Triển khai mới → Ứng dụng web
 * (Thực thi với tư cách: Tôi, Người có quyền truy cập: Bất kỳ ai) → copy link /exec
 * dán vào SCRIPT_URL trong file config.js của trang web.
 */
const SHEET_NAME = 'Kết quả Cam 20';
const HEAD = ['Thời gian', 'Họ tên', 'Lớp / nhóm', 'Test', 'Phần', 'Chế độ', 'Đúng', 'Tổng', '% đúng', 'Band (ước tính)',
              'Số phút', 'Câu sai', 'Hết giờ tự nộp', 'Thiết bị'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.kind !== 'cam20') return out_({ ok: false, error: 'sai loại dữ liệu' });
    const sh = sheet_();
    const total = Number(d.total) || 0, got = Number(d.got) || 0;
    const pct = total ? Math.round(got / total * 1000) / 10 : '';
    sh.appendRow([
      new Date(d.submittedAt || Date.now()), d.name || '(chưa nhập tên)', d.lop || '', d.test || '', d.part || '',
      d.mode || '', got, total, pct, d.band || '', d.minutes || '', d.wrong || '', d.auto ? 'Có' : '', d.userAgent || ''
    ]);
    const r = sh.getLastRow();
    sh.getRange(r, 7, 1, 4).setBackground(pct >= 70 ? '#e1f4ec' : pct >= 50 ? '#fdf3dc' : '#fbe6e2');
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out_({ ok: true, info: 'Cam 20 results endpoint' }); }

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  sheet_();
  ['Trang tính1', 'Sheet1'].forEach(n => { const d = ss.getSheetByName(n); if (d && ss.getSheets().length > 1) ss.deleteSheet(d); });
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEAD);
    sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold').setBackground('#f2e2c4');
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
    sh.setColumnWidth(2, 180); sh.setColumnWidth(12, 220);
  }
  return sh;
}

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

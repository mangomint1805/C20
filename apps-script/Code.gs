/**
 * Minto English — nhận kết quả luyện tập (TOEIC ETS 2026 + Cambridge IELTS) và ghi vào Google Sheet.
 *
 * CÁCH CẬP NHẬT (đã có bản cũ):
 *  1. Mở Google Sheet kết quả → Tiện ích mở rộng → Apps Script.
 *  2. Xoá hết code cũ, dán toàn bộ file này vào, bấm Lưu.
 *  3. Chọn hàm setup ở thanh trên → bấm Chạy (lần đầu Google sẽ hỏi quyền, bấm Cho phép).
 *     → Tạo thêm 2 tab "Góp ý" và "Bài viết", và tạo MÃ GIÁO VIÊN (xem ở Nhật ký thực thi).
 *  4. Triển khai → Quản lý các bản triển khai → bấm bút chì ở bản đang dùng → Phiên bản: "Phiên bản mới" → Triển khai.
 *     (Giữ nguyên bản triển khai cũ để link /exec KHÔNG đổi.)
 *
 * Kết quả bài làm vẫn vào tab cũ; góp ý / báo lỗi vào tab "Góp ý"; bài Writing vào tab "Bài viết".
 * Trang "Bảng theo dõi lớp" đọc dữ liệu bằng MÃ GIÁO VIÊN — không chia sẻ mã này cho học sinh.
 */
const SHEET_NAME = 'Kết quả Cam 20';
const HEAD = ['Thời gian', 'Họ tên', 'Lớp / nhóm', 'Test', 'Phần', 'Chế độ', 'Đúng', 'Tổng', '% đúng', 'Band (ước tính)',
              'Số phút', 'Câu sai', 'Hết giờ tự nộp', 'Thiết bị'];
const FB_NAME = 'Góp ý';
const FB_HEAD = ['Thời gian', 'Họ tên', 'Lớp / nhóm', 'Loại', 'Nội dung', 'Trang', 'Thiết bị'];
const WS_NAME = 'Bài viết';
const WS_HEAD = ['Thời gian', 'Họ tên', 'Lớp / nhóm', 'Đề', 'Task', 'Số từ', 'Yêu cầu', 'Số phút', 'Bài viết'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.kind !== 'cam20') return out_({ ok: false, error: 'sai loại dữ liệu' });
    const when = new Date(d.submittedAt || Date.now()), name = d.name || '(chưa nhập tên)', lop = d.lop || '';
    const part = String(d.part || '');
    if (part.indexOf('Góp ý') === 0 || d.mode === 'Góp ý') {
      const msg = String(d.wrong || ''), i = msg.lastIndexOf('\n— Trang: ');
      tab_(FB_NAME, FB_HEAD).appendRow([when, name, lop, part.replace(/^Góp ý · /, ''), i >= 0 ? msg.slice(0, i) : msg, i >= 0 ? msg.slice(i + 10) : '', d.userAgent || '']);
      return out_({ ok: true });
    }
    if (d.mode === 'Writing') {
      tab_(WS_NAME, WS_HEAD).appendRow([when, name, lop, d.test || '', part, Number(d.got) || '', Number(d.total) || '', d.minutes || '', d.wrong || '']);
      return out_({ ok: true });
    }
    const sh = tab_(SHEET_NAME, HEAD);
    const total = Number(d.total) || 0, got = Number(d.got) || 0;
    const pct = total ? Math.round(got / total * 1000) / 10 : '';
    sh.appendRow([when, name, lop, d.test || '', part, d.mode || '', got, total, pct, d.band || '', d.minutes || '', d.wrong || '', d.auto ? 'Có' : '', d.userAgent || '']);
    const r = sh.getLastRow();
    if (pct !== '') sh.getRange(r, 7, 1, 4).setBackground(pct >= 70 ? '#e1f4ec' : pct >= 50 ? '#fdf3dc' : '#fbe6e2');
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Bảng theo dõi lớp: GET ...exec?key=MÃ_GIÁO_VIÊN
function doGet(e) {
  const key = PropertiesService.getScriptProperties().getProperty('GV_KEY');
  if (!e || !e.parameter || !key || e.parameter.key !== key) return out_({ ok: true, info: 'Minto English results endpoint' });
  const read = (n, max) => {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); if (!sh || sh.getLastRow() < 2) return [];
    const last = sh.getLastRow(), from = Math.max(2, last - max + 1);
    return sh.getRange(from, 1, last - from + 1, sh.getLastColumn()).getValues().map(r => r.map(v => v instanceof Date ? v.toISOString() : v));
  };
  const data = { ok: true, results: read(SHEET_NAME, 5000), feedback: read(FB_NAME, 300), writing: read(WS_NAME, 500).map(r => r.slice(0, 8)) };
  const cb = String(e.parameter.callback || '');
  if (/^[A-Za-z_$][\w$]*$/.test(cb)) return ContentService.createTextOutput(cb + '(' + JSON.stringify(data) + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return out_(data);
}

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  tab_(SHEET_NAME, HEAD); tab_(FB_NAME, FB_HEAD); tab_(WS_NAME, WS_HEAD);
  ['Trang tính1', 'Sheet1'].forEach(n => { const d = ss.getSheetByName(n); if (d && ss.getSheets().length > 1) ss.deleteSheet(d); });
  const P = PropertiesService.getScriptProperties();
  let key = P.getProperty('GV_KEY');
  if (!key) { key = Utilities.getUuid().replace(/-/g, '').slice(0, 12); P.setProperty('GV_KEY', key); }
  Logger.log('MÃ GIÁO VIÊN (dán vào trang Bảng theo dõi lớp): ' + key);
}

function tab_(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(head);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#f2e2c4');
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
    sh.setColumnWidth(2, 180);
  }
  return sh;
}

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

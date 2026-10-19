# Cambridge IELTS 20 · 18 · 17 · Luyện tập Listening & Reading

Trang luyện tập cho học viên: 4 test mỗi bộ Cambridge IELTS 20, 18 và 17 (Academic), mỗi test gồm Listening 40 câu (có audio từng Part) và Reading 40 câu.

**Trang chủ (chọn bộ đề):** https://mangomint1805.github.io/C20/  
- Cambridge 20: https://mangomint1805.github.io/C20/c20/  
- Cambridge 18: https://mangomint1805.github.io/C20/c18/  
- Cambridge 17: https://mangomint1805.github.io/C20/c17/

> Cambridge 17 · Test 4: hiện mới có audio Part 1.

## Học viên dùng được gì

- **Chọn bài**: làm cả test, cả Listening / cả Reading, hoặc riêng từng Part / Passage.
- **Thi thử**: Listening phát liền 4 part, mỗi part chỉ nghe một lần, nghe xong có 2 phút rồi tự nộp; Reading đếm ngược 60 phút, hết giờ tự nộp.
- **Chấm điểm ngay**: câu đúng xanh, câu sai đỏ kèm đáp án, điểm từng phần và band ước tính (khi làm đủ 40 câu).
- **📍 Vị trí đáp án**: nộp xong bấm 📍 cạnh mỗi câu để mở lời thoại (Listening) hoặc tô vàng câu chứa đáp án trong bài đọc (Reading).
- **💡 Giải thích tiếng Việt**: nộp xong bấm 💡 cạnh mỗi câu để đọc vì sao đáp án đúng, các bẫy hay gặp, và bấm "Câu sau" để đọc lần lượt.
- **Tô sáng & ghi chú** trong bài đọc (bôi đen chữ → Tô vàng / Ghi chú), lưu lại trên máy.
- **🃏 Từ vựng**: flashcard ~10 từ cho mỗi passage, có phiên âm, nghĩa tiếng Việt và phát âm (3 giọng).
- **📈 Tiến độ** (`tien-do.html`): biểu đồ band qua các lần làm, điểm cao nhất từng phần, lịch sử làm bài.
- Bài làm tự lưu trên máy; xem được trên máy tính và điện thoại.

## Kết quả gửi về Google Sheet

Học viên nhập họ tên (và lớp/nhóm) ở trang chủ. Mỗi lần nộp bài, kết quả (phần, chế độ, số câu đúng, band, thời gian, câu sai) được gửi về Google Sheet của giáo viên.

Cài đặt một lần: tạo Google Sheet → *Tiện ích mở rộng → Apps Script* → dán nội dung `apps-script/Code.gs` → chạy `setup` → *Triển khai → Ứng dụng web* (Thực thi: Tôi · Truy cập: Bất kỳ ai) → dán link `/exec` vào `SCRIPT_URL` trong `config.js`. Để trống thì trang không gửi kết quả.

## Cấu trúc thư mục

```
index.html          trang chủ: thông tin học viên, chọn test / phần / thi thử
test-1..4.html      trang làm bài (test-N.html?part=L1 … R3, ?part=L&thi=1 để thi thử)
tien-do.html        trang tiến độ của học viên
config.js           link Apps Script nhận kết quả
fc.js, vocab.js     flashcard và danh sách từ vựng từng passage
audio/              audio Listening (t1-part1.mp3 …) và phát âm từ vựng (audio/vocab/)
img-t3/             bản đồ Listening Test 3
apps-script/        mã Google Apps Script ghi kết quả vào Sheet
```

GitHub Pages: Settings → Pages → Branch `main`, folder `/ (root)`.

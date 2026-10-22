# Cambridge IELTS 17–21 · Luyện tập Listening & Reading

Trang luyện tập cho học viên: 4 test mỗi bộ Cambridge IELTS 17, 18, 19, 20 và 21 (Academic), mỗi test gồm Listening 40 câu (có audio từng Part) và Reading 40 câu.

**Trang chủ (chọn bộ đề):** https://mangomint1805.github.io/cam/  
- Cambridge 21: https://mangomint1805.github.io/cam/c21/  
- Cambridge 20: https://mangomint1805.github.io/cam/c20/  
- Cambridge 19: https://mangomint1805.github.io/cam/c19/  
- Cambridge 18: https://mangomint1805.github.io/cam/c18/  
- Cambridge 17: https://mangomint1805.github.io/cam/c17/


## Tính năng mới
- **Tra từ trong bài:** bấm vào bất kỳ từ nào trong bài đọc, câu hỏi, lời thoại để xem nghĩa tiếng Việt, phiên âm và nghe phát âm (tắt khi thi thử). Từ điển rút gọn ~7.400 từ: [en_vn_dic](https://github.com/mduccc/en_vn_dic) (MIT) + bổ sung từ học thuật trong đề.
- **📊 Phân tích điểm yếu:** gom kết quả cả 5 bộ theo 14 dạng câu hỏi, kèm mẹo và bài luyện đúng dạng.
- **✍️ Chép chính tả:** ~600 câu cắt từ audio của đề, gõ lại và chấm từng từ.
- **🃏 Flashcard** (`flashcards.html`): lưu từ khi bấm tra từ, ôn bằng thẻ lật; dùng chung với web TOEIC.
- **Tốc độ audio** 0.75x / 1x / 1.25x khi luyện tập; **biểu đồ band** qua các lần làm ở trang Điểm yếu.
- **Writing & Speaking** (`ws.html`): đề Writing Task 1/2 của cả 20 test có bấm giờ, đếm từ, bài mẫu kèm nhận xét giám khảo, gửi bài cho thầy; Speaking Part 1–3 có đọc câu hỏi, ghi âm tự nghe lại, Part 2 bấm giờ 1 phút chuẩn bị + 2 phút nói.
- **Lời thoại chạy chữ:** câu đang phát được tô vàng; nút ▶ đầu mỗi lượt nói. **📍 ở Listening** phát lại đúng đoạn có đáp án.
- **❓ Hướng dẫn nhanh** có ảnh minh hoạ cho học viên mới.
- Audio dùng **bản gốc**, không nén lại.

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

## Lịch sử cập nhật

Xem đầy đủ: [Có gì mới](https://mangomint1805.github.io/cam/cap-nhat.html) (`cap-nhat.html`, dữ liệu trong `cap-nhat.js`).

- **22/10/2026** — Tô sáng + ghi chú cả Listening, trên máy tính và điện thoại; giao diện Băng hoại dễ đọc hơn.
- **21/10/2026** — Chép chính tả: căn lại mốc thời gian từng câu C17–C21. Đăng nhập Google và đồng bộ tiến độ, xem lại bài, gửi bài nói và xem nhận xét Writing/Speaking của thầy; Forecast Speaking quý 3/2026, Các dạng bài Writing, Kho mẫu câu; đánh dấu ☆ + ghi chú, kiểm tra xếp lớp, Gõ từ rơi; linh vật bé Xoài và 3 phong cách giao diện.
- **20/10/2026** — Writing & Speaking cho cả 5 bộ, nhãn dạng câu hỏi, flashcard dùng chung, cài như app.
- **19/10/2026** — Ra mắt Cambridge IELTS 20, rồi thêm 17, 18, 19, 21; giải thích tiếng Việt, lời thoại, tra từ, phân tích điểm yếu, chép chính tả.

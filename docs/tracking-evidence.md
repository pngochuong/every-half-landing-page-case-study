# Bằng chứng kiểm chứng Prototype, UTM, Redirect và Event Tracking (Version 3)

## Bối cảnh kiểm thử

- Trang kiểm thử: https://every-half-landing-page-case-study.vercel.app/ (production, commit `cba2eed`)
- Ngày giờ chạy: 2026-09-21, 09:31 UTC
- Cách thực hiện: Chrome (headless) mở trang production, xoá localStorage, rồi phát chuột thật (mouseMoved, mousePressed, mouseReleased) vào nút "Tìm cửa hàng gần bạn". Không gọi `.click()` bằng script.
- Quyền riêng tư: dữ liệu chỉ lưu trong localStorage của trình duyệt, không gửi ra dịch vụ analytics nào.
- Dữ liệu thô: [evidence/v3-evidence.json](evidence/v3-evidence.json)

## Đối chiếu 3 yêu cầu

| Yêu cầu | Triển khai | Kết quả |
| --- | --- | --- |
| 01 CTA hoạt động | Nút `#visit-roastery`, nhãn "Tìm cửa hàng gần bạn" | Đạt. Click thật chuyển trình duyệt sang everyhalf.vn |
| 01 liên kết có bộ UTM hợp lệ | `href` = `https://www.everyhalf.vn/?utm_source=every_half_study&utm_medium=landing_cta&utm_campaign=academic_demo_2026` | Đạt. Có đủ source, medium, campaign |
| 01 cơ chế ghi nhận sự kiện | Event log trong localStorage (key `every-half-academic-events`), hiển thị ở mục "Khu vực kiểm tra nội bộ" cuối trang | Đạt. Ghi được tên sự kiện, timestamp, URL đích, UTM |

## Bằng chứng trước / sau

| Thời điểm | Quan sát | Ảnh |
| --- | --- | --- |
| Trước click, Hero | CTA hiển thị "Tìm cửa hàng gần bạn". Chưa có event `cta_click` | [v3-01-before-hero.png](evidence/v3-01-before-hero.png) |
| Trước click, khu kiểm tra | Chỉ có `page_view`. Mục chuỗi chuyển hướng báo chưa có thao tác CTA | [v3-02-before-tracking.png](evidence/v3-02-before-tracking.png) |
| Sau click, trang đích | Trình duyệt ở everyhalf.vn, còn nguyên UTM | [v3-03-after-click-everyhalf.png](evidence/v3-03-after-click-everyhalf.png) |
| Sau click, quay lại trang | Có event `cta_click` kèm UTM và URL đích | [v3-04-after-tracking.png](evidence/v3-04-after-tracking.png) |

## 1. URL có UTM

Trước click, `href` đọc từ DOM:

```
https://www.everyhalf.vn/?utm_source=every_half_study&utm_medium=landing_cta&utm_campaign=academic_demo_2026
```

## 2. Redirect chain

Ghi bằng Chrome DevTools (Network.requestWillBeSent / responseReceived), chỉ lấy request loại Document:

| Bước | URL | Kết quả |
| --- | --- | --- |
| 1 | `https://every-half-landing-page-case-study.vercel.app/` | HTTP 200 |
| 2 | `https://www.everyhalf.vn/?utm_source=every_half_study&utm_medium=landing_cta&utm_campaign=academic_demo_2026` | HTTP 200 |

- Không có bước HTTP 3xx nào giữa trang nguồn và everyhalf.vn.
- Không đi qua `thank-you.html` hay route nội bộ nào.
- `document.referrer` tại everyhalf.vn: `https://every-half-landing-page-case-study.vercel.app/`.
- Kiểm tra độc lập bằng `curl -IL` tới URL trên: HTTP 200, URL cuối không đổi.

## 3. Tham số còn / mất sau chuyển hướng

| Tham số | Giá trị gửi đi | Sau chuyển hướng (đọc `location.search` tại everyhalf.vn) | Trạng thái |
| --- | --- | --- | --- |
| `utm_source` | `every_half_study` | `every_half_study` | Còn |
| `utm_medium` | `landing_cta` | `landing_cta` | Còn |
| `utm_campaign` | `academic_demo_2026` | `academic_demo_2026` | Còn |

- URL cuối tại 6 giây và 9 giây sau click đều giữ đủ 3 tham số, nên trang đích không xoá UTM bằng script sau khi tải.
- Kết luận trên áp dụng cho URL trình duyệt. Trang bài tập không đọc được dữ liệu analytics bên trong everyhalf.vn.

## 4. Event name, timestamp và kết quả ghi nhận

Đọc từ localStorage sau khi quay lại trang production:

| Event | Timestamp (ISO UTC) | Destination URL | UTM | Kết quả |
| --- | --- | --- | --- | --- |
| `page_view` | 2026-09-21T09:31:11.583Z | không có | không có | Đã ghi |
| `page_view` | 2026-09-21T09:31:16.976Z | không có | không có | Đã ghi |
| `cta_click` | 2026-09-21T09:31:20.880Z | `https://www.everyhalf.vn/?utm_source=every_half_study&utm_medium=landing_cta&utm_campaign=academic_demo_2026` | source `every_half_study`, medium `landing_cta`, campaign `academic_demo_2026` | Đã ghi trước khi rời trang |
| `page_view` | 2026-09-21T09:31:30.461Z | không có | không có | Đã ghi (lần quay lại) |

Thời điểm click là 09:31:20.832Z và event `cta_click` được ghi lúc 09:31:20.880Z, tức là ghi xong ngay khi click, trước khi trình duyệt chuyển sang everyhalf.vn.

Mục "Chuỗi chuyển hướng và bảo toàn UTM" trên trang hiển thị sau click:

- Sự kiện ghi nhận: `cta_click`
- Thời gian: `2026-09-21T09:31:20.880Z`
- Chuỗi chuyển hướng: `/` chuyển đến URL everyhalf.vn ở trên
- Trạng thái UTM: đã bảo toàn đầy đủ tham số UTM
- Tham số còn / mất sau redirect: còn đủ source, medium, campaign

## Giới hạn cần nêu rõ

- Mục "Tham số còn / mất" trên trang tính từ URL đích tại lúc click. Việc UTM còn nguyên sau khi đến everyhalf.vn được xác nhận riêng ở phần 2 và 3 bằng cách đọc URL thật của trình duyệt.
- Event được ghi theo từng trình duyệt (localStorage). Đây là sandbox phục vụ bài tập, không phải hệ thống analytics thật.

## Cách tự kiểm tra lại

1. Mở https://every-half-landing-page-case-study.vercel.app/ và bấm "Xem kết quả ghi nhận sự kiện" để xem trạng thái ban đầu.
2. Cuộn lên đầu trang, bấm "Tìm cửa hàng gần bạn". Kiểm tra thanh địa chỉ tại everyhalf.vn có đủ 3 tham số UTM.
3. Quay lại trang, bấm lại "Xem kết quả ghi nhận sự kiện" và đối chiếu event `cta_click`, timestamp, UTM.

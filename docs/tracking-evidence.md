# Tracking Verification Evidence — `every-half-study-web` & `every-half-study-web-tracking`

## Test Context

- **System Name**: `every-half-study-web` (Landing Page) & `every-half-study-web-tracking` (Visual Sandbox)
- **Test Date**: 2026-09-20 (UTC timestamps)
- **Live Deployment Surface**: `https://temporary-spry-oasis-ibogq7y.vercel.app`
- **Interaction Method**: Real user click on CTA button `#visit-roastery` on `every-half-study-web`.
- **Privacy Scope**: No third-party marketing cookies, external analytics requests, or personal data collection.

---

## 3 Core Assignment Criteria Verification

| Requirement | Observed Implementation | Verification Result |
| --- | --- | --- |
| **1. 01 CTA Hoạt Động** | Interactive CTA Button `#visit-roastery` on `every-half-study-web` | ✅ Pass (Real click triggers navigation) |
| **2. 01 Liên Kết Có Bộ UTM Hợp Lệ** | `thank-you.html?utm_source=every_half_study&utm_medium=landing_cta&utm_campaign=academic_demo_2026` | ✅ Pass (Valid `utm_source`, `utm_medium`, `utm_campaign`) |
| **3. 01 Cơ Chế Ghi Nhận Sự Kiện** | Visual Analytics Sandbox on `every-half-study-web-tracking` reading `localStorage` key `every-half-academic-events` | ✅ Pass (Records event_name, timestamp, redirect chain, UTM retention) |

---

## Redirect Chain & UTM Retention Result

| Check | Observed Result | Status |
| --- | --- | --- |
| **Source URL (Truớc chuyển hướng)** | `https://temporary-spry-oasis-ibogq7y.vercel.app/` | ✅ Pass |
| **CTA Selector** | `#visit-roastery` | ✅ Pass |
| **CTA href** | `thank-you.html?utm_source=every_half_study&utm_medium=landing_cta&utm_campaign=academic_demo_2026` | ✅ Pass |
| **Redirect Chain** | `index.html` ➔ `thank-you.html` (Same-origin navigation; 0 lost parameters) | ✅ Pass |
| **Destination URL (Sau chuyển hướng)** | `https://temporary-spry-oasis-ibogq7y.vercel.app/thank-you.html?utm_source=every_half_study&utm_medium=landing_cta&utm_campaign=academic_demo_2026` | ✅ Pass |
| **UTM Preserved After Navigation** | `utm_source=every_half_study`, `utm_medium=landing_cta`, `utm_campaign=academic_demo_2026` | ✅ Pass |
| **Destination Display** | Received UTM parameters render in `#campaign-details` and `every-half-study-web-tracking` | ✅ Pass |

---

## Event Log Evidence Record

Recorded in browser `localStorage` key `every-half-academic-events`:

| Event Name | Timestamp (ISO UTC) | Page URL | UTM Parameters | Result |
| --- | --- | --- | --- | --- |
| `page_view` | `2026-09-20T14:55:01.120Z` | `every-half-study-web` (`/`) | None (Organic View) | Recorded |
| `cta_click` | `2026-09-20T14:55:05.412Z` | `every-half-study-web` (`/`) | `source: every_half_study`<br>`medium: landing_cta`<br>`campaign: academic_demo_2026` | Recorded; Destination URL attached |
| `page_view` | `2026-09-20T14:55:05.440Z` | Destination Page (`/thank-you.html`) | `source: every_half_study`<br>`medium: landing_cta`<br>`campaign: academic_demo_2026` | Recorded; Retained from query string |

---

## How To Reproduce & Test Live

1. Visit [every-half-study-web Homepage](https://temporary-spry-oasis-ibogq7y.vercel.app/).
2. Scroll to the demo section or click **🎯 1. Thao tác Nút CTA (Có bộ UTM hợp lệ) →**.
3. Confirm redirection to `thank-you.html` and observe that all UTM parameters are preserved in the URL address bar and on-page details.
4. Click **📊 Mở trang every-half-study-web-tracking →** to open [every-half-study-web-tracking](https://temporary-spry-oasis-ibogq7y.vercel.app/tracking/).
5. Confirm the **Redirect Chain & UTM Inspector** displays the exact navigation chain, timestamp, and preserved UTM values.

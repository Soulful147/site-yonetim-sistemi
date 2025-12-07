# SİTE İSTEK & ŞİKAYET YÖNETİM SİSTEMİ
## Sistem Analiz ve Tasarım Dokümanı (v2.0)

**Tarih**: 06.12.2023
**Durum**: Geliştirme Aşamasında (Development)

---

## 1. Proje Özeti
Bu proje, site sakinlerinin taleplerini (arıza, temizlik, güvenlik vb.) yönetime iletebileceği, yönetimin bu talepleri takip edip personele atayabileceği ve personelin de üzerindeki işleri yönetebileceği bulut tabanlı bir web uygulamasıdır. GitHub Pages üzerinde barındırılacak şekilde "Serverless" (Sunucusuz) mimaride tasarlanmıştır.

---

## 2. Teknik Mimari ve Teknoloji Yığını

Sistem **JAMstack** (JavaScript, API, Markup) mimarisi üzerine kuruludur.

*   **Frontend**: React.js (Vite ile build edilmekte)
*   **Dil**: JavaScript (ES6+)
*   **UI Framework**: Özel CSS (Tailwind kullanılmamış, `index.css` üzerinden stil yönetimi)
*   **Routing**: React Router DOM v6
*   **State Management**: React Hooks (useState, useEffect, Context API)
*   **Backend & Veritabanı**: Google Firebase (Authentication, Firestore, Storage)
*   **Görselleştirme**: Chart.js / React-Chartjs-2
*   **İkon Seti**: Lucide React
*   **Hosting**: GitHub Pages

---

## 3. Kullanıcı Rolleri ve Yetkileri

Sistemde üç temel kullanıcı rolü bulunmaktadır. Yetkilendirme `ProtectedRoute` bileşeni ve veritabanındaki `role` alanı üzerinden yapılır.

### 3.1. Yönetici (Admin)
*   **Erişim**: Tam yetkili.
*   **Görevi**: Tüm sistemi izler, yönetir ve raporlar.
*   **Yapabildikleri**:
    *   Dashboard üzerinden genel durumu (grafikler, özet kartlar) izleme.
    *   Tüm talepleri (Tickets) listeleme, filtreleme ve detaylarını görme.
    *   Talepleri personele (Staff) atama.
    *   Site sakinlerini ve personelleri yönetme (Listeleme, Silme, Düzenleme).
    *   Analitik verilerini inceleme.

### 3.2. Personel (Staff)
*   **Erişim**: Kısıtlı yönetim.
*   **Görevi**: Kendisine atanan işleri tamamlamak.
*   **Yapabildikleri**:
    *   Sadece kendisine atanan talepleri görme.
    *   Taleplerin durumunu güncelleme (örn: "İşlemde", "Çözüldü").
    *   Tamamladığı işleri geçmişe dönük inceleme.

### 3.3. Site Sakini (Resident)
*   **Erişim**: Son kullanıcı.
*   **Görevi**: Sorun bildirmek ve takibini yapmak.
*   **Yapabildikleri**:
    *   Yeni talep oluşturma (Fotoğraf, Konu, Açıklama).
    *   Sadece kendi oluşturduğu talepleri görme.
    *   Tamamlanan talepleri onaylama ve puanlama (Anket).

---

## 4. Veri Modeli (Firestore Schema)

Veritabanı NoSQL yapısındadır ve aşağıdaki koleksiyonlardan oluşur.

### 4.1. `users` Koleksiyonu
Kullanıcı profil bilgilerini tutar. Authentication UID'si ile eşleşir.

| Alan | Tip | Açıklama |
| :--- | :--- | :--- |
| `uid` | String | Benzersiz Kullanıcı ID (Auth ID) |
| `email` | String | E-posta adresi |
| `password` | String | Şifre |
| `full_name`| String | Ad Soyad |
| `role` | String | `admin`, `staff`, `resident` |
| `block` | String | Blok Bilgisi (Örn: "A") |
| `flat_no` | String | Daire Numarası (Örn: "12") |
| `created_at`| Timestamp | Kayıt tarihi |

### 4.2. `tickets` Koleksiyonu
Oluşturulan talep ve şikayet kayıtları.

| Alan | Tip | Açıklama |
| :--- | :--- | :--- |
| `id` | String | Otomatik döküman ID |
| `user_id` | String | Talebi açan kullanıcının UID'si |
| `title` | String | Başlık |
| `description`| String | Detaylı açıklama |
| `category` | String | `ari̇za`, `temi̇zli̇k`, `güvenli̇k`, `di̇ğer` |
| `status` | String | `new`, `assigned`, `in_progress`, `resolved`, `closed`|
| `priority` | String | `low`, `medium`, `high` |
| `photo_url` | String | Yüklenen fotoğrafın URL'i (Opsiyonel) |
| `assigned_to`| String | Atanan personelin UID'si (Opsiyonel) |
| `block` | String | Kullanıcının bloğu (Otomatik eklenir) |
| `flat_no` | String | Kullanıcının dairesi (Otomatik eklenir) |
| `created_at` | Timestamp | Oluşturulma tarihi |
| `updated_at` | Timestamp | Son güncelleme tarihi |
| `resolved_at`| Timestamp | Çözülme tarihi |
| `rating` | Number | Memnuniyet Puanı (1-5) |

### 4.3. `logs` Koleksiyonu
Talepler üzerindeki işlem tarihçesini tutar (Audit Log).

| Alan | Tip | Açıklama |
| :--- | :--- | :--- |
| `ticket_id` | String | İlgili talebin ID'si |
| `action` | String | `created`, `updated`, `assigned`, `status_change`, `rated` |
| `by_user` | String | İşlemi yapan kullaıcı ID |
| `timestamp` | Timestamp | İşlem zamanı |
| `details` | String | İşlem detayı (Örn: "Durum 'new' -> 'assigned' olarak değişti") |
| `from` | String | Eski durum (Varsa) |
| `to` | String | Yeni durum (Varsa) |

---

## 5. Uygulama Yapısı ve Klasör Dizini

```
/src
├── /assets         # Görseller ve statik dosyalar
├── /components     # React bileşenleri
│   ├── /common     # Ortak bileşenler (Button, Input, Loader vb.)
│   ├── /layout     # Sayfa düzeni (Navbar, Sidebar)
│   └── ProtectedRoute.jsx # Güvenlik katmanı
├── /config         # Firebase konfigürasyonu
├── /pages          # Sayfalar
│   ├── /admin      # Yönetici sayfaları (Dashboard, Users, Analytics)
│   ├── /resident   # Sakin sayfaları (CreateTicket, MyTickets)
│   ├── /staff      # Personel sayfaları (Tasks)
│   ├── Login.jsx   # Giriş sayfası
│   └── ...
├── /services       # İş mantığı ve API çağrıları
│   ├── authService.js   # Kimlik doğrulama işlemleri
│   ├── ticketService.js # Talep yönetimi işlemleri
│   └── userService.js   # Kullanıcı işlemleri
├── /utils          # Yardımcı fonksiyonlar
├── App.jsx         # Ana uygulama ve rotalar
└── main.jsx        # Giriş noktası
```

---

## 6. Güvenlik Önlemleri

*   **Rota Koruması**: `ProtectedRoute` bileşeni, giriş yapmamış kullanıcıları Login sayfasına, yetkisi olmayan kullanıcıları (örn: resident -> admin paneline girmeye çalışırsa) kendi dashboardlarına yönlendirir.
*   **Firebase Kuralları (Firestore Rules)**: (Planlanan) Veritabanı seviyesinde, kullanıcıların sadece kendi verilerine veya yetkili oldukları verilere erişmesi sağlanmalıdır.

---

## 7. Gelecek Planları (Roadmap)

1.  **Bildirim Sistemi**: Taleplerin durumu değiştiğinde e-posta veya uygulama içi bildirim gönderilmesi.
2.  **Duyuru Panosu**: Yönetimin tüm siteye duyuru yapabileceği bir modül.
3.  **Profil Düzenleme**: Kullanıcıların şifre ve profil fotoğraflarını değiştirebilmesi.

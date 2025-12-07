# SİTE İSTEK & ŞİKAYET YÖNETİM SİSTEMİ

## Sistem Analiz ve Tasarım Dokümanı (v1.0)

**Platform**: Web (GitHub Pages Hosting)
**Mimari**: JAMstack (Serverless)

---

## 1. Proje Özeti ve Mimari Yaklaşım

Bu proje, site sakinlerinin taleplerini iletebileceği, yönetimin iş takibi yapabileceği ve personelin görevlerini yönetebileceği bulut tabanlı bir uygulamadır.

### GitHub Pages Uyarlaması:

Sistem, klasik bir sunucu (Backend) yerine tarayıcı tabanlı (Client-side) çalışacak şekilde tasarlanmıştır.

*   **Frontend (Arayüz)**: HTML, CSS, JavaScript (React veya Vue.js önerilir).
*   **Hosting**: GitHub Pages.
*   **Veritabanı & Auth**: Firebase veya Supabase (Sunucusuz Hizmet).
*   **Analiz**: Veriler istemci tarafında çekilip JavaScript kütüphaneleri ile görselleştirilecektir.

---

## 2. Varlık ve Aktör Analizi (Entities & Actors)

### 2.1. Aktörler (Kullanıcı Rolleri)

#### Site Sakini (Resident):

*   **Yetkiler**: Talep oluşturma, kendi taleplerini listeleme, anket oylama.
*   **Erişim**: Sadece kendi daire verisi.

#### Yönetici (Admin):

*   **Yetkiler**: Tüm talepleri görme, personel atama, duyuru yayınlama, analiz dashboard'unu görüntüleme.
*   **Erişim**: Tam yetki.

#### Personel (Staff):

*   **Yetkiler**: Atanan işleri görüntüleme, durum güncelleme ("Tamamlandı" yapma).
*   **Erişim**: Sadece atanan işler.

### 2.2. Temel Varlıklar (Entities)

*   **Lokasyon**: Site > Blok > Kat > Daire.
*   **Kategoriler**: Arıza, Temizlik, Güvenlik, Gürültü, Öneri.
*   **Durumlar**: Yeni (New), Atandı (Assigned), İşlemde (In Progress), Beklemede (Pending), Çözüldü (Resolved).

---

## 3. Süreç ve İş Akışı (Workflow)

Bir şikayetin yaşam döngüsü aşağıdaki adımlarla ilerler:

1.  **Giriş**: Kullanıcı sisteme (Firebase Auth) ile giriş yapar.
2.  **Kayıt**: Site sakini "Yeni Talep" butonuna tıklar.
    *   **Sistem**: Kullanıcının blok/daire bilgisini profilden otomatik çeker.
    *   **Kullanıcı**: Kategori seçer, açıklama yazar, fotoğraf yükler.
3.  **Triyaj (Yönlendirme)**:
    *   Talep "Yeni" statüsüyle havuza düşer.
    *   Yönetici panele girer, talebi inceler ve ilgili Personele atar (Statü: "Atandı").
4.  **Müdahale**:
    *   Personel mobil uyumlu ekranda işi görür.
    *   Sorunu çözer ve "Tamamlandı" işaretler (Statü: "Çözüldü").
5.  **Onay**:
    *   Site sakinine bildirim gider.
    *   Sakin çözümü onaylar ve 1-5 arası puan verir (Statü: "Kapalı").

---

## 4. Veritabanı Tasarımı (NoSQL / JSON Yapısı)

GitHub Pages üzerinde SQL çalışmayacağı için, yapı JSON tabanlı (Firebase Firestore) döküman yapısına dönüştürülmüştür.

### Koleksiyon: `users` (Kullanıcılar)

```json
{
  "uid": "user123",
  "full_name": "Ahmet Yılmaz",
  "role": "resident", // admin, staff
  "block": "A",
  "flat_no": "12",
  "email": "ahmet@mail.com"
}
```

### Koleksiyon: `tickets` (Talepler)

```json
{
  "id": "tckt_9988",
  "user_id": "user123",
  "category": "elevator_fix", // Asansör Arıza
  "title": "A Blok Asansör Işığı Yanmıyor",
  "description": "3. kat asansör düğmesi çalışmıyor.",
  "photo_url": "https://storage...",
  "status": "new", // assigned, resolved, closed
  "assigned_to": "staff_55", // Personel ID (boş olabilir)
  "created_at": "2023-10-27T10:00:00Z",
  "priority": "medium"
}
```

### Koleksiyon: `logs` (İşlem Tarihçesi)

```json
{
  "ticket_id": "tckt_9988",
  "action": "status_change",
  "from": "new",
  "to": "assigned",
  "by_user": "admin_01",
  "timestamp": "2023-10-27T10:15:00Z"
}
```

---

## 5. Analiz ve Raporlama Modülü (Frontend BI)

Orijinal belgede Python ile yapılması istenen analizler, tarayıcı tabanlı JavaScript kütüphaneleri ile yapılacaktır.

*   **Kullanılacak Teknoloji**: Chart.js veya Recharts

### Dashboard Metrikleri (Yönetici Ekranı):

*   **Isı Haritası (Heatmap Simülasyonu)**:
    *   Blok bazlı şikayet yoğunluğu grafiği (Bar Chart).
    *   **Örn**: A Blok: 15 Arıza, B Blok: 2 Arıza.
*   **Kategori Dağılımı (Pie Chart)**:
    *   Toplam şikayetlerin yüzdelik dilimi.
    *   **Örn**: %40 Asansör, %20 Temizlik.
*   **Ortalama Çözüm Süresi**:
    *   (Kapanış Tarihi - Oluşturma Tarihi) hesaplanarak personel bazlı performans kartları.
*   **Memnuniyet Skoru**:
    *   Anketlerden gelen 1-5 puanların ortalaması.

---

## 6. Geliştirme Yol Haritası (GitHub Pages İçin)

### Faz 1: Kurulum ve Arayüz

*   GitHub'da `site-yonetim-sistemi` adında Public repo oluşturulması.
*   Proje iskeletinin (HTML/CSS veya React) oluşturulması.
*   **Sayfaların Tasarımı**:
    *   Login Sayfası
    *   Site Sakini Paneli (Talep Ekle)
    *   Yönetici Paneli (Dashboard)

### Faz 2: Backend Bağlantısı (Firebase)

*   Firebase Konsolunda proje oluşturulması.
*   **Authentication**: Email/Şifre girişinin aktif edilmesi.
*   **Firestore**: Veritabanı kurallarının yazılması.
*   Projenin Firebase config bilgilerinin GitHub projesine eklenmesi.

### Faz 3: Yayınlama

*   Kodların GitHub'a push edilmesi.
*   Settings -> Pages menüsünden main dalının seçilip yayınlanması.

---

## 7. Tasarım Sorularına Yanıtlar (Kararlar)

### Kayıt Modeli:

*   **Karar**: Yönetim Kayıtlı. Güvenlik nedeniyle site sakinleri kendi kafasına göre üye olamaz. Yönetici, email adreslerini sisteme tanımlar, kullanıcı "Şifremi Unuttum" diyerek ilk şifresini alır.

### Şeffaflık:

*   **Karar**: Yarı Şeffaf. Kullanıcılar sadece kendi taleplerini detaylı görür. Ancak "Bina Genel Duyuruları" kısmında "A Blok Asansör arızası için parça bekleniyor" gibi genel bir durum kartı görülebilir.

### Kiracı/Ev Sahibi:

*   **Karar**: Kullanıcı profilinde `type: 'tenant'` veya `'owner'` alanı tutulacak. Analizlerde kiracıların daha çok hangi konuda şikayet ettiği ayrıştırılabilir.
# 🏢 Site İstek & Şikayet Yönetim Sistemi

**Modern, şeffaf ve kullanıcı dostu bir apartman/site yönetim platformu.**

Bu proje, site sakinlerinin taleplerini kolayca iletebileceği, yönetimin iş takibini verimli bir şekilde yapabileceği ve personelin görevlerini mobil uyumlu bir arayüzden yönetebileceği bulut tabanlı bir çözümdür.

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://yusakru.github.io/github-pages-2/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Proje Hakkında

Geleneksel site yönetim yazılımlarının aksine, bu sistem kurulum maliyeti gerektirmeyen, tamamen tarayıcı tabanlı çalışan modern bir mimariye sahiptir.

### Temel Özellikler
*   **Rol Tabanlı Giriş**: Yönetici, Personel ve Site Sakini için özel arayüzler.
*   **Talep Yönetimi**: Arıza, temizlik veya güvenlik taleplerini anlık oluşturma ve takip etme.
*   **Analitik Dashboard**: Yönetim için grafiksel raporlar ve iş zekası ekranları.
*   **Mobil Uyumlu**: Her cihazda (Telefon, Tablet, PC) kusursuz görünüm.

---

## 🧠 Nasıl Çalışıyor? (Teknik Mimari)

Bu proje, **GitHub Pages** üzerinde barındırılmasına rağmen **tamamen dinamik** bir yapıya sahiptir.
Normalde GitHub Pages sadece statik sayfaları (HTML/CSS) sunar. Ancak biz **JAMstack** mimarisi ile bu sınırı aşıyoruz.

> **Meraklısına:** GitHub Pages üzerinde "Serverless" bir uygulamanın nasıl çalıştığını, "Garson ve Mutfak" analojisi ile anlattığımız detaylı teknik makalemizi okuyun:
>
> 👉 [**Mimari Çalışma Mantığı (JAMstack & Firebase)**](docs/MIMARI_CALISMA_MANTIGI.md)

Kısaca:
1.  **İskelet (Frontend)**: GitHub Pages, React uygulamasını tarayıcınıza gönderir.
2.  **Beyin (Backend)**: Uygulama, kullanıcının tarayıcısında çalışırken arka planda **Google Firebase** ile konuşur.
3.  **Sonuç**: Sunucu maliyeti olmadan, güvenli ve hızlı bir dinamik uygulama.

---

## 🛠️ Kurulum ve Başlangıç

Bu projeyi kendi bilgisayarınızda çalıştırmak veya kendi siteniz için kurmak oldukça basittir.

Detaylı kurulum adımları, Firebase ayarları ve ilk kullanıcının oluşturulması için lütfen rehberimize göz atın:

👉 [**ADIM ADIM KURULUM REHBERİ**](KURULUM_REHBERI.md)

---

## 💻 Teknoloji Yığını

*   **Frontend**: React.js, Vite
*   **Dil**: Modern JavaScript (ES6+)
*   **Stil**: Özel CSS Tasarım Sistemi (Glassmorphism UI)
*   **Backend / Veritabanı**: Google Firebase (Auth, Firestore, Storage)
*   **Görselleştirme**: Chart.js
*   **İkonlar**: Lucide React

---

## 👥 Katkıda Bulunma

1.  Bu repoyu fork'layın.
2.  Yeni bir özellik dalı (feature branch) oluşturun.
3.  Değişikliklerinizi commit'leyin.
4.  Dalınızı push'layın ve bir **Pull Request** oluşturun.

---
*Geliştirici: [Yusuf Sakru](https://github.com/yusakru)*

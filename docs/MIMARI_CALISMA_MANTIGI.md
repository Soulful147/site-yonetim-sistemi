# GitHub Pages & JAMstack Çalışma Mantığı

Bu doküman, statik dosya sunucusu olan GitHub Pages üzerinde nasıl tam fonksiyonel ve dinamik bir web uygulaması çalıştırabildiğimizi açıklamaktadır.

---

## 1. Büyük Yanılgı: "Sadece Statik Site"

Genel kanı şudur: *"GitHub Pages sadece HTML/CSS gösterir, veritabanı bağlantısı veya kullanıcı girişi yapamaz."*
Bu bilgi teknik olarak kısmen doğrudur; GitHub Pages bir **PHP, Python veya Node.js** sunucusu (Backend) çalıştırmaz.

Ancak modern web mimarileri (**JAMstack**) sayesinde, bir backend sunucusuna ihtiyaç duymadan da dinamik uygulamalar geliştirmek mümkündür.

---

## 2. Nasıl Çalışıyor? (Sihrin Arkasındaki Teknoloji)

Sistemimiz **"Sunucusuz" (Serverless)** ve **"İstemci Taraflı" (Client-Side)** bir mimari kullanır.

### A. İskelet ve Kaslar (Frontend)
Web sitemiz aslında bir **React** uygulamasıdır (JavaScript). Siz siteye girdiğinizde:
1.  GitHub Pages size sadece boş bir sayfa şablonu ve JavaScript paketlerini gönderir.
2.  **Sizin tarayıcınız (Chrome, Safari vb.)**, bu kodları çalıştırarak ekrandaki görüntüleri oluşturur.
3.  Yani işlem GitHub'ın sunucusunda değil, **sizin cihazınızda** gerçekleşir.

### B. Beyin ve Hafıza (Backend as a Service - BaaS)
Uygulama çalıştıktan sonra verilere ihtiyaç duyar (Giriş yapma, talep listesi çekme vb.). İşte burada devreye **Google Firebase** girer.
*   **Yetkilendirme**: "Kullanıcı adı ve şifre doğru mu?" sorusunu React uygulaması, arka kapıdan Google Firebase'e sorar.
*   **Veritabanı**: "Bana eski şikayetleri getir" isteğini doğrudan Firebase veritabanına yapar.

---

## 3. Analoji (Restoran Örneği)

Durumu daha iyi anlamak için bir restoran benzetmesi yapabiliriz:

| Rol | Bizim Sistemdeki Karşılığı | Açıklama |
| :--- | :--- | :--- |
| **Garson** | **GitHub Pages** | Size sadece boş tabağı (HTML) ve çatal-bıçağı (JS) getirir. Yemek pişirmez, sadece servisi yapar. |
| **Mutfak** | **Google Firebase** | Malzemelerin (Verilerin) durduğu ve piştiği yerdir. Yetki kontrolleri ve veri saklama burada yapılır. |
| **Müşteri** | **Tarayıcınız (Client)** | Garsonun getirdiği araçlarla, mutfaktan malzemeyi alıp masada (Tarayıcıda) yemeği birleştirirsiniz. |

---

## 4. Neden Bu Yöntemi Seçtik? Avantajları Neler?

1.  **Maliyet**: Geleneksel bir sunucu (VDS/Hosting) kiralamak aylık maliyet gerektirir. GitHub Pages **ücretsizdir**. Firebase ise başlangıç seviyesinde **ücretsizdir**.
2.  **Hız**: GitHub'ın devasa CDN (İçerik Dağıtım Ağı) sayesinde site dünyanın her yerinden çok hızlı açılır.
3.  **Güvenlik**: Sunucu yönetimi, güncellemesi veya güvenlik yamalarıyla biz uğraşmayız. Google ve GitHub bu altyapıyı korur.
4.  **Modern Mimari**: Günümüzde Facebook, Airbnb, Twitter gibi devler de arayüzlerini bu "Single Page Application (SPA)" mantığıyla sunar.

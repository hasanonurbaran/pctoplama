# 🖥️ Bilgisayar Topla (React + TypeScript + Vite)

Güncel donanım verilerinden kendi uyumlu PC'ni oluşturabileceğin, mobil ve masaüstünde harika çalışan bir web uygulaması.

## 🚀 Hızlı Başlangıç

- **Gereksinim:** Node.js 20+ 
- **Kurulum ve başlatma adımları:**

```bash
npm install
npm run dev
```

Tarayıcıdan [http://localhost:5173](http://localhost:5173) adresine git!

## 📁 Proje Yapısı
- `public/data/` — Tüm JSON veri setleri (`urunler/` kökünden alınır)
- `src/data/loader.ts` — Veri alma (fetch yardımcıları)
- `src/data/types.ts` — Tip tanımları
- `src/state/store.ts` — Global state (zustand) + localStorage saklama, toplam fiyat vb.
- `src/utils/compat.ts` — Uyum/filtreleme mantıkları ve karşılaştırma
- `src/components/Picker/` — Seçim kartları, "seçilenleri gör", karşılaştır, sepete ekle
- `src/components/Summary.tsx` — Seçilenlerin özeti (responsive sağda veya mobilde altta)
- `src/components/Header.tsx` — Sticky üst bar, hamburger menü (responsive)
- `src/App.tsx` — Tek sayfa uygulama, landing/scroll akışı

## 🛠️ Responsive ve Kullanıcı Deneyimi
- Mobilde ve masaüstünde tam responsive, hızlı ve akıcı arayüz
- "Seçilenleri gör", "karşılaştır" ve "sepete ekle" işlemleri mobilde ekran altında bar olarak çıkar
- Hamburger üst menü küçük ekranlarda otomatik açılır/kapanır
- Tüm seçimler localStorage'da saklanır
- Koyu tema ve erişilebilirlik desteği

## ⚡ Teknik Notlar & Uyumluluk
- **Vite** tabanlı hızlı geliştirme ortamı
- **React 19**, **TypeScript**, **Zustand** altyapısı
- Anakart, CPU, RAM, GPU, Kasa, PSU ve Soğutucu gibi parçalar arası çapraz uyumluluk denetimleri
- Sadece stokta olan ürünler seçilebilir

## 📚 Veri Kaynağı
- Kökteki `urunler/` klasöründe JSON formatında hazır ürün verisi
- Uygulama, otomatik olarak `public/data/` altından jsonları okumaktadır

## 📝 Lisans
Bireysel/yazılım projesi amaçlıdır, açık fikir için kullanılabilir.

---
Her türlü katkı, görüş ve hata bildirimi için GitHub Issues'u kullanabilirsin.

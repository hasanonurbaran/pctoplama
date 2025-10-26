# 🖥️ Bilgisayar Toplama (React + TypeScript)

Tek sayfa (scrolling) bir web uygulaması. Kullanıcılar JSON veri setlerinden parçaları seçerek uyumlu bir PC toplayabilir. Uyumluluk kuralları otomatik uygulanır, stok dışı ürünler seçilemez, seçimler localStorage'da saklanır.

## Kurulum ve Çalıştırma

- Node 20+ önerilir.
- Komutlar `app/` klasörü içinde çalıştırılır.

```bash
npm install
npm run dev
```

Geliştirme sunucusu açıldığında tarayıcıda http://localhost:5173 adresine gidin.

## Proje Yapısı

- `app/public/data/` JSON veri setleri (kaynak: repo kökündeki `urunler/` klasörü)
- `app/src/data/loader.ts` JSON fetch yardımcıları
- `app/src/data/types.ts` Tip tanımları (dataset alanlarına uyumlu)
- `app/src/state/store.ts` Global durum (Zustand) + localStorage persist + toplam fiyat
- `app/src/utils/compat.ts` Uyumluluk kuralları (anakart↔CPU, RAM, GPU, PSU, kasa, soğutucu, depolama)
- `app/src/components/Picker/*` Seçim bileşenleri (genel kart ve picker)
- `app/src/components/Summary.tsx` Sağ özet paneli
- `app/src/App.tsx` Tek sayfa akış (landing benzeri scroll)

## Uyumluluk Kuralları (Özet)

- Anakart ↔ CPU: vendor, soket, nesil eşleşmeli
- Anakart ↔ RAM: tip ve hız (≤ anakart max), yuva sayısı uyarısı (temel)
- Anakart ↔ GPU: en az 1× PCIe x16 yuvası
- Kasa ↔ Anakart/GPU/PSU: form factor listesi, GPU uzunluğu, PSU desteği
- PSU ↔ GPU/Sistem: (CPU TDP + GPU TGP + 150W) ≤ PSU gücü; 8-pin/12VHPWR konnektör kontrolü
- CPU Soğutucu ↔ CPU/Kasa: soket, max TDP, yükseklik
- Depolama ↔ Anakart: SATA/M.2 NVMe/M.2 SATA; M.2 için anakartta M.2 yuvası > 0
- Stok: `stok.durum === in_stock` seçilebilir, aksi halde gri/devre dışı

Not: Bazı gelişmiş senaryolar (PCIe hat düşümü, M.2 paylaşım) bilgilendirici uyarı olarak genişletilebilir.

## Veri Kaynağı

- Kaynak JSON'lar: `urunler/` (repo kökü)
- Uygulama: `app/public/data/` altından fetcheder (`/data/*.json`)

## Geliştirme Notları

- UI: Koyu (siyah/gri), sade.
- Performans: Basit memo ve basit filtreleme; istenirse sanal liste/lazy load eklenebilir.
- Erişilebilirlik: Buton ve inputlara aria etiketleri eklendi; genişletilebilir.

## Lisans

Bu proje örnek/ödev amaçlıdır.

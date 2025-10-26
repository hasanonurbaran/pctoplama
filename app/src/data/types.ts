export type StockStatus = 'in_stock' | 'out_of_stock';

export interface StockInfo {
  durum: StockStatus;
  adet: number;
}

export interface BaseItem {
  id: string;
  marka: string;
  model?: string;
  ad?: string;
  fiyat_try: number;
  stok: StockInfo;
  etiketler?: string[];
}

export interface Anakart extends BaseItem {
  form_factor: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | string;
  yonga_seti: string;
  soket: string;
  cpu_uyumluluk: {
    vendor: 'AMD' | 'Intel' | string;
    socket: string;
    nesiller: string[];
  };
  bellek: {
    tip: 'DDR4' | 'DDR5' | string;
    yuva_sayisi: number;
    max_kapasite_gb: number;
    hiz_mhz: number[];
  };
  depolama: {
    sata: number;
    m2: number;
    m2_pci_gen?: string;
  };
  genisleme: {
    pcie_x16: number;
    pcie_x1?: number;
    pcie_gen?: string;
  };
}

export interface Islemci extends BaseItem {
  vendor: 'AMD' | 'Intel' | string;
  soket: string;
  nesil: string;
  cekirdek_sayi: number;
  izlek_sayi: number;
  temel_hiz_ghz: number;
  turbo_hiz_ghz: number;
  tdp_w: number;
  bellek_destek: {
    tip: 'DDR4' | 'DDR5' | string;
    max_mhz: number;
  };
  igpu: boolean | null;
}

export interface Ram extends BaseItem {
  tip: 'DDR4' | 'DDR5' | string;
  kapasite_kit_gb: number;
  modul_sayisi: number;
  kapasite_modul_gb: number;
  hiz_mhz: number;
  hiz_profilleri_mhz?: number[];
}

export interface Gpu extends BaseItem {
  gpu_cipi: string;
  vram: { boyut_gb: number; tip: string };
  pcie_arayuz: { surum: string; hat_sayisi: number; fiziksel: string };
  ekran_cikislari: { hdmi: number; dp: number; dvi: number };
  boyut: { uzunluk_mm: number; kalinlik_slot: number };
  guc: { tgp_w: number; ek_guc_konnektoru: string[]; onerilen_psu_w: number };
}

export interface Psu extends BaseItem {
  guc_w: number;
  efficiency: string;
  form_factor: 'ATX' | 'SFX' | 'SFX-L' | string;
  moduler: 'full' | 'semi' | 'non' | string;
  boyut: { uzunluk_mm: number };
  baglantilar: { pcie_8pin_adet: number; pcie_12vhpwr_adet: number; eps_8pin_adet: number; sata_adet: number };
}

export interface Kasa extends BaseItem {
  form_factor: string;
  mobo_destek: string[];
  gpu_uzunluk_max_mm: number;
  cpu_sogutucu_yukseklik_max_mm: number;
  psu_destek: string[];
  psu_tumlesik: boolean;
  psu_dahili?: {
    guc_w: number;
    efficiency: string;
    form_factor: string;
    moduler: string;
    baglantilar: { pcie_8pin_adet: number; pcie_12vhpwr_adet: number; eps_8pin_adet: number; sata_adet: number };
  } | null;
  radyator_destek?: { front?: number[]; top?: number[]; rear?: number[] };
}

export interface Depolama extends BaseItem {
  form_factor: string; // "2.5in", "3.5in", "M.2 2280" ...
  m2_boy?: string;
  arayuz: {
    tip: 'SATA' | 'M.2 SATA' | 'M.2 NVMe' | string;
    protokol?: string;
    port?: string;
    pcie_gen?: string;
    lanes?: number;
  };
  kapasite_gb: number;
}

export interface Monitor extends BaseItem {
  boyut_inch: number;
  cozunurluk: string;
  yenileme_hizi_hz: number;
}

export interface Klavye extends BaseItem {
  mekanik: boolean;
  baglanti: 'Kablolu' | 'Kablosuz' | string;
}

export interface Fare extends BaseItem {
  dpi: number;
  kablosuz: boolean;
}

export interface Sogutucu extends BaseItem {
  tip: 'Air' | 'Liquid' | string;
  fan_sayisi?: number;
  fan_boyutu_mm?: number;
  radyator_mm?: number[];
  desteklenen_soketler: string[];
  max_tdp_w: number;
  yukseklik_mm?: number;
}

export interface DataCatalog {
  anakart: Anakart[];
  islemci: Islemci[];
  ram: Ram[];
  gpu: Gpu[];
  psu: Psu[];
  kasa: Kasa[];
  depolama: Depolama[];
  monitor: Monitor[];
  klavye: Klavye[];
  fare: Fare[];
  islemci_sogutucu: Sogutucu[];
}

export type CategoryKey = keyof DataCatalog;

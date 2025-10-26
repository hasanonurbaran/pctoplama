import type { DataCatalog, CategoryKey } from './types';

const categoryFiles: Record<CategoryKey, string> = {
  anakart: '/data/anakart.json',
  islemci: '/data/islemci.json',
  ram: '/data/ram.json',
  gpu: '/data/ekran_karti.json',
  psu: '/data/psu.json',
  kasa: '/data/kasa.json',
  depolama: '/data/depolama.json',
  monitor: '/data/monitor.json',
  klavye: '/data/klavye.json',
  fare: '/data/fare.json',
  islemci_sogutucu: '/data/islemci_sogutucu.json',
};

export async function loadCategory<T extends CategoryKey>(key: T) {
  const resp = await fetch(categoryFiles[key]);
  if (!resp.ok) throw new Error(`Veri yüklenemedi: ${key}`);
  return (await resp.json()) as DataCatalog[T];
}

export async function loadAllData(): Promise<DataCatalog> {
  const result: Partial<DataCatalog> = {};
  await Promise.all(
    (Object.keys(categoryFiles) as CategoryKey[]).map(async (k) => {
      const list = await loadCategory(k as CategoryKey);
      (result as any)[k] = list;
    })
  );
  return result as DataCatalog;
}

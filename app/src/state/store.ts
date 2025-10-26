import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Anakart, BaseItem, CategoryKey, DataCatalog, Depolama, Fare, Gpu, Islemci, Kasa, Klavye, Monitor, Psu, Ram, Sogutucu } from '../data/types';

export type Selection = {
  anakart?: Anakart;
  islemci?: Islemci;
  ram?: Ram;
  gpu?: Gpu;
  psu?: Psu;
  kasa?: Kasa;
  depolama?: Depolama;
  monitor?: Monitor;
  klavye?: Klavye;
  fare?: Fare;
  islemci_sogutucu?: Sogutucu;
};

export const order: CategoryKey[] = [
  'anakart',
  'islemci',
  'ram',
  'gpu',
  'psu',
  'kasa',
  'depolama',
  'monitor',
  'klavye',
  'fare',
  'islemci_sogutucu',
];

function priceTRY(value: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
}

export interface CartItem {
  key: CategoryKey;
  item: BaseItem;
}

export interface AppState {
  data?: Partial<DataCatalog>;
  selections: Selection;
  cart: CartItem[];
  setData: (data: DataCatalog) => void;
  select: <K extends CategoryKey>(key: K, item: NonNullable<Selection[K]>) => void;
  clear: (key: CategoryKey) => void;
  clearAll: () => void;
  total: () => number;
  totalText: () => string;
  addToCart: (key: CategoryKey, item: BaseItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartTotalText: () => string;
  cartCount: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      data: undefined,
      selections: {},
      cart: [],
      setData: (data) => set({ data }),
      select: (key, item) => set({ selections: { ...get().selections, [key]: item } }),
      clear: (key) => set({ selections: { ...get().selections, [key]: undefined } }),
      clearAll: () => set({ selections: {} }),
      total: () => {
        const s = get().selections;
        return Object.values(s).reduce((sum, item: any) => sum + (item?.fiyat_try || 0), 0);
      },
      totalText: () => priceTRY(get().total()),
      addToCart: (key, item) => set({ cart: [...get().cart, { key, item }] }),
      removeFromCart: (index) => set({ cart: get().cart.filter((_, i) => i !== index) }),
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, ci) => sum + (ci.item?.fiyat_try || 0), 0),
      cartTotalText: () => priceTRY(get().cartTotal()),
      cartCount: () => get().cart.length,
    }),
    { name: 'pctopla_store' }
  )
);

export { priceTRY };

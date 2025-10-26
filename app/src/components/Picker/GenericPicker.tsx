import { useMemo, useState } from 'react';
import ItemCard from './ItemCard';
import type { BaseItem } from '../../data/types';
import { priceTRY } from '../../state/store';

interface GenericPickerProps<T extends BaseItem> {
  id?: string;
  title: string;
  items: T[] | undefined;
  selected?: T;
  onSelect: (item: T) => void;
  isCompatible?: (item: T) => boolean;
  onAddToCart?: (item: T) => void;
}

export default function GenericPicker<T extends BaseItem>({ id, title, items, selected, onSelect, isCompatible, onAddToCart }: GenericPickerProps<T>) {
  const [brand, setBrand] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [hideIncompatible, setHideIncompatible] = useState(true);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const brands = useMemo(() => {
    const set = new Set<string>();
    (items || []).forEach((it) => it.marka && set.add(it.marka));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const list = (items || []).filter((it) => {
      if (brand && it.marka !== brand) return false;
      if (minPrice && it.fiyat_try < Number(minPrice)) return false;
      if (maxPrice && it.fiyat_try > Number(maxPrice)) return false;
      if (it.stok?.durum !== 'in_stock') return false;
      if (hideIncompatible && isCompatible && !isCompatible(it)) return false;
      return true;
    });
    return list;
  }, [items, brand, minPrice, maxPrice, hideIncompatible, isCompatible]);

  const selectedIds = useMemo(() => Object.keys(checked).filter((k) => checked[k]), [checked]);
  const selectedItems = useMemo(() => {
    const map = new Map((items || []).map((it) => [it.id, it] as const));
    return selectedIds.map((id) => map.get(id)).filter(Boolean) as T[];
  }, [items, selectedIds]);
  const selectedTotal = useMemo(() => selectedItems.reduce((s, it) => s + (it.fiyat_try || 0), 0), [selectedItems]);

  const toggle = (id: string, value: boolean) => {
    setChecked((prev) => ({ ...prev, [id]: value }));
  };

  const addAllToCart = () => {
    if (!onAddToCart || selectedItems.length === 0) return;
    selectedItems.forEach((it) => onAddToCart(it));
    setChecked({});
  };

  return (
    <section id={id} style={{ margin: '40px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select aria-label="Marka" value={brand} onChange={(e) => setBrand(e.target.value)}
            style={{ background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 8 }}>
            <option value="">Tüm Markalar</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <input aria-label="Min Fiyat" type="number" inputMode="numeric" placeholder="Min ₺"
            value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
            style={{ background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 8, width: 110 }} />
          <input aria-label="Max Fiyat" type="number" inputMode="numeric" placeholder="Max ₺"
            value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
            style={{ background: 'var(--panel)', color: 'var(--text)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 8, width: 110 }} />
          <button onClick={() => { setBrand(''); setMinPrice(''); setMaxPrice(''); }}
            style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px', color: 'var(--text)' }}>Sıfırla</button>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#9ca3af' }}>
            <input type="checkbox" checked={hideIncompatible} onChange={(e) => setHideIncompatible(e.target.checked)} />
            Uyumsuzları gizle
          </label>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {filtered.map((it) => {
          const comp = isCompatible ? isCompatible(it) : true;
          const disabled = it.stok?.durum !== 'in_stock' || !comp;
          return (
            <div key={it.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ItemCard item={it} disabled={disabled} selected={!!checked[it.id]} onSelect={() => {}} />
              {onAddToCart && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    aria-label="Ürünü seç"
                    title="Ürünü seç"
                    type="checkbox"
                    disabled={disabled}
                    checked={!!checked[it.id]}
                    onChange={(e) => toggle(it.id, e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>Sepete eklemek veya ürünleri karşılaştırmak için işaretle</span>
                </div>
              )}
            </div>
          );
        })}
        {!filtered.length && (
          <div style={{ color: '#9ca3af' }}>Kriterlere uygun ürün bulunamadı.</div>
        )}
      </div>

      {onAddToCart && selectedItems.length > 0 && (
        <div className="picker-selected-bar">
          <div style={{ color: 'var(--text)', fontSize: 14 }}>{selectedItems.length} ürün seçildi • {priceTRY(selectedTotal)}</div>
          <button onClick={() => setPreviewOpen(true)} className="picker-btn picker-btn-outline">Seçilenleri Gör</button>
          <button onClick={() => setCompareOpen(true)} className="picker-btn picker-btn-filled">Seçilenleri Karşılaştır</button>
          <button onClick={addAllToCart} className="picker-btn picker-btn-cart">Seçilenleri Sepete Ekle</button>
        </div>
      )}

      {previewOpen && selectedItems.length > 0 && (
        <div role="dialog" aria-label="Seçilen Ürünler" className="picker-modal-bg">
          <div className="picker-modal-content">
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600 }}>Seçilen Ürünler</div>
              <button onClick={() => setPreviewOpen(false)} className="picker-btn picker-btn-outline">Kapat</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
              {selectedItems.map((it) => (
                <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', border: '1px solid var(--border)', padding: 8, borderRadius: 8 }}>
                  <div>
                    <div style={{ fontSize: 14 }}>{it.ad || `${it.marka} ${it.model || ''}`}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{priceTRY(it.fiyat_try)}</div>
                  </div>
                  <input type="checkbox" checked={!!checked[it.id]} onChange={(e) => setChecked((p) => ({ ...p, [it.id]: e.target.checked }))} />
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{priceTRY(selectedTotal)}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setPreviewOpen(false)} className="picker-btn picker-btn-outline">Kapat</button>
                <button onClick={() => { addAllToCart(); setPreviewOpen(false); }} className="picker-btn picker-btn-filled">Sepete Ekle</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {compareOpen && selectedItems.length > 0 && (
        <div role="dialog" aria-label="Karşılaştır" className="picker-modal-bg">
          <div className="picker-modal-content picker-modal-content-wide">
            <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600 }}>Seçilenleri Karşılaştır</div>
              <button onClick={() => setCompareOpen(false)} className="picker-btn picker-btn-outline">Kapat</button>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid var(--border)', color: '#9ca3af' }}>Özellik</th>
                      {selectedItems.map((it) => (
                        <th key={it.id} style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid var(--border)' }}>{it.ad || `${it.marka} ${it.model || ''}`}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 8, color: '#9ca3af' }}>Marka/Model</td>
                      {selectedItems.map((it) => (
                        <td key={it.id + '-mm'} style={{ padding: 8 }}>{it.marka} {it.model || ''}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: 8, color: '#9ca3af' }}>Fiyat</td>
                      {selectedItems.map((it) => (
                        <td key={it.id + '-f'} style={{ padding: 8 }}>{priceTRY(it.fiyat_try)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: 8, color: '#9ca3af' }}>Etiketler</td>
                      {selectedItems.map((it) => (
                        <td key={it.id + '-e'} style={{ padding: 8 }}>{(it.etiketler || []).join(', ') || '-'}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setCompareOpen(false)} className="picker-btn picker-btn-outline">Kapat</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

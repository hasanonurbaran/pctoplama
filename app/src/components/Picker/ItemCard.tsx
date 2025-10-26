import { useState } from 'react';
import { priceTRY } from '../../state/store';
import type { BaseItem } from '../../data/types';

interface Props<T extends BaseItem> {
  item: T;
  disabled?: boolean;
  selected?: boolean;
  onSelect: (item: T) => void;
}

export default function ItemCard<T extends BaseItem>({ item, disabled, selected, onSelect }: Props<T>) {
  const [hover, setHover] = useState(false);
  const glow = hover || !!selected;
  const bg = '#121212';
  const panelGrad = selected
    ? 'linear-gradient(180deg, rgba(185,28,28,0.18), rgba(0,0,0,0))'
    : 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0))';
  const borderColor = selected ? 'var(--accent-700)' : 'var(--border)';
  const shadow = glow
    ? '0 0 0 1px var(--accent-700), 0 0 18px rgba(185,28,28,0.35), inset 0 0 0 1px rgba(185,28,28,0.25)'
    : '0 0 0 1px var(--border)';

  return (
    <button
      aria-pressed={!!selected}
      disabled={disabled}
      onClick={() => onSelect(item)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        background: `${panelGrad}, ${bg}`,
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        opacity: disabled ? 0.5 : 1,
        borderRadius: 12,
        padding: 14,
        color: 'var(--text)',
        transition: 'box-shadow 160ms ease, border-color 160ms ease, transform 120ms ease',
        transform: glow ? 'translateZ(0)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.ad || `${item.marka} ${item.model || ''}`}
        </div>
        <div style={{ background: 'var(--accent-800)', border: '1px solid var(--accent-700)', color: 'var(--text)', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>
          {priceTRY(item.fiyat_try)}
        </div>
      </div>
      <div style={{ marginTop: 6, color: '#a7a7a7', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.marka} {item.model}
      </div>
      {item.etiketler && item.etiketler.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {item.etiketler.slice(0, 4).map((t) => (
            <span key={t} style={{ fontSize: 11, color: '#cfcfcf', border: '1px solid var(--border)', background: '#0f0f0f', padding: '2px 6px', borderRadius: 999 }}>{t}</span>
          ))}
        </div>
      )}
      {item.stok?.durum !== 'in_stock' && (
        <div style={{ marginTop: 8, color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>Stokta yok</div>
      )}
    </button>
  );
}

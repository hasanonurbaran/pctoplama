import { useState } from 'react';
import { priceTRY } from '../../state/store';
import type { BaseItem } from '../../data/types';

interface Props<T extends BaseItem> {
  item: T;
  disabled?: boolean;
  disabledReason?: string;
  selected?: boolean;
  onSelect: (item: T) => void;
}

export default function ItemCard<T extends BaseItem>({ item, disabled, disabledReason, selected, onSelect }: Props<T>) {
  const [hover, setHover] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const glow = (hover || !!selected) && !disabled;
  const bg = '#121212';
  
  const panelGrad = selected && !disabled
    ? 'linear-gradient(180deg, rgba(185,28,28,0.18), rgba(0,0,0,0))'
    : 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0))';
  
  const borderColor = selected && !disabled ? 'var(--accent-700)' : (disabled ? '#4a4a4a' : 'var(--border)');
  
  const shadow = glow
    ? '0 0 0 1px var(--accent-700), 0 0 18px rgba(185,28,28,0.35), inset 0 0 0 1px rgba(185,28,28,0.25)'
    : `0 0 0 1px ${disabled ? '#3a3a3a' : 'var(--border)'}`;

  const isOutOfStock = item.stok?.durum !== 'in_stock';

  return (
    <div style={{ position: 'relative' }}>
      <button
        aria-pressed={!!selected}
        disabled={disabled}
        onClick={() => onSelect(item)}
        onMouseEnter={() => {
          setHover(true);
          if (disabled && disabledReason) setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setHover(false);
          setShowTooltip(false);
        }}
        style={{
          width: '100%',
          textAlign: 'left',
          background: `${panelGrad}, ${bg}`,
          border: `1px solid ${borderColor}`,
          boxShadow: shadow,
          opacity: disabled ? 0.45 : 1,
          borderRadius: 12,
          padding: 14,
          color: disabled ? '#757575' : 'var(--text)',
          transition: 'box-shadow 160ms ease, border-color 160ms ease, transform 120ms ease, opacity 160ms ease',
          transform: glow ? 'translateZ(0)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 15, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.ad || `${item.marka} ${item.model || ''}`}
          </div>
          <div style={{ background: disabled ? '#2a2a2a' : 'var(--accent-800)', border: `1px solid ${disabled ? '#404040' : 'var(--accent-700)'}`, color: disabled ? '#757575' : 'var(--text)', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>
            {priceTRY(item.fiyat_try)}
          </div>
        </div>
        <div style={{ marginTop: 6, color: disabled ? '#606060' : '#a7a7a7', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.marka} {item.model}
        </div>
        {item.etiketler && item.etiketler.length > 0 && (
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {item.etiketler.slice(0, 4).map((t) => (
              <span key={t} style={{ fontSize: 11, color: disabled ? '#505050' : '#cfcfcf', border: `1px solid ${disabled ? '#3a3a3a' : 'var(--border)'}`, background: disabled ? '#0a0a0a' : '#0f0f0f', padding: '2px 6px', borderRadius: 999 }}>{t}</span>
            ))}
          </div>
        )}
        {isOutOfStock && (
          <div style={{ marginTop: 8, color: disabled ? '#8b5a3c' : 'var(--accent)', fontSize: 12, fontWeight: 600 }}>⚠️ Stokta yok</div>
        )}
        {disabled && !isOutOfStock && (
          <div style={{ marginTop: 8, color: '#8b7355', fontSize: 12, fontWeight: 600 }}>🔒 Uyumsuz</div>
        )}
      </button>

      {showTooltip && disabledReason && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1a1a',
          border: '1px solid var(--accent-700)',
          borderRadius: 8,
          padding: '8px 12px',
          color: 'var(--text)',
          fontSize: 12,
          whiteSpace: 'nowrap',
          zIndex: 1000,
          marginBottom: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          {disabledReason}
        </div>
      )}
    </div>
  );
}

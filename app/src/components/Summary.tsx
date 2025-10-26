import { useAppStore, priceTRY } from '../state/store';
import type { CategoryKey } from '../data/types';
import '../App.css';

const labels: Record<CategoryKey, string> = {
  anakart: 'Anakart',
  islemci: 'İşlemci',
  ram: 'RAM',
  gpu: 'Ekran Kartı',
  psu: 'Güç Kaynağı',
  kasa: 'Kasa',
  depolama: 'Depolama',
  monitor: 'Monitör',
  klavye: 'Klavye',
  fare: 'Fare',
  islemci_sogutucu: 'CPU Soğutucu',
};

export default function Summary() {
  const selections = useAppStore((s) => s.selections);
  const totalText = useAppStore((s) => s.totalText());
  const clear = useAppStore((s) => s.clear);
  const addToCart = useAppStore((s) => s.addToCart);

  const selectedCount = Object.values(selections).filter(Boolean).length;

  const handleAddAllToCart = () => {
    Object.entries(selections).forEach(([key, item]) => {
      if (item) {
        addToCart(key as CategoryKey, item);
      }
    });
  };

  return (
    <aside className="summary-responsive">
      <h3>Özet</h3>
      <div className="summary-list">
        {(Object.keys(labels) as CategoryKey[]).map((k) => {
          const it = (selections as any)[k];
          return (
            <div key={k} className="summary-row">
              <div className="summary-label">{labels[k]}</div>
              <div className="summary-value">
                <div>{it ? (it.ad || `${it.marka} ${it.model||''}`) : '-'}</div>
                <div className="summary-fiyat">{it ? priceTRY(it.fiyat_try) : ''}</div>
              </div>
              {it && (
                <button onClick={() => clear(k)} aria-label={`${labels[k]} temizle`} className="summary-clear">×</button>
              )}
            </div>
          );
        })}
      </div>
      <hr className="summary-hr" />
      <div className="summary-total-container">
        <div className="summary-total-label">Toplam</div>
        <div className="summary-total-value">{totalText}</div>
      </div>

      {selectedCount > 0 && (
        <button
          onClick={handleAddAllToCart}
          style={{
            marginTop: 12,
            width: '100%',
            background: 'var(--accent-800)',
            border: '1px solid var(--accent-700)',
            color: 'var(--text)',
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-700)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-800)')}
        >
          🛒 Sepete Ekle ({selectedCount})
        </button>
      )}
    </aside>
  );
}

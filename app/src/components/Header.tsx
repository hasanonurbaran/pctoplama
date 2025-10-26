import { useState } from 'react';
import { useAppStore, priceTRY } from '../state/store';
import type { CategoryKey } from '../data/types';

const sections: { id: CategoryKey | 'hero'; label: string }[] = [
  { id: 'hero', label: 'Ana Sayfa' },
  { id: 'anakart', label: 'Anakart' },
  { id: 'islemci', label: 'CPU' },
  { id: 'ram', label: 'RAM' },
  { id: 'gpu', label: 'GPU' },
  { id: 'psu', label: 'PSU' },
  { id: 'kasa', label: 'Kasa' },
  { id: 'depolama', label: 'Depolama' },
  { id: 'monitor', label: 'Monitör' },
  { id: 'klavye', label: 'Klavye' },
  { id: 'fare', label: 'Fare' },
  { id: 'islemci_sogutucu', label: 'Soğutucu' },
];

interface Props {
  loading: boolean;
  err: string | null;
}

export default function Header({ loading, err }: Props) {
  const [open, setOpen] = useState(false);
  const [mobilNav, setMobilNav] = useState(false);
  const cart = useAppStore((s) => s.cart);
  const cartCount = useAppStore((s) => s.cartCount());
  const cartTotalText = useAppStore((s) => s.cartTotalText());
  const removeFromCart = useAppStore((s) => s.removeFromCart);
  const clearCart = useAppStore((s) => s.clearCart);

  const scrollTo = (id: string) => {
    const offset = 80; // sticky header approx height
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobilNav(false);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setMobilNav(false);
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--panel)', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontWeight: 800, color: 'var(--text)' }}>🖥️ PC Topla</div>
          <nav className="header-nav" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {sections.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 13, padding: '4px 6px' }}>{s.label}</button>
            ))}
          </nav>
          <button className="header-hamburger" aria-label="Menü" onClick={() => setMobilNav(v => !v)}>
            ☰
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {loading && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Yükleniyor…</div>}
          {err && <div style={{ fontSize: 12, color: 'var(--accent)' }}>{err}</div>}
          <button onClick={() => setOpen((v) => !v)} aria-haspopup="dialog" aria-expanded={open} style={{ position: 'relative', background: 'var(--accent-800)', border: '1px solid var(--accent-700)', borderRadius: 8, padding: '6px 10px', color: 'var(--text)' }}>
            Sepet ({cartCount})
          </button>
        </div>
      </div>

      {mobilNav && (
        <div className="header-nav-mobile">
          {sections.map((s) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 16, textAlign: 'left', padding: 8 }}>{s.label}</button>
          ))}
        </div>
      )}

      {open && (
        <div role="dialog" aria-label="Sepet" style={{ position: 'absolute', right: 16, top: 50, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, width: 360, maxHeight: '70vh', overflow: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600 }}>Sepet</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{cartTotalText}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12 }}>
            {cart.length === 0 && <div style={{ color: '#9ca3af', fontSize: 14 }}>Sepet boş.</div>}
            {cart.map((ci, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', border: '1px solid var(--border)', padding: 8, borderRadius: 8 }}>
                <div>
                  <div style={{ fontSize: 14 }}>{ci.item.ad || `${ci.item.marka} ${ci.item.model || ''}`}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>{priceTRY(ci.item.fiyat_try)} • {ci.key}</div>
                </div>
                <button onClick={() => removeFromCart(idx)} aria-label="Kaldır" style={{ background: 'transparent', border: '1px solid var(--border)', padding: '4px 6px', color: 'var(--text)' }}>×</button>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 700 }}>{cartTotalText}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => clearCart()} style={{ background: 'var(--accent-800)', border: '1px solid var(--accent-700)', borderRadius: 6, padding: '6px 10px', color: 'var(--text)' }}>Temizle</button>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', color: 'var(--text)' }}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section
      id="hero"
      style={{
        margin: 0,
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: '48px 28px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 24,
        background:
          'radial-gradient(1200px 380px at 10% -10%, rgba(185,28,28,0.22), rgba(0,0,0,0)), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0))',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 920, textAlign: 'left' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 54,
            lineHeight: 1.08,
            background: 'linear-gradient(90deg, #f87171 0%, #ef4444 45%, #b91c1c 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: 0.4,
          }}
        >
          Gücünü Seç, Canavarı Topla
        </h1>
        <div style={{ width: 72, height: 4, background: 'var(--accent-700)', borderRadius: 9999 }} />
        <p style={{ margin: 0, color: '#c7c7c7', fontSize: 18 }}>
          Parçanı seç, gücünü belirle.
          <br />
          Saniyeler içinde kendi efsane sistemini oluştur — tam performans, tam senin tarzın!
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <button
            onClick={() => go('anakart')}
            style={{ background: 'var(--accent-800)', border: '1px solid var(--accent-700)', borderRadius: 12, padding: '12px 16px', color: 'var(--text)' }}
          >
            Toplamaya Başla
          </button>
        </div>
      </div>
    </section>
  );
}

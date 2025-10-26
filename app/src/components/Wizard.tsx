import { useState, useMemo } from 'react';
import { useAppStore, priceTRY } from '../state/store';
import type { CategoryKey, Anakart, Islemci, Ram, Gpu, Psu, Kasa, Depolama, Monitor, Klavye, Fare, Sogutucu } from '../data/types';
import GenericPicker from './Picker/GenericPicker';
import { cpuMatchesBoard, ramMatchesBoard, gpuMatchesBoard, psuMatchesCpuGpu, caseMatchesBoardGpuPsu, coolerMatchesCpuCase, storageMatchesBoard } from '../utils/compat';

interface WizardStep {
  key: CategoryKey;
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { key: 'anakart', title: '1) Anakart', description: 'Sisteminizin temelini seçin' },
  { key: 'islemci', title: '2) İşlemci (CPU)', description: 'Anakartla uyumlu bir CPU seçin' },
  { key: 'ram', title: '3) RAM', description: 'Bellek modülü seçin' },
  { key: 'gpu', title: '4) Ekran Kartı (GPU)', description: 'Grafik kartı seçin' },
  { key: 'psu', title: '5) Güç Kaynağı (PSU)', description: 'Sisteminizi güçlendirecek PSU seçin' },
  { key: 'kasa', title: '6) Kasa', description: 'Tüm parçaları yerleştirecek kasa seçin' },
  { key: 'depolama', title: '7) Depolama', description: 'SSD/HDD seçin' },
  { key: 'monitor', title: '8) Monitör', description: 'Ekran seçin' },
  { key: 'klavye', title: '9) Klavye', description: 'Klavye seçin' },
  { key: 'fare', title: '10) Fare', description: 'Fare seçin' },
  { key: 'islemci_sogutucu', title: '11) CPU Soğutucu', description: 'İşlemci soğutucu seçin' },
];

interface Props {
  data: any;
  loading: boolean;
  err: string | null;
}

export default function Wizard({ data, loading, err }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const sel = useAppStore((s) => s.selections);
  const select = useAppStore((s) => s.select);
  
  const step = steps[currentStep];
  const categoryKey = step.key as CategoryKey;
  const items = (data as any)?.[categoryKey];
  
  const isCompatible = useMemo(() => {
    if (categoryKey === 'islemci') return (it: any) => cpuMatchesBoard(it, sel.anakart);
    if (categoryKey === 'ram') return (it: any) => ramMatchesBoard(it, sel.anakart);
    if (categoryKey === 'gpu') return (it: any) => gpuMatchesBoard(it, sel.anakart);
    if (categoryKey === 'psu') return (it: any) => psuMatchesCpuGpu(it, sel.islemci, sel.gpu);
    if (categoryKey === 'kasa') return (it: any) => caseMatchesBoardGpuPsu(it, sel.anakart, sel.gpu, sel.psu);
    if (categoryKey === 'islemci_sogutucu') return (it: any) => coolerMatchesCpuCase(it, sel.islemci, sel.kasa);
    if (categoryKey === 'depolama') return (it: any) => storageMatchesBoard(it, sel.anakart);
    return undefined;
  }, [categoryKey, sel]);

  const handleSelect = (item: any) => {
    select(categoryKey, item);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;
  const selectedCount = Object.values(sel).filter(Boolean).length;
  const total = Object.values(sel).reduce((sum: number, item: any) => sum + (item?.fiyat_try || 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 16 }}>
      {/* Header */}
      <div style={{ maxWidth: 1200, margin: '0 auto', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, color: 'var(--text)' }}>🧙 PC Toplama Sihirbazı</h1>
            <p style={{ margin: 8, color: '#9ca3af', fontSize: 14 }}>Adım adım sisteminizi kurun</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{priceTRY(total)}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{selectedCount} / 11 parça seçildi</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>Adım {currentStep + 1} / {steps.length}</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>{Math.round(progressPercent)}%</div>
          </div>
          <div style={{ width: '100%', height: 8, background: '#1a1a1a', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--accent)', transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

      {/* Main Wizard Modal */}
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
          {/* Step Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 24, color: 'var(--text)' }}>{step.title}</h2>
            <p style={{ margin: 8, color: '#9ca3af' }}>{step.description}</p>
            {sel[categoryKey] && (
              <div style={{ marginTop: 12, padding: 12, background: 'rgba(185,28,28,0.1)', border: '1px solid var(--accent-700)', borderRadius: 8, color: 'var(--text)', fontSize: 13 }}>
                ✓ Seçim: <strong>{(sel[categoryKey] as any).ad || `${(sel[categoryKey] as any).marka} ${(sel[categoryKey] as any).model || ''}`}</strong>
              </div>
            )}
          </div>

          {/* Picker */}
          {loading ? (
            <div style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Yükleniyor...</div>
          ) : err ? (
            <div style={{ color: 'var(--accent)', textAlign: 'center', padding: 40 }}>{err}</div>
          ) : (
            <div style={{ flex: 1, marginBottom: 28 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                {(items || []).map((it: any) => {
                  const comp = isCompatible ? isCompatible(it) : true;
                  const disabled = it.stok?.durum !== 'in_stock' || !comp;
                  const selected = sel[categoryKey]?.id === it.id;

                  return (
                    <button
                      key={it.id}
                      onClick={() => !disabled && handleSelect(it)}
                      disabled={disabled}
                      style={{
                        background: selected ? 'linear-gradient(180deg, rgba(185,28,28,0.2), rgba(0,0,0,0)), #121212' : '#121212',
                        border: selected ? '2px solid var(--accent)' : disabled ? '1px solid #3a3a3a' : '1px solid var(--border)',
                        borderRadius: 12,
                        padding: 16,
                        color: disabled ? '#606060' : 'var(--text)',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.45 : 1,
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{it.ad || `${it.marka} ${it.model || ''}`}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{it.marka} {it.model}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: selected ? 'var(--accent)' : 'inherit' }}>{priceTRY(it.fiyat_try)}</div>
                      {selected && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--accent)' }}>✓ Seçildi</div>}
                    </button>
                  );
                })}
              </div>
              {(!items || items.length === 0) && (
                <div style={{ color: '#9ca3af', textAlign: 'center', padding: 40 }}>Ürün bulunamadı</div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              style={{
                background: currentStep === 0 ? '#1a1a1a' : 'transparent',
                border: '1px solid var(--border)',
                color: currentStep === 0 ? '#606060' : 'var(--text)',
                borderRadius: 8,
                padding: '10px 16px',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                fontSize: 14,
              }}
            >
              ← Önceki
            </button>

            <div style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
              Adım {currentStep + 1} / {steps.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              style={{
                background: currentStep === steps.length - 1 ? 'var(--accent-800)' : 'var(--accent-800)',
                border: '1px solid var(--accent-700)',
                color: 'var(--text)',
                borderRadius: 8,
                padding: '10px 16px',
                cursor: currentStep === steps.length - 1 ? 'default' : 'pointer',
                fontSize: 14,
              }}
            >
              {currentStep === steps.length - 1 ? '✓ Tamamlandı!' : 'Sonraki →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

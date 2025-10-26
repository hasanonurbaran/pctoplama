import { useEffect, useState } from 'react';
import './App.css';
import { loadAllData } from './data/loader';
import { useAppStore } from './state/store';
import type { Anakart, Depolama, Fare, Gpu, Islemci, Kasa, Klavye, Monitor, Psu, Ram, Sogutucu } from './data/types';
import GenericPicker from './components/Picker/GenericPicker';
import Header from './components/Header';
import Hero from './components/Hero';
import Summary from './components/Summary';
import { cpuMatchesBoard, ramMatchesBoard, gpuMatchesBoard, psuMatchesCpuGpu, caseMatchesBoardGpuPsu, coolerMatchesCpuCase, storageMatchesBoard } from './utils/compat';

function App() {
  const data = useAppStore((s) => s.data);
  const setData = useAppStore((s) => s.setData);
  const sel = useAppStore((s) => s.selections);
  const select = useAppStore((s) => s.select);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (data) return;
    setLoading(true);
    loadAllData()
      .then((d) => setData(d))
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Header loading={loading} err={err} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, maxWidth: 1400, margin: '0 auto', padding: 16 }}>
        <main style={{ minWidth: 0 }}>
          <Hero />
          <GenericPicker<Anakart>
            id="anakart"
            title="1) Anakart"
            items={data?.anakart}
            selected={sel.anakart}
            onSelect={(it) => select('anakart', it)}
            onAddToCart={(it) => useAppStore.getState().addToCart('anakart', it)}
          />

          <GenericPicker<Islemci>
            id="islemci"
            title="2) İşlemci"
            items={data?.islemci}
            selected={sel.islemci}
            onSelect={(it) => select('islemci', it)}
            isCompatible={(it) => cpuMatchesBoard(it, sel.anakart)}
            onAddToCart={(it) => useAppStore.getState().addToCart('islemci', it)}
          />

          <GenericPicker<Ram>
            id="ram"
            title="3) RAM"
            items={data?.ram}
            selected={sel.ram}
            onSelect={(it) => select('ram', it)}
            isCompatible={(it) => ramMatchesBoard(it, sel.anakart)}
            onAddToCart={(it) => useAppStore.getState().addToCart('ram', it)}
          />

          <GenericPicker<Gpu>
            id="gpu"
            title="4) Ekran Kartı"
            items={data?.gpu}
            selected={sel.gpu}
            onSelect={(it) => select('gpu', it)}
            isCompatible={(it) => gpuMatchesBoard(it, sel.anakart)}
            onAddToCart={(it) => useAppStore.getState().addToCart('gpu', it)}
          />

          <GenericPicker<Psu>
            id="psu"
            title="5) Güç Kaynağı"
            items={data?.psu}
            selected={sel.psu}
            onSelect={(it) => select('psu', it)}
            isCompatible={(it) => psuMatchesCpuGpu(it, sel.islemci, sel.gpu)}
            onAddToCart={(it) => useAppStore.getState().addToCart('psu', it)}
          />

          <GenericPicker<Kasa>
            id="kasa"
            title="6) Kasa"
            items={data?.kasa}
            selected={sel.kasa}
            onSelect={(it) => select('kasa', it)}
            isCompatible={(it) => caseMatchesBoardGpuPsu(it, sel.anakart, sel.gpu, sel.psu)}
            onAddToCart={(it) => useAppStore.getState().addToCart('kasa', it)}
          />

          <GenericPicker<Depolama>
            id="depolama"
            title="7) Depolama"
            items={data?.depolama}
            selected={sel.depolama}
            onSelect={(it) => select('depolama', it)}
            isCompatible={(it) => storageMatchesBoard(it, sel.anakart)}
            onAddToCart={(it) => useAppStore.getState().addToCart('depolama', it)}
          />

          <GenericPicker<Monitor>
            id="monitor"
            title="8) Monitör"
            items={data?.monitor}
            selected={sel.monitor}
            onSelect={(it) => select('monitor', it)}
            onAddToCart={(it) => useAppStore.getState().addToCart('monitor', it)}
          />

          <GenericPicker<Klavye>
            id="klavye"
            title="9) Klavye"
            items={data?.klavye}
            selected={sel.klavye}
            onSelect={(it) => select('klavye', it)}
            onAddToCart={(it) => useAppStore.getState().addToCart('klavye', it)}
          />

          <GenericPicker<Fare>
            id="fare"
            title="10) Fare"
            items={data?.fare}
            selected={sel.fare}
            onSelect={(it) => select('fare', it)}
            onAddToCart={(it) => useAppStore.getState().addToCart('fare', it)}
          />

          <GenericPicker<Sogutucu>
            id="islemci_sogutucu"
            title="11) CPU Soğutucu"
            items={data?.islemci_sogutucu}
            selected={sel.islemci_sogutucu}
            onSelect={(it) => select('islemci_sogutucu', it)}
            isCompatible={(it) => coolerMatchesCpuCase(it, sel.islemci, sel.kasa)}
            onAddToCart={(it) => useAppStore.getState().addToCart('islemci_sogutucu', it)}
          />
        </main>

        {/* Sağ Sidebar - Summary */}
        <aside>
          <Summary />
        </aside>
      </div>
    </div>
  );
}

export default App;

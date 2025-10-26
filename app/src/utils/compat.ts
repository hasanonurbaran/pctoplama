import type { Anakart, Depolama, Gpu, Islemci, Kasa, Psu, Ram, Sogutucu } from '../data/types';

export function cpuMatchesBoard(cpu: Islemci, board?: Anakart) {
  if (!board) return true;
  return (
    board.cpu_uyumluluk.vendor.toLowerCase() === cpu.vendor.toLowerCase() &&
    board.cpu_uyumluluk.socket.toLowerCase() === cpu.soket.toLowerCase() &&
    board.cpu_uyumluluk.nesiller.includes(cpu.nesil)
  );
}

export function ramMatchesBoard(ram: Ram, board?: Anakart) {
  if (!board) return true;
  if (ram.tip !== board.bellek.tip) return false;
  if (!board.bellek.hiz_mhz.some((mhz) => mhz >= ram.hiz_mhz)) return false;
  return true;
}

export function gpuMatchesBoard(_: Gpu, board?: Anakart) {
  if (!board) return true;
  return ((board.genisleme.pcie_x16 as number) || 0) > 0;
}

export function caseMatchesBoardGpuPsu(c: Kasa, board?: Anakart, gpu?: Gpu, psu?: Psu) {
  if (!c) return true;
  if (board) {
    const form = (board.form_factor || '').toLowerCase();
    const boardOk = Array.isArray(c.mobo_destek) && (c.mobo_destek || []).some((s) => (s || '').toLowerCase() === form);
    if (!boardOk) return false;
  }
  if (gpu && typeof c.gpu_uzunluk_max_mm === 'number' && typeof gpu.boyut?.uzunluk_mm === 'number' && gpu.boyut.uzunluk_mm > c.gpu_uzunluk_max_mm) return false;
  if (psu && Array.isArray(c.psu_destek) && psu.form_factor && !c.psu_destek.includes(psu.form_factor)) return false;
  return true;
}

export function psuMatchesCpuGpu(psu: Psu, cpu?: Islemci, gpu?: Gpu) {
  if (!psu) return true;
  const cpuTdp = cpu?.tdp_w || 0;
  const gpuTgp = gpu?.guc.tgp_w || 0;
  const needed = cpuTdp + gpuTgp + 150;
  if (psu.guc_w < needed) return false;
  if (gpu) {
    const needs12vhpwr = gpu.guc.ek_guc_konnektoru.some((k) => k.toLowerCase().includes('12vhpwr'));
    if (needs12vhpwr && psu.baglantilar.pcie_12vhpwr_adet <= 0) return false;
    const needs8pin = gpu.guc.ek_guc_konnektoru.filter((k) => k.includes('8-pin')).length;
    if (needs8pin > psu.baglantilar.pcie_8pin_adet) return false;
  }
  return true;
}

export function coolerMatchesCpuCase(cooler: Sogutucu, cpu?: Islemci, kasa?: Kasa) {
  if (!cooler) return true;
  if (cpu) {
    if (!cooler.desteklenen_soketler.map((s: string) => s.toLowerCase()).includes(cpu.soket.toLowerCase())) return false;
    if (cooler.max_tdp_w < (cpu.tdp_w || 0)) return false;
  }
  if (kasa && cooler.yukseklik_mm && kasa.cpu_sogutucu_yukseklik_max_mm) {
    if (cooler.yukseklik_mm > kasa.cpu_sogutucu_yukseklik_max_mm) return false;
  }
  return true;
}

export function storageMatchesBoard(d: Depolama, board?: Anakart) {
  if (!board) return true;
  const tip = d?.arayuz?.tip || '';
  const ff = (d?.form_factor || '').toLowerCase();
  if (tip === 'M.2 NVMe' || ff.includes('m.2')) return (board.depolama?.m2 || 0) > 0;
  if (tip === 'SATA' || tip === 'M.2 SATA') return (board.depolama.sata || 0) > 0;
  return true;
}

export function isInStock(obj: { stok: { durum: string } }) {
  return obj.stok?.durum === 'in_stock';
}

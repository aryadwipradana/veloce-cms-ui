/**
 * VELOCE PERFORMANCE - PROFESSIONAL TIRE & WHEEL FITMENT CALCULATOR
 * Real-time specification comparison, clearances, speedometer variance, and SVG cross-section visualizer.
 */

const PRESETS = {
  zenix: {
    name: 'Toyota Innova Zenix (OEM 17" -> Upgrade 19")',
    p1: { sw: 215, ar: 60, rd: 17, rw: 7.0, et: 40 },
    p2: { sw: 245, ar: 45, rd: 19, rw: 8.5, et: 38 }
  },
  alphard: {
    name: 'Toyota Alphard / Vellfire (OEM 18" -> Upgrade 20")',
    p1: { sw: 235, ar: 50, rd: 18, rw: 7.5, et: 45 },
    p2: { sw: 245, ar: 40, rd: 20, rw: 8.5, et: 38 }
  },
  fortuner: {
    name: 'Toyota Fortuner / Pajero Sport (OEM 18" -> Upgrade 20")',
    p1: { sw: 265, ar: 60, rd: 18, rw: 7.5, et: 30 },
    p2: { sw: 275, ar: 55, rd: 20, rw: 9.0, et: 20 }
  },
  bmw3: {
    name: 'BMW 3-Series G20 (OEM 18" -> Upgrade 19" Staggered)',
    p1: { sw: 225, ar: 45, rd: 18, rw: 7.5, et: 30 },
    p2: { sw: 255, ar: 35, rd: 19, rw: 8.5, et: 28 }
  },
  civic: {
    name: 'Honda Civic FE (OEM 17" -> Upgrade 18")',
    p1: { sw: 215, ar: 50, rd: 17, rw: 7.0, et: 45 },
    p2: { sw: 235, ar: 40, rd: 18, rw: 8.5, et: 40 }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const calcForm = document.getElementById('tireCalcForm');
  if (!calcForm) return;

  // Bind change and input events
  calcForm.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', calculateTireComparison);
    input.addEventListener('change', calculateTireComparison);
  });

  // Bind preset selector
  const presetSelect = document.getElementById('carPreset');
  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (PRESETS[val]) {
        applyPreset(PRESETS[val]);
      }
    });
  }

  // Initial calculation
  calculateTireComparison();
});

function applyPreset(preset) {
  setFormValues('p1', preset.p1);
  setFormValues('p2', preset.p2);
  calculateTireComparison();
}

function setFormValues(prefix, pkg) {
  const sw = document.getElementById(`${prefix}_sw`);
  const ar = document.getElementById(`${prefix}_ar`);
  const rd = document.getElementById(`${prefix}_rd`);
  const rw = document.getElementById(`${prefix}_rw`);
  const et = document.getElementById(`${prefix}_et`);

  if (sw) sw.value = pkg.sw;
  if (ar) ar.value = pkg.ar;
  if (rd) rd.value = pkg.rd;
  if (rw) rw.value = pkg.rw;
  if (et) et.value = pkg.et;
}

function getPackageData(prefix) {
  return {
    sw: parseFloat(document.getElementById(`${prefix}_sw`)?.value || 215), // section width (mm)
    ar: parseFloat(document.getElementById(`${prefix}_ar`)?.value || 60),  // aspect ratio (%)
    rd: parseFloat(document.getElementById(`${prefix}_rd`)?.value || 17),  // rim diameter (inch)
    rw: parseFloat(document.getElementById(`${prefix}_rw`)?.value || 7.0), // rim width (inch)
    et: parseFloat(document.getElementById(`${prefix}_et`)?.value || 40)   // offset (mm)
  };
}

function calculateTireComparison() {
  const p1 = getPackageData('p1');
  const p2 = getPackageData('p2');

  // Sidewall height in mm
  const sw1 = p1.sw * (p1.ar / 100);
  const sw2 = p2.sw * (p2.ar / 100);

  // Total diameter in mm
  const dia1 = (p1.rd * 25.4) + (2 * sw1);
  const dia2 = (p2.rd * 25.4) + (2 * sw2);

  // Circumference in mm
  const circ1 = Math.PI * dia1;
  const circ2 = Math.PI * dia2;

  // Revs per km
  const revs1 = 1000000 / circ1;
  const revs2 = 1000000 / circ2;

  // Differences
  const diffDia = dia2 - dia1;
  const diffDiaPct = (diffDia / dia1) * 100;
  const diffWidth = p2.sw - p1.sw;
  const diffSidewall = sw2 - sw1;

  // Speedometer at 100 km/h
  const speedAt100 = 100 * (dia2 / dia1);
  const speedDiff = speedAt100 - 100;

  // Clearances
  // Suspension: Positive means Package 2 is closer to suspension
  const suspClearance = Math.round((0.5 * p2.sw + p2.et) - (0.5 * p1.sw + p1.et));
  // Fender: Positive means Package 2 pokes out farther
  const fenderClearance = Math.round((0.5 * p2.sw - p2.et) - (0.5 * p1.sw - p1.et));
  // Wheelwell: Positive means fills wheelwell more
  const wheelwellClearance = Math.round(0.5 * dia2 - 0.5 * dia1);

  // Update DOM Output Table
  updateMetric('out_sw1', `${p1.sw} mm (${(p1.sw / 25.4).toFixed(1)}")`);
  updateMetric('out_sw2', `${p2.sw} mm (${(p2.sw / 25.4).toFixed(1)}")`);
  updateDiff('out_sw_diff', diffWidth, 'mm');

  updateMetric('out_sidewall1', `${sw1.toFixed(1)} mm (${(sw1 / 25.4).toFixed(1)}")`);
  updateMetric('out_sidewall2', `${sw2.toFixed(1)} mm (${(sw2 / 25.4).toFixed(1)}")`);
  updateDiff('out_sidewall_diff', diffSidewall, 'mm');

  updateMetric('out_dia1', `${dia1.toFixed(1)} mm (${(dia1 / 25.4).toFixed(1)}")`);
  updateMetric('out_dia2', `${dia2.toFixed(1)} mm (${(dia2 / 25.4).toFixed(1)}")`);
  updateDiffPercent('out_dia_diff', diffDia, diffDiaPct);

  updateMetric('out_circ1', `${circ1.toFixed(0)} mm`);
  updateMetric('out_circ2', `${circ2.toFixed(0)} mm`);
  updateDiff('out_circ_diff', circ2 - circ1, 'mm');

  updateMetric('out_revs1', `${revs1.toFixed(0)} /km`);
  updateMetric('out_revs2', `${revs2.toFixed(0)} /km`);
  updateDiff('out_revs_diff', revs2 - revs1, '/km');

  // Speedometer display
  const speedEl = document.getElementById('out_speedometer');
  if (speedEl) {
    let speedHtml = `Ketika spidometer terbaca <strong>100 km/h</strong>, kecepatan aktual kendaraan adalah <strong>${speedAt100.toFixed(1)} km/h</strong> (${Math.abs(speedDiff).toFixed(1)}% ${speedDiff >= 0 ? 'lebih cepat' : 'lebih lambat'}).`;
    if (Math.abs(diffDiaPct) > 3.0) {
      speedHtml += `<br><span style="color: #ef4444; font-weight: 700;">⚠ Peringatan: Selisih diameter (${diffDiaPct.toFixed(1)}%) melebihi ambang batas rekomendasi aman 3%.</span>`;
    } else {
      speedHtml += `<br><span style="color: #22c55e; font-weight: 600;">✓ Selisih dalam batas aman standar pabrik (< 3%).</span>`;
    }
    speedEl.innerHTML = speedHtml;
  }

  // Clearances display
  renderClearance('out_suspension', suspClearance, 'Suspension / Shockbreaker', 'lebih dekat ke suspensi', 'lebih renggang dari suspensi');
  renderClearance('out_fender', fenderClearance, 'Fender Luar', 'lebih menonjol keluar (flush/poke)', 'lebih masuk ke dalam fender');
  renderClearance('out_wheelwell', wheelwellClearance, 'Tinggi Ruang Roda (Fender Gap)', 'ruang roda lebih padat terisi', 'jarak ke spakbor bertambah');

  // Draw 2D visualizer comparison SVG
  renderVisualizer(p1, p2, sw1, sw2, dia1, dia2);
}

function updateMetric(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function updateDiff(id, diff, unit) {
  const el = document.getElementById(id);
  if (!el) return;
  const sign = diff > 0 ? '+' : '';
  el.textContent = `${sign}${diff.toFixed(1)} ${unit}`;
  el.className = diff === 0 ? 'diff-neutral' : (diff > 0 ? 'diff-pos' : 'diff-neg');
}

function updateDiffPercent(id, diffVal, diffPct) {
  const el = document.getElementById(id);
  if (!el) return;
  const sign = diffVal > 0 ? '+' : '';
  el.innerHTML = `${sign}${diffVal.toFixed(1)} mm <small>(${sign}${diffPct.toFixed(1)}%)</small>`;
  if (Math.abs(diffPct) > 3.0) {
    el.className = 'diff-warning';
  } else {
    el.className = diffVal === 0 ? 'diff-neutral' : (diffVal > 0 ? 'diff-pos' : 'diff-neg');
  }
}

function renderClearance(id, val, component, closerText, fartherText) {
  const el = document.getElementById(id);
  if (!el) return;

  if (Math.abs(val) < 1.5) {
    el.innerHTML = `<strong>Sama dengan bawaan OEM</strong> (Selisih < 1.5 mm). Tidak ada perubahan ruang.`;
    el.style.borderLeftColor = '#94a3b8';
  } else if (val > 0) {
    let note = '';
    let color = '#22c55e';
    if (val <= 15) {
      note = 'Aman untuk sebagian besar mobil harian.';
    } else {
      note = 'Pastikan ruang spakbor mencukupi atau pertimbangkan camber / offset yang lebih presisi.';
      color = '#eab308';
    }
    el.innerHTML = `<strong>${val} mm ${closerText}.</strong> ${note}`;
    el.style.borderLeftColor = color;
  } else {
    el.innerHTML = `<strong>${Math.abs(val)} mm ${fartherText}.</strong> Ruang sangat lega.`;
    el.style.borderLeftColor = '#3b82f6';
  }
}

function renderVisualizer(p1, p2, sw1, sw2, dia1, dia2) {
  const svg = document.getElementById('calcVisualizerSvg');
  if (!svg) return;

  // Visual scaling
  const maxDia = Math.max(dia1, dia2, 700);
  const scale = 220 / maxDia;

  const r1_outer = (dia1 / 2) * scale;
  const r1_inner = ((p1.rd * 25.4) / 2) * scale;

  const r2_outer = (dia2 / 2) * scale;
  const r2_inner = ((p2.rd * 25.4) / 2) * scale;

  svg.innerHTML = `
    <!-- Background grid -->
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222630" stroke-width="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="#101217" />
    <rect width="100%" height="100%" fill="url(#grid)" />

    <!-- Package 1 (OEM - Left/Blue) -->
    <g transform="translate(180, 160)">
      <!-- Tire Outer -->
      <circle r="${r1_outer}" fill="none" stroke="#3b82f6" stroke-width="4" stroke-dasharray="6,4" />
      <circle r="${r1_outer}" fill="#3b82f6" fill-opacity="0.1" />
      <!-- Rim -->
      <circle r="${r1_inner}" fill="#1e293b" stroke="#60a5fa" stroke-width="3" />
      <!-- Center Hub -->
      <circle r="16" fill="#3b82f6" />
      <!-- Label -->
      <text y="${r1_outer + 24}" fill="#93c5fd" font-size="12" font-weight="700" text-anchor="middle">
        PKG 1 (OEM): ${p1.sw}/${p1.ar} R${p1.rd}
      </text>
      <text y="${r1_outer + 40}" fill="#94a3b8" font-size="11" text-anchor="middle">
        Ø ${dia1.toFixed(0)} mm | ET ${p1.et}
      </text>
    </g>

    <!-- Package 2 (Upgrade - Right/Red) -->
    <g transform="translate(420, 160)">
      <!-- Tire Outer -->
      <circle r="${r2_outer}" fill="none" stroke="#ef4444" stroke-width="4" />
      <circle r="${r2_outer}" fill="#ef4444" fill-opacity="0.15" />
      <!-- Rim -->
      <circle r="${r2_inner}" fill="#261b1c" stroke="#f87171" stroke-width="3" />
      <!-- Center Hub -->
      <circle r="16" fill="#ef4444" />
      <!-- Label -->
      <text y="${r2_outer + 24}" fill="#fca5a5" font-size="12" font-weight="700" text-anchor="middle">
        PKG 2 (NEW): ${p2.sw}/${p2.ar} R${p2.rd}
      </text>
      <text y="${r2_outer + 40}" fill="#94a3b8" font-size="11" text-anchor="middle">
        Ø ${dia2.toFixed(0)} mm | ET ${p2.et}
      </text>
    </g>

    <!-- Comparison Overlay (Center) -->
    <g transform="translate(300, 160)">
      <line x1="-80" y1="0" x2="80" y2="0" stroke="#475569" stroke-width="1" stroke-dasharray="3,3" />
      <text y="-105" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">
        PERBANDINGAN UKURAN
      </text>
      <text y="-88" fill="${dia2 >= dia1 ? '#ef4444' : '#3b82f6'}" font-size="12" font-weight="700" text-anchor="middle">
        Selisih Diameter: ${dia2 >= dia1 ? '+' : ''}${(dia2 - dia1).toFixed(1)} mm
      </text>
    </g>
  `;
}

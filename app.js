// ==================== Firebase konfigurácia ====================
const firebaseConfig = {
  apiKey: "AIzaSyCYTB63Wikgf8wA4rh1UK68a5nOshrtuoQ",
  authDomain: "hydrosmart-3aa0e.firebaseapp.com",
  databaseURL: "https://hydrosmart-3aa0e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hydrosmart-3aa0e",
  storageBucket: "hydrosmart-3aa0e.firebasestorage.app",
  messagingSenderId: "823014363392",
  appId: "1:823014363392:web:26faf7e45e1f436d27a3e5",
  measurementId: "G-7M72SPJ0WV"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==================== Odoslanie rastliny ====================
function sendPlant() {
  const plantKey = document.getElementById('plantSelect').value;
  if (!plantKey) { alert('Vyber rastlinu!'); return; }

  db.ref('tower/commands').update({
    plant: plantKey,
    forceWater: false,
    resetPumpTimer: true
  }).then(() => {
    alert('Rastlina odoslaná ✔');
  }).catch((err) => {
    console.error(err);
    alert('Chyba zápisu do Firebase: ' + err.message);
  });
}
window.sendPlant = sendPlant;

// ==================== Helpers ====================
function safeNum(x, def = 0) {
  return (typeof x === "number" && !isNaN(x)) ? x : def;
}

function formatTarget(min, max) {
  if (!min && !max) return "--";
  return `${min} – ${max}`;
}

// ==================== Live status ====================
let latestStatus = null;
let latestPlantProfile = null;

db.ref('tower/status').on('value', (snap) => {
  const s = snap.val();
  if (!s) return;
  latestStatus = s;
  render();
});

document.getElementById('plantSelect').addEventListener('change', () => {
  const plantKey = document.getElementById('plantSelect').value;
  if (!plantKey) return;

  db.ref(`tower/plants/${plantKey}`).once('value').then((snap) => {
    latestPlantProfile = snap.val() || null;
    render();
  });
});

// pri štarte: načítaj aktuálnu plant z DB aby UI sedelo
db.ref('tower/commands/plant').once('value').then((snap) => {
  const plantKey = snap.val();
  if (plantKey) {
    document.getElementById('plantSelect').value = plantKey;
    return db.ref(`tower/plants/${plantKey}`).once('value');
  }
}).then((snap) => {
  if (snap && snap.exists()) latestPlantProfile = snap.val();
  render();
});

// ==================== Render ====================
function render() {
  const s = latestStatus || {};

  const pump = !!s.pump;
  const light = !!s.light;
  const waterLow = !!s.waterLow;

  const temp = safeNum(s.temperature, 0);
  const hum = safeNum(s.humidity, 0);
  const waterTemp = safeNum(s.waterTemp, 0);

  const nutrientsPct = safeNum(s.nutrients, 0);
  const concPpm = safeNum(s.concentrationPpm, 0);
  const baselineOk = !!s.baselineCalibrated;

  document.getElementById('pumpStatus').innerText = pump ? 'ON' : 'OFF';
  document.getElementById('lightStatus').innerText = light ? 'ON' : 'OFF';
  document.getElementById('waterLevel').innerText = waterLow ? 'MIMO NORMY' : 'V norme';
  document.getElementById('nutrients').innerText = `${nutrientsPct} % (${concPpm} ppm)`;

  document.getElementById('temperature').innerText = temp.toFixed(1) + ' °C';
  document.getElementById('humidity').innerText = hum.toFixed(0) + ' %';
  document.getElementById('waterTemp').innerText = waterTemp.toFixed(1) + ' °C';

  document.getElementById('calStatus').innerText = baselineOk ? 'OK (baseline uložený)' : 'NEKALIBROVANÉ';

  // odporúčania
  const profile = latestPlantProfile;
  if (!profile || !profile.phases) {
    document.getElementById('targetPpm').innerText = '--';
    document.getElementById('concPpm').innerText = concPpm;
    document.getElementById('nutrientHint').innerText = 'Vyber rastlinu pre odporúčania.';
    return;
  }

  // zvolíme fázu:
  // - ak nie je kalibrácia -> odporučíme kalibráciu
  // - inak predvolene growth (aby to bolo MVP jednoduché)
  const seed = profile.phases.seedling || null;
  const grow = profile.phases.growth || null;

  document.getElementById('concPpm').innerText = concPpm;

  if (!baselineOk) {
    document.getElementById('targetPpm').innerText = grow ? formatTarget(grow.tdsMin, grow.tdsMax) : '--';
    document.getElementById('nutrientHint').innerHTML =
      "Najprv sprav <b>kalibráciu čistej vody</b> (2 kliky na dotykové tlačidlo). Potom uvidíš presnú koncentráciu ppm.";
    return;
  }

  // teraz používame growth ako default (môžeš si neskôr pridať prepínač fázy)
  const phase = grow || seed;
  const min = safeNum(phase?.tdsMin, 0);
  const max = safeNum(phase?.tdsMax, 0);

  document.getElementById('targetPpm').innerText = formatTarget(min, max);

  // Text dávkovania
  let dosingText = "";
  if (phase?.clonexMlPerL != null) {
    dosingText += `Clonex Pro Start: <b>${phase.clonexMlPerL} ml/L</b>. `;
  }
  if (phase?.awaAmlPerL != null && phase?.awaBmlPerL != null) {
    dosingText += `ATA Awa Leaves: <b>A ${phase.awaAmlPerL} ml/L</b> + <b>B ${phase.awaBmlPerL} ml/L</b> (A do vody, premiešať, potom B). `;
  }

  // Navigácia podľa TDS (ppm po baseline)
  let hint = "";
  if (min && concPpm < (min - 100)) {
    hint = "🔻 Koncentrácia je nízka. Pridaj malé množstvo A+B a znovu premeraj.";
  } else if (max && concPpm > (max + 150)) {
    hint = "🔺 Koncentrácia je vysoká. Dolej čistú vodu (3 kliky = dolievanie).";
  } else if (min && max) {
    hint = "✅ Koncentrácia je v norme.";
  } else {
    hint = "✅ Sleduj ppm a uprav podľa potreby.";
  }

  document.getElementById('nutrientHint').innerHTML =
    `<div style="margin-bottom:8px;">${dosingText || "Dávkovanie nie je nastavené."}</div>
     <div><b>${hint}</b></div>`;
}

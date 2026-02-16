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

// ==================== Helpers ====================
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function isNum(x) { return typeof x === "number" && isFinite(x); }
function pad(n) { return String(n).padStart(2, "0"); }

function fmtDate(d) {
  if (!(d instanceof Date)) return "--";
  return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}`;
}

function daysBetween(dateA, dateB) {
  const ms = dateB.getTime() - dateA.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// % z koncentrácie podľa cieľa (ppm min..max) – 0% = pod min, 100% = nad max
function percentFromTarget(concPpm, minPpm, maxPpm) {
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm) || maxPpm <= minPpm) return 0;
  if (concPpm <= minPpm) return 0;
  if (concPpm >= maxPpm) return 100;
  return clamp(Math.round(((concPpm - minPpm) / (maxPpm - minPpm)) * 100), 0, 100);
}

// UI: cieľ pásmo zobrazíme ako percentá v rámci pásma (0–100 je pásmo)
function targetPctLabel() {
  return `0–100 % (cieľové pásmo)`;
}

function dosingText(phaseObj) {
  if (!phaseObj) return "--";
  if (phaseObj.type === "water") return "Iba voda (bez dávkovania)";
  if (phaseObj.type === "root") {
    const ml = phaseObj.rootBoostMlPerL;
    return `Zakoreňovač: ${ml} ml / 1 L (napr. ${ml * 10} ml / 10 L)`;
  }
  if (phaseObj.type === "growth") {
    const a = phaseObj.fertA_MlPerL;
    const b = phaseObj.fertB_MlPerL;
    return `Hnojivo A: ${a} ml/L + Hnojivo B: ${b} ml/L (napr. ${a*10} ml + ${b*10} ml / 10 L)`;
  }
  return "--";
}

function recommendation(concPpm, minPpm, maxPpm, phaseObj) {
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm)) return "Čakám na dáta…";

  if (concPpm < (minPpm - 100)) {
    if (phaseObj?.type === "root") return `Nízke živiny → pridaj zakoreňovač ${phaseObj.rootBoostMlPerL} ml/L.`;
    if (phaseObj?.type === "growth") return `Nízke živiny → pridaj malé množstvo: A ${phaseObj.fertA_MlPerL} ml/L + B ${phaseObj.fertB_MlPerL} ml/L.`;
    return "Nízke živiny → pridaj malé množstvo živín.";
  }

  if (concPpm > (maxPpm + 150)) return "Vysoké živiny → dolej čistú vodu.";

  return "OK (v norme).";
}

// ==================== Rastliny (NOVÝ zoznam + fázy + časy) ====================
const PLANTS = {
  // kľúče presne také, aké posielaš do /tower/commands/plant
  salad: {
    name: "Hlávkový šalát",
    lightHours: "14–16",
    timing: { germMin: 2, germMax: 4, rootMin: 7, rootMax: 10, harvestMin: 30, harvestMax: 40 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "2–4 dni" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 250, tdsMax: 350, daysNote: "7 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 600, tdsMax: 750, daysNote: "ďalej" }
    }
  },

  arugula: {
    name: "Rukola",
    lightHours: "14–16",
    timing: { germMin: 2, germMax: 3, rootMin: 5, rootMax: 7, harvestMin: 20, harvestMax: 30 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "2–3 dni" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 250, tdsMax: 350, daysNote: "5–7 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 600, tdsMax: 800, daysNote: "ďalej" }
    }
  },

  basil: {
    name: "Bazalka",
    lightHours: "16",
    timing: { germMin: 4, germMax: 7, rootMin: 10, rootMax: 14, harvestMin: 35, harvestMax: 50 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "4–7 dní" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 300, tdsMax: 400, daysNote: "10–14 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 700, tdsMax: 900, daysNote: "ďalej" }
    }
  },

  spinach: {
    name: "Špenát",
    lightHours: "12–14",
    timing: { germMin: 4, germMax: 8, rootMin: 7, rootMax: 10, harvestMin: 30, harvestMax: 45 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "4–8 dní" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 250, tdsMax: 350, daysNote: "7 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 600, tdsMax: 800, daysNote: "ďalej" }
    }
  },

  chives: {
    name: "Pažítka",
    lightHours: "14–16",
    timing: { germMin: 7, germMax: 14, rootMin: 10, rootMax: 14, harvestMin: 45, harvestMax: 60 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "7–14 dní" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 300, tdsMax: 400, daysNote: "10–14 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 700, tdsMax: 900, daysNote: "ďalej" }
    }
  },

  coriander: {
    name: "Koriander",
    lightHours: "12–14",
    timing: { germMin: 5, germMax: 10, rootMin: 7, rootMax: 10, harvestMin: 30, harvestMax: 45 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "5–10 dní" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 250, tdsMax: 350, daysNote: "7–10 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 600, tdsMax: 800, daysNote: "ďalej" }
    }
  },

  mint: {
    name: "Mäta",
    lightHours: "14–16",
    timing: { germMin: 8, germMax: 15, rootMin: 10, rootMax: 14, harvestMin: 40, harvestMax: 60 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "8–15 dní" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 250, tdsMax: 350, daysNote: "10–14 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 650, tdsMax: 850, daysNote: "ďalej" }
    }
  },

  leafLettuce: {
    name: "Listový šalát (dubáčik / lollo)",
    lightHours: "14–16",
    timing: { germMin: 2, germMax: 4, rootMin: 7, rootMax: 10, harvestMin: 25, harvestMax: 35 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "2–4 dni" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 250, tdsMax: 350, daysNote: "7 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 600, tdsMax: 750, daysNote: "ďalej" }
    }
  },

  parsley: {
    name: "Petržlen vňaťový",
    lightHours: "14–16",
    timing: { germMin: 10, germMax: 20, rootMin: 10, rootMax: 14, harvestMin: 50, harvestMax: 70 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "10–20 dní" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 300, tdsMax: 400, daysNote: "10–14 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 700, tdsMax: 900, daysNote: "ďalej" }
    }
  },

  pakchoi: {
    name: "Pak choi (baby)",
    lightHours: "14–16",
    timing: { germMin: 2, germMax: 3, rootMin: 5, rootMax: 7, harvestMin: 25, harvestMax: 35 },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0,   tdsMax: 150, daysNote: "2–3 dni" },
      seedling:    { name: "Zakoreňovanie", type: "root",  rootBoostMlPerL: 0.5, tdsMin: 250, tdsMax: 350, daysNote: "5–7 dní" },
      growth:      { name: "Rast", type: "growth", fertA_MlPerL: 2, fertB_MlPerL: 2, tdsMin: 650, tdsMax: 850, daysNote: "ďalej" }
    }
  }
};

// ==================== Commands (write) ====================
function sendPlant() {
  const plantKey = document.getElementById("plantSelect").value;
  if (!plantKey) { alert("Vyber rastlinu!"); return; }

  db.ref("tower/commands").update({
    plant: plantKey,
    resetPumpTimer: true
  }).then(() => alert("Rastlina odoslaná ✔"))
    .catch(err => alert("Chyba: " + err.message));
}

function sendPhase() {
  const phase = document.getElementById("phaseSelect").value;
  if (!phase) { alert("Vyber fázu!"); return; }

  db.ref("tower/commands").update({ phase })
    .then(() => alert("Fáza odoslaná ✔"))
    .catch(err => alert("Chyba: " + err.message));
}

window.sendPlant = sendPlant;
window.sendPhase = sendPhase;

// ==================== Výsev (save/clear) ====================
async function saveSowDate() {
  const v = document.getElementById("sowDate").value;
  if (!v) { alert("Vyber dátum výsevu!"); return; }

  // uložíme ISO dátum do Firebase
  await db.ref("tower/user").update({ sowDate: v });
  alert("Dátum výsevu uložený ✔");
}
async function clearSowDate() {
  await db.ref("tower/user").update({ sowDate: null });
  document.getElementById("sowDate").value = "";
  alert("Dátum výsevu vymazaný ✔");
}
window.saveSowDate = saveSowDate;
window.clearSowDate = clearSowDate;

// ==================== Live state ====================
let latestPlantKey = "salad";
let latestPhase = "seedling";
let sowDateIso = null;

db.ref("tower/commands").on("value", (snap) => {
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()) latestPlantKey = c.plant.trim();
  if (typeof c.phase === "string" && c.phase.trim()) latestPhase = c.phase.trim();

  // sync dropdown
  const plantSel = document.getElementById("plantSelect");
  if (plantSel && plantSel.value !== latestPlantKey) plantSel.value = latestPlantKey;

  const phaseSel = document.getElementById("phaseSelect");
  if (phaseSel && phaseSel.value !== latestPhase) phaseSel.value = latestPhase;
});

db.ref("tower/user").on("value", (snap) => {
  const u = snap.val() || {};
  sowDateIso = (typeof u.sowDate === "string" && u.sowDate) ? u.sowDate : null;

  const sowInput = document.getElementById("sowDate");
  if (sowInput && sowDateIso && sowInput.value !== sowDateIso) {
    sowInput.value = sowDateIso;
  }
});

// ==================== Časová os výpočty ====================
function computeTimeline(plantKey) {
  const plant = PLANTS[plantKey];
  if (!plant) return null;

  const t = plant.timing;
  const out = {
    germRange: `${t.germMin}–${t.germMax} dní`,
    rootRange: `${t.rootMin}–${t.rootMax} dní`,
    harvestRange: `${t.harvestMin}–${t.harvestMax} dní`,
    daysFromSow: null,
    nextAction: "Nastav dátum výsevu, aby sa zobrazil postup.",
    autoPhaseSuggestion: latestPhase
  };

  if (!sowDateIso) return out;

  const sow = new Date(sowDateIso + "T00:00:00");
  const now = new Date();
  const d = daysBetween(sow, now);
  out.daysFromSow = d;

  const germEnd = t.germMax;
  const rootEnd = t.germMax + t.rootMax; // jednoduché: germ + root
  const harvestStart = t.harvestMin;

  if (d <= germEnd) {
    out.autoPhaseSuggestion = "germination";
    out.nextAction = "Fáza: Klíčenie → iba voda (bez živín).";
  } else if (d <= rootEnd) {
    out.autoPhaseSuggestion = "seedling";
    out.nextAction = "Fáza: Zakoreňovanie → zakoreňovač podľa dávky.";
  } else {
    out.autoPhaseSuggestion = "growth";
    out.nextAction = "Fáza: Rast → hnojivo A+B podľa dávky.";
  }

  if (d >= harvestStart) {
    out.nextAction += " ✅ Blíži sa zber / možný zber.";
  }

  return out;
}

function renderTimeline(plantKey) {
  const tl = computeTimeline(plantKey);

  const daysEl = document.getElementById("daysFromSow");
  const germEl = document.getElementById("germinationRange");
  const rootEl = document.getElementById("rootingRange");
  const harvEl = document.getElementById("harvestRange");
  const nextEl = document.getElementById("nextAction");

  if (!tl) {
    if (daysEl) daysEl.innerText = "--";
    if (germEl) germEl.innerText = "--";
    if (rootEl) rootEl.innerText = "--";
    if (harvEl) harvEl.innerText = "--";
    if (nextEl) nextEl.innerText = "Neznáma rastlina.";
    return;
  }

  if (daysEl) daysEl.innerText = (tl.daysFromSow === null) ? "--" : `${tl.daysFromSow} dní (od ${fmtDate(new Date(sowDateIso+"T00:00:00"))})`;
  if (germEl) germEl.innerText = tl.germRange;
  if (rootEl) rootEl.innerText = tl.rootRange;
  if (harvEl) harvEl.innerText = tl.harvestRange;
  if (nextEl) nextEl.innerText = tl.nextAction;
}

// ==================== Status listener (ESP32 -> UI) ====================
db.ref("tower/status").on("value", (snap) => {
  const s = snap.val();
  if (!s) return;

  // -------------- základný status --------------
  document.getElementById("pumpStatus").innerText = s.pump ? "ON" : "OFF";
  document.getElementById("lightStatus").innerText = s.light ? "ON" : "OFF";
  document.getElementById("waterLevel").innerText = s.waterLow ? "MIMO NORMY" : "V norme";

  const tAir = isNum(s.temperature) ? s.temperature : 0;
  const hum = isNum(s.humidity) ? s.humidity : 0;
  const tWater = isNum(s.waterTemp) ? s.waterTemp : 0;

  document.getElementById("temperature").innerText = tAir.toFixed(1) + " °C";
  document.getElementById("humidity").innerText = hum.toFixed(0) + " %";
  document.getElementById("waterTemp").innerText = tWater.toFixed(1) + " °C";

  // -------------- plant / phase --------------
  const plantKey = (typeof s.plant === "string" && s.plant) ? s.plant : latestPlantKey;
  const phase = (typeof s.phase === "string" && s.phase) ? s.phase : latestPhase;

  const plant = PLANTS[plantKey] || null;
  document.getElementById("plantName").innerText = plant ? plant.name : plantKey;
  document.getElementById("phaseName").innerText = (plant?.phases?.[phase]?.name) ? plant.phases[phase].name : phase;

  // svetlo (z app-configu)
  document.getElementById("lightHours").innerText = plant ? `${plant.lightHours} h/deň` : "--";

  // timeline
  renderTimeline(plantKey);

  // -------------- kalibrácia (FIX) --------------
  // ESP32: baselineCalibrated + tdsBaselinePpm
  const calibrated = !!s.baselineCalibrated;
  const baseline = isNum(s.tdsBaselinePpm) ? s.tdsBaselinePpm : 0;

  document.getElementById("baselinePpm").innerText = calibrated ? `${baseline} ppm` : "--";
  document.getElementById("calibrationStatus").innerText =
    calibrated ? "OK (nakalibrované)" : "NEKALIBROVANÉ (sprav 'nová nádrž' = 2 kliky)";

  // -------------- živiny / koncentrácia / cieľ --------------
  const conc = isNum(s.concentrationPpm) ? s.concentrationPpm : 0;

  const phaseObj = plant?.phases?.[phase] || null;

  if (phaseObj) {
    // percentá pre používateľa = ako blízko si k cieľ pásmu fázy
    const pct = percentFromTarget(conc, phaseObj.tdsMin, phaseObj.tdsMax);
    document.getElementById("nutrientsPct").innerText = pct + " %";
    document.getElementById("nutrientsTargetPct").innerText = targetPctLabel();

    document.getElementById("dosingText").innerText = dosingText(phaseObj);
    document.getElementById("nutrientHint").innerText = recommendation(conc, phaseObj.tdsMin, phaseObj.tdsMax, phaseObj);
  } else {
    // fallback: ak by nemal plant config
    const pct = isNum(s.nutrients) ? s.nutrients : 0; // ESP32 posiela "nutrients" ako %
    document.getElementById("nutrientsPct").innerText = pct + " %";
    document.getElementById("nutrientsTargetPct").innerText = "--";
    document.getElementById("dosingText").innerText = "--";
    document.getElementById("nutrientHint").innerText = "Chýba konfigurácia rastliny/fázy v app.js.";
  }
});

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
function el(id) { return document.getElementById(id); }

function safeSetText(id, txt) {
  const e = el(id);
  if (e) e.innerText = txt;
}

function percentFromTarget(concPpm, minPpm, maxPpm) {
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm) || maxPpm <= minPpm) return 0;
  if (concPpm <= minPpm) return 0;
  if (concPpm >= maxPpm) return 100;
  return clamp(Math.round(((concPpm - minPpm) / (maxPpm - minPpm)) * 100), 0, 100);
}

// ==================== Rastliny + fázy (v appke) ====================
const PLANTS = {
  salad: {
    name: "Hlávkový šalát",
    lightHours: "14–16",
    timing: { germ: "2–4 dni", root: "7–10 dní", harvest: "30–40 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 250, tdsMax: 350, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 600, tdsMax: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  arugula: {
    name: "Rukola",
    lightHours: "14–16",
    timing: { germ: "2–3 dni", root: "5–7 dní", harvest: "20–30 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 250, tdsMax: 350, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 600, tdsMax: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  basil: {
    name: "Bazalka",
    lightHours: "16",
    timing: { germ: "4–7 dní", root: "10–14 dní", harvest: "35–50 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 300, tdsMax: 400, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 700, tdsMax: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  spinach: {
    name: "Špenát",
    lightHours: "12–14",
    timing: { germ: "4–8 dní", root: "7–10 dní", harvest: "30–45 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 250, tdsMax: 350, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 600, tdsMax: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  chives: {
    name: "Pažítka",
    lightHours: "14–16",
    timing: { germ: "7–14 dní", root: "10–14 dní", harvest: "45–60 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 300, tdsMax: 400, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 700, tdsMax: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  coriander: {
    name: "Koriander",
    lightHours: "12–14",
    timing: { germ: "5–10 dní", root: "7–10 dní", harvest: "30–45 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 250, tdsMax: 350, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 600, tdsMax: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  mint: {
    name: "Mäta",
    lightHours: "14–16",
    timing: { germ: "8–15 dní", root: "10–14 dní", harvest: "40–60 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 250, tdsMax: 350, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 650, tdsMax: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  leafLettuce: {
    name: "Listový šalát (dubáčik / lollo)",
    lightHours: "14–16",
    timing: { germ: "2–4 dni", root: "7–10 dní", harvest: "25–35 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 250, tdsMax: 350, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 600, tdsMax: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  parsley: {
    name: "Petržlen vňaťový",
    lightHours: "14–16",
    timing: { germ: "10–20 dní", root: "10–14 dní", harvest: "50–70 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 300, tdsMax: 400, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 700, tdsMax: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  },
  pakchoi: {
    name: "Pak choi (baby)",
    lightHours: "14–16",
    timing: { germ: "2–3 dni", root: "5–7 dní", harvest: "25–35 dní" },
    phases: {
      germination: { name: "Klíčenie", type: "water", tdsMin: 0, tdsMax: 150, dose: "Iba voda (bez dávkovania)" },
      seedling: { name: "Zakoreňovanie", type: "root", tdsMin: 250, tdsMax: 350, dose: "Zakoreňovač: 0.5 ml/L (5 ml / 10 L)" },
      growth: { name: "Rast", type: "growth", tdsMin: 650, tdsMax: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (20+20 ml / 10 L)" }
    }
  }
};

// ==================== Auth (pre GitHub Pages) ====================
// Ak máš rules nastavené tak, že vyžadujú auth, toto je MUST.
async function ensureAuth() {
  try {
    if (!firebase.auth().currentUser) {
      await firebase.auth().signInAnonymously();
      console.log("✅ Anonymous auth OK");
    }
  } catch (e) {
    console.error("❌ Auth error:", e);
    alert("Firebase Auth zlyhal. Skontroluj v Firebase Console: Authentication -> Sign-in method -> Anonymous (Enabled).");
  }
}

// ==================== Commands (write) ====================
async function sendPlant() {
  await ensureAuth();

  const plantKey = el("plantSelect")?.value || "";
  if (!plantKey) return alert("Vyber rastlinu!");

  await db.ref("tower/commands").update({
    plant: plantKey,
    resetPumpTimer: true
  });

  alert("Rastlina odoslaná ✔");
}

async function sendPhase() {
  await ensureAuth();

  const phase = el("phaseSelect")?.value || "";
  if (!phase) return alert("Vyber fázu!");

  await db.ref("tower/commands").update({ phase });
  alert("Fáza odoslaná ✔");
}

window.sendPlant = sendPlant;
window.sendPhase = sendPhase;

// ==================== Výsev (save/clear) ====================
async function saveSowDate() {
  await ensureAuth();

  const v = el("sowDate")?.value || "";
  if (!v) return alert("Vyber dátum výsevu!");

  await db.ref("tower/user/sowDate").set(v);
  alert("Dátum výsevu uložený ✔");
}

async function clearSowDate() {
  await ensureAuth();

  await db.ref("tower/user/sowDate").remove();
  if (el("sowDate")) el("sowDate").value = "";
  alert("Dátum výsevu vymazaný ✔");
}

window.saveSowDate = saveSowDate;
window.clearSowDate = clearSowDate;

// ==================== Timeline ====================
function renderTimeline(plantKey, sowIso) {
  const p = PLANTS[plantKey];
  if (!p) {
    safeSetText("daysFromSow", "--");
    safeSetText("germinationRange", "--");
    safeSetText("rootingRange", "--");
    safeSetText("harvestRange", "--");
    safeSetText("nextAction", "Neznáma rastlina.");
    return;
  }

  safeSetText("germinationRange", p.timing.germ);
  safeSetText("rootingRange", p.timing.root);
  safeSetText("harvestRange", p.timing.harvest);

  if (!sowIso) {
    safeSetText("daysFromSow", "--");
    safeSetText("nextAction", "Nastav dátum výsevu (voliteľné) – appka ti prepne fázu podľa dní.");
    return;
  }

  const sow = new Date(sowIso + "T00:00:00");
  const now = new Date();
  const d = Math.floor((now - sow) / (1000 * 60 * 60 * 24));
  safeSetText("daysFromSow", `${d} dní`);

  // Jednoduché “automatické” odporúčanie
  // (len text, nič nemení v systéme)
  let next = "OK.";
  if (d <= 7) next = "Odporúčanie: Klíčenie → iba voda (bez živín).";
  else if (d <= 21) next = "Odporúčanie: Zakoreňovanie → zakoreňovač podľa dávky.";
  else next = "Odporúčanie: Rast → hnojivo A+B podľa dávky.";

  safeSetText("nextAction", next);
}

// ==================== Live listeners ====================
let latestPlantKey = "salad";
let latestPhase = "seedling";
let sowDateIso = null;

// commands
db.ref("tower/commands").on("value", (snap) => {
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()) latestPlantKey = c.plant.trim();
  if (typeof c.phase === "string" && c.phase.trim()) latestPhase = c.phase.trim();

  if (el("plantSelect") && el("plantSelect").value !== latestPlantKey) el("plantSelect").value = latestPlantKey;
  if (el("phaseSelect") && el("phaseSelect").value !== latestPhase) el("phaseSelect").value = latestPhase;
});

// sow date
db.ref("tower/user/sowDate").on("value", (snap) => {
  sowDateIso = snap.val() || null;
  if (el("sowDate") && sowDateIso && el("sowDate").value !== sowDateIso) el("sowDate").value = sowDateIso;
});

// status
db.ref("tower/status").on("value", (snap) => {
  const s = snap.val();
  if (!s) return;

  // základ
  safeSetText("pumpStatus", s.pump ? "ON" : "OFF");
  safeSetText("lightStatus", s.light ? "ON" : "OFF");
  safeSetText("waterLevel", s.waterLow ? "MIMO NORMY" : "V norme");

  const tAir = isNum(s.temperature) ? s.temperature : 0;
  const hum = isNum(s.humidity) ? s.humidity : 0;
  const tWater = isNum(s.waterTemp) ? s.waterTemp : 0;

  safeSetText("temperature", tAir.toFixed(1) + " °C");
  safeSetText("humidity", hum.toFixed(0) + " %");
  safeSetText("waterTemp", tWater.toFixed(1) + " °C");

  // plant/phase (z status alebo commands fallback)
  const plantKey = (typeof s.plant === "string" && s.plant.trim()) ? s.plant.trim() : latestPlantKey;
  const phase = (typeof s.phase === "string" && s.phase.trim()) ? s.phase.trim() : latestPhase;

  const p = PLANTS[plantKey] || null;
  safeSetText("plantName", p ? p.name : plantKey);
  safeSetText("phaseName", p?.phases?.[phase]?.name ? p.phases[phase].name : phase);
  safeSetText("lightHours", p ? `${p.lightHours} h/deň` : "--");

  // timeline
  renderTimeline(plantKey, sowDateIso);

  // kalibrácia (FIX: sedí s ESP32 názvami)
  const calibrated = !!s.baselineCalibrated;
  const baseline = isNum(s.tdsBaselinePpm) ? s.tdsBaselinePpm : 0;

  safeSetText("baselinePpm", calibrated ? `${baseline} ppm` : "--");
  safeSetText("calibrationStatus", calibrated ? "OK (nakalibrované)" : "NEKALIBROVANÉ (sprav 'nová nádrž' = 2 kliky)");

  // živiny: ESP posiela concentrationPpm + nutrients (%) aj tdsMin/Max máme v appke
  const conc = isNum(s.concentrationPpm) ? s.concentrationPpm : 0;

  const phaseObj = p?.phases?.[phase] || null;

  if (phaseObj) {
    const pct = percentFromTarget(conc, phaseObj.tdsMin, phaseObj.tdsMax);
    safeSetText("nutrientsPct", pct + " %");
    safeSetText("nutrientsTargetPct", "0–100 % (cieľové pásmo)");

    safeSetText("dosingText", phaseObj.dose || "--");

    // odporúčanie
    let hint = "OK (v norme).";
    if (conc < phaseObj.tdsMin - 100) {
      if (phaseObj.type === "root") hint = "Nízke živiny → pridaj zakoreňovač podľa dávky.";
      else if (phaseObj.type === "growth") hint = "Nízke živiny → pridaj malé množstvo hnojiva A+B.";
      else hint = "Nízke živiny → (v tejto fáze má byť skoro 0).";
    } else if (conc > phaseObj.tdsMax + 150) {
      hint = "Vysoké živiny → dolej čistú vodu.";
    }
    safeSetText("nutrientHint", hint);
  } else {
    // fallback (ak by fáza nebola)
    const pct = isNum(s.nutrients) ? s.nutrients : 0;
    safeSetText("nutrientsPct", pct + " %");
    safeSetText("nutrientsTargetPct", "--");
    safeSetText("dosingText", "--");
    safeSetText("nutrientHint", "Chýba konfigurácia rastliny alebo fázy.");
  }
});

// ==================== Start ====================
document.addEventListener("DOMContentLoaded", async () => {
  await ensureAuth();
});

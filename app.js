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

// ==================== Nastavenia ====================
// percenty chceme z koncentrácie po baseline.
// Jednoduchá referenčná škála: 0..1000 ppm = 0..100%
const REF_MAX_PPM = 1000;

// ==================== Rastliny (len tie nové) ====================
const PLANTS = {
  "lettuce_head": {
    name: "🥬 Hlávkový šalát",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 40 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 600, max: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "arugula": {
    name: "🥗 Rukola",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 20, max: 30 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "basil": {
    name: "🌿 Bazalka",
    light: "16 h/deň",
    germ: { min: 4, max: 7 },
    root: { min: 10, max: 14 },
    harvest: { min: 35, max: 50 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "spinach": {
    name: "🌿 Špenát",
    light: "12–14 h/deň",
    germ: { min: 4, max: 8 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "chives": {
    name: "🧅 Pažítka",
    light: "14–16 h/deň",
    germ: { min: 7, max: 14 },
    root: { min: 10, max: 14 },
    harvest: { min: 45, max: 60 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "coriander": {
    name: "🌿 Koriander",
    light: "12–14 h/deň",
    germ: { min: 5, max: 10 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "mint": {
    name: "🌱 Mäta",
    light: "14–16 h/deň",
    germ: { min: 8, max: 15 },
    root: { min: 10, max: 14 },
    harvest: { min: 40, max: 60 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 650, max: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "lettuce_leaf": {
    name: "🥬 Listový šalát (lollo/dubáčik)",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 600, max: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "parsley": {
    name: "🌿 Petržlen vňaťový",
    light: "14–16 h/deň",
    germ: { min: 10, max: 20 },
    root: { min: 10, max: 14 },
    harvest: { min: 50, max: 70 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  },
  "pakchoi": {
    name: "🥬 Pak choi (baby)",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0,   max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting:  { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth:   { min: 650, max: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    }
  }
};

// ==================== DOM helpers ====================
function $(id){ return document.getElementById(id); }
function isNum(x){ return typeof x === "number" && isFinite(x); }
function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }

function ppmToPct(ppm){
  if (!isNum(ppm)) return 0;
  return clamp(Math.round((ppm / REF_MAX_PPM) * 100), 0, 100);
}

// phase z dní
function computePhase(days, plant){
  // pravidlo: do konca klíčenia (max) = seedling
  // potom do konca zakoreňovania (klíčenie max + koreňovanie max) = rooting
  // potom growth
  const endSeed = plant.germ.max;
  const endRoot = plant.germ.max + plant.root.max;
  if (days <= endSeed) return "seedling";
  if (days <= endRoot) return "rooting";
  return "growth";
}

function phaseLabel(phase){
  if (phase === "seedling") return "🌱 Klíčenie (iba voda)";
  if (phase === "rooting") return "🌿 Zakoreňovanie (zakoreňovač)";
  return "🌱 Rast (hnojivo A+B)";
}

function daysBetween(isoDate){
  if (!isoDate) return null;
  const d0 = new Date(isoDate + "T00:00:00");
  if (isNaN(d0.getTime())) return null;
  const now = new Date();
  const dn = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((dn - d0) / (1000*60*60*24));
  return diff >= 0 ? diff : 0;
}

// ==================== Populate plant dropdown ====================
function populatePlants(){
  const sel = $("plantSelect");
  sel.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = "🌱 Vyber rastlinu";
  sel.appendChild(opt0);

  Object.entries(PLANTS).forEach(([key, p])=>{
    const o = document.createElement("option");
    o.value = key;
    o.textContent = p.name;
    sel.appendChild(o);
  });
}

// ==================== Writes ====================
function sendPlant(){
  const plantKey = $("plantSelect").value;
  if (!plantKey) { alert("Vyber rastlinu!"); return; }

  db.ref("tower/commands").update({
    plant: plantKey,
    resetPumpTimer: true
  }).then(()=> alert("Rastlina odoslaná ✔"))
    .catch(err => alert("Chyba: " + err.message));
}
window.sendPlant = sendPlant;

function saveSowDate(){
  const d = $("sowDate").value; // YYYY-MM-DD
  const plantKey = $("plantSelect").value;
  if (!plantKey) { alert("Najprv vyber rastlinu."); return; }
  if (!d) { alert("Zadaj dátum výsevu."); return; }

  db.ref("tower/meta").update({
    sowDate: d,
    sowPlant: plantKey
  }).then(()=> alert("Dátum uložený ✔"))
    .catch(err => alert("Chyba: " + err.message));
}
window.saveSowDate = saveSowDate;

function clearSowDate(){
  db.ref("tower/meta").update({
    sowDate: null,
    sowPlant: null
  }).then(()=> alert("Dátum zmazaný ✔"))
    .catch(err => alert("Chyba: " + err.message));
}
window.clearSowDate = clearSowDate;

// ==================== UI render ====================
function setSummary(plantKey, phase, sowDate){
  const p = PLANTS[plantKey];
  if (!p){
    $("selectionSummary").innerHTML = "Vyber rastlinu.";
    return;
  }
  const sowTxt = sowDate ? sowDate.split("-").reverse().join(". ") : "nezadaný";

  $("selectionSummary").innerHTML = `
    <b>Vybraná rastlina:</b> ${p.name}<br>
    <b>Aktuálna fáza:</b> ${phaseLabel(phase)}<br>
    <b>Svetlo:</b> ${p.light}<br>
    <b>Dátum výsevu:</b> ${sowTxt}
  `;
}

function setCalibrationBox(calibrated){
  if (calibrated){
    $("calibrationBox").innerHTML = `
      <span class="pill-ok">OK (nakalibrované)</span><br><br>
      <b>Ak vymeníš celú nádrž (čistá voda):</b><br>
      2× dotkni tlačidlo (nová nádrž).<br><br>
      <b>Ak iba doleješ vodu:</b><br>
      3× dotkni tlačidlo (dolievanie).
    `;
  } else {
    $("calibrationBox").innerHTML = `
      <span class="pill-bad">NEKALIBROVANÉ</span><br><br>
      Nalej <b>čistú vodu</b> a sprav kalibráciu:<br>
      <b>2× dotkni tlačidlo</b> (nová nádrž).<br><br>
      Potom appka začne ukazovať živiny správne.
    `;
  }
}

function makeNextAction({ waterLow, calibrated, phase, doseText, nutrientsStateText }){
  // najvyššia priorita: voda low
  if (waterLow){
    return {
      title: "Dolej vodu",
      desc: "Hladina vody je nízka. Dolej vodu do nádrže. Po dolievaní urob 3× dotyk tlačidla (dolievanie).",
      tone: "bad"
    };
  }

  // kalibrácia
  if (!calibrated){
    return {
      title: "Sprav kalibráciu (prvýkrát)",
      desc: "Nalej čistú vodu do nádrže a sprav 2× dotyk tlačidla (nová nádrž). Potom bude meranie živín správne.",
      tone: "warn"
    };
  }

  // fáza a dávkovanie
  if (phase === "seedling"){
    return {
      title: "Nechaj iba čistú vodu",
      desc: "Si vo fáze klíčenia. Teraz nepridávaj žiadne živiny. Sleduj teplotu a hladinu vody.",
      tone: "ok"
    };
  }

  if (phase === "rooting"){
    return {
      title: "Zakoreňovač podľa dávkovania",
      desc: `Aktuálne je zakoreňovanie. ${doseText}  •  Stav živín: ${nutrientsStateText}`,
      tone: "ok"
    };
  }

  return {
    title: "Hnojivo A + B podľa dávkovania",
    desc: `Aktuálne je rast. ${doseText}  •  Stav živín: ${nutrientsStateText}`,
    tone: "ok"
  };
}

function renderNextAction(box){
  const el = $("nextActionBox");
  const cls = box.tone === "bad" ? "pill-bad" : box.tone === "warn" ? "pill-warn" : "pill-ok";
  el.innerHTML = `
    <div class="title"><span class="${cls}">${box.title}</span></div>
    <div class="desc">${box.desc}</div>
  `;
}

// ==================== Nutrient advice ====================
function nutrientState(concPpm, target){
  // tolerancia jednoduchá: pod min-100 = nízke, nad max+150 = vysoké
  if (!isNum(concPpm)) return { label: "Čakám na dáta…", tone: "warn" };
  if (concPpm < (target.min - 100)) return { label: "NÍZKE", tone: "warn" };
  if (concPpm > (target.max + 150)) return { label: "VYSOKÉ", tone: "bad" };
  return { label: "OK", tone: "ok" };
}

function setNutrientAdvice({ phase, plant, concPpm }){
  const t = plant.tds[phase];
  const state = nutrientState(concPpm, t);

  const concPct = ppmToPct(concPpm);
  const minPct = ppmToPct(t.min);
  const maxPct = ppmToPct(t.max);

  let stateText = "";
  if (state.tone === "ok") stateText = `<span class="pill-ok">OK (v norme)</span>`;
  if (state.tone === "warn") stateText = `<span class="pill-warn">Pozor (nízke živiny)</span>`;
  if (state.tone === "bad") stateText = `<span class="pill-bad">Pozor (vysoké živiny)</span>`;

  let rec = "";
  if (state.tone === "warn"){
    rec = (phase === "rooting")
      ? "Pridaj trochu zakoreňovača podľa dávkovania."
      : (phase === "growth" ? "Pridaj malé množstvo hnojiva A+B." : "Zatiaľ nič nepridávaj.");
  } else if (state.tone === "bad"){
    rec = "Dolej čistú vodu (riedenie). Potom sprav 3× dotyk tlačidla (dolievanie).";
  } else {
    rec = "Všetko je v poriadku. Len kontroluj vodu a teplotu.";
  }

  $("nutrientAdviceBox").innerHTML = `
    <b>Dávkovanie:</b> ${t.dose}<br>
    <b>Stav živín:</b> ${stateText}<br>
    <b>Tvoj stav:</b> ${concPct} %<br>
    <b>Cieľ pre túto fázu:</b> ${minPct}–${maxPct} %<br><br>
    <b>Odporúčanie:</b> ${rec}
  `;

  // do statusu: živiny %
  $("nutrientsPct").innerText = concPct + " %";
}

// ==================== Timeline ====================
function setTimeline(plant, sowDate){
  const days = daysBetween(sowDate);
  if (days === null){
    $("timelineBox").innerHTML = `
      Zadaj <b>dátum výsevu</b> a systém ti bude automaticky hovoriť fázy a ďalší krok.
    `;
    return;
  }

  const germ = `${plant.germ.min}–${plant.germ.max} dní`;
  const root = `${plant.root.min}–${plant.root.max} dní`;
  const harv = `${plant.harvest.min}–${plant.harvest.max} dní`;

  $("timelineBox").innerHTML = `
    <b>Dní od výsevu:</b> ${days} dní<br>
    🌱 <b>Klíčenie:</b> ${germ}<br>
    🌿 <b>Zakoreňovanie:</b> ${root}<br>
    🧺 <b>Zber:</b> ${harv}<br>
  `;
}

// ==================== Auto-phase (z dátumu) ====================
async function autoPhaseUpdate(plantKey, sowDate){
  const plant = PLANTS[plantKey];
  if (!plant) return null;

  const days = daysBetween(sowDate);
  if (days === null) return "seedling"; // keď nie je dátum, nech je bezpečne seedling

  const phase = computePhase(days, plant);

  // zapíš phase do commands (pre budúcnosť; aj keď ESP to zatiaľ nerieši)
  try {
    await db.ref("tower/commands").update({ phase });
  } catch (e) {
    // nevadí, UI aj tak funguje
  }
  return phase;
}

// ==================== Main listeners ====================
populatePlants();

let latestPlantKey = "";
let sowDate = "";
let computedPhase = "seedling";

db.ref("tower/commands").on("value", (snap)=>{
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()) {
    latestPlantKey = c.plant.trim();
    if ($("plantSelect").value !== latestPlantKey) $("plantSelect").value = latestPlantKey;
  }
});

db.ref("tower/meta").on("value", async (snap)=>{
  const m = snap.val() || {};
  if (typeof m.sowDate === "string" && m.sowDate) sowDate = m.sowDate;
  else sowDate = "";

  if ($("sowDate").value !== sowDate) $("sowDate").value = sowDate;

  // ak má meta aj sowPlant a líši sa, synchronizuj
  if (typeof m.sowPlant === "string" && m.sowPlant && m.sowPlant !== latestPlantKey) {
    latestPlantKey = m.sowPlant;
    $("plantSelect").value = latestPlantKey;
    db.ref("tower/commands").update({ plant: latestPlantKey, resetPumpTimer: true }).catch(()=>{});
  }

  // auto phase
  if (latestPlantKey && PLANTS[latestPlantKey]) {
    computedPhase = await autoPhaseUpdate(latestPlantKey, sowDate);
    setSummary(latestPlantKey, computedPhase, sowDate);
    setTimeline(PLANTS[latestPlantKey], sowDate);
  } else {
    $("selectionSummary").innerHTML = "Vyber rastlinu.";
    $("timelineBox").innerHTML = "Zadaj rastlinu a dátum výsevu.";
  }
});

// status listener
db.ref("tower/status").on("value", (snap)=>{
  const s = snap.val() || {};

  // status
  $("pumpStatus").innerText = s.pump ? "ON" : "OFF";
  $("lightStatus").innerText = s.light ? "ON" : "OFF";
  $("waterLevel").innerText = s.waterLow ? "MIMO NORMY" : "V norme";

  const tAir = isNum(s.temperature) ? s.temperature : 0;
  const hum = isNum(s.humidity) ? s.humidity : 0;
  const tWater = isNum(s.waterTemp) ? s.waterTemp : 0;

  $("temperature").innerText = tAir.toFixed(1) + " °C";
  $("humidity").innerText = hum.toFixed(0) + " %";
  $("waterTemp").innerText = tWater.toFixed(1) + " °C";

  // kalibrácia (ESP posiela baselineCalibrated)
  const calibrated = !!s.baselineCalibrated;
  setCalibrationBox(calibrated);

  // koncentrácia ppm (po baseline)
  let concPpm = 0;
  if (isNum(s.concentrationPpm)) concPpm = s.concentrationPpm;
  else if (isNum(s.tdsPpm) && isNum(s.tdsBaselinePpm)) concPpm = Math.max(0, s.tdsPpm - s.tdsBaselinePpm);

  // plant/phase (phase rieši app)
  const plantKey = latestPlantKey && PLANTS[latestPlantKey] ? latestPlantKey : "arugula";
  const plant = PLANTS[plantKey] || PLANTS["arugula"];
  const phase = computedPhase || "seedling";

  // živiny + odporúčania
  setNutrientAdvice({ phase, plant, concPpm });

  const t = plant.tds[phase];
  const state = nutrientState(concPpm, t);
  const nutrientsStateText = (state.label === "OK") ? "OK" : (state.label === "NÍZKE" ? "Nízke" : "Vysoké");
  const action = makeNextAction({
    waterLow: !!s.waterLow,
    calibrated,
    phase,
    doseText: t.dose,
    nutrientsStateText
  });
  renderNextAction(action);

  // ak ešte nebol summary (napr. plant nepríde hneď), dobehni
  setSummary(plantKey, phase, sowDate);
});

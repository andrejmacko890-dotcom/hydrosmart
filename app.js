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

// ==================== Rastliny ====================
const PLANTS = {
  lettuce_head: {
    name: "🥬 Hlávkový šalát",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 40 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 600, max: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 18, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  arugula: {
    name: "🥗 Rukola",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 20, max: 30 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 16, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  basil: {
    name: "🌿 Bazalka",
    light: "16 h/deň",
    germ: { min: 4, max: 7 },
    root: { min: 10, max: 14 },
    harvest: { min: 35, max: 50 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 20, airMax: 26, waterMin: 18, waterMax: 22 }
  },
  spinach: {
    name: "🌿 Špenát",
    light: "12–14 h/deň",
    germ: { min: 4, max: 8 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 16, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  chives: {
    name: "🧅 Pažítka",
    light: "14–16 h/deň",
    germ: { min: 7, max: 14 },
    root: { min: 10, max: 14 },
    harvest: { min: 45, max: 60 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  coriander: {
    name: "🌿 Koriander",
    light: "12–14 h/deň",
    germ: { min: 5, max: 10 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  mint: {
    name: "🌱 Mäta",
    light: "14–16 h/deň",
    germ: { min: 8, max: 15 },
    root: { min: 10, max: 14 },
    harvest: { min: 40, max: 60 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 650, max: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  lettuce_leaf: {
    name: "🥬 Listový šalát (lollo/dubáčik)",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 600, max: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 18, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  parsley: {
    name: "🌿 Petržlen vňaťový",
    light: "14–16 h/deň",
    germ: { min: 10, max: 20 },
    root: { min: 10, max: 14 },
    harvest: { min: 50, max: 70 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  pakchoi: {
    name: "🥬 Pak choi (baby)",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L (napr. 5 ml / 10 L)" },
      growth: { min: 650, max: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml / 10 L)" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  }
};

// ==================== Helpers ====================
function $(id){ return document.getElementById(id); }
function isNum(x){ return typeof x === "number" && isFinite(x); }
function clamp(n,a,b){ return Math.max(a, Math.min(b, n)); }

function ppmToPct(ppm){
  if (!isNum(ppm)) return 0;
  return clamp(Math.round((ppm / 1000) * 100), 0, 100);
}

function daysBetween(isoDate){
  if (!isoDate) return null;
  const d0 = new Date(isoDate + "T00:00:00");
  if (isNaN(d0.getTime())) return null;
  const now = new Date();
  const dn = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((dn - d0) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
}

function computePhase(days, plant){
  const endSeed = plant.germ.max;
  const endRoot = plant.germ.max + plant.root.max;
  if (days <= endSeed) return "seedling";
  if (days <= endRoot) return "rooting";
  return "growth";
}

function phaseLabel(phase){
  if (phase === "seedling") return "Klíčenie";
  if (phase === "rooting") return "Zakoreňovanie";
  return "Rast";
}

function okMark(ok){
  return ok ? "✅" : "⚠️";
}

function formatWaterStatus(waterLow){
  return waterLow ? "Málo vody ⚠️" : "V norme ✅";
}

function formatCalibrationShort(calibrated){
  return calibrated ? "OK ✅" : "Treba nastaviť ⚠️";
}

function setPlantDropdown(){
  const sel = $("plantSelect");
  sel.innerHTML = `<option value="">🌱 Vyber rastlinu</option>`;
  Object.entries(PLANTS).forEach(([key, p])=>{
    const o = document.createElement("option");
    o.value = key;
    o.textContent = p.name;
    sel.appendChild(o);
  });
}

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

function renderCalibration(calibrated){
  if (calibrated){
    $("calibrationBox").innerHTML = `
      <span class="pill-ok">✅ Nakalibrované</span><br><br>
      <b>Ak vymeníš celú vodu:</b><br>
      2× stlač dotykové tlačidlo.<br><br>
      <b>Ak iba doleješ vodu:</b><br>
      3× stlač dotykové tlačidlo.
    `;
  } else {
    $("calibrationBox").innerHTML = `
      <span class="pill-bad">❌ Nekalibrované</span><br><br>
      <b>Prvá kalibrácia:</b><br>
      nalej čistú vodu a 2× stlač dotykové tlačidlo.<br><br>
      <b>Dolievanie vody:</b><br>
      po dolievaní stlač tlačidlo 3×.
    `;
  }
}

function renderTimeline(plant, sowDate, phase){
  const days = daysBetween(sowDate);

  if (days === null){
    $("timelineBox").innerHTML = `
      Zadaj dátum výsevu a aplikácia ti bude sama posielať ďalší krok.
    `;
    return;
  }

  let nextStep = "Systém čaká na ďalšiu fázu.";
  if (phase === "seedling"){
    nextStep = `Po ${plant.germ.max}. dni začne zakoreňovanie a appka ťa upozorní na zakoreňovač.`;
  } else if (phase === "rooting"){
    nextStep = `Po zakoreňovaní prejde systém do rastu a appka ťa upozorní na hnojivo A+B.`;
  } else {
    nextStep = `Rastová fáza beží. Sleduj stav vody a živín.`;
  }

  $("timelineBox").innerHTML = `
    <b>Dní od výsevu:</b> ${days} dní<br>
    🌱 <b>Klíčenie:</b> ${plant.germ.min}–${plant.germ.max} dní<br>
    🌿 <b>Zakoreňovanie:</b> ${plant.root.min}–${plant.root.max} dní<br>
    🧺 <b>Zber:</b> ${plant.harvest.min}–${plant.harvest.max} dní<br><br>
    <b>Ďalší krok:</b> ${nextStep}
  `;
}

function nutrientState(concPpm, target){
  if (!isNum(concPpm)) return { text: "čakám na dáta", tone: "warn" };
  if (concPpm < (target.min - 100)) return { text: "nízke", tone: "warn" };
  if (concPpm > (target.max + 150)) return { text: "vysoké", tone: "bad" };
  return { text: "v poriadku", tone: "ok" };
}

function renderNutrientAdvice(plant, phase, concPpm){
  const t = plant.tds[phase];
  const state = nutrientState(concPpm, t);
  const concPct = ppmToPct(concPpm);
  const minPct = ppmToPct(t.min);
  const maxPct = ppmToPct(t.max);

  let stateHtml = `<span class="pill-ok">✅ V poriadku</span>`;
  if (state.tone === "warn") stateHtml = `<span class="pill-warn">⚠️ Nízke</span>`;
  if (state.tone === "bad") stateHtml = `<span class="pill-bad">❌ Vysoké</span>`;

  let rec = "Všetko je v poriadku.";
  if (state.tone === "warn"){
    if (phase === "seedling") rec = "Zatiaľ nič nepridávaj, v tejto fáze má byť iba voda.";
    else if (phase === "rooting") rec = "Pridaj zakoreňovač podľa dávkovania.";
    else rec = "Pridaj menšie množstvo hnojiva A + B podľa dávkovania.";
  } else if (state.tone === "bad"){
    rec = "Dolej čistú vodu, živiny sú príliš vysoké.";
  }

  $("nutrientAdviceBox").innerHTML = `
    <b>Dávkovanie:</b> ${t.dose}<br>
    <b>Stav živín:</b> ${stateHtml}<br>
    <b>Tvoj stav:</b> ${concPct} %<br>
    <b>Cieľ podľa rastliny:</b> ${minPct}–${maxPct} %<br><br>
    <b>Odporúčanie:</b> ${rec}
  `;
}

function renderNextAction(obj){
  const box = $("nextActionBox");
  if (!box) return;

  let title = "Všetko je v poriadku";
  let desc = "Systém beží správne. Zatiaľ nič nemusíš robiť.";

  if (!obj.deviceConnected){
    title = "Skontroluj napájanie záhonu";
    desc = "Záhon neposlal údaje už dlhšie. Skontroluj napájanie, Wi-Fi alebo reštart zariadenia.";
  } else if (!obj.wifiConnected){
    title = "Pripoj zariadenie na Wi-Fi";
    desc = "Zariadenie momentálne nie je pripojené na Wi-Fi. Pozri návod vyššie a nastav pripojenie.";
  } else if (obj.waterLow){
    title = "Dolej vodu";
    desc = "Hladina vody je nízka. Dolej vodu do nádrže. Po dolievaní stlač dotykové tlačidlo 3×.";
  } else if (!obj.calibrated){
    title = "Sprav prvú kalibráciu";
    desc = "Nalej čistú vodu a stlač dotykové tlačidlo 2×. Až potom bude meranie živín presné.";
  } else if (obj.phase === "seedling"){
    title = "Zatiaľ iba voda";
    desc = "Systém vyhodnotil, že rastlina je ešte v klíčení. Zatiaľ nepridávaj živiny.";
  } else if (obj.phase === "rooting"){
    title = "Zakoreňovač podľa dávkovania";
    desc = `${obj.doseText} Aktuálny stav živín: ${obj.stateText}.`;
  } else {
    title = "Hnojivo A + B podľa dávkovania";
    desc = `${obj.doseText} Aktuálny stav živín: ${obj.stateText}.`;
  }

  box.innerHTML = `
    <div class="title">${title}</div>
    <div class="desc">${desc}</div>
  `;
}

// ==================== Write ====================
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
  const d = $("sowDate").value;
  const plantKey = $("plantSelect").value;
  if (!plantKey){ alert("Najprv vyber rastlinu."); return; }
  if (!d){ alert("Zadaj dátum výsevu."); return; }

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

// ==================== Init ====================
setPlantDropdown();

let latestPlantKey = "";
let sowDate = "";
let computedPhase = "seedling";

// fallback hneď po načítaní
renderCalibration(false);
renderNextAction({
  waterLow: false,
  calibrated: false,
  phase: "seedling",
  doseText: "Iba voda",
  stateText: "čakám na dáta",
  wifiConnected: false,
  deviceConnected: false
});

db.ref("tower/commands").on("value", (snap)=>{
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()){
    latestPlantKey = c.plant.trim();
    if ($("plantSelect") && $("plantSelect").value !== latestPlantKey) {
      $("plantSelect").value = latestPlantKey;
    }
  }
});

db.ref("tower/meta").on("value", (snap)=>{
  const m = snap.val() || {};
  sowDate = (typeof m.sowDate === "string" && m.sowDate) ? m.sowDate : "";

  if ($("sowDate") && $("sowDate").value !== sowDate) {
    $("sowDate").value = sowDate;
  }

  if (typeof m.sowPlant === "string" && m.sowPlant && m.sowPlant !== latestPlantKey){
    latestPlantKey = m.sowPlant;
    if ($("plantSelect")) $("plantSelect").value = latestPlantKey;
  }

  const plantKey = latestPlantKey && PLANTS[latestPlantKey] ? latestPlantKey : "arugula";
  const plant = PLANTS[plantKey];
  const days = daysBetween(sowDate);
  computedPhase = days === null ? "seedling" : computePhase(days, plant);

  setSummary(plantKey, computedPhase, sowDate);
  renderTimeline(plant, sowDate, computedPhase);
});

db.ref("tower/status").on("value", (snap)=>{
  try {
    const s = snap.val() || {};

    $("pumpStatus").innerText = s.pump ? "ON ✅" : "OFF";
    $("lightStatus").innerText = s.light ? "ON ✅" : "OFF";
    $("waterLevel").innerText = formatWaterStatus(!!s.waterLow);

    const airTemp = isNum(s.temperature) ? s.temperature : 0;
    const humidity = isNum(s.humidity) ? s.humidity : 0;
    const waterTemp = isNum(s.waterTemp) ? s.waterTemp : 0;

    const calibrated = !!s.baselineCalibrated;
    $("calibrationShort").innerText = formatCalibrationShort(calibrated);
    renderCalibration(calibrated);

    const wifiConnected = !!s.wifiConnected;
    $("wifiStatus").innerText = wifiConnected ? "Pripojené ✅" : "Nepripojené ⚠️";

    const lastUpdate = isNum(s.lastUpdate) ? s.lastUpdate : 0;
    const ageSec = lastUpdate > 0 ? Math.floor(Date.now() / 1000) - lastUpdate : 999999;
    const deviceConnected = ageSec <= 30;
    $("deviceStatus").innerText = deviceConnected ? "Pripojený ✅" : "Nepripojený ⚠️";
    $("lastUpdateText").innerText = deviceConnected
      ? "Posledná aktualizácia prebehla v poriadku."
      : "Záhon neposlal údaje dlhšie než 30 sekúnd.";

    let concPpm = 0;
    if (isNum(s.concentrationPpm)) concPpm = s.concentrationPpm;
    else if (isNum(s.tdsPpm) && isNum(s.tdsBaselinePpm)) concPpm = Math.max(0, s.tdsPpm - s.tdsBaselinePpm);

    const plantKey = latestPlantKey && PLANTS[latestPlantKey] ? latestPlantKey : (typeof s.plant === "string" && PLANTS[s.plant] ? s.plant : "arugula");
    const plant = PLANTS[plantKey];
    const phase = computedPhase || "seedling";

    const target = plant.tds[phase];
    const nutrientOk = concPpm >= (target.min - 100) && concPpm <= (target.max + 150);
    const airOk = isNum(airTemp) && airTemp >= plant.temps.airMin && airTemp <= plant.temps.airMax;
    const waterOk = isNum(waterTemp) && waterTemp >= plant.temps.waterMin && waterTemp <= plant.temps.waterMax;
    const humOk = isNum(humidity) && humidity >= 40 && humidity <= 80;

    $("temperature").innerText = `${airTemp.toFixed(1)} °C ${okMark(airOk)}`;
    $("humidity").innerText = `${humidity.toFixed(0)} % ${okMark(humOk)}`;
    $("waterTemp").innerText = `${waterTemp.toFixed(1)} °C ${okMark(waterOk)}`;
    $("nutrientsPct").innerText = `${ppmToPct(concPpm)} % ${okMark(nutrientOk)}`;

    setSummary(plantKey, phase, sowDate);
    renderTimeline(plant, sowDate, phase);
    renderNutrientAdvice(plant, phase, concPpm);

    const state = nutrientState(concPpm, target);

    renderNextAction({
      waterLow: !!s.waterLow,
      calibrated: calibrated,
      phase: phase,
      doseText: target.dose,
      stateText: state.text,
      wifiConnected: wifiConnected,
      deviceConnected: deviceConnected
    });
  } catch (err) {
    console.error("Status render error:", err);
    $("lastUpdateText").innerText = "Chyba pri vykreslení dát.";
    renderNextAction({
      waterLow: false,
      calibrated: false,
      phase: "seedling",
      doseText: "Iba voda",
      stateText: "chyba",
      wifiConnected: false,
      deviceConnected: false
    });
  }
});

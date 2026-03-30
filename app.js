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

const PLANTS = {
  lettuce_head: {
    name: "🥬 Hlávkový šalát",
    short: "Jemný listový rast",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 40 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 600, max: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 18, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  arugula: {
    name: "🥗 Rukola",
    short: "Rýchly rast a skorý zber",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 20, max: 30 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 16, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  basil: {
    name: "🌿 Bazalka",
    short: "Teplomilná aromatická rastlina",
    light: "16 h/deň",
    germ: { min: 4, max: 7 },
    root: { min: 10, max: 14 },
    harvest: { min: 35, max: 50 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 20, airMax: 26, waterMin: 18, waterMax: 22 }
  },
  spinach: {
    name: "🌿 Špenát",
    short: "Chladnejšie prostredie",
    light: "12–14 h/deň",
    germ: { min: 4, max: 8 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 16, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  chives: {
    name: "🧅 Pažítka",
    short: "Stabilný pomalší rast",
    light: "14–16 h/deň",
    germ: { min: 7, max: 14 },
    root: { min: 10, max: 14 },
    harvest: { min: 45, max: 60 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  coriander: {
    name: "🌿 Koriander",
    short: "Jemné listy, rýchly zber",
    light: "12–14 h/deň",
    germ: { min: 5, max: 10 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 600, max: 800, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  mint: {
    name: "🌱 Mäta",
    short: "Svieža a odolná",
    light: "14–16 h/deň",
    germ: { min: 8, max: 15 },
    root: { min: 10, max: 14 },
    harvest: { min: 40, max: 60 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 650, max: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  lettuce_leaf: {
    name: "🥬 Listový šalát",
    short: "Rýchly zber listov",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 600, max: 750, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 18, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  parsley: {
    name: "🌿 Petržlen vňaťový",
    short: "Dlhší nábeh, stabilný rast",
    light: "14–16 h/deň",
    germ: { min: 10, max: 20 },
    root: { min: 10, max: 14 },
    harvest: { min: 50, max: 70 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 300, max: 400, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 700, max: 900, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  pakchoi: {
    name: "🥬 Pak choi",
    short: "Rýchly baby harvest",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Iba voda (bez dávkovania)" },
      rooting: { min: 250, max: 350, dose: "Zakoreňovač: 0.5 ml/L" },
      growth: { min: 650, max: 850, dose: "Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L" }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  }
};

function $(id){ return document.getElementById(id); }
function isNum(x){ return typeof x === "number" && isFinite(x); }
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

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

function formatDateSK(isoDate){
  if (!isoDate) return "Nezadaný";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return "Nezadaný";
  return d.toLocaleDateString("sk-SK");
}

function setBar(id, pct){
  const el = $(id);
  if (!el) return;
  el.style.width = `${clamp(pct || 0, 0, 100)}%`;
}

function nutrientState(concPpm, target){
  if (!isNum(concPpm)) return { text: "čakám na dáta", tone: "warn" };
  if (concPpm < (target.min - 100)) return { text: "nízke", tone: "warn" };
  if (concPpm > (target.max + 150)) return { text: "vysoké", tone: "bad" };
  return { text: "v poriadku", tone: "ok" };
}

function calculateHealthScore(obj){
  let score = 100;
  if (!obj.deviceConnected) score -= 40;
  if (!obj.wifiConnected) score -= 20;
  if (obj.waterLow) score -= 20;
  if (!obj.calibrated) score -= 10;
  if (!obj.airOk) score -= 4;
  if (!obj.waterOk) score -= 4;
  if (!obj.humOk) score -= 2;
  if (!obj.nutrientOk) score -= 12;
  return clamp(score, 0, 100);
}

let latestPlantKey = "";
let sowDate = "";
let computedPhase = "seedling";

function setPlantDropdown(){
  const sel = $("plantSelect");
  if (!sel) return;

  sel.innerHTML = `<option value="">🌱 Vyber rastlinu</option>`;
  Object.entries(PLANTS).forEach(([key, p])=>{
    const o = document.createElement("option");
    o.value = key;
    o.textContent = p.name;
    sel.appendChild(o);
  });
}

function renderPlantCards(selectedKey){
  const wrap = $("plantCards");
  if (!wrap) return;

  wrap.innerHTML = "";
  Object.entries(PLANTS).forEach(([key, p]) => {
    const div = document.createElement("div");
    div.className = "plant-chip" + (selectedKey === key ? " active" : "");
    div.innerHTML = `
      <div class="name">${p.name}</div>
      <div class="desc">${p.short || p.light || ""}</div>
    `;

    div.addEventListener("click", () => {
      $("plantSelect").value = key;
      latestPlantKey = key;
      renderPlantCards(key);

      const plant = PLANTS[key];
      const days = daysBetween(sowDate);
      const phase = days === null ? "seedling" : computePhase(days, plant);

      setSummary(key, phase, sowDate);
      setHero(key, phase, sowDate);
      renderTimeline(plant, sowDate, phase);
      renderDaysToHarvest(key, sowDate);
    });

    wrap.appendChild(div);
  });
}

function setSummary(plantKey, phase, sowDateValue){
  const p = PLANTS[plantKey];
  if (!p){
    $("selectionSummary").innerHTML = "Vyber rastlinu a zadaj dátum výsevu.";
    return;
  }

  $("selectionSummary").innerHTML = `
    <b>Vybraná rastlina:</b> ${p.name}<br>
    <b>Aktuálna fáza:</b> ${phaseLabel(phase)}<br>
    <b>Odporúčané svetlo:</b> ${p.light}<br>
    <b>Dátum výsevu:</b> ${formatDateSK(sowDateValue)}
  `;
}

function setHero(plantKey, phase, sowDateValue){
  const p = PLANTS[plantKey];
  const days = daysBetween(sowDateValue);

  $("plantNameHero").innerText = p ? p.name : "—";
  $("growthDayHero").innerText = days === null ? "—" : `${days}`;
  $("phaseHero").innerText = p ? phaseLabel(phase) : "—";
  $("sowDateHero").innerText = formatDateSK(sowDateValue);

  if (p) {
    $("heroHeadline").innerText = `${p.name} je aktuálne vo fáze „${phaseLabel(phase)}“.`;
    $("heroSubtext").innerText = `HydroSmart sleduje vodu, živiny, teplotu a stav systému. Používateľ vždy vidí presne to, čo má spraviť ďalej.`;
  } else {
    $("heroHeadline").innerText = `Systém sleduje rastlinu, vodu, živiny a vždy ukáže ďalší krok.`;
    $("heroSubtext").innerText = `HydroSmart zjednodušuje pestovanie tým, že automaticky vyhodnocuje stav veže a používateľovi povie iba to, čo má urobiť.`;
  }
}

function renderDaysToHarvest(plantKey, sowDateValue){
  const p = PLANTS[plantKey];
  const el = $("daysToHarvestHero");
  if (!el || !p){
    if (el) el.innerText = "—";
    return;
  }

  const days = daysBetween(sowDateValue);
  if (days === null){
    el.innerText = "Zber —";
    return;
  }

  const remaining = Math.max(0, p.harvest.min - days);
  if (remaining <= 0) el.innerText = "Možný zber";
  else el.innerText = `Zber o ${remaining} dní`;
}

function renderCalibration(calibrated){
  if (calibrated){
    $("calibrationBox").innerHTML = `
      <b>Kalibrácia:</b> <span style="color:#13995f;font-weight:800;">Nakalibrované ✅</span><br><br>
      <b>Ak vymeníš celú vodu:</b><br>
      2× stlač dotykové tlačidlo.<br><br>
      <b>Ak iba doleješ vodu:</b><br>
      3× stlač dotykové tlačidlo.
    `;
  } else {
    $("calibrationBox").innerHTML = `
      <b>Kalibrácia:</b> <span style="color:#d15454;font-weight:800;">Treba nastaviť ⚠️</span><br><br>
      <b>Prvá kalibrácia:</b><br>
      nalej čistú vodu a 2× stlač dotykové tlačidlo.<br><br>
      <b>Po dolievaní vody:</b><br>
      stlač tlačidlo 3×.
    `;
  }
}

function renderTimeline(plant, sowDateValue, phase){
  const days = daysBetween(sowDateValue);

  if (days === null){
    $("timelineBox").innerHTML = `Zadaj dátum výsevu a aplikácia sama vypočíta deň rastu aj ďalšiu fázu.`;
    return;
  }

  let nextStep = "Systém čaká na ďalšiu fázu.";
  if (phase === "seedling"){
    nextStep = `Po ${plant.germ.max}. dni začne zakoreňovanie a aplikácia upozorní na zakoreňovač.`;
  } else if (phase === "rooting"){
    nextStep = `Po zakoreňovaní prejde systém do rastu a upozorní na hnojivo A + B.`;
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

function renderNutrientAdvice(plant, phase, concPpm){
  const t = plant.tds[phase];
  const state = nutrientState(concPpm, t);
  const concPct = ppmToPct(concPpm);
  const minPct = ppmToPct(t.min);
  const maxPct = ppmToPct(t.max);

  let stateHtml = `<span style="color:#13995f;font-weight:800;">✅ V poriadku</span>`;
  if (state.tone === "warn") stateHtml = `<span style="color:#d98b22;font-weight:800;">⚠️ Nízke</span>`;
  if (state.tone === "bad") stateHtml = `<span style="color:#d15454;font-weight:800;">❌ Vysoké</span>`;

  let rec = "Všetko je v poriadku.";
  if (state.tone === "warn"){
    if (phase === "seedling") rec = "Zatiaľ nič nepridávaj. V tejto fáze má byť iba voda.";
    else if (phase === "rooting") rec = "Pridaj zakoreňovač podľa dávkovania.";
    else rec = "Pridaj menšie množstvo hnojiva A + B podľa dávkovania.";
  } else if (state.tone === "bad"){
    rec = "Dolej čistú vodu. Živiny sú príliš vysoké.";
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
  let tag = "Smart odporúčanie";
  let priority = "Nízka";
  let reason = "Všetky hlavné ukazovatele sú stabilné.";

  if (!obj.deviceConnected){
    title = "Skontroluj zariadenie";
    desc = "Záhon neposlal údaje dlhšie než 30 sekúnd. Skontroluj napájanie, Wi-Fi alebo reštart zariadenia.";
    tag = "Potrebný zásah";
    priority = "Vysoká";
    reason = "Zariadenie je offline.";
  } else if (!obj.wifiConnected){
    title = "Pripoj zariadenie na Wi-Fi";
    desc = "Zariadenie momentálne nie je pripojené na Wi-Fi. Nižšie v aplikácii je stručný návod na pripojenie.";
    tag = "Potrebný zásah";
    priority = "Vysoká";
    reason = "Chýba Wi-Fi spojenie.";
  } else if (obj.waterLow){
    title = "Dolej vodu";
    desc = "Hladina vody je nízka. Dolej vodu do nádrže. Po dolievaní stlač dotykové tlačidlo 3×.";
    tag = "Priorita";
    priority = "Vysoká";
    reason = "Hladina vody je nízka.";
  } else if (!obj.calibrated){
    title = "Sprav prvú kalibráciu";
    desc = "Nalej čistú vodu a stlač dotykové tlačidlo 2×. Až potom bude meranie živín presné.";
    tag = "Priorita";
    priority = "Stredná";
    reason = "Systém nie je kalibrovaný.";
  } else if (obj.phase === "seedling"){
    title = "Zatiaľ iba voda";
    desc = "Rastlina je ešte v klíčení. Zatiaľ nepridávaj živiny.";
    priority = "Nízka";
    reason = "Rastlina je v klíčení.";
  } else if (obj.phase === "rooting"){
    title = "Pridaj zakoreňovač";
    desc = `${obj.doseText}. Aktuálny stav živín: ${obj.stateText}.`;
    priority = obj.stateTone === "warn" ? "Stredná" : "Nízka";
    reason = obj.stateTone === "warn" ? "Živiny sú pod cieľom." : "Prebieha zakoreňovanie.";
  } else {
    title = "Pridaj hnojivo A + B";
    desc = `${obj.doseText}. Aktuálny stav živín: ${obj.stateText}.`;
    priority = obj.stateTone === "warn" ? "Stredná" : "Nízka";
    reason = obj.stateTone === "warn" ? "Živiny sú nízke." : "Rastová fáza pokračuje.";
  }

  box.innerHTML = `
    <div>
      <div class="smart-tag"><i class="fa-solid fa-wand-magic-sparkles"></i> ${tag}</div>
      <div class="smart-title">${title}</div>
      <div class="smart-desc">${desc}</div>

      <div class="next-meta">
        <div class="meta-chip"><b>Priorita:</b> ${priority}</div>
        <div class="meta-chip"><b>Dôvod:</b> ${reason}</div>
      </div>
    </div>
  `;
}

function renderOverallState(obj){
  let text = "Stav neznámy";
  if (!obj.deviceConnected) text = "🔴 Zariadenie offline";
  else if (!obj.wifiConnected) text = "🟠 Bez Wi-Fi";
  else if (obj.waterLow || !obj.calibrated) text = "🟠 Vyžaduje zásah";
  else text = "🟢 Stabilný";
  $("overallStateBadge").innerText = text;
}

function renderHealth(score){
  const scoreText = $("healthScoreText");
  const scoreBar = $("healthScoreBar");
  const note = $("healthScoreNote");
  const badge = $("healthBadge");

  if (!scoreText || !scoreBar || !note || !badge) return;
  scoreText.innerText = `${score} %`;
  scoreBar.style.width = `${score}%`;

  if (score >= 85){
    note.innerText = "Systém je vo veľmi dobrom stave. Podmienky sú stabilné a pripravené na ďalší rast.";
  } else if (score >= 65){
    note.innerText = "Systém funguje dobre, ale niektoré ukazovatele si pýtajú menšiu pozornosť.";
  } else {
    note.innerText = "Systém potrebuje zásah. Skontroluj hlavné ukazovatele a odporúčanú akciu.";
  }

  badge.innerText = `Zdravie systému: ${score} %`;
}

function renderMiniStats(obj){
  $("deviceStatusMini").innerText = obj.deviceConnected ? "Zariadenie: online ✅" : "Zariadenie: offline ⚠️";
  $("pumpStatusMini").innerText = obj.pump ? "Aktívna ✅" : "Vypnutá";
  $("lightStatusMini").innerText = obj.light ? "Zapnuté ✅" : "Vypnuté";
  $("wifiStatusMini").innerText = obj.wifiConnected ? "Pripojené ✅" : "Nepripojené ⚠️";
  $("waterLevelMini").innerText = obj.waterLow ? "Nízka ⚠️" : "OK ✅";
}

function setRowTone(id, tone){
  const row = $(id);
  if (!row) return;
  row.classList.remove("tone-good", "tone-warn", "tone-bad");
  row.classList.add(tone);
}

function renderStatusTones(obj){
  setRowTone("rowDevice", obj.deviceConnected ? "tone-good" : "tone-bad");
  setRowTone("rowWifi", obj.wifiConnected ? "tone-good" : "tone-warn");
  setRowTone("rowPump", obj.pump ? "tone-good" : "tone-warn");
  setRowTone("rowLight", obj.light ? "tone-good" : "tone-warn");
  setRowTone("rowHumidity", obj.humOk ? "tone-good" : "tone-warn");
  setRowTone("rowCalibration", obj.calibrated ? "tone-good" : "tone-warn");
}

function renderVisualState(obj){
  const waterFill = $("waterFillAnim");
  const towerGlow = $("towerGlow");

  if (waterFill) {
    waterFill.style.height = obj.waterLow ? "18%" : "38%";
    waterFill.style.background = obj.waterLow
      ? "linear-gradient(180deg, rgba(228,95,95,0.42), rgba(228,95,95,0.18))"
      : "linear-gradient(180deg, rgba(83,215,255,0.42), rgba(83,215,255,0.14))";
  }

  if (towerGlow) {
    if (!obj.deviceConnected) {
      towerGlow.style.background = "radial-gradient(circle, rgba(228,95,95,0.26), rgba(228,95,95,0.06), transparent 72%)";
    } else if (obj.waterLow || !obj.calibrated) {
      towerGlow.style.background = "radial-gradient(circle, rgba(238,154,34,0.24), rgba(238,154,34,0.06), transparent 72%)";
    } else {
      towerGlow.style.background = "radial-gradient(circle, rgba(255,241,164,0.44), rgba(255,241,164,0.10), transparent 72%)";
    }
  }
}

function sendPlant(){
  const plantKey = $("plantSelect").value;
  if (!plantKey) {
    alert("Vyber rastlinu.");
    return;
  }

  db.ref("tower/commands").update({
    plant: plantKey,
    resetPumpTimer: true
  }).then(() => {
    alert("Rastlina bola nastavená ✔");
  }).catch(err => {
    alert("Chyba: " + err.message);
  });
}
window.sendPlant = sendPlant;

function saveSowDate(){
  const d = $("sowDate").value;
  const plantKey = $("plantSelect").value;

  if (!plantKey){
    alert("Najprv vyber rastlinu.");
    return;
  }

  if (!d){
    alert("Zadaj dátum výsevu.");
    return;
  }

  db.ref("tower/meta").update({
    sowDate: d,
    sowPlant: plantKey
  }).then(() => {
    alert("Dátum výsevu bol uložený ✔");
  }).catch(err => {
    alert("Chyba: " + err.message);
  });
}
window.saveSowDate = saveSowDate;

function clearSowDate(){
  db.ref("tower/meta").update({
    sowDate: null,
    sowPlant: null
  }).then(() => {
    alert("Dátum výsevu bol zmazaný ✔");
  }).catch(err => {
    alert("Chyba: " + err.message);
  });
}
window.clearSowDate = clearSowDate;

function initPlantSelectSync(){
  const select = $("plantSelect");
  if (!select) return;

  select.addEventListener("change", () => {
    latestPlantKey = select.value || "";
    renderPlantCards(latestPlantKey);

    const p = PLANTS[latestPlantKey];
    if (p) {
      const days = daysBetween(sowDate);
      const phase = days === null ? "seedling" : computePhase(days, p);
      setSummary(latestPlantKey, phase, sowDate);
      setHero(latestPlantKey, phase, sowDate);
      renderTimeline(p, sowDate, phase);
      renderDaysToHarvest(latestPlantKey, sowDate);
    }
  });
}

setPlantDropdown();
renderPlantCards("");
initPlantSelectSync();

renderCalibration(false);
renderNextAction({
  waterLow: false,
  calibrated: false,
  phase: "seedling",
  doseText: "Iba voda",
  stateText: "čakám na dáta",
  stateTone: "warn",
  wifiConnected: false,
  deviceConnected: false
});
renderOverallState({
  waterLow: false,
  calibrated: false,
  wifiConnected: false,
  deviceConnected: false
});
renderMiniStats({
  deviceConnected: false,
  pump: false,
  light: false,
  wifiConnected: false,
  waterLow: false
});
renderHealth(0);

db.ref("tower/commands").on("value", (snap) => {
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()) {
    latestPlantKey = c.plant.trim();
    if ($("plantSelect") && $("plantSelect").value !== latestPlantKey) {
      $("plantSelect").value = latestPlantKey;
    }
    renderPlantCards(latestPlantKey);
  }
});

db.ref("tower/meta").on("value", (snap) => {
  const m = snap.val() || {};
  sowDate = (typeof m.sowDate === "string" && m.sowDate) ? m.sowDate : "";

  if ($("sowDate") && $("sowDate").value !== sowDate) {
    $("sowDate").value = sowDate;
  }

  if (typeof m.sowPlant === "string" && m.sowPlant && m.sowPlant !== latestPlantKey) {
    latestPlantKey = m.sowPlant;
    if ($("plantSelect")) $("plantSelect").value = latestPlantKey;
  }

  const plantKey = latestPlantKey && PLANTS[latestPlantKey] ? latestPlantKey : "arugula";
  const plant = PLANTS[plantKey];
  const days = daysBetween(sowDate);
  computedPhase = days === null ? "seedling" : computePhase(days, plant);

  setSummary(plantKey, computedPhase, sowDate);
  setHero(plantKey, computedPhase, sowDate);
  renderTimeline(plant, sowDate, computedPhase);
  renderPlantCards(plantKey);
  renderDaysToHarvest(plantKey, sowDate);
});

db.ref("tower/status").on("value", (snap) => {
  try {
    const s = snap.val() || {};

    const pumpOn = !!s.pump;
    const lightOn = !!s.light;
    const waterLow = !!s.waterLow;
    const calibrated = !!s.baselineCalibrated;
    const wifiConnected = !!s.wifiConnected;

    $("pumpStatus").innerText = pumpOn ? "ON ✅" : "OFF";
    $("lightStatus").innerText = lightOn ? "ON ✅" : "OFF";
    $("waterLevel").innerText = formatWaterStatus(waterLow);

    const airTemp = isNum(s.temperature) ? s.temperature : 0;
    const humidity = isNum(s.humidity) ? s.humidity : 0;
    const waterTemp = isNum(s.waterTemp) ? s.waterTemp : 0;

    $("calibrationShort").innerText = formatCalibrationShort(calibrated);
    renderCalibration(calibrated);
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

    const plantKey = latestPlantKey && PLANTS[latestPlantKey]
      ? latestPlantKey
      : (typeof s.plant === "string" && PLANTS[s.plant] ? s.plant : "arugula");

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

    $("waterLevelDetail").innerText = waterLow ? "Treba doliať" : "Stav je stabilný";
    $("nutrientsDetail").innerText = `${ppmToPct(concPpm)} %`;
    $("temperatureDetail").innerText = `${airTemp.toFixed(1)} °C`;
    $("waterTempDetail").innerText = `${waterTemp.toFixed(1)} °C`;

    setBar("waterBar", waterLow ? 18 : 78);
    setBar("nutrientBar", ppmToPct(concPpm));
    setBar("tempBar", clamp(Math.round((airTemp / 35) * 100), 0, 100));
    setBar("waterTempBar", clamp(Math.round((waterTemp / 30) * 100), 0, 100));

    setSummary(plantKey, phase, sowDate);
    setHero(plantKey, phase, sowDate);
    renderTimeline(plant, sowDate, phase);
    renderNutrientAdvice(plant, phase, concPpm);
    renderDaysToHarvest(plantKey, sowDate);

    const state = nutrientState(concPpm, target);

    renderNextAction({
      waterLow,
      calibrated,
      phase,
      doseText: target.dose,
      stateText: state.text,
      stateTone: state.tone,
      wifiConnected,
      deviceConnected
    });

    renderOverallState({
      waterLow,
      calibrated,
      wifiConnected,
      deviceConnected
    });

    renderMiniStats({
      deviceConnected,
      pump: pumpOn,
      light: lightOn,
      wifiConnected,
      waterLow
    });

    renderStatusTones({
      deviceConnected,
      wifiConnected,
      pump: pumpOn,
      light: lightOn,
      humOk,
      calibrated
    });

    renderVisualState({
      waterLow,
      calibrated,
      deviceConnected
    });

    renderPlantCards(plantKey);

    const healthScore = calculateHealthScore({
      deviceConnected,
      wifiConnected,
      waterLow,
      calibrated,
      airOk,
      waterOk,
      humOk,
      nutrientOk
    });
    renderHealth(healthScore);

  } catch (err) {
    console.error("Status render error:", err);
    $("lastUpdateText").innerText = "Chyba pri vykreslení dát.";
    renderNextAction({
      waterLow: false,
      calibrated: false,
      phase: "seedling",
      doseText: "Iba voda",
      stateText: "chyba",
      stateTone: "bad",
      wifiConnected: false,
      deviceConnected: false
    });
  }
});

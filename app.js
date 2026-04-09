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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 750, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 800, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 300, max: 400, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 700, max: 900, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 800, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 300, max: 400, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 700, max: 900, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 800, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 650, max: 850, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 750, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 300, max: 400, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 700, max: 900, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 650, max: 850, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
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
  return waterLow ? "Treba doplniť ⚠️" : "V poriadku ✅";
}

function formatCalibrationShort(calibrated){
  return calibrated ? "Hotovo ✅" : "Treba nastaviť ⚠️";
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
  if (obj.waterLow) score -= 18;
  if (!obj.calibrated) score -= 10;
  if (!obj.airOk) score -= 4;
  if (!obj.waterOk) score -= 4;
  if (!obj.humOk) score -= 2;
  if (!obj.nutrientOk) score -= 12;
  return clamp(score, 0, 100);
}

let latestPlantKey = "";
let sowDate = "";

/* ==================== VISUAL TOWER ==================== */

function updateTowerVisual({ deviceConnected, waterLow, calibrated, lightOn }){
  const badge = $("towerLiveBadge");
  const img = $("towerRender");
  if (!badge || !img) return;

  let text = "Vizualizácia pripravená";
  let icon = "fa-circle";
  let color = "#1fa36f";

  if (!deviceConnected) {
    text = "Veža je offline";
    color = "#df6767";
  } else if (waterLow) {
    text = "Treba doplniť vodu";
    color = "#ef9f2f";
  } else if (!calibrated) {
    text = "Treba kalibráciu";
    color = "#ef9f2f";
  } else if (!lightOn) {
    text = "Svetlo je vypnuté";
    color = "#69827b";
  } else {
    text = "Veža je v poriadku";
    color = "#1fa36f";
  }

  badge.innerHTML = `<i class="fa-solid ${icon}" style="color:${color};"></i><span>${text}</span>`;

  img.style.filter = !deviceConnected
    ? "grayscale(0.15) brightness(0.97) drop-shadow(0 20px 30px rgba(20,58,50,0.10))"
    : waterLow
      ? "saturate(0.96) contrast(1.01) drop-shadow(0 20px 30px rgba(20,58,50,0.12))"
      : "drop-shadow(0 20px 30px rgba(20,58,50,0.12)) saturate(1.03) contrast(1.02)";
}

/* ==================== UI ==================== */

function setPlantDropdown(){
  const sel = $("plantSelect");
  if (!sel) return;

  sel.innerHTML = `<option value="">🌱 Vyber rastlinu</option>`;
  Object.entries(PLANTS).forEach(([key, p]) => {
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
      setHero(key, phase, sowDate, { urgentAction: false });
      renderTimeline(plant, sowDate, phase);
      renderDaysToHarvest(key, sowDate);
      renderPlantProfile(key, phase, null);
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

function getHeroTitle(plantName, phase, urgentAction) {
  if (urgentAction) return `${plantName} potrebuje zásah`;
  if (phase === "seedling") return `${plantName} práve klíči`;
  if (phase === "rooting") return `${plantName} si vytvára korene`;
  return `${plantName} rastie správne`;
}

function getHeroSubtitle(state) {
  if (!state.deviceConnected) return "Veža sa neozvala dlhšie než 30 sekúnd. Skontroluj napájanie alebo Wi-Fi.";
  if (state.waterLow) return "Stačí doplniť vodu. O všetko ostatné sa postará systém.";
  if (!state.calibrated) return "Pred presným meraním treba spraviť kalibráciu čistej vody.";
  return "Dnes netreba veľký zásah. Veža drží vhodné podmienky pre rast.";
}

function setHero(plantKey, phase, sowDateValue, opts = {}){
  const p = PLANTS[plantKey];
  const days = daysBetween(sowDateValue);

  $("plantNameHero").innerText = p ? p.name : "—";
  $("growthDayHero").innerText = days === null ? "—" : `${days}`;
  $("phaseHero").innerText = p ? phaseLabel(phase) : "—";
  $("sowDateHero").innerText = formatDateSK(sowDateValue);

  if (p) {
    $("heroHeadline").innerText = getHeroTitle(p.name, phase, !!opts.urgentAction);
    $("heroSubtext").innerText = opts.heroSubtitle || "Aplikácia ti ukáže len to, čo je dôležité. Nemusíš riešiť technické hodnoty, stačí sa držať odporúčania.";
  } else {
    $("heroHeadline").innerText = "Tvoja veža je pripravená na ďalší krok";
    $("heroSubtext").innerText = "Aplikácia ti ukáže len to, čo je dôležité. Nemusíš riešiť technické hodnoty, stačí sa držať odporúčania.";
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

function renderPrediction(plantKey, sowDateValue, healthScore){
  const p = PLANTS[plantKey];
  const box = $("predictionBox");
  if (!box || !p) return;

  const days = daysBetween(sowDateValue);
  const remaining = days === null ? "—" : Math.max(0, p.harvest.min - days);

  let growthText = "Rast je stabilný";
  if (healthScore < 65) growthText = "Rast sa môže spomaliť";
  if (healthScore < 45) growthText = "Rast potrebuje zásah";

  let warningText = "Ak zostanú podmienky rovnaké, rast bude pokračovať správne.";
  if (healthScore < 65) warningText = "Ak nič nezmeníš, rast sa môže spomaliť.";
  if (healthScore < 45) warningText = "Bez zásahu sa rast pravdepodobne výrazne spomalí.";

  box.innerHTML = `
    <div class="predict-item">🧺 Zber o: <b>${remaining === "—" ? "—" : remaining + " dní"}</b></div>
    <div class="predict-item">🌿 ${growthText}</div>
    <div class="predict-item">⚠ ${warningText}</div>
  `;
}

function renderPlantProfile(plantKey, phase, confirmation){
  const p = PLANTS[plantKey];
  const modeBox = $("plantModeBox");
  const modeText = $("plantModeText");
  const profileText = $("plantProfileText");
  if (!p || !modeBox || !modeText || !profileText) return;

  let modeLabel = "Režim: Rýchly rast 🚀";
  let modeDesc = "Táto rastlina rastie rýchlejšie a systém ju vedie v aktívnejšom režime.";

  if (p.harvest.min >= 40 || p.germ.max >= 10) {
    modeLabel = "Režim: Stabilný rast 🌱";
    modeDesc = "Táto rastlina rastie pokojnejšie a systém ju drží v jemnejšom režime.";
  }

  if (phase === "seedling") {
    modeDesc = "Rastlina je v klíčení. Systém teraz potvrdzuje jemný štart a čistú vodu.";
  } else if (phase === "rooting") {
    modeDesc = "Rastlina si vytvára korene. Systém teraz potvrdzuje vhodný prechod do ďalšej fázy.";
  }

  modeBox.innerText = modeLabel;
  modeText.innerText = modeDesc;

  let confirmationText = "Systém čaká na dáta, aby potvrdil vhodné podmienky.";
  if (confirmation) confirmationText = confirmation;

  profileText.innerHTML = confirmationText;
}

function renderCalibration(calibrated){
  if (calibrated){
    $("calibrationBox").innerHTML = `
      <b>Kalibrácia:</b> <span style="color:#13995f;font-weight:800;">Hotovo ✅</span><br><br>
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
    $("timelineBox").innerHTML = `Zadaj dátum výsevu a aplikácia sama vypočíta, v akej fáze sa rastlina nachádza a čo príde ďalej.`;
    return;
  }

  let nextStep = "Systém čaká na ďalšiu fázu.";
  if (phase === "seedling"){
    nextStep = `Po ${plant.germ.max}. dni začne zakoreňovanie.`;
  } else if (phase === "rooting"){
    nextStep = `Po zakoreňovaní prejde rastlina do rastovej fázy.`;
  } else {
    nextStep = `Rastová fáza pokračuje. Sleduj vodu a výživu.`;
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

  let title = "Výživa je správna.";
  let rec = "Zatiaľ netreba robiť veľký zásah.";

  if (state.tone === "warn"){
    if (phase === "seedling") {
      title = "Zatiaľ nechaj len čistú vodu.";
      rec = "Rastlina je ešte malá. Výživu zatiaľ nepridávaj.";
    } else if (phase === "rooting") {
      title = "Treba jemne podporiť korene.";
      rec = t.dose;
    } else {
      title = "Treba pridať výživu.";
      rec = t.dose;
    }
  } else if (state.tone === "bad"){
    title = "Roztok je príliš silný.";
    rec = "Pridaj čistú vodu, aby bol roztok jemnejší pre korene.";
  }

  $("nutrientAdviceBox").innerHTML = `
    <b>${title}</b><br><br>
    ${rec}<br><br>
    <b>Tvoje hodnoty:</b> ${Math.round(concPpm)}<br>
    <b>Vhodné rozmedzie:</b> ${t.min} – ${t.max}
  `;
}

function renderNextAction(obj){
  const box = $("nextActionBox");
  if (!box) return;

  let title = "Dnes netreba veľký zásah";
  let desc = "Veža je v poriadku. Stačí ju priebežne kontrolovať.";
  let tag = "Odporúčanie";
  let priority = "Nízka";
  let reason = "Všetko dôležité je stabilné.";

  if (!obj.deviceConnected){
    title = "Skontroluj zariadenie";
    desc = "Veža neposlala údaje dlhšie než 30 sekúnd. Skontroluj napájanie alebo Wi-Fi.";
    tag = "Potrebný zásah";
    priority = "Vysoká";
    reason = "Veža sa neozýva.";
  } else if (!obj.wifiConnected){
    title = "Pripoj vežu na Wi-Fi";
    desc = "Zariadenie momentálne nie je pripojené na Wi-Fi.";
    tag = "Potrebný zásah";
    priority = "Vysoká";
    reason = "Chýba spojenie.";
  } else if (obj.waterLow){
    title = "Doplň vodu";
    desc = "Hladina vody je nízka. Dolej vodu do nádrže.";
    tag = "Dôležité";
    priority = "Vysoká";
    reason = "Málo vody.";
  } else if (!obj.calibrated){
    title = "Sprav kalibráciu";
    desc = "Pred presným meraním treba spraviť kalibráciu čistej vody.";
    tag = "Dôležité";
    priority = "Stredná";
    reason = "Kalibrácia chýba.";
  } else if (obj.phase === "seedling"){
    title = "Zatiaľ nechaj čistú vodu";
    desc = "Rastlina je ešte v klíčení. Výživu zatiaľ nepridávaj.";
    priority = "Nízka";
    reason = "Začiatok rastu.";
  } else if (obj.phase === "rooting"){
    title = obj.stateTone === "warn" ? "Podpor korene" : "Korene sa vyvíjajú správne";
    desc = obj.stateTone === "warn"
      ? obj.doseText
      : "Rastlina si vytvára korene. Systém zatiaľ drží vhodné podmienky.";
    priority = obj.stateTone === "warn" ? "Stredná" : "Nízka";
    reason = obj.stateTone === "warn" ? "Rastlina potrebuje jemnú podporu." : "Zakoreňovanie prebieha správne.";
  } else {
    if (obj.stateTone === "warn") {
      title = "Pridaj výživu";
      desc = obj.doseText;
      priority = "Stredná";
      reason = "Rastlina potrebuje viac výživy.";
    } else if (obj.stateTone === "bad") {
      title = "Zrieď roztok";
      desc = "Pridaj čistú vodu, aby bola výživa jemnejšia pre korene.";
      priority = "Stredná";
      reason = "Roztok je príliš silný.";
    } else {
      title = "Rast pokračuje správne";
      desc = "Rastlina má vhodné podmienky. Zatiaľ stačí len bežná kontrola.";
      priority = "Nízka";
      reason = "Podmienky sú stabilné.";
    }
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
  if (!obj.deviceConnected) text = "🔴 Veža offline";
  else if (!obj.wifiConnected) text = "🟠 Bez Wi-Fi";
  else if (obj.waterLow || !obj.calibrated) text = "🟠 Treba zásah";
  else text = "🟢 V poriadku";
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
    note.innerText = "Veža je vo veľmi dobrom stave a pripravená na ďalší rast.";
  } else if (score >= 65){
    note.innerText = "Veža funguje dobre, ale niektoré veci si pýtajú menšiu pozornosť.";
  } else {
    note.innerText = "Veža potrebuje zásah. Pozri odporúčanie vpravo.";
  }

  badge.innerText = `Stav veže: ${score} %`;
}

function renderMiniStats(obj){
  $("deviceStatusMini").innerText = obj.deviceConnected ? "Veža: online ✅" : "Veža: offline ⚠️";
  $("pumpStatusMini").innerText = obj.pump ? "Beží ✅" : "Vypnutá";
  $("lightStatusMini").innerText = obj.light ? "Zapnuté ✅" : "Vypnuté";
  $("wifiStatusMini").innerText = obj.wifiConnected ? "Pripojené ✅" : "Nepripojené ⚠️";
  $("waterLevelMini").innerText = obj.waterLow ? "Málo vody ⚠️" : "V poriadku ✅";
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

function renderSystemDoing(items){
  const box = $("systemDoingBox");
  if (!box) return;
  box.innerHTML = items.map(item => `<div class="micro-item">${item}</div>`).join("");
}

function renderSystemWhy(text){
  const box = $("systemWhyBox");
  if (!box) return;
  box.innerHTML = `<div class="micro-item">${text}</div>`;
}

/* ==================== WRITE ==================== */

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

/* ==================== INIT ==================== */

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
      setHero(latestPlantKey, phase, sowDate, { urgentAction: false });
      renderTimeline(p, sowDate, phase);
      renderDaysToHarvest(latestPlantKey, sowDate);
      renderPlantProfile(latestPlantKey, phase, null);
    }
  });
}

setPlantDropdown();
renderPlantCards("");
initPlantSelectSync();

renderCalibration(false);
renderHealth(0);
renderSystemDoing([
  "🔄 Čakám na prvé údaje z veže",
  "💧 Sledujem hladinu vody",
  "🌡 Sledujem teplotu"
]);
renderSystemWhy("Po načítaní údajov ti aplikácia ukáže len to, čo je dôležité.");
$("predictionBox").innerHTML = `
  <div class="predict-item">🧺 Zber o: —</div>
  <div class="predict-item">🌿 Rast: —</div>
  <div class="predict-item">⚠ Predikcia sa zobrazí po načítaní dát.</div>
`;

renderNextAction({
  waterLow: false,
  calibrated: false,
  phase: "seedling",
  doseText: "Zatiaľ len čistá voda.",
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
updateTowerVisual({
  deviceConnected: false,
  waterLow: false,
  calibrated: false,
  lightOn: false
});

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
  const computedPhase = days === null ? "seedling" : computePhase(days, plant);

  setSummary(plantKey, computedPhase, sowDate);
  setHero(plantKey, computedPhase, sowDate, { urgentAction: false });
  renderTimeline(plant, sowDate, computedPhase);
  renderPlantCards(plantKey);
  renderDaysToHarvest(plantKey, sowDate);
  renderPlantProfile(plantKey, computedPhase, null);
});

db.ref("tower/status").on("value", (snap) => {
  try {
    const s = snap.val() || {};

    const pumpOn = !!s.pump;
    const lightOn = !!s.light;
    const waterLow = !!s.waterLow;
    const calibrated = !!s.baselineCalibrated;
    const wifiConnected = !!s.wifiConnected;

    $("pumpStatus").innerText = pumpOn ? "Zapnutá ✅" : "Vypnutá";
    $("lightStatus").innerText = lightOn ? "Zapnuté ✅" : "Vypnuté";
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

    $("deviceStatus").innerText = deviceConnected ? "Pripojené ✅" : "Neodpovedá ⚠️";
    $("lastUpdateText").innerText = deviceConnected
      ? "Posledná aktualizácia prebehla v poriadku."
      : "Veža neposlala údaje dlhšie než 30 sekúnd.";

    let concPpm = 0;
    if (isNum(s.concentrationPpm)) concPpm = s.concentrationPpm;
    else if (isNum(s.tdsPpm) && isNum(s.tdsBaselinePpm)) {
      concPpm = Math.max(0, s.tdsPpm - s.tdsBaselinePpm);
    }

    const plantKey = latestPlantKey && PLANTS[latestPlantKey]
      ? latestPlantKey
      : (typeof s.plant === "string" && PLANTS[s.plant] ? s.plant : "arugula");

    const plant = PLANTS[plantKey];
    const days = daysBetween(sowDate);
    const phase = days === null ? "seedling" : computePhase(days, plant);
    const target = plant.tds[phase];

    const nutrientStateObj = nutrientState(concPpm, target);
    const nutrientOk = nutrientStateObj.tone === "ok";
    const airOk = isNum(airTemp) && airTemp >= plant.temps.airMin && airTemp <= plant.temps.airMax;
    const waterOk = isNum(waterTemp) && waterTemp >= plant.temps.waterMin && waterTemp <= plant.temps.waterMax;
    const humOk = isNum(humidity) && humidity >= 40 && humidity <= 80;

    $("temperature").innerText = `${airTemp.toFixed(1)} °C ${okMark(airOk)}`;
    $("humidity").innerText = `${humidity.toFixed(0)} % ${okMark(humOk)}`;
    $("waterTemp").innerText = `${waterTemp.toFixed(1)} °C ${okMark(waterOk)}`;
    $("nutrientsPct").innerText =
      nutrientStateObj.tone === "ok"
        ? "V poriadku ✅"
        : nutrientStateObj.tone === "warn"
          ? "Treba upraviť ⚠️"
          : "Príliš silné ⚠️";

    $("waterLevelDetail").innerText = waterLow ? "Treba doplniť" : "V poriadku";
    $("waterLevelNote").innerText = waterLow
      ? "Doplň nádrž čistou vodou."
      : "Hladina vody je dostatočná.";

    $("nutrientsDetail").innerText =
      nutrientStateObj.tone === "ok"
        ? "Výživa je správna"
        : nutrientStateObj.tone === "warn"
          ? "Treba pridať výživu"
          : "Treba zriediť roztok";
    $("nutrientsNote").innerText =
      `Aktuálne: ${Math.round(concPpm)} | Vhodné: ${target.min} – ${target.max}`;

    $("temperatureDetail").innerText = airOk ? "Vhodná teplota" : "Treba upraviť teplotu";
    $("temperatureNote").innerText =
      `Aktuálne: ${airTemp.toFixed(1)} °C | Vhodné: ${plant.temps.airMin} – ${plant.temps.airMax} °C`;

    $("waterTempDetail").innerText = waterOk ? "Voda je v poriadku" : "Voda je mimo ideálu";
    $("waterTempNote").innerText =
      `Aktuálne: ${waterTemp.toFixed(1)} °C | Vhodné: ${plant.temps.waterMin} – ${plant.temps.waterMax} °C`;

    setBar("waterBar", waterLow ? 18 : 78);
    setBar("nutrientBar", nutrientStateObj.tone === "ok" ? 78 : nutrientStateObj.tone === "warn" ? 42 : 92);
    setBar("tempBar", clamp(Math.round((airTemp / 35) * 100), 0, 100));
    setBar("waterTempBar", clamp(Math.round((waterTemp / 30) * 100), 0, 100));

    setSummary(plantKey, phase, sowDate);

    const urgentAction = !deviceConnected || !wifiConnected || waterLow || !calibrated || nutrientStateObj.tone !== "ok";
    const heroSubtitle = getHeroSubtitle({
      deviceConnected,
      waterLow,
      calibrated
    });
    setHero(plantKey, phase, sowDate, { urgentAction, heroSubtitle });

    renderTimeline(plant, sowDate, phase);
    renderNutrientAdvice(plant, phase, concPpm);
    renderDaysToHarvest(plantKey, sowDate);

    const profileConfirmation = `
      <b>Svetlo:</b> ${plant.light}<br>
      <b>Teplota okolia:</b> ${plant.temps.airMin} – ${plant.temps.airMax} °C ${airOk ? "✅ splnené" : "⚠️ treba upraviť"}<br>
      <b>Teplota vody:</b> ${plant.temps.waterMin} – ${plant.temps.waterMax} °C ${waterOk ? "✅ splnené" : "⚠️ treba upraviť"}<br>
      <b>Výživa:</b> ${target.min} – ${target.max} ${nutrientOk ? "✅ splnené" : "⚠️ treba upraviť"}
    `;
    renderPlantProfile(plantKey, phase, profileConfirmation);

    renderNextAction({
      waterLow,
      calibrated,
      phase,
      doseText: target.dose,
      stateText: nutrientStateObj.text,
      stateTone: nutrientStateObj.tone,
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
    renderPrediction(plantKey, sowDate, healthScore);

    updateTowerVisual({
      deviceConnected,
      waterLow,
      calibrated,
      lightOn
    });

    const doing = [];
    if (!deviceConnected) {
      doing.push("📡 Veža je offline");
    } else {
      doing.push("💧 Kontrolujem hladinu vody");
      doing.push("🌡 Sledujem teplotu a svetlo");
      if (nutrientStateObj.tone === "warn") doing.push("🧪 Pripravujem odporúčanie na výživu");
      else if (nutrientStateObj.tone === "bad") doing.push("🧪 Upozorňujem na silný roztok");
      else doing.push("🌿 Držím podmienky pre stabilný rast");
    }

    renderSystemDoing(doing.slice(0, 3));

    let why = "Podmienky sú stabilné, preto zatiaľ netreba veľký zásah.";
    if (!deviceConnected) {
      why = "Veža neposlala údaje dlhšie než 30 sekúnd.";
    } else if (!wifiConnected) {
      why = "Chýba Wi-Fi spojenie, preto aplikácia upozorňuje na pripojenie.";
    } else if (waterLow) {
      why = "Hladina vody je nízka, preto treba doplniť nádrž.";
    } else if (!calibrated) {
      why = "Kalibrácia ešte nie je hotová, preto meranie nemusí byť presné.";
    } else if (nutrientStateObj.tone === "warn") {
      why = "Rastlina je vo fáze, kde potrebuje viac výživy pre ďalší rast.";
    } else if (nutrientStateObj.tone === "bad") {
      why = "Roztok je príliš silný, preto je vhodné pridať čistú vodu.";
    } else if (!airOk || !waterOk) {
      why = "Teplota je mimo vhodného rozsahu pre túto rastlinu.";
    }

    renderSystemWhy(why);
    renderPlantCards(plantKey);

  } catch (err) {
    console.error("Status render error:", err);
    $("lastUpdateText").innerText = "Chyba pri vykreslení dát.";
    renderSystemDoing([
      "❌ Nastala chyba pri spracovaní dát",
      "🔄 Skúšam obnoviť stav systému"
    ]);
    renderSystemWhy("Pri načítaní dát nastala chyba. Skontroluj pripojenie zariadenia.");
  }
});

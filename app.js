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
function isNum(x){ return typeof x === "number" && isFinite(x); }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
function unixNow(){ return Math.floor(Date.now()/1000); }
function fmtTime(ts){
  if (!isNum(ts) || ts <= 0) return "—";
  const d = new Date(ts * 1000);
  return d.toLocaleString("sk-SK");
}
function setText(id, txt){
  const el = document.getElementById(id);
  if (el) el.innerText = txt;
}

function pill(id, kind, text){
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("pill-ok","pill-warn","pill-bad");
  if (kind === "ok") el.classList.add("pill-ok");
  if (kind === "warn") el.classList.add("pill-warn");
  if (kind === "bad") el.classList.add("pill-bad");
  el.innerText = text;
}

// ==================== Plant & Phase model (lokálne, stabilné) ====================
// 3 fázy: seedling (iba voda), rooting (zakoreňovač), grow (hnojivo A+B)

const PLANTS = {
  salad_head: {
    name:"Hlávkový šalát",
    times:{ germ:[2,4], root:[7,10], harvest:[30,40] },
    tds:{ seedling:[0,150], rooting:[250,350], grow:[600,750] },
    light:[14,16],
    dosing:{
      seedling:"Iba čistá voda (bez dávkovania).",
      rooting:"Zakoreňovač: 0.5 ml/L (napr. 5 ml do 10 L) na 7 dní.",
      grow:"Hnojivo A: 2 ml/L + Hnojivo B: 2 ml/L (napr. 20 ml + 20 ml do 10 L)."
    }
  },
  arugula: {
    name:"Rukola",
    times:{ germ:[2,3], root:[5,7], harvest:[20,30] },
    tds:{ seedling:[0,150], rooting:[250,350], grow:[600,800] },
    light:[14,16],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 5–7 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  basil: {
    name:"Bazalka",
    times:{ germ:[4,7], root:[10,14], harvest:[35,50] },
    tds:{ seedling:[0,150], rooting:[300,400], grow:[700,900] },
    light:[16,16],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7–10 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  spinach: {
    name:"Špenát",
    times:{ germ:[4,8], root:[7,10], harvest:[30,45] },
    tds:{ seedling:[0,150], rooting:[250,350], grow:[600,800] },
    light:[12,14],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  chives: {
    name:"Pažítka",
    times:{ germ:[7,14], root:[10,14], harvest:[45,60] },
    tds:{ seedling:[0,150], rooting:[300,400], grow:[700,900] },
    light:[14,16],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7–10 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  coriander: {
    name:"Koriander",
    times:{ germ:[5,10], root:[7,10], harvest:[30,45] },
    tds:{ seedling:[0,150], rooting:[250,350], grow:[600,800] },
    light:[12,14],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7–10 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  mint: {
    name:"Mäta",
    times:{ germ:[8,15], root:[10,14], harvest:[40,60] },
    tds:{ seedling:[0,150], rooting:[250,350], grow:[650,850] },
    light:[14,16],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  salad_leaf: {
    name:"Listový šalát (lollo/dubáčik)",
    times:{ germ:[2,4], root:[7,10], harvest:[25,35] },
    tds:{ seedling:[0,150], rooting:[250,350], grow:[600,750] },
    light:[14,16],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  parsley: {
    name:"Petržlen vňaťový",
    times:{ germ:[10,20], root:[10,14], harvest:[50,70] },
    tds:{ seedling:[0,150], rooting:[300,400], grow:[700,900] },
    light:[14,16],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7–10 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  },
  pakchoi: {
    name:"Pak choi (baby)",
    times:{ germ:[2,3], root:[5,7], harvest:[25,35] },
    tds:{ seedling:[0,150], rooting:[250,350], grow:[650,850] },
    light:[14,16],
    dosing:{
      seedling:"Iba čistá voda.",
      rooting:"Zakoreňovač: 0.5 ml/L na 7 dní.",
      grow:"Hnojivo A 2 ml/L + B 2 ml/L."
    }
  }
};

// fáza podľa počtu dní od výsevu
function phaseFromSow(plantKey, sowUnix){
  const p = PLANTS[plantKey];
  if (!p || !isNum(sowUnix) || sowUnix <= 0) return "seedling";

  const days = Math.floor((unixNow() - sowUnix) / 86400);
  const germMax = p.times.germ[1];
  const rootMax = p.times.root[1];

  // seedling = do konca klíčenia (germMax)
  if (days <= germMax) return "seedling";
  // rooting = do konca koreňovania (germMax + rootMax)
  if (days <= germMax + rootMax) return "rooting";
  return "grow";
}

function phaseName(phase){
  if (phase === "seedling") return "Klíčenie (iba voda)";
  if (phase === "rooting") return "Zakoreňovanie (zakoreňovač)";
  if (phase === "grow") return "Rast (hnojivo A+B)";
  return phase;
}

// percentá živín – počítame z koncentrácie voči cieľovému pásmu
function nutrientsPct(concPpm, minPpm, maxPpm){
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm) || maxPpm <= minPpm) return 0;
  if (concPpm <= minPpm) return 0;
  if (concPpm >= maxPpm) return 100;
  return clamp(Math.round(((concPpm - minPpm)/(maxPpm - minPpm))*100),0,100);
}

function recommendation(concPpm, minPpm, maxPpm, dosingText){
  if (!isNum(concPpm)) return "Čakám na dáta…";
  if (concPpm < (minPpm - 100)) return `Pridaj živiny. ${dosingText}`;
  if (concPpm > (maxPpm + 150)) return "Dolej čistú vodu (živiny sú vysoké).";
  return "Všetko je v norme. Nič nemusíš robiť.";
}

// ==================== Setup: uloženie rastliny + výsevu ====================
async function saveSetup(){
  const plantKey = document.getElementById("plantSelect").value;
  const dateStr = document.getElementById("sowDate").value;

  if (!plantKey) { alert("Vyber rastlinu."); return; }
  if (!dateStr) { alert("Vyber dátum výsevu."); return; }

  // date -> unix (00:00 lokálne)
  const d = new Date(dateStr + "T00:00:00");
  const sowUnix = Math.floor(d.getTime()/1000);

  try{
    await db.ref("tower/config").update({ plant: plantKey, sowDate: sowUnix });
    setText("setupStatus", "✅ Uložené. Systém si fázy bude rátať sám.");
  }catch(err){
    alert("Chyba: " + err.message);
  }
}
window.saveSetup = saveSetup;

// ==================== Live listeners ====================
let latestConfig = { plant:"salad_head", sowDate:0 };
let latestStatus = null;

db.ref("tower/config").on("value", (snap)=>{
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant) latestConfig.plant = c.plant;
  if (isNum(c.sowDate)) latestConfig.sowDate = c.sowDate;

  // sync UI
  const plantSel = document.getElementById("plantSelect");
  if (plantSel && plantSel.value !== latestConfig.plant) plantSel.value = latestConfig.plant;

  const sowInput = document.getElementById("sowDate");
  if (sowInput && latestConfig.sowDate){
    const d = new Date(latestConfig.sowDate*1000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    sowInput.value = `${yyyy}-${mm}-${dd}`;
  }
});

db.ref("tower/status").on("value", (snap)=>{
  const s = snap.val();
  if (!s) return;
  latestStatus = s;
  render();
});

function render(){
  const s = latestStatus || {};
  const plantKey = (typeof s.plant === "string" && s.plant) ? s.plant : latestConfig.plant;
  const plant = PLANTS[plantKey] || PLANTS.salad_head;

  // Status
  setText("pumpStatus", s.pump ? "ON" : "OFF");
  setText("lightStatus", s.light ? "ON" : "OFF");
  setText("waterLevel", s.waterLow ? "MIMO NORMY" : "V norme");

  const tAir = isNum(s.temperature) ? s.temperature : 0;
  const hum = isNum(s.humidity) ? s.humidity : 0;
  const tWater = isNum(s.waterTemp) ? s.waterTemp : 0;

  setText("temperature", tAir.toFixed(1) + " °C");
  setText("humidity", hum.toFixed(0) + " %");
  setText("waterTemp", tWater.toFixed(1) + " °C");

  // Calibration (POZOR: názvy z ESP32)
  const calibrated = !!s.baselineCalibrated;
  const baseline = isNum(s.tdsBaselinePpm) ? s.tdsBaselinePpm : (isNum(s.baselinePpm) ? s.baselinePpm : 0);
  const conc = isNum(s.concentrationPpm) ? s.concentrationPpm : 0;

  setText("baselinePpm", String(baseline));
  setText("concPpm", String(conc));
  setText("calibrationStatus", calibrated ? "OK" : "NEKALIBROVANÉ");

  // Fáza z výsevu (apka vedie človeka, ESP nemusí nič posielať)
  const phase = phaseFromSow(plantKey, latestConfig.sowDate || 0);
  setText("plantName", plant.name);
  setText("phaseName", phaseName(phase));

  // Ciele pre živiny podľa fázy
  const [minP, maxP] = plant.tds[phase];
  const pct = nutrientsPct(conc, minP, maxP);
  setText("nutrientsPct", pct + " %");

  // Odporúčanie + dávkovanie
  const doseTxt = plant.dosing[phase] || "—";
  setText("dosingText", doseTxt);
  setText("recommendationText", recommendation(conc, minP, maxP, doseTxt));

  // “ČO TERAZ?” – najdôležitejšie hore
  // priority: voda low -> nekalibrované -> živiny mimo -> ok
  const lastUp = isNum(s.lastUpdate) ? s.lastUpdate : 0;
  setText("lastUpdateText", "Posledná aktualizácia: " + fmtTime(lastUp));

  if (s.waterLow){
    setText("todoTitle", "Dolej vodu do nádrže");
    pill("todoPill","bad","VODA");
    setText("todoText", "Hladina vody je nízka. Dolej vodu. Pumpa je kvôli bezpečnosti blokovaná.");
    setText("todoSub","Keď doplníš vodu: sprav 3 dotyky (DOLIEVANIE). Baseline sa nezmení.");
    return;
  }

  if (!calibrated){
    setText("todoTitle", "Sprav NOVÁ NÁDRŽ (kalibrácia)");
    pill("todoPill","warn","KALIBRÁCIA");
    setText("todoText", "Systém potrebuje vedieť baseline (čistú vodu). Nalej čistú vodu a sprav 2 dotyky.");
    setText("todoSub","2 dotyky = Nová nádrž → uloží baseline. Potom sa živiny budú počítať správne.");
    return;
  }

  // živiny mimo?
  if (conc < (minP - 100)){
    setText("todoTitle", "Pridaj živiny");
    pill("todoPill","warn","ŽIVINY");
    setText("todoText", "Živiny sú nízke. Pridaj odporúčanú dávku (nižšie). Potom chvíľu počkaj a sleduj %.");
    setText("todoSub", doseTxt);
    return;
  }
  if (conc > (maxP + 150)){
    setText("todoTitle", "Dolej čistú vodu");
    pill("todoPill","warn","ŽIVINY");
    setText("todoText", "Živiny sú vysoké. Dolej čistú vodu (zriedenie). Baseline sa nemení.");
    setText("todoSub","Po dolievaní môžeš spraviť 3 dotyky (DOLIEVANIE) – len log, baseline ostáva.");
    return;
  }

  // OK
  setText("todoTitle", "Všetko je OK");
  pill("todoPill","ok","OK");
  setText("todoText", "Systém beží sám. Skontroluj raz za čas vodu a živiny. Inak nič nerieš.");
  setText("todoSub","Tip: ak meníš celú vodu → 2 dotyky (NOVÁ NÁDRŽ).");
}

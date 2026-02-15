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

function percentFromTarget(concPpm, minPpm, maxPpm) {
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm) || maxPpm <= minPpm) return 0;
  if (concPpm <= minPpm) return 0;
  if (concPpm >= maxPpm) return 100;
  return clamp(Math.round(((concPpm - minPpm) / (maxPpm - minPpm)) * 100), 0, 100);
}

function recommendation(concPpm, minPpm, maxPpm, phaseObj) {
  // phaseObj: {rootBoostMlPerL, fertA_MlPerL, fertB_MlPerL, ...}
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm)) return "Čakám na dáta…";

  if (concPpm < (minPpm - 100)) {
    // nízko
    if (phaseObj && isNum(phaseObj.rootBoostMlPerL) && phaseObj.rootBoostMlPerL > 0) {
      return `Pridaj zakoreňovač ${phaseObj.rootBoostMlPerL} ml/L (jemne).`;
    }
    if (phaseObj && isNum(phaseObj.fertA_MlPerL) && isNum(phaseObj.fertB_MlPerL) && (phaseObj.fertA_MlPerL > 0 || phaseObj.fertB_MlPerL > 0)) {
      return `Pridaj malé množstvo: hnojivo A ${phaseObj.fertA_MlPerL} ml/L + hnojivo B ${phaseObj.fertB_MlPerL} ml/L.`;
    }
    return "Pridaj malé množstvo živín.";
  }

  if (concPpm > (maxPpm + 150)) {
    return "Dolej čistú vodu (máš vysokú koncentráciu).";
  }

  // v norme
  if (phaseObj && isNum(phaseObj.rootBoostMlPerL) && phaseObj.rootBoostMlPerL > 0) {
    return `OK. (Fáza zakoreňovač ${phaseObj.rootBoostMlPerL} ml/L)`;
  }
  if (phaseObj && isNum(phaseObj.fertA_MlPerL) && isNum(phaseObj.fertB_MlPerL) && (phaseObj.fertA_MlPerL > 0 || phaseObj.fertB_MlPerL > 0)) {
    return `OK. (Hnojivo A ${phaseObj.fertA_MlPerL} ml/L + B ${phaseObj.fertB_MlPerL} ml/L)`;
  }
  return "OK.";
}

// ==================== Write commands ====================
function sendPlant() {
  const plantKey = document.getElementById("plantSelect").value;
  if (!plantKey) { alert("Vyber rastlinu!"); return; }

  db.ref("tower/commands").update({
    plant: plantKey,
    resetPumpTimer: true
  }).then(() => {
    alert("Rastlina odoslaná ✔");
  }).catch(err => {
    console.error(err);
    alert("Chyba zápisu: " + err.message);
  });
}

function sendPhase() {
  const phase = document.getElementById("phaseSelect").value; // seedling / growth
  if (!phase) { alert("Vyber fázu!"); return; }

  db.ref("tower/commands").update({
    phase: phase
  }).then(() => {
    alert("Fáza odoslaná ✔");
  }).catch(err => {
    console.error(err);
    alert("Chyba zápisu: " + err.message);
  });
}

// aby onclick v HTML fungoval
window.sendPlant = sendPlant;
window.sendPhase = sendPhase;

// ==================== Live UI ====================
let latestPlantKey = "salad";
let latestPhase = "seedling";
let latestPlantProfile = null;

// 1) čítaj commands (aktuálna rastlina + fáza)
db.ref("tower/commands").on("value", (snap) => {
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()) latestPlantKey = c.plant.trim();
  if (typeof c.phase === "string" && c.phase.trim()) latestPhase = c.phase.trim();

  // nastav dropdowny podľa reality
  const plantSel = document.getElementById("plantSelect");
  if (plantSel && plantSel.value !== latestPlantKey) plantSel.value = latestPlantKey;

  const phaseSel = document.getElementById("phaseSelect");
  if (phaseSel && phaseSel.value !== latestPhase) phaseSel.value = latestPhase;

  // načítaj profil rastliny
  db.ref(`tower/plants/${latestPlantKey}`).once("value").then(psnap => {
    latestPlantProfile = psnap.val() || null;
  });
});

// 2) čítaj status
db.ref("tower/status").on("value", (snap) => {
  const s = snap.val();
  if (!s) return;

  // základné hodnoty
  const pump = !!s.pump;
  const light = !!s.light;
  const waterLow = !!s.waterLow;

  const temp = isNum(s.temperature) ? s.temperature : 0;
  const hum = isNum(s.humidity) ? s.humidity : 0;
  const waterTemp = isNum(s.waterTemp) ? s.waterTemp : 0;

  document.getElementById("pumpStatus").innerText = pump ? "ON" : "OFF";
  document.getElementById("lightStatus").innerText = light ? "ON" : "OFF";
  document.getElementById("waterLevel").innerText = waterLow ? "MIMO NORMY" : "V norme";
  document.getElementById("temperature").innerText = temp.toFixed(1) + " °C";
  document.getElementById("humidity").innerText = hum.toFixed(0) + " %";
  document.getElementById("waterTemp").innerText = waterTemp.toFixed(1) + " °C";

  // kalibrácia
  const calibrated = !!s.calibrated;
  const baselinePpm = isNum(s.baselinePpm) ? s.baselinePpm : 0;

  document.getElementById("calibrationStatus").innerText =
    calibrated ? `OK (baseline ${baselinePpm} ppm)` : "NEKALIBROVANÉ (sprav 'nová nádrž')";

  // koncentrácia ppm (živiny navyše)
  const tdsPpm = isNum(s.tdsPpm) ? s.tdsPpm : null;
  const concPpmFromDb = isNum(s.concentrationPpm) ? s.concentrationPpm : null;

  let concPpm = 0;
  if (concPpmFromDb !== null) concPpm = concPpmFromDb;
  else if (tdsPpm !== null) concPpm = Math.max(0, tdsPpm - baselinePpm);

  // vyber fázu (z statusu alebo commands)
  const phase = (typeof s.phase === "string" && s.phase) ? s.phase : latestPhase;
  const plantKey = (typeof s.plant === "string" && s.plant) ? s.plant : latestPlantKey;

  // načítaj plant profil ak ešte nemáme
  if (!latestPlantProfile || plantKey !== latestPlantKey) {
    latestPlantKey = plantKey;
    db.ref(`tower/plants/${plantKey}`).once("value").then(psnap => {
      latestPlantProfile = psnap.val() || null;
    });
  }

  // percentá + odporúčanie
  let pct = 0;
  let hint = "Čakám na profil rastliny…";

  const phaseObj = latestPlantProfile?.phases?.[phase];
  if (phaseObj && isNum(phaseObj.tdsTargetMin) && isNum(phaseObj.tdsTargetMax)) {
    pct = percentFromTarget(concPpm, phaseObj.tdsTargetMin, phaseObj.tdsTargetMax);
    hint = recommendation(concPpm, phaseObj.tdsTargetMin, phaseObj.tdsTargetMax, phaseObj);
  } else {
    // fallback: ak ESP už posiela nutrientsPct, zoberieme to
    if (isNum(s.nutrientsPct)) pct = clamp(Math.round(s.nutrientsPct), 0, 100);
    hint = "Chýba profil fázy v databáze.";
  }

  document.getElementById("nutrientsPct").innerText = pct + " %";
  document.getElementById("nutrientHint").innerText = hint;
});

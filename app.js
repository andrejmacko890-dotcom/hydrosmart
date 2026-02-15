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

// percent z koncentrácie podľa cieľa (min..max)
function percentFromTarget(concPpm, minPpm, maxPpm) {
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm) || maxPpm <= minPpm) return 0;
  if (concPpm <= minPpm) return 0;
  if (concPpm >= maxPpm) return 100;
  return clamp(Math.round(((concPpm - minPpm) / (maxPpm - minPpm)) * 100), 0, 100);
}

// Pre UI: prevedieme cieľ ppm -> cieľ %
function targetPctRange(minPpm, maxPpm) {
  // 0% = min, 100% = max (v našom modeli)
  // teda cieľ je vždy 0–100, ale používateľ chce vidieť "od-do" percenta reálneho cieľa
  // Spravíme to takto: cieľový pás je vždy 35–65% okolo stredu (jednoduché a stabilné)
  // ALE: lepšie: ukážeme "min=0% max=100%" je blbosť. Preto to počítame voči "max cieľu" 1000 ppm.
  // Jednoduché praktické riešenie: zoberieme maxPpm ako 100% referenciu.
  if (!isNum(minPpm) || !isNum(maxPpm) || maxPpm <= 0) return "--";
  const minPct = clamp(Math.round((minPpm / maxPpm) * 100), 0, 100);
  const maxPct = 100;
  return `${minPct}–${maxPct} %`;
}

// Dávkovanie text podľa fázy
function dosingText(phaseObj) {
  if (!phaseObj) return "--";

  const rb = isNum(phaseObj.rootBoostMlPerL) ? phaseObj.rootBoostMlPerL : 0;
  const a = isNum(phaseObj.fertA_MlPerL) ? phaseObj.fertA_MlPerL : 0;
  const b = isNum(phaseObj.fertB_MlPerL) ? phaseObj.fertB_MlPerL : 0;

  if (rb > 0) return `Zakoreňovač: ${rb} ml / 1 L (napr. ${rb * 10} ml / 10 L)`;
  if (a > 0 || b > 0) return `Hnojivo A: ${a} ml/L + Hnojivo B: ${b} ml/L (napr. ${a*10} ml + ${b*10} ml / 10 L)`;
  return "Bez dávkovania";
}

// Odporúčanie podľa odchýlky
function recommendation(concPpm, minPpm, maxPpm, phaseObj) {
  if (!isNum(concPpm) || !isNum(minPpm) || !isNum(maxPpm)) return "Čakám na dáta…";

  if (concPpm < (minPpm - 100)) {
    const rb = phaseObj && isNum(phaseObj.rootBoostMlPerL) ? phaseObj.rootBoostMlPerL : 0;
    const a = phaseObj && isNum(phaseObj.fertA_MlPerL) ? phaseObj.fertA_MlPerL : 0;
    const b = phaseObj && isNum(phaseObj.fertB_MlPerL) ? phaseObj.fertB_MlPerL : 0;

    if (rb > 0) return `Nízke živiny → pridaj zakoreňovač ${rb} ml/L.`;
    if (a > 0 || b > 0) return `Nízke živiny → pridaj malé množstvo: A ${a} ml/L + B ${b} ml/L.`;
    return "Nízke živiny → pridaj malé množstvo živín.";
  }

  if (concPpm > (maxPpm + 150)) {
    return "Vysoké živiny → dolej čistú vodu.";
  }

  return "OK (v norme).";
}

// ==================== Write commands ====================
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

// ==================== Live ====================
let latestPlantKey = "salad";
let latestPhase = "seedling";
let plantProfile = null;

// commands listener
db.ref("tower/commands").on("value", (snap) => {
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()) latestPlantKey = c.plant.trim();
  if (typeof c.phase === "string" && c.phase.trim()) latestPhase = c.phase.trim();

  // sync dropdowns
  const plantSel = document.getElementById("plantSelect");
  if (plantSel && plantSel.value !== latestPlantKey) plantSel.value = latestPlantKey;

  const phaseSel = document.getElementById("phaseSelect");
  if (phaseSel && phaseSel.value !== latestPhase) phaseSel.value = latestPhase;

  // load plant profile
  db.ref(`tower/plants/${latestPlantKey}`).once("value").then(psnap => {
    plantProfile = psnap.val() || null;
  });
});

// status listener
db.ref("tower/status").on("value", async (snap) => {
  const s = snap.val();
  if (!s) return;

  // base UI
  document.getElementById("pumpStatus").innerText = s.pump ? "ON" : "OFF";
  document.getElementById("lightStatus").innerText = s.light ? "ON" : "OFF";
  document.getElementById("waterLevel").innerText = s.waterLow ? "MIMO NORMY" : "V norme";

  const tAir = isNum(s.temperature) ? s.temperature : 0;
  const hum = isNum(s.humidity) ? s.humidity : 0;
  const tWater = isNum(s.waterTemp) ? s.waterTemp : 0;

  document.getElementById("temperature").innerText = tAir.toFixed(1) + " °C";
  document.getElementById("humidity").innerText = hum.toFixed(0) + " %";
  document.getElementById("waterTemp").innerText = tWater.toFixed(1) + " °C";

  // plant/phase (z statusu alebo commands)
  const plantKey = (typeof s.plant === "string" && s.plant) ? s.plant : latestPlantKey;
  const phase = (typeof s.phase === "string" && s.phase) ? s.phase : latestPhase;

  // load profile if needed
  if (!plantProfile || plantKey !== latestPlantKey) {
    latestPlantKey = plantKey;
    plantProfile = (await db.ref(`tower/plants/${plantKey}`).once("value")).val() || null;
  }

  const plantName = plantProfile?.plantName || plantKey;
  document.getElementById("plantName").innerText = plantName;

  const phaseObj = plantProfile?.phases?.[phase] || null;
  const phaseName = phaseObj?.name ? `${phaseObj.name} (${phaseObj.daysNote || ""})`.trim() : phase;
  document.getElementById("phaseName").innerText = phaseName;

  // light hours (z profilu)
  const lh = plantProfile?.lightHours;
  document.getElementById("lightHours").innerText = isNum(lh) ? `${lh} h/deň` : "--";

  // calibration
  const calibrated = !!s.calibrated;
  const baseline = isNum(s.baselinePpm) ? s.baselinePpm : 0;
  document.getElementById("calibrationStatus").innerText =
    calibrated ? `OK (baseline ${baseline} ppm)` : "NEKALIBROVANÉ (sprav 'nová nádrž')";

  // concentration ppm
  const conc = isNum(s.concentrationPpm) ? s.concentrationPpm : 0;

  // nutrients % + target % + dosing + hint
  if (phaseObj && isNum(phaseObj.tdsTargetMin) && isNum(phaseObj.tdsTargetMax)) {
    const pct = percentFromTarget(conc, phaseObj.tdsTargetMin, phaseObj.tdsTargetMax);
    document.getElementById("nutrientsPct").innerText = pct + " %";

    document.getElementById("nutrientsTargetPct").innerText =
      `${targetPctRange(phaseObj.tdsTargetMin, phaseObj.tdsTargetMax)} (pre túto fázu)`;

    document.getElementById("dosingText").innerText = dosingText(phaseObj);

    document.getElementById("nutrientHint").innerText =
      recommendation(conc, phaseObj.tdsTargetMin, phaseObj.tdsTargetMax, phaseObj);
  } else {
    document.getElementById("nutrientsPct").innerText = (isNum(s.nutrientsPct) ? s.nutrientsPct : 0) + " %";
    document.getElementById("nutrientsTargetPct").innerText = "--";
    document.getElementById("dosingText").innerText = "--";
    document.getElementById("nutrientHint").innerText = "Chýba profil rastliny/fázy v databáze.";
  }
});

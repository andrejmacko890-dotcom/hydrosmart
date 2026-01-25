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

// ==================== MAP: tvoje HTML hodnoty 0-9 → názvy v databáze ====================
const PLANT_KEY_BY_INDEX = {
  "0": "salad",
  "1": "tomato",
  "2": "cucumber",
  "3": "pepper",
  "4": "spinach",
  "5": "basil",
  "6": "mint",
  "7": "arugula",
  "8": "coriander",
  "9": "strawberry"
};

// ==================== Prihlásenie (Anonymous) ====================
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("✅ Web prihlásený (anonymous)");
    startListeners();
  })
  .catch((err) => {
    console.error("❌ Auth error:", err);
    alert("Nepodarilo sa prihlásiť do Firebase (skontroluj Anonymous Auth v konzole).");
  });

// ==================== Odoslanie rastliny ====================
function sendPlant() {
  const index = document.getElementById('plantSelect').value;
  if (!index) { alert('Vyber rastlinu!'); return; }

  const plantKey = PLANT_KEY_BY_INDEX[index];
  if (!plantKey) { alert('Chyba: neznáma rastlina'); return; }

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

// aby to fungovalo s onclick v HTML
window.sendPlant = sendPlant;

// ==================== Live čítanie (bez setInterval) ====================
function startListeners() {
  // 1) Stav veže (odporúčané, nech všetko ide z jedného miesta)
  db.ref('tower/status').on('value', (snap) => {
    const s = snap.val();
    if (!s) return;

    // bezpečné fallbacky, aby UI nikdy neostalo prázdne
    const pump = !!s.pump;
    const light = !!s.light;
    const waterLow = !!s.waterLow;
    const nutrients = (typeof s.nutrients === "number") ? s.nutrients : 0;
    const temperature = (typeof s.temperature === "number") ? s.temperature : 0;
    const humidity = (typeof s.humidity === "number") ? s.humidity : 0;

    document.getElementById('pumpStatus').innerText = pump ? 'ON' : 'OFF';
    document.getElementById('lightStatus').innerText = light ? 'ON' : 'OFF';
    document.getElementById('waterLevel').innerText = waterLow ? 'MIMO NORMY' : 'V norme';
    document.getElementById('nutrients').innerText = nutrients + ' %';
    document.getElementById('temperature').innerText = temperature.toFixed(1) + ' °C';
    document.getElementById('humidity').innerText = humidity.toFixed(0) + ' %';
  });

  // 2) BONUS: ak ESP zatiaľ zapisuje len do /senzor (teplota/vlhkost)
  //    tak to zoberieme odtiaľ a aspoň teplota/vlhkosť budú živé.
  db.ref('senzor').on('value', (snap) => {
    const d = snap.val();
    if (!d) return;

    // tvoje ESP používa "teplota" a "vlhkost"
    if (typeof d.teplota === "number") {
      document.getElementById('temperature').innerText = d.teplota.toFixed(1) + ' °C';
    }
    if (typeof d.vlhkost === "number") {
      document.getElementById('humidity').innerText = d.vlhkost.toFixed(0) + ' %';
    }
  });
}


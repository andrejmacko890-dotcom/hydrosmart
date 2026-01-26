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

// ==================== MAP: HTML 0-9 -> Firebase plant key (tých 10 rastlín) ====================
// MUSÍ sedieť s /tower/plants/<key> v databáze a s ESP32 (loadPlantProfile)
const PLANT_KEY_BY_INDEX = {
  "0": "lettuce",    // Hlávkový šalát
  "1": "tomato",     // Rajčiaky cherry
  "2": "pepper",     // Paprika mini
  "3": "radish",     // Reďkovka
  "4": "spinach",    // Špenát
  "5": "basil",      // Bazalka
  "6": "mint",       // Mäta
  "7": "arugula",    // Rukola
  "8": "coriander",  // Koriander
  "9": "chives"      // Pažítka
};

// ==================== Prihlásenie (Anonymous) ====================
// Pozor: v HTML musíš mať firebase-auth.js
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("✅ Web prihlásený (anonymous)");
    startListeners();
  })
  .catch((err) => {
    console.error("❌ Auth error:", err);
    alert("Nepodarilo sa prihlásiť do Firebase. Skontroluj: Authentication → Sign-in method → Anonymous = ENABLED.");
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

// ==================== Live čítanie ====================
function startListeners() {
  // 1) Hlavný stav systému (ESP32 zapisuje sem)
  db.ref('tower/status').on('value', (snap) => {
    const s = snap.val();
    if (!s) return;

    const pump = !!s.pump;
    const light = !!s.light;
    const waterLow = !!s.waterLow;

    const nutrients = (typeof s.nutrients === "number") ? s.nutrients : 0;
    const temperature = (typeof s.temperature === "number") ? s.temperature : 0;
    const humidity = (typeof s.humidity === "number") ? s.humidity : 0;

    document.getElementById('pumpStatus').innerText = pump ? 'ON' : 'OFF';
    document.getElementById('lightStatus').innerText = light ? 'ON' : 'OFF';
    document.getElementById('waterLevel').innerText = waterLow ? 'LOW' : 'OK';
    document.getElementById('nutrients').innerText = nutrients + ' %';
    document.getElementById('temperature').innerText = temperature.toFixed(1) + ' °C';
    document.getElementById('humidity').innerText = humidity.toFixed(0) + ' %';
  });

  // 2) Fallback, ak ešte niečo zapisuje do /senzor
  db.ref('senzor').on('value', (snap) => {
    const d = snap.val();
    if (!d) return;

    if (typeof d.teplota === "number") {
      document.getElementById('temperature').innerText = d.teplota.toFixed(1) + ' °C';
    }
    if (typeof d.vlhkost === "number") {
      document.getElementById('humidity').innerText = d.vlhkost.toFixed(0) + ' %';
    }
  });
}


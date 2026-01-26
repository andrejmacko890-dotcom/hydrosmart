// ==================== Firebase konfigurácia ====================
const firebaseConfig = {
  apiKey: "AIzaSyCYTB63Wikgf8wA4rh1UK68a5nOshrtuoQ",
  authDomain: "hydrosmart-3aa0e.firebaseapp.com",
  databaseURL: "https://hydrosmart-3aa0e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hydrosmart-3aa0e",
  storageBucket: "hydrosmart-3aa0e.appspot.com",
  messagingSenderId: "823014363392",
  appId: "1:823014363392:web:26faf7e45e1f436d27a3e5",
  measurementId: "G-7M72SPJ0WV"
};

// ==================== Inicializácia Firebase ====================
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==================== Anonymous login ====================
firebase.auth().signInAnonymously()
  .then(() => {
    console.log("✅ Web prihlásený (anonymous)");
    startListeners();
  })
  .catch((err) => {
    console.error("❌ Auth error:", err);
    alert("Chyba prihlásenia do Firebase. Skontroluj Anonymous Auth v konzole.");
  });

// ==================== ODOSLANIE RASTLINY ====================
function sendPlant() {
  const plantKey = document.getElementById("plantSelect").value;

  if (!plantKey) {
    alert("Vyber rastlinu!");
    return;
  }

  db.ref("tower/commands").update({
    plant: plantKey,
    forceWater: false,
    resetPumpTimer: true
  })
  .then(() => {
    alert("Rastlina odoslaná ✔");
  })
  .catch((err) => {
    console.error(err);
    alert("Chyba zápisu do Firebase: " + err.message);
  });
}

window.sendPlant = sendPlant;

// ==================== LIVE NAČÍTANIE DÁT ====================
function startListeners() {

  // -------- tower/status --------
  db.ref("tower/status").on("value", (snap) => {
    const s = snap.val();
    if (!s) return;

    const pump = !!s.pump;
    const light = !!s.light;
    const waterLow = !!s.waterLow;

    const nutrients = (typeof s.nutrients === "number") ? s.nutrients : 0;
    const temperature = (typeof s.temperature === "number") ? s.temperature : 0;
    const humidity = (typeof s.humidity === "number") ? s.humidity : 0;

    document.getElementById("pumpStatus").innerText = pump ? "ON" : "OFF";
    document.getElementById("lightStatus").innerText = light ? "ON" : "OFF";
    document.getElementById("waterLevel").innerText = waterLow ? "MIMO NORMY" : "V norme";
    document.getElementById("nutrients").innerText = nutrients + " %";
    document.getElementById("temperature").innerText = temperature.toFixed(1) + " °C";
    document.getElementById("humidity").innerText = humidity.toFixed(0) + " %";
  });

  // -------- fallback ak ide len /senzor --------
  db.ref("senzor").on("value", (snap) => {
    const d = snap.val();
    if (!d) return;

    if (typeof d.teplota === "number") {
      document.getElementById("temperature").innerText =
        d.teplota.toFixed(1) + " °C";
    }

    if (typeof d.vlhkost === "number") {
      document.getElementById("humidity").innerText =
        d.vlhkost.toFixed(0) + " %";
    }
  });

}


import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, onValue } from "firebase/database";

// ===== Firebase konfigurácia =====
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Odoslanie rastliny
export function sendPlant() {
  const plant = document.getElementById('plantSelect').value;
  if (!plant) { alert('Vyber rastlinu!'); return; }

  update(ref(db, 'tower'), {
    plantType: plant,
    plantName: plant,
    commands: { forceWater: false, resetPumpTimer: true }
  });

  alert('Rastlina odoslaná ✔');
}

// Načítanie stavu
function updateStatus() {
  onValue(ref(db, 'tower'), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    document.getElementById('pumpStatus').innerText = data.status.pumpActive ? 'ON' : 'OFF';
    document.getElementById('waterLevel').innerText = data.waterLow ? 'MIMO NORMY' : 'V norme';
    document.getElementById('nutrients').innerText = data.tds + ' %';
    document.getElementById('lightStatus').innerText = data.status.lightActive ? 'ON' : 'OFF';
    document.getElementById('temperature').innerText = data.temperature + ' °C';
    document.getElementById('humidity').innerText = data.humidity + ' %';
  });
}

updateStatus();
setInterval(updateStatus, 5000);


// Firebase konfigurácia (správny API KEY!)
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

// Inicializácia Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==================== ODOSLANIE RASTLINY ====================
function sendPlant() {
  const plant = document.getElementById('plantSelect').value;
  if (!plant) { alert('Vyber rastlinu!'); return; }

  db.ref('tower/commands').update({
    plant: plant,
    forceWater: false,
    resetPumpTimer: true
  })
  .then(() => alert('Rastlina odoslaná ✔'))
  .catch(err => alert('Chyba Firebase: ' + err.message));
}

// ==================== REALTIME STAV ====================
db.ref('tower/status').on('value', snapshot => {
  const status = snapshot.val();
  if (!status) return;

  document.getElementById('pumpStatus').innerText = status.pump ? 'ON' : 'OFF';
  document.getElementById('waterLevel').innerText = status.waterLow ? 'MIMO NORMY' : 'V norme';
  document.getElementById('nutrients').innerText = (status.nutrients ?? 0) + ' %';
  document.getElementById('lightStatus').innerText = status.light ? 'ON' : 'OFF';
  document.getElementById('temperature').innerText = (status.temperature ?? '--') + ' °C';
  document.getElementById('humidity').innerText = (status.humidity ?? '--') + ' %';
}, err => {
  console.log('Firebase listener error:', err);
});




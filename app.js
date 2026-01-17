// Firebase konfigurácia
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
  });

  alert('Rastlina odoslaná ✔');
}

// ==================== NAČÍTANIE STAVU ====================
function updateStatus() {
  // Status veže
  db.ref('tower/status').once('value', snapshot => {
    const status = snapshot.val();
    if (!status) return;

    document.getElementById('pumpStatus').innerText = status.pump ? 'ON' : 'OFF';
    document.getElementById('waterLevel').innerText = status.waterLevel ? 'V norme' : 'MIMO NORMY';
    document.getElementById('nutrients').innerText = status.nutrients + ' %';
    document.getElementById('lightStatus').innerText = status.light ? 'ON' : 'OFF';
    document.getElementById('temperature').innerText = status.temperature + ' °C';
    document.getElementById('humidity').innerText = status.humidity + ' %';
  });

  // Dynamické info pre aktuálnu rastlinu
  const selectedPlant = document.getElementById('plantSelect').value;
  if (selectedPlant) {
    db.ref(`tower/plants/${selectedPlant}`).once('value', snapshot => {
      const plantData = snapshot.val();
      if (!plantData) return;

      // Tu môžeš rozšíriť o ďalšie info, ak chceš zobrazovať intervaly, pumpOnSeconds atď.
      console.log(`Aktuálne parametre pre ${plantData.plantName}:`, plantData);
    });
  }
}

// Načítaj stav hneď a potom každých 5 sekúnd
updateStatus();
setInterval(updateStatus, 5000);



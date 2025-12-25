// ===============================
// NASTAVENIE
// ===============================

// IP adresa ESP32 (zmeň ak sa zmení)
const ESP32_IP = '192.168.1.168';

// Limity pre stav "v norme / mimo normy"
// (len na zobrazenie – skutočná logika je v ESP32)
const WATER_MIN = 30;   // %
const NUTRIENTS_MIN = 40; // %


// ===============================
// ODOSLANIE RASTLINY DO ESP32
// ===============================

function sendPlant() {
  const plant = document.getElementById('plantSelect').value;

  if (!plant) {
    alert('Vyber rastlinu!');
    return;
  }

  fetch(`http://${ESP32_IP}/plant?name=${encodeURIComponent(plant)}`)
    .then(response => response.text())
    .then(data => {
      console.log('ESP32:', data);
      alert('Rastlina nastavená ✔');
    })
    .catch(error => {
      console.error(error);
      alert('ESP32 nedostupné');
    });
}


// ===============================
// ČÍTANIE STAVU Z ESP32
// ===============================

function updateStatus() {
  fetch(`http://${ESP32_IP}/status`)
    .then(response => response.json())
    .then(data => {

      // Pumpa
      document.getElementById('pumpStatus').innerText =
        data.pump ? 'ON' : 'OFF';

      // Svetlo
      document.getElementById('lightStatus').innerText =
        data.light ? 'ON' : 'OFF';

      // Water level – norma / mimo normy
      document.getElementById('waterLevel').innerText =
        data.waterLevel >= WATER_MIN
          ? 'V norme'
          : 'MIMO NORMY';

      // Živiny – norma / mimo normy
      document.getElementById('nutrients').innerText =
        data.nutrients >= NUTRIENTS_MIN
          ? 'V norme'
          : 'MIMO NORMY';

    })
    .catch(err => {
      console.log('ESP32 offline');
    });
}


// ===============================
// AUTOMATICKÉ OBNOVOVANIE STAVU
// ===============================

// Načítaj stav hneď po otvorení stránky
updateStatus();

// A potom každých 5 sekúnd
setInterval(updateStatus, 5000);

// ===============================
// NASTAVENIE
// ===============================

const ESP32_IP = '192.168.1.168';  // IP ESP32

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

      // Water level – v norme / mimo normy
      document.getElementById('waterLevel').innerText =
        data.water === "OK" ? 'V norme' : 'MIMO NORMY';

      // Živiny – norma / mimo normy
      document.getElementById('nutrients').innerText =
        data.nutrients >= NUTRIENTS_MIN
          ? 'V norme'
          : 'MIMO NORMY';

      // Teplota a vlhkosť
      document.getElementById('temperature').innerText = data.temp + " °C";
      document.getElementById('humidity').innerText = data.hum + " %";

    })
    .catch(err => {
      console.log('ESP32 offline');
    });
}

// ===============================
// AUTOMATICKÉ OBNOVOVANIE STAVU
// ===============================

updateStatus();
setInterval(updateStatus, 5000);

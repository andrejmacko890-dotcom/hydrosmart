// ===============================
// NASTAVENIE
// ===============================

// IP adresa ESP32 (zmeň podľa toho, čo ti ESP32 vypíše po pripojení)
const ESP32_IP = '192.168.1.168';

// Limity pre stav "v norme / mimo normy" (pre zobrazenie)
const WATER_MIN = 30;     // len logická hodnota, ESP32 vyhodnotí
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

      document.getElementById('pumpStatus').innerText = data.pump ? 'ON' : 'OFF';
      document.getElementById('lightStatus').innerText = data.light ? 'ON' : 'OFF';

      document.getElementById('waterLevel').innerText = data.waterLevel;  // ESP32 posiela "OK" alebo "LOW"
      document.getElementById('nutrients').innerText = data.nutrients + ' %';
      document.getElementById('temperature').innerText = data.temp + ' °C';
      document.getElementById('humidity').innerText = data.hum + ' %';

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



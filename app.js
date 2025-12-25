// IP adresa ESP32
const ESP32_IP = '192.168.1.168'; // zmeň podľa Serial monitoru ESP32

// Odoslanie zvolenej rastliny
function sendPlant() {
  const plant = document.getElementById('plantSelect').value;
  if(!plant) {
    alert('Vyber rastlinu!');
    return;
  }

  fetch(`http://${ESP32_IP}/plant?name=${encodeURIComponent(plant)}`)
    .then(res => res.text())
    .then(data => console.log('Rastlina nastavená: ' + data))
    .catch(err => console.log('Chyba: ' + err));
}

// Pravidelné čítanie statusu každých 5 sekúnd
setInterval(() => {
  fetch(`http://${ESP32_IP}/status`)
    .then(res => res.json())
    .then(data => {
      // Pumpa
      document.getElementById('pumpStatus').innerText = data.pump ? 'ON' : 'OFF';

      // Water level: v norme / mimo normy
      if(data.waterLevel >= 40 && data.waterLevel <= 90) {
        document.getElementById('waterLevel').innerText = data.waterLevel + '% (v norme)';
        document.getElementById('waterLevel').className = 'status-item status-normal';
      } else {
        document.getElementById('waterLevel').innerText = data.waterLevel + '% (mimo normy)';
        document.getElementById('waterLevel').className = 'status-item status-alert';
      }

      // Nutrients
      document.getElementById('nutrients').innerText = data.nutrients + '%';

      // Light ON/OFF
      document.getElementById('light').innerText = data.light ? 'ON' : 'OFF';

      // Temperature
      document.getElementById('temperature').innerText = data.temperature + ' °C';
    })
    .catch(() => console.log('ESP32 offline'));
}, 5000);

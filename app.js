// IP adresa ESP32 (tá, čo vypíše Serial Monitor)
const ESP32_IP = '192.168.1.168';

// Odoslanie zvolenej rastliny do ESP32
function sendPlant() {
  const plant = document.getElementById('plantSelect').value;

  if (!plant) {
    alert('Vyber rastlinu!');
    return;
  }

  fetch(`http://${ESP32_IP}/plant?name=${encodeURIComponent(plant)}`)
    .then(res => res.text())
    .then(data => alert('Rastlina nastavená: ' + data))
    .catch(err => alert('Chyba: ' + err));
}

// Pravidelné čítanie stavu zo zariadenia
setInterval(() => {
  fetch(`http://${ESP32_IP}/status`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('pumpStatus').innerText = data.pump ? 'ON' : 'OFF';
      document.getElementById('waterLevel').innerText = data.waterLevel + ' %';
      document.getElementById('nutrients').innerText = data.nutrients + ' %';
    })
    .catch(() => console.log('ESP32 offline'));
}, 5000);

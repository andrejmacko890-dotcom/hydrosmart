// ===============================
// NASTAVENIE
// ===============================

const ESP32_IP = '192.168.1.168'; // zmeň podľa IP tvojho ESP32
const NUTRIENTS_MIN = 40;

// ===============================
// ODOSLANIE RASTLINY
// ===============================
function sendPlant() {
  const plant = document.getElementById('plantSelect').value;
  if (!plant) { alert('Vyber rastlinu!'); return; }

  fetch(`http://${ESP32_IP}/plant?name=${encodeURIComponent(plant)}`)
    .then(res => res.text())
    .then(data => { console.log('ESP32:', data); alert('Rastlina nastavená ✔'); })
    .catch(err => { console.error(err); alert('ESP32 nedostupné'); });
}

// ===============================
// GRAFY
// ===============================
const nutrientsCtx = document.getElementById('nutrientsChart').getContext('2d');
const nutrientsChart = new Chart(nutrientsCtx, {
    type: 'doughnut',
    data: {
        labels: ['V norme', 'MIMO NORMY'],
        datasets: [{
            data: [0,0],
            backgroundColor: ['#558b2f','#dcedc8']
        }]
    },
    options: { responsive:true, plugins:{legend:{position:'bottom'}} }
});

const waterCtx = document.getElementById('waterChart').getContext('2d');
const waterChart = new Chart(waterCtx, {
    type: 'doughnut',
    data: {
        labels: ['V norme', 'MIMO NORMY'],
        datasets: [{
            data: [0,0],
            backgroundColor: ['#0277bd','#b3e5fc']
        }]
    },
    options: { responsive:true, plugins:{legend:{position:'bottom'}} }
});

// ===============================
// ČÍTANIE STAVU
// ===============================
function updateStatus() {
    fetch(`http://${ESP32_IP}/status`)
    .then(res => res.json())
    .then(data => {
        // Pumpa
        document.getElementById('pumpStatus').innerText = data.pump ? 'ON' : 'OFF';
        // Svetlo
        document.getElementById('lightStatus').innerText = data.light ? 'ON' : 'OFF';
        // Water Level – binárny
        document.getElementById('waterLevel').innerText = data.water === "OK" ? 'V norme' : 'MIMO NORMY';
        // Nutrients
        document.getElementById('nutrients').innerText = data.nutrients >= NUTRIENTS_MIN ? 'V norme' : 'MIMO NORMY';
        // Teplota
        document.getElementById('temperature').innerText = data.temp.toFixed(1) + ' °C';

        // Aktualizácia grafov
        waterChart.data.datasets[0].data = data.water === "OK" ? [1,0] : [0,1];
        waterChart.update();
        nutrientsChart.data.datasets[0].data = data.nutrients >= NUTRIENTS_MIN ? [1,0] : [0,1];
        nutrientsChart.update();
    })
    .catch(err => console.log('ESP32 offline'));
}

// Načítaj hneď
updateStatus();
// Každých 5 sekúnd
setInterval(updateStatus, 5000);


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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const PLANTS = {
  lettuce_head: {
    name: "🥬 Hlávkový šalát",
    short: "Jemný listový rast",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 40 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 750, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 18, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  arugula: {
    name: "🥗 Rukola",
    short: "Rýchly rast a skorý zber",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 20, max: 30 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 800, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 16, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  basil: {
    name: "🌿 Bazalka",
    short: "Teplomilná aromatická rastlina",
    light: "16 h/deň",
    germ: { min: 4, max: 7 },
    root: { min: 10, max: 14 },
    harvest: { min: 35, max: 50 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 300, max: 400, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 700, max: 900, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 20, airMax: 26, waterMin: 18, waterMax: 22 }
  },
  spinach: {
    name: "🌿 Špenát",
    short: "Chladnejšie prostredie",
    light: "12–14 h/deň",
    germ: { min: 4, max: 8 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 800, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 16, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  chives: {
    name: "🧅 Pažítka",
    short: "Stabilný pomalší rast",
    light: "14–16 h/deň",
    germ: { min: 7, max: 14 },
    root: { min: 10, max: 14 },
    harvest: { min: 45, max: 60 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 300, max: 400, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 700, max: 900, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  coriander: {
    name: "🌿 Koriander",
    short: "Jemné listy, rýchly zber",
    light: "12–14 h/deň",
    germ: { min: 5, max: 10 },
    root: { min: 7, max: 10 },
    harvest: { min: 30, max: 45 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 800, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  mint: {
    name: "🌱 Mäta",
    short: "Svieža a odolná",
    light: "14–16 h/deň",
    germ: { min: 8, max: 15 },
    root: { min: 10, max: 14 },
    harvest: { min: 40, max: 60 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 650, max: 850, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  lettuce_leaf: {
    name: "🥬 Listový šalát",
    short: "Rýchly zber listov",
    light: "14–16 h/deň",
    germ: { min: 2, max: 4 },
    root: { min: 7, max: 10 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 600, max: 750, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 18, airMax: 22, waterMin: 18, waterMax: 20 }
  },
  parsley: {
    name: "🌿 Petržlen vňaťový",
    short: "Dlhší nábeh, stabilný rast",
    light: "14–16 h/deň",
    germ: { min: 10, max: 20 },
    root: { min: 10, max: 14 },
    harvest: { min: 50, max: 70 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 300, max: 400, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 700, max: 900, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  },
  pakchoi: {
    name: "🥬 Pak choi",
    short: "Rýchly baby harvest",
    light: "14–16 h/deň",
    germ: { min: 2, max: 3 },
    root: { min: 5, max: 7 },
    harvest: { min: 25, max: 35 },
    tds: {
      seedling: { min: 0, max: 150, dose: "Zatiaľ len čistá voda." },
      rooting: { min: 250, max: 350, dose: "Pridaj zakoreňovač: 0.5 ml/L." },
      growth: { min: 650, max: 850, dose: "Pridaj výživu A 2 ml/L + B 2 ml/L." }
    },
    temps: { airMin: 18, airMax: 24, waterMin: 18, waterMax: 22 }
  }
};

function $(id){ return document.getElementById(id); }
function isNum(x){ return typeof x === "number" && isFinite(x); }
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

function ppmToPct(ppm){
  if (!isNum(ppm)) return 0;
  return clamp(Math.round((ppm / 1000) * 100), 0, 100);
}

function daysBetween(isoDate){
  if (!isoDate) return null;
  const d0 = new Date(isoDate + "T00:00:00");
  if (isNaN(d0.getTime())) return null;
  const now = new Date();
  const dn = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((dn - d0) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
}

function computePhase(days, plant){
  const endSeed = plant.germ.max;
  const endRoot = plant.germ.max + plant.root.max;
  if (days <= endSeed) return "seedling";
  if (days <= endRoot) return "rooting";
  return "growth";
}

function phaseLabel(phase){
  if (phase === "seedling") return "Klíčenie";
  if (phase === "rooting") return "Zakoreňovanie";
  return "Rast";
}

function okMark(ok){
  return ok ? "✅" : "⚠️";
}

function formatWaterStatus(waterLow){
  return waterLow ? "Treba doplniť ⚠️" : "V poriadku ✅";
}

function formatCalibrationShort(calibrated){
  return calibrated ? "Hotovo ✅" : "Treba nastaviť ⚠️";
}

function formatDateSK(isoDate){
  if (!isoDate) return "Nezadaný";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return "Nezadaný";
  return d.toLocaleDateString("sk-SK");
}

function setBar(id, pct){
  const el = $(id);
  if (!el) return;
  el.style.width = `${clamp(pct || 0, 0, 100)}%`;
}

function nutrientState(concPpm, target){
  if (!isNum(concPpm)) return { text: "čakám na dáta", tone: "warn" };
  if (concPpm < (target.min - 100)) return { text: "nízke", tone: "warn" };
  if (concPpm > (target.max + 150)) return { text: "vysoké", tone: "bad" };
  return { text: "v poriadku", tone: "ok" };
}

function calculateHealthScore(obj){
  let score = 100;
  if (!obj.deviceConnected) score -= 40;
  if (!obj.wifiConnected) score -= 20;
  if (obj.waterLow) score -= 18;
  if (!obj.calibrated) score -= 10;
  if (!obj.airOk) score -= 4;
  if (!obj.waterOk) score -= 4;
  if (!obj.humOk) score -= 2;
  if (!obj.nutrientOk) score -= 12;
  return clamp(score, 0, 100);
}

let latestPlantKey = "";
let sowDate = "";
let computedPhase = "seedling";

/* ==================== 3D TOWER ==================== */
let tower3D = {
  root: null,
  scene: null,
  camera: null,
  renderer: null,
  group: null,
  water: null,
  topGlow: null,
  initialized: false
};

function initTower3D(){
  if (tower3D.initialized || typeof THREE === "undefined") return;
  const root = $("tower3d");
  if (!root) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    root.clientWidth / root.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.7, 7.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(root.clientWidth, root.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  root.innerHTML = "";
  root.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 1.25);
  scene.add(ambient);

  const dir1 = new THREE.DirectionalLight(0xffffff, 1.7);
  dir1.position.set(4, 8, 6);
  scene.add(dir1);

  const dir2 = new THREE.DirectionalLight(0xb8f4d3, 1.0);
  dir2.position.set(-5, 2, -3);
  scene.add(dir2);

  const group = new THREE.Group();
  scene.add(group);

  const baseGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.9, 48);
  const baseMat = new THREE.MeshPhysicalMaterial({
    color: 0x24343a,
    roughness: 0.45,
    metalness: 0.35,
    clearcoat: 0.5
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -2.2;
  group.add(base);

  const capGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.22, 48);
  const capMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f8fa,
    roughness: 0.25,
    metalness: 0.05
  });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.position.y = 2.25;
  group.add(cap);

  const glassGeo = new THREE.CylinderGeometry(0.95, 0.95, 4.2, 64, 1, true);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xeefcff,
    transparent: true,
    opacity: 0.33,
    roughness: 0.02,
    metalness: 0,
    transmission: 0.92,
    thickness: 1.2,
    clearcoat: 1
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.y = 0.15;
  group.add(glass);

  const waterGeo = new THREE.CylinderGeometry(0.83, 0.83, 1.45, 48);
  const waterMat = new THREE.MeshPhysicalMaterial({
    color: 0x7fe8ff,
    transparent: true,
    opacity: 0.42,
    roughness: 0.05,
    transmission: 0.6
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.y = -1.22;
  group.add(water);

  const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.5, 32);
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0xf4f7f8,
    roughness: 0.5
  });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.1;
  group.add(stem);

  const topGlowGeo = new THREE.SphereGeometry(1.8, 24, 24);
  const topGlowMat = new THREE.MeshBasicMaterial({
    color: 0xfff0a8,
    transparent: true,
    opacity: 0.18
  });
  const topGlow = new THREE.Mesh(topGlowGeo, topGlowMat);
  topGlow.scale.set(1.6, 0.6, 1.6);
  topGlow.position.y = 2.4;
  scene.add(topGlow);

  function createPod(y, side = 1, rot = 0) {
    const podGroup = new THREE.Group();

    const cupGeo = new THREE.CylinderGeometry(0.32, 0.42, 0.42, 24);
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xfafcfc,
      roughness: 0.45
    });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.rotation.z = side * 0.95;
    cup.position.x = side * 0.7;
    podGroup.add(cup);

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x57d96f,
      roughness: 0.7
    });

    const leaf1 = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 18), leafMat);
    leaf1.scale.set(1.45, 0.65, 1);
    leaf1.position.set(side * 0.88, 0.16, 0.06);
    podGroup.add(leaf1);

    const leaf2 = leaf1.clone();
    leaf2.position.set(side * 0.68, 0.19, -0.02);
    leaf2.rotation.y = 0.6;
    podGroup.add(leaf2);

    podGroup.position.y = y;
    podGroup.rotation.y = rot;
    group.add(podGroup);
  }

  createPod(1.45, -1, 0.2);
  createPod(0.75, 1, -0.1);
  createPod(0.05, -1, 0.3);
  createPod(-0.65, 1, -0.15);
  createPod(-1.35, -1, 0.18);

  const shadowGeo = new THREE.CircleGeometry(2.1, 48);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x9ab7b0,
    transparent: true,
    opacity: 0.18
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.68;
  scene.add(shadow);

  tower3D.root = root;
  tower3D.scene = scene;
  tower3D.camera = camera;
  tower3D.renderer = renderer;
  tower3D.group = group;
  tower3D.water = water;
  tower3D.topGlow = topGlow;
  tower3D.initialized = true;

  let t = 0;
  function animate(){
    if (!tower3D.initialized) return;
    t += 0.01;
    group.rotation.y = Math.sin(t * 0.55) * 0.18 + 0.25;
    if (tower3D.water) tower3D.water.position.y += Math.sin(t * 1.8) * 0.0008;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", resizeTower3D);
}

function resizeTower3D(){
  if (!tower3D.initialized || !tower3D.root) return;
  const w = tower3D.root.clientWidth;
  const h = tower3D.root.clientHeight;
  tower3D.camera.aspect = w / h;
  tower3D.camera.updateProjectionMatrix();
  tower3D.renderer.setSize(w, h);
}

function updateTower3D({ waterLow, deviceConnected, calibrated }){
  if (!tower3D.initialized) return;

  if (tower3D.water) {
    const targetScale = waterLow ? 0.45 : 1.0;
    tower3D.water.scale.y = targetScale;
    tower3D.water.position.y = waterLow ? -1.72 : -1.22;

    if (!deviceConnected) {
      tower3D.water.material.color.set(0xff9b9b);
      tower3D.water.material.opacity = 0.26;
    } else if (waterLow) {
      tower3D.water.material.color.set(0xffa6a6);
      tower3D.water.material.opacity = 0.34;
    } else {
      tower3D.water.material.color.set(0x7fe8ff);
      tower3D.water.material.opacity = 0.42;
    }
  }

  if (tower3D.topGlow) {
    if (!deviceConnected) {
      tower3D.topGlow.material.color.set(0xff8d8d);
      tower3D.topGlow.material.opacity = 0.16;
    } else if (!calibrated || waterLow) {
      tower3D.topGlow.material.color.set(0xffd37b);
      tower3D.topGlow.material.opacity = 0.18;
    } else {
      tower3D.topGlow.material.color.set(0xfff0a8);
      tower3D.topGlow.material.opacity = 0.18;
    }
  }
}

/* ==================== UI ==================== */

function setPlantDropdown(){
  const sel = $("plantSelect");
  if (!sel) return;

  sel.innerHTML = `<option value="">🌱 Vyber rastlinu</option>`;
  Object.entries(PLANTS).forEach(([key, p]) => {
    const o = document.createElement("option");
    o.value = key;
    o.textContent = p.name;
    sel.appendChild(o);
  });
}

function renderPlantCards(selectedKey){
  const wrap = $("plantCards");
  if (!wrap) return;

  wrap.innerHTML = "";
  Object.entries(PLANTS).forEach(([key, p]) => {
    const div = document.createElement("div");
    div.className = "plant-chip" + (selectedKey === key ? " active" : "");
    div.innerHTML = `
      <div class="name">${p.name}</div>
      <div class="desc">${p.short || p.light || ""}</div>
    `;

    div.addEventListener("click", () => {
      $("plantSelect").value = key;
      latestPlantKey = key;
      renderPlantCards(key);

      const plant = PLANTS[key];
      const days = daysBetween(sowDate);
      const phase = days === null ? "seedling" : computePhase(days, plant);

      setSummary(key, phase, sowDate);
      setHero(key, phase, sowDate, { urgentAction: false });
      renderTimeline(plant, sowDate, phase);
      renderDaysToHarvest(key, sowDate);
      renderPlantProfile(key, phase);
    });

    wrap.appendChild(div);
  });
}

function setSummary(plantKey, phase, sowDateValue){
  const p = PLANTS[plantKey];
  if (!p){
    $("selectionSummary").innerHTML = "Vyber rastlinu a zadaj dátum výsevu.";
    return;
  }

  $("selectionSummary").innerHTML = `
    <b>Vybraná rastlina:</b> ${p.name}<br>
    <b>Aktuálna fáza:</b> ${phaseLabel(phase)}<br>
    <b>Odporúčané svetlo:</b> ${p.light}<br>
    <b>Dátum výsevu:</b> ${formatDateSK(sowDateValue)}
  `;
}

function getHeroTitle(plantName, phase, urgentAction) {
  if (urgentAction) return `${plantName} potrebuje malý zásah`;
  if (phase === "seedling") return `${plantName} práve klíči`;
  if (phase === "rooting") return `${plantName} si vytvára korene`;
  return `${plantName} rastie správne`;
}

function getHeroSubtitle(state) {
  if (!state.deviceConnected) return "Veža sa neozvala dlhšie než 30 sekúnd. Skontroluj napájanie alebo Wi-Fi.";
  if (state.waterLow) return "Stačí doplniť vodu. O všetko ostatné sa postará systém.";
  if (!state.calibrated) return "Pred presným meraním treba spraviť kalibráciu čistej vody.";
  return "Dnes netreba veľký zásah. Veža drží vhodné podmienky pre rast.";
}

function setHero(plantKey, phase, sowDateValue, opts = {}){
  const p = PLANTS[plantKey];
  const days = daysBetween(sowDateValue);

  $("plantNameHero").innerText = p ? p.name : "—";
  $("growthDayHero").innerText = days === null ? "—" : `${days}`;
  $("phaseHero").innerText = p ? phaseLabel(phase) : "—";
  $("sowDateHero").innerText = formatDateSK(sowDateValue);

  if (p) {
    $("heroHeadline").innerText = getHeroTitle(p.name, phase, !!opts.urgentAction);
    $("heroSubtext").innerText = opts.heroSubtitle || "Aplikácia ti ukáže len to, čo je dôležité. Nemusíš riešiť technické hodnoty, stačí sa držať odporúčania.";
  } else {
    $("heroHeadline").innerText = "Tvoja veža je pripravená na ďalší krok";
    $("heroSubtext").innerText = "Aplikácia ti ukáže len to, čo je dôležité. Nemusíš riešiť technické hodnoty, stačí sa držať odporúčania.";
  }
}

function renderDaysToHarvest(plantKey, sowDateValue){
  const p = PLANTS[plantKey];
  const el = $("daysToHarvestHero");
  if (!el || !p){
    if (el) el.innerText = "—";
    return;
  }

  const days = daysBetween(sowDateValue);
  if (days === null){
    el.innerText = "Zber —";
    return;
  }

  const remaining = Math.max(0, p.harvest.min - days);
  if (remaining <= 0) el.innerText = "Možný zber";
  else el.innerText = `Zber o ${remaining} dní`;
}

function renderPrediction(plantKey, phase, sowDateValue, healthScore){
  const p = PLANTS[plantKey];
  const box = $("predictionBox");
  if (!box || !p) return;

  const days = daysBetween(sowDateValue);
  const remaining = days === null ? "—" : Math.max(0, p.harvest.min - days);

  let growthText = "Rast je stabilný";
  if (healthScore < 65) growthText = "Rast sa môže spomaliť";
  if (healthScore < 45) growthText = "Rast potrebuje zásah";

  let warningText = "Ak zostanú podmienky rovnaké, rast bude pokračovať správne.";
  if (healthScore < 65) warningText = "Ak nič nezmeníš, rast sa môže spomaliť.";
  if (healthScore < 45) warningText = "Bez zásahu sa rast pravdepodobne výrazne spomalí.";

  box.innerHTML = `
    <div class="predict-item">🧺 Zber o: <b>${remaining === "—" ? "—" : remaining + " dní"}</b></div>
    <div class="predict-item">🌿 ${growthText}</div>
    <div class="predict-item">⚠ ${warningText}</div>
  `;
}

function renderPlantProfile(plantKey, phase){
  const p = PLANTS[plantKey];
  const modeBox = $("plantModeBox");
  const modeText = $("plantModeText");
  const profileText = $("plantProfileText");
  if (!p || !modeBox || !modeText || !profileText) return;

  let modeLabel = "Režim: Rýchly rast 🚀";
  let modeDesc = "Táto rastlina rastie rýchlejšie a potrebuje stabilnú vodu, svetlo a výživu.";

  if (p.harvest.min >= 40 || p.germ.max >= 10) {
    modeLabel = "Režim: Úsporný 🌱";
    modeDesc = "Táto rastlina rastie pokojnejšie a lepšie znáša stabilný, menej agresívny režim.";
  }

  if (phase === "seedling") {
    modeDesc = "Rastlina je v klíčení. Teraz potrebuje pokojný štart a čistú vodu.";
  } else if (phase === "rooting") {
    modeDesc = "Rastlina si vytvára korene. Teraz je dôležitý jemný prechod a stabilná voda.";
  }

  modeBox.innerText = modeLabel;
  modeText.innerText = modeDesc;
  profileText.innerHTML = `
    <b>Svetlo:</b> ${p.light}<br>
    <b>Klíčenie:</b> ${p.germ.min}–${p.germ.max} dní<br>
    <b>Zber:</b> ${p.harvest.min}–${p.harvest.max} dní<br>
    <b>Odporúčaná teplota okolia:</b> ${p.temps.airMin}–${p.temps.airMax} °C
  `;
}

function renderCalibration(calibrated){
  if (calibrated){
    $("calibrationBox").innerHTML = `
      <b>Kalibrácia:</b> <span style="color:#13995f;font-weight:800;">Hotovo ✅</span><br><br>
      <b>Ak vymeníš celú vodu:</b><br>
      2× stlač dotykové tlačidlo.<br><br>
      <b>Ak iba doleješ vodu:</b><br>
      3× stlač dotykové tlačidlo.
    `;
  } else {
    $("calibrationBox").innerHTML = `
      <b>Kalibrácia:</b> <span style="color:#d15454;font-weight:800;">Treba nastaviť ⚠️</span><br><br>
      <b>Prvá kalibrácia:</b><br>
      nalej čistú vodu a 2× stlač dotykové tlačidlo.<br><br>
      <b>Po dolievaní vody:</b><br>
      stlač tlačidlo 3×.
    `;
  }
}

function renderTimeline(plant, sowDateValue, phase){
  const days = daysBetween(sowDateValue);

  if (days === null){
    $("timelineBox").innerHTML = `Zadaj dátum výsevu a aplikácia sama vypočíta, v akej fáze sa rastlina nachádza a čo príde ďalej.`;
    return;
  }

  let nextStep = "Systém čaká na ďalšiu fázu.";
  if (phase === "seedling"){
    nextStep = `Po ${plant.germ.max}. dni začne zakoreňovanie.`;
  } else if (phase === "rooting"){
    nextStep = `Po zakoreňovaní prejde rastlina do rastovej fázy.`;
  } else {
    nextStep = `Rastová fáza pokračuje. Sleduj vodu a výživu.`;
  }

  $("timelineBox").innerHTML = `
    <b>Dní od výsevu:</b> ${days} dní<br>
    🌱 <b>Klíčenie:</b> ${plant.germ.min}–${plant.germ.max} dní<br>
    🌿 <b>Zakoreňovanie:</b> ${plant.root.min}–${plant.root.max} dní<br>
    🧺 <b>Zber:</b> ${plant.harvest.min}–${plant.harvest.max} dní<br><br>
    <b>Ďalší krok:</b> ${nextStep}
  `;
}

function renderNutrientAdvice(plant, phase, concPpm){
  const t = plant.tds[phase];
  const state = nutrientState(concPpm, t);

  let title = "Výživa je správna.";
  let rec = "Zatiaľ netreba robiť veľký zásah.";

  if (state.tone === "warn"){
    if (phase === "seedling") {
      title = "Zatiaľ nechaj len čistú vodu.";
      rec = "Rastlina je ešte malá. Výživu zatiaľ nepridávaj.";
    } else if (phase === "rooting") {
      title = "Treba jemne podporiť korene.";
      rec = t.dose;
    } else {
      title = "Treba pridať výživu.";
      rec = t.dose;
    }
  } else if (state.tone === "bad"){
    title = "Roztok je príliš silný.";
    rec = "Pridaj čistú vodu, aby bol roztok jemnejší pre korene.";
  }

  $("nutrientAdviceBox").innerHTML = `
    <b>${title}</b><br><br>
    ${rec}
  `;
}

function renderNextAction(obj){
  const box = $("nextActionBox");
  if (!box) return;

  let title = "Dnes netreba veľký zásah";
  let desc = "Veža je v poriadku. Stačí ju priebežne kontrolovať.";
  let tag = "Odporúčanie";
  let priority = "Nízka";
  let reason = "Všetko dôležité je stabilné.";

  if (!obj.deviceConnected){
    title = "Skontroluj zariadenie";
    desc = "Veža neposlala údaje dlhšie než 30 sekúnd. Skontroluj napájanie alebo Wi-Fi.";
    tag = "Potrebný zásah";
    priority = "Vysoká";
    reason = "Veža sa neozýva.";
  } else if (!obj.wifiConnected){
    title = "Pripoj vežu na Wi-Fi";
    desc = "Zariadenie momentálne nie je pripojené na Wi-Fi.";
    tag = "Potrebný zásah";
    priority = "Vysoká";
    reason = "Chýba spojenie.";
  } else if (obj.waterLow){
    title = "Doplň vodu";
    desc = "Hladina vody je nízka. Dolej vodu do nádrže.";
    tag = "Dôležité";
    priority = "Vysoká";
    reason = "Málo vody.";
  } else if (!obj.calibrated){
    title = "Sprav kalibráciu";
    desc = "Pred presným meraním treba spraviť kalibráciu čistej vody.";
    tag = "Dôležité";
    priority = "Stredná";
    reason = "Kalibrácia chýba.";
  } else if (obj.phase === "seedling"){
    title = "Zatiaľ nechaj čistú vodu";
    desc = "Rastlina je ešte v klíčení. Výživu zatiaľ nepridávaj.";
    priority = "Nízka";
    reason = "Začiatok rastu.";
  } else if (obj.phase === "rooting"){
    title = obj.stateTone === "warn" ? "Podpor korene" : "Korene sa vyvíjajú správne";
    desc = obj.stateTone === "warn"
      ? obj.doseText
      : "Rastlina si vytvára korene. Systém zatiaľ drží vhodné podmienky.";
    priority = obj.stateTone === "warn" ? "Stredná" : "Nízka";
    reason = obj.stateTone === "warn" ? "Rastlina potrebuje jemnú podporu." : "Zakoreňovanie prebieha správne.";
  } else {
    if (obj.stateTone === "warn") {
      title = "Pridaj výživu";
      desc = obj.doseText;
      priority = "Stredná";
      reason = "Rastlina potrebuje viac výživy.";
    } else if (obj.stateTone === "bad") {
      title = "Zrieď roztok";
      desc = "Pridaj čistú vodu, aby bola výživa jemnejšia pre korene.";
      priority = "Stredná";
      reason = "Roztok je príliš silný.";
    } else {
      title = "Rast pokračuje správne";
      desc = "Rastlina má vhodné podmienky. Zatiaľ stačí len bežná kontrola.";
      priority = "Nízka";
      reason = "Podmienky sú stabilné.";
    }
  }

  box.innerHTML = `
    <div>
      <div class="smart-tag"><i class="fa-solid fa-wand-magic-sparkles"></i> ${tag}</div>
      <div class="smart-title">${title}</div>
      <div class="smart-desc">${desc}</div>

      <div class="next-meta">
        <div class="meta-chip"><b>Priorita:</b> ${priority}</div>
        <div class="meta-chip"><b>Dôvod:</b> ${reason}</div>
      </div>
    </div>
  `;
}

function renderOverallState(obj){
  let text = "Stav neznámy";
  if (!obj.deviceConnected) text = "🔴 Veža offline";
  else if (!obj.wifiConnected) text = "🟠 Bez Wi-Fi";
  else if (obj.waterLow || !obj.calibrated) text = "🟠 Treba zásah";
  else text = "🟢 V poriadku";
  $("overallStateBadge").innerText = text;
}

function renderHealth(score){
  const scoreText = $("healthScoreText");
  const scoreBar = $("healthScoreBar");
  const note = $("healthScoreNote");
  const badge = $("healthBadge");

  if (!scoreText || !scoreBar || !note || !badge) return;
  scoreText.innerText = `${score} %`;
  scoreBar.style.width = `${score}%`;

  if (score >= 85){
    note.innerText = "Veža je vo veľmi dobrom stave a pripravená na ďalší rast.";
  } else if (score >= 65){
    note.innerText = "Veža funguje dobre, ale niektoré veci si pýtajú menšiu pozornosť.";
  } else {
    note.innerText = "Veža potrebuje zásah. Pozri odporúčanie vpravo.";
  }

  badge.innerText = `Stav veže: ${score} %`;
}

function renderMiniStats(obj){
  $("deviceStatusMini").innerText = obj.deviceConnected ? "Veža: online ✅" : "Veža: offline ⚠️";
  $("pumpStatusMini").innerText = obj.pump ? "Beží ✅" : "Vypnutá";
  $("lightStatusMini").innerText = obj.light ? "Zapnuté ✅" : "Vypnuté";
  $("wifiStatusMini").innerText = obj.wifiConnected ? "Pripojené ✅" : "Nepripojené ⚠️";
  $("waterLevelMini").innerText = obj.waterLow ? "Málo ⚠️" : "OK ✅";
}

function setRowTone(id, tone){
  const row = $(id);
  if (!row) return;
  row.classList.remove("tone-good", "tone-warn", "tone-bad");
  row.classList.add(tone);
}

function renderStatusTones(obj){
  setRowTone("rowDevice", obj.deviceConnected ? "tone-good" : "tone-bad");
  setRowTone("rowWifi", obj.wifiConnected ? "tone-good" : "tone-warn");
  setRowTone("rowPump", obj.pump ? "tone-good" : "tone-warn");
  setRowTone("rowLight", obj.light ? "tone-good" : "tone-warn");
  setRowTone("rowHumidity", obj.humOk ? "tone-good" : "tone-warn");
  setRowTone("rowCalibration", obj.calibrated ? "tone-good" : "tone-warn");
}

function renderSystemDoing(items){
  const box = $("systemDoingBox");
  if (!box) return;
  box.innerHTML = items.map(item => `<div class="micro-item">${item}</div>`).join("");
}

function renderSystemWhy(text){
  const box = $("systemWhyBox");
  if (!box) return;
  box.innerHTML = `<div class="micro-item">${text}</div>`;
}

/* ==================== WRITE ==================== */

function sendPlant(){
  const plantKey = $("plantSelect").value;
  if (!plantKey) {
    alert("Vyber rastlinu.");
    return;
  }

  db.ref("tower/commands").update({
    plant: plantKey,
    resetPumpTimer: true
  }).then(() => {
    alert("Rastlina bola nastavená ✔");
  }).catch(err => {
    alert("Chyba: " + err.message);
  });
}
window.sendPlant = sendPlant;

function saveSowDate(){
  const d = $("sowDate").value;
  const plantKey = $("plantSelect").value;

  if (!plantKey){
    alert("Najprv vyber rastlinu.");
    return;
  }

  if (!d){
    alert("Zadaj dátum výsevu.");
    return;
  }

  db.ref("tower/meta").update({
    sowDate: d,
    sowPlant: plantKey
  }).then(() => {
    alert("Dátum výsevu bol uložený ✔");
  }).catch(err => {
    alert("Chyba: " + err.message);
  });
}
window.saveSowDate = saveSowDate;

function clearSowDate(){
  db.ref("tower/meta").update({
    sowDate: null,
    sowPlant: null
  }).then(() => {
    alert("Dátum výsevu bol zmazaný ✔");
  }).catch(err => {
    alert("Chyba: " + err.message);
  });
}
window.clearSowDate = clearSowDate;

/* ==================== INIT ==================== */

function initPlantSelectSync(){
  const select = $("plantSelect");
  if (!select) return;

  select.addEventListener("change", () => {
    latestPlantKey = select.value || "";
    renderPlantCards(latestPlantKey);

    const p = PLANTS[latestPlantKey];
    if (p) {
      const days = daysBetween(sowDate);
      const phase = days === null ? "seedling" : computePhase(days, p);
      setSummary(latestPlantKey, phase, sowDate);
      setHero(latestPlantKey, phase, sowDate, { urgentAction: false });
      renderTimeline(p, sowDate, phase);
      renderDaysToHarvest(latestPlantKey, sowDate);
      renderPlantProfile(latestPlantKey, phase);
    }
  });
}

setPlantDropdown();
renderPlantCards("");
initPlantSelectSync();
initTower3D();

renderCalibration(false);
renderHealth(0);
renderSystemDoing([
  "🔄 Čakám na prvé údaje z veže",
  "💧 Sledujem hladinu vody",
  "🌡 Sledujem teplotu"
]);
renderSystemWhy("Po načítaní údajov ti aplikácia ukáže len to, čo je dôležité.");
$("predictionBox").innerHTML = `
  <div class="predict-item">🧺 Zber o: —</div>
  <div class="predict-item">🌿 Rast: —</div>
  <div class="predict-item">⚠ Predikcia sa zobrazí po načítaní dát.</div>
`;

renderNextAction({
  waterLow: false,
  calibrated: false,
  phase: "seedling",
  doseText: "Zatiaľ len čistá voda.",
  stateText: "čakám na dáta",
  stateTone: "warn",
  wifiConnected: false,
  deviceConnected: false
});
renderOverallState({
  waterLow: false,
  calibrated: false,
  wifiConnected: false,
  deviceConnected: false
});
renderMiniStats({
  deviceConnected: false,
  pump: false,
  light: false,
  wifiConnected: false,
  waterLow: false
});
updateTower3D({
  waterLow: false,
  deviceConnected: false,
  calibrated: false
});

db.ref("tower/commands").on("value", (snap) => {
  const c = snap.val() || {};
  if (typeof c.plant === "string" && c.plant.trim()) {
    latestPlantKey = c.plant.trim();
    if ($("plantSelect") && $("plantSelect").value !== latestPlantKey) {
      $("plantSelect").value = latestPlantKey;
    }
    renderPlantCards(latestPlantKey);
  }
});

db.ref("tower/meta").on("value", (snap) => {
  const m = snap.val() || {};
  sowDate = (typeof m.sowDate === "string" && m.sowDate) ? m.sowDate : "";

  if ($("sowDate") && $("sowDate").value !== sowDate) {
    $("sowDate").value = sowDate;
  }

  if (typeof m.sowPlant === "string" && m.sowPlant && m.sowPlant !== latestPlantKey) {
    latestPlantKey = m.sowPlant;
    if ($("plantSelect")) $("plantSelect").value = latestPlantKey;
  }

  const plantKey = latestPlantKey && PLANTS[latestPlantKey] ? latestPlantKey : "arugula";
  const plant = PLANTS[plantKey];
  const days = daysBetween(sowDate);
  computedPhase = days === null ? "seedling" : computePhase(days, plant);

  setSummary(plantKey, computedPhase, sowDate);
  setHero(plantKey, computedPhase, sowDate, { urgentAction: false });
  renderTimeline(plant, sowDate, computedPhase);
  renderPlantCards(plantKey);
  renderDaysToHarvest(plantKey, sowDate);
  renderPlantProfile(plantKey, computedPhase);
});

db.ref("tower/status").on("value", (snap) => {
  try {
    const s = snap.val() || {};

    const pumpOn = !!s.pump;
    const lightOn = !!s.light;
    const waterLow = !!s.waterLow;
    const calibrated = !!s.baselineCalibrated;
    const wifiConnected = !!s.wifiConnected;

    $("pumpStatus").innerText = pumpOn ? "Zapnutá ✅" : "Vypnutá";
    $("lightStatus").innerText = lightOn ? "Zapnuté ✅" : "Vypnuté";
    $("waterLevel").innerText = formatWaterStatus(waterLow);

    const airTemp = isNum(s.temperature) ? s.temperature : 0;
    const humidity = isNum(s.humidity) ? s.humidity : 0;
    const waterTemp = isNum(s.waterTemp) ? s.waterTemp : 0;

    $("calibrationShort").innerText = formatCalibrationShort(calibrated);
    renderCalibration(calibrated);
    $("wifiStatus").innerText = wifiConnected ? "Pripojené ✅" : "Nepripojené ⚠️";

    const lastUpdate = isNum(s.lastUpdate) ? s.lastUpdate : 0;
    const ageSec = lastUpdate > 0 ? Math.floor(Date.now() / 1000) - lastUpdate : 999999;
    const deviceConnected = ageSec <= 30;

    $("deviceStatus").innerText = deviceConnected ? "Pripojené ✅" : "Neodpovedá ⚠️";
    $("lastUpdateText").innerText = deviceConnected
      ? "Posledná aktualizácia prebehla v poriadku."
      : "Veža neposlala údaje dlhšie než 30 sekúnd.";

    let concPpm = 0;
    if (isNum(s.concentrationPpm)) concPpm = s.concentrationPpm;
    else if (isNum(s.tdsPpm) && isNum(s.tdsBaselinePpm)) {
      concPpm = Math.max(0, s.tdsPpm - s.tdsBaselinePpm);
    }

    const plantKey = latestPlantKey && PLANTS[latestPlantKey]
      ? latestPlantKey
      : (typeof s.plant === "string" && PLANTS[s.plant] ? s.plant : "arugula");

    const plant = PLANTS[plantKey];
    const phase = computedPhase || "seedling";
    const target = plant.tds[phase];

    const nutrientStateObj = nutrientState(concPpm, target);
    const nutrientOk = nutrientStateObj.tone === "ok";
    const airOk = isNum(airTemp) && airTemp >= plant.temps.airMin && airTemp <= plant.temps.airMax;
    const waterOk = isNum(waterTemp) && waterTemp >= plant.temps.waterMin && waterTemp <= plant.temps.waterMax;
    const humOk = isNum(humidity) && humidity >= 40 && humidity <= 80;

    $("temperature").innerText = `${airTemp.toFixed(1)} °C ${okMark(airOk)}`;
    $("humidity").innerText = `${humidity.toFixed(0)} % ${okMark(humOk)}`;
    $("waterTemp").innerText = `${waterTemp.toFixed(1)} °C ${okMark(waterOk)}`;
    $("nutrientsPct").innerText =
      nutrientStateObj.tone === "ok"
        ? "V poriadku ✅"
        : nutrientStateObj.tone === "warn"
          ? "Treba upraviť ⚠️"
          : "Príliš silné ⚠️";

    $("waterLevelDetail").innerText = waterLow ? "Treba doplniť" : "V poriadku";
    $("nutrientsDetail").innerText =
      nutrientStateObj.tone === "ok"
        ? "Výživa je správna"
        : nutrientStateObj.tone === "warn"
          ? "Treba pridať výživu"
          : "Treba zriediť roztok";
    $("temperatureDetail").innerText = airOk ? "Teplota je vhodná" : "Treba upraviť teplotu";
    $("waterTempDetail").innerText = waterOk ? "Voda má vhodnú teplotu" : "Voda je mimo ideálu";

    setBar("waterBar", waterLow ? 18 : 78);
    setBar("nutrientBar", nutrientStateObj.tone === "ok" ? 78 : nutrientStateObj.tone === "warn" ? 42 : 92);
    setBar("tempBar", clamp(Math.round((airTemp / 35) * 100), 0, 100));
    setBar("waterTempBar", clamp(Math.round((waterTemp / 30) * 100), 0, 100));

    setSummary(plantKey, phase, sowDate);

    const urgentAction = !deviceConnected || !wifiConnected || waterLow || !calibrated || nutrientStateObj.tone !== "ok";
    const heroSubtitle = getHeroSubtitle({
      deviceConnected,
      waterLow,
      calibrated
    });
    setHero(plantKey, phase, sowDate, { urgentAction, heroSubtitle });

    renderTimeline(plant, sowDate, phase);
    renderNutrientAdvice(plant, phase, concPpm);
    renderDaysToHarvest(plantKey, sowDate);
    renderPlantProfile(plantKey, phase);

    renderNextAction({
      waterLow,
      calibrated,
      phase,
      doseText: target.dose,
      stateText: nutrientStateObj.text,
      stateTone: nutrientStateObj.tone,
      wifiConnected,
      deviceConnected
    });

    renderOverallState({
      waterLow,
      calibrated,
      wifiConnected,
      deviceConnected
    });

    renderMiniStats({
      deviceConnected,
      pump: pumpOn,
      light: lightOn,
      wifiConnected,
      waterLow
    });

    renderStatusTones({
      deviceConnected,
      wifiConnected,
      pump: pumpOn,
      light: lightOn,
      humOk,
      calibrated
    });

    const healthScore = calculateHealthScore({
      deviceConnected,
      wifiConnected,
      waterLow,
      calibrated,
      airOk,
      waterOk,
      humOk,
      nutrientOk
    });
    renderHealth(healthScore);
    renderPrediction(plantKey, phase, sowDate, healthScore);

    updateTower3D({
      waterLow,
      deviceConnected,
      calibrated
    });

    const doing = [];
    if (!deviceConnected) {
      doing.push("📡 Čakám na spojenie s vežou");
    } else {
      doing.push("💧 Kontrolujem hladinu vody");
    }

    if (waterLow) doing.push("🚰 Pripravujem upozornenie na doplnenie vody");
    else doing.push("🌡 Sledujem teplotu a svetlo");

    if (nutrientStateObj.tone === "warn") doing.push("🧪 Pripravujem odporúčanie na výživu");
    else if (nutrientStateObj.tone === "bad") doing.push("🧪 Upozorňujem na silný roztok");
    else doing.push("🌿 Držím podmienky pre stabilný rast");

    renderSystemDoing(doing.slice(0, 3));

    let why = "Podmienky sú stabilné, preto zatiaľ netreba veľký zásah.";
    if (!deviceConnected) {
      why = "Veža neposlala údaje dlhšie než 30 sekúnd, preto treba skontrolovať napájanie alebo Wi-Fi.";
    } else if (!wifiConnected) {
      why = "Chýba Wi-Fi spojenie, preto aplikácia upozorňuje na pripojenie.";
    } else if (waterLow) {
      why = "Hladina vody je nízka, preto treba doplniť nádrž.";
    } else if (!calibrated) {
      why = "Kalibrácia ešte nie je hotová, preto meranie nemusí byť presné.";
    } else if (nutrientStateObj.tone === "warn") {
      why = "Rastlina je vo fáze, kde potrebuje viac výživy pre ďalší rast.";
    } else if (nutrientStateObj.tone === "bad") {
      why = "Roztok je príliš silný, preto je vhodné pridať čistú vodu.";
    } else if (!airOk || !waterOk) {
      why = "Teplota je mimo odporúčaného rozsahu pre túto rastlinu.";
    }

    renderSystemWhy(why);
    renderPlantCards(plantKey);

  } catch (err) {
    console.error("Status render error:", err);
    $("lastUpdateText").innerText = "Chyba pri vykreslení dát.";
    renderSystemDoing([
      "❌ Nastala chyba pri spracovaní dát",
      "🔄 Skúšam obnoviť stav systému"
    ]);
    renderSystemWhy("Pri načítaní dát nastala chyba. Skontroluj pripojenie zariadenia.");
  }
});

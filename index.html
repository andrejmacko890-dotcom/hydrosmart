<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>HydroSmart Dashboard</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(to right, #e0f7fa, #d0f0c0);
      color: #333;
      margin: 0; padding: 0;
    }
    .container {
      max-width: 650px;
      margin: 30px auto;
      background: #ffffffee;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.25);
    }
    header { text-align:center; margin-bottom: 25px; }
    header h1 { color:#2e7d32; font-size:2.5em; margin:0 0 6px 0; }
    header p { color:#555; font-size:1.1em; margin:0; }

    .card {
      background: #ffffff;
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 18px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    }
    .card h2 {
      color:#2e7d32;
      margin:0 0 12px 0;
      border-bottom: 3px solid #2e7d32;
      padding-bottom: 6px;
      font-size: 1.35em;
      display:flex; align-items:center; gap:10px;
    }

    select, input[type="date"], button {
      width: 100%;
      padding: 14px;
      margin-bottom: 12px;
      border-radius: 14px;
      border: 1px solid #ccc;
      font-size: 16px;
      box-sizing: border-box;
    }

    .btn {
      background-color:#2e7d32;
      color:white;
      border:none;
      cursor:pointer;
      transition: background 0.25s ease;
      font-weight: 600;
    }
    .btn:hover { background-color:#1b5e20; }

    .btn-row { display:flex; gap:10px; }
    .btn-row button { width: 100%; }
    .btn-secondary {
      background:#1565c0;
    }
    .btn-secondary:hover { background:#0d47a1; }
    .btn-danger { background:#b71c1c; }
    .btn-danger:hover { background:#7f0000; }

    .mini-box {
      background:#f6f8f6;
      border:1px dashed #cfd8dc;
      padding: 12px;
      border-radius: 14px;
      font-size: 14px;
      color:#444;
    }

    .status-section {
      background-color:#f1f8e9;
      padding: 16px;
      border-radius: 18px;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
    }
    .status-item {
      font-size: 16px;
      margin-bottom: 10px;
      display:flex;
      align-items:center;
      justify-content: space-between;
      padding: 12px 14px;
      border-radius: 14px;
    }
    .status-item .left { display:flex; align-items:center; gap:12px; }
    .status-item span.value { font-weight:700; }

    .status-pump { background:#c8e6c9; color:#2e7d32; }
    .status-water { background:#b3e5fc; color:#0277bd; }
    .status-nutrients { background:#dcedc8; color:#558b2f; }
    .status-light { background:#fff9c4; color:#f57f17; }
    .status-temp { background:#ffe0b2; color:#ef6c00; }
    .status-humidity { background:#f0f4c3; color:#827717; }
    .status-waterTemp { background:#e1f5fe; color:#01579b; }

    .big-action {
      background: #e8f5e9;
      border: 1px solid #c8e6c9;
      border-radius: 18px;
      padding: 14px;
      margin-bottom: 12px;
    }
    .big-action .title { font-weight:800; color:#1b5e20; margin-bottom:6px; }
    .big-action .desc { color:#2f3b2f; font-size: 14px; line-height: 1.35; }

    .pill-ok { color:#1b5e20; font-weight:800; }
    .pill-bad { color:#b71c1c; font-weight:800; }
    .pill-warn { color:#ef6c00; font-weight:800; }

    .footer {
      text-align:center;
      color:#6b6b6b;
      font-size: 12px;
      margin-top: 8px;
    }

    @media(max-width: 520px){
      .container{ margin: 12px; padding: 18px; }
      header h1{ font-size: 2.0em; }
      .btn-row { flex-direction: column; }
    }
  </style>
</head>

<body>
  <div class="container">
    <header>
      <h1>HydroSmart Dashboard</h1>
      <p>Jednoducho: vyber rastlinu, zadaj dátum výsevu a systém ťa povedie.</p>
    </header>

    <!-- OVLÁDANIE -->
    <div class="card">
      <h2><i class="fa-solid fa-sliders"></i> Ovládanie</h2>

      <label><b>Rastlina</b></label>
      <select id="plantSelect"></select>
      <button class="btn" onclick="sendPlant()"><i class="fa-solid fa-seedling"></i> Odoslať rastlinu</button>

      <label><b>Dátum výsevu</b> (kedy si zasadil semienka)</label>
      <input id="sowDate" type="date" />
      <div class="btn-row">
        <button class="btn btn-secondary" onclick="saveSowDate()"><i class="fa-solid fa-floppy-disk"></i> Uložiť</button>
        <button class="btn btn-danger" onclick="clearSowDate()"><i class="fa-solid fa-trash"></i> Zmazať</button>
      </div>

      <div class="mini-box" id="selectionSummary">
        Načítavam…
      </div>
    </div>

    <!-- ČO MÁŠ UROBIŤ TERAZ -->
    <div class="card">
      <h2><i class="fa-solid fa-compass"></i> Čo máš urobiť teraz</h2>
      <div class="big-action" id="nextActionBox">
        <div class="title">Načítavam…</div>
        <div class="desc">Čakám na dáta z veže.</div>
      </div>
    </div>

    <!-- STATUS -->
    <div class="card">
      <h2><i class="fa-solid fa-tower-observation"></i> Status HydroVeže</h2>
      <div class="status-section">
        <div class="status-item status-pump">
          <div class="left"><i class="fa-solid fa-droplet"></i> Pumpa</div>
          <span class="value" id="pumpStatus">--</span>
        </div>

        <div class="status-item status-water">
          <div class="left"><i class="fa-solid fa-water"></i> Hladina vody</div>
          <span class="value" id="waterLevel">--</span>
        </div>

        <div class="status-item status-nutrients">
          <div class="left"><i class="fa-solid fa-vial"></i> Živiny</div>
          <span class="value" id="nutrientsPct">--</span>
        </div>

        <div class="status-item status-light">
          <div class="left"><i class="fa-solid fa-lightbulb"></i> Svetlo</div>
          <span class="value" id="lightStatus">--</span>
        </div>

        <div class="status-item status-temp">
          <div class="left"><i class="fa-solid fa-temperature-half"></i> Teplota vzduchu</div>
          <span class="value" id="temperature">--</span>
        </div>

        <div class="status-item status-humidity">
          <div class="left"><i class="fa-solid fa-tint"></i> Vlhkosť</div>
          <span class="value" id="humidity">--</span>
        </div>

        <div class="status-item status-waterTemp">
          <div class="left"><i class="fa-solid fa-thermometer"></i> Teplota vody</div>
          <span class="value" id="waterTemp">--</span>
        </div>
      </div>
    </div>

    <!-- KALIBRÁCIA -->
    <div class="card">
      <h2><i class="fa-solid fa-check-double"></i> Kalibrácia vody</h2>
      <div class="mini-box" id="calibrationBox">Načítavam…</div>
    </div>

    <!-- ODPORÚČANIA ŽIVÍN -->
    <div class="card">
      <h2><i class="fa-solid fa-clipboard-list"></i> Odporúčania (živiny)</h2>
      <div class="mini-box" id="nutrientAdviceBox">Načítavam…</div>
    </div>

    <!-- ČASOVÁ OS -->
    <div class="card">
      <h2><i class="fa-solid fa-calendar-days"></i> Časová os rastu</h2>
      <div class="mini-box" id="timelineBox">Načítavam…</div>
    </div>

    <div class="footer">HydroSmart © 2026</div>
  </div>

  <!-- Firebase SDK (v8) -->
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js"></script>

  <script src="./app.js"></script>
</body>
</html>

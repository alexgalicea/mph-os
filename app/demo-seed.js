// Web demo (GitHub Pages): staged, fictional content so the browser build looks like the app in a car.
// Injected before the app bundle by scripts/web-demo/build.sh. No real people, places or tracks.
(function () {
  var q = new URLSearchParams(location.search);
  var es = q.get('lang') === 'es';
  var now = Math.floor(Date.now() / 1000);
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var ago = function (min) { return Date.now() - min * 60e3; };
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset=".55" stop-color="#6d28d9"/><stop offset="1" stop-color="#db2777"/></linearGradient></defs><rect width="512" height="512" fill="url(#g)"/><circle cx="256" cy="300" r="120" fill="#fbbf24" opacity=".85"/><rect y="300" width="512" height="212" fill="#0f172a" opacity=".55"/></svg>';
  var art = 'data:image/svg+xml;base64,' + btoa(svg);
  window.__civicShowcase = true;

  // Simulated car: the app's "daemon" source pointed at a fake host, answered here in the page.
  // A gentle loop (cruise, slow down, stop at a light, pull away), never a full-throttle launch.
  var DEMO_HOST = 'demo-car.invalid:1';
  var t0 = Date.now(), dtcs = [{ code: 'P0456', description: 'Evaporative Emission System Leak Detected (very small leak)' }];
  function carData() {
    var t = (Date.now() - t0) / 1000, p = t % 60, speed, throttle, rpm, load;
    if (p < 24) { speed = 62 + 3 * Math.sin(t * 0.3); throttle = 20 + 4 * Math.sin(t * 0.5); rpm = 2000 + 120 * Math.sin(t * 0.4); load = 36 + 5 * Math.sin(t * 0.5); }
    else if (p < 34) { var k = (p - 24) / 10; speed = Math.max(0, 62 * (1 - k)); throttle = 0; rpm = Math.max(750, 2000 * (1 - k)); load = 15; }
    else if (p < 40) { speed = 0; throttle = 0; rpm = 750 + 20 * Math.random(); load = 22; }
    else { var j = p - 40; speed = 62 * (1 - Math.exp(-j / 6)); throttle = 45 - j; rpm = 2600 - 20 * j; load = 60 - j; }
    var map = 30 + (101.3 - 32) * Math.pow(throttle / 100, 0.7);
    return { speed: Math.round(speed * 10) / 10, rpm: Math.round(rpm), throttle: Math.round(throttle * 10) / 10, load: Math.round(load * 10) / 10,
      boost: Math.round((map - 101.3) * 0.145 * 10) / 10, map: Math.round(map * 10) / 10, coolant: 194, iat: null, oilTemp: null,
      stft: Math.round(16 * Math.sin(t * 0.7)) / 10, ltft: -2.3, odometer: 12480, cvtTemp: 168, fuelGal: 9.7, misfires: [0, 0, 0, 0],
      vtec: false, ambient: 74, battery: 14.2, fuelPct: 78, runTime: Math.round(t) + 1260, distSinceClear: 1234,
      mil: dtcs.length > 0, dtcCount: dtcs.length };
  }
  var RealWS = window.WebSocket;
  function FakeWS(url) {
    var self = this;
    this.readyState = 1;
    this.close = function () { clearInterval(self._timer); self.readyState = 3; };
    this.send = function () {};
    this._timer = setInterval(function () {
      if (self.onmessage) self.onmessage({ data: JSON.stringify({ type: 'telemetry', source: 'sim', link: 'connected', ts: Date.now() / 1000, data: carData(), launch: null }) });
    }, 250);
  }
  window.WebSocket = function (url, protocols) { return String(url).indexOf(DEMO_HOST) >= 0 ? new FakeWS(url) : new RealWS(url, protocols); };
  window.WebSocket.prototype = RealWS.prototype;
  var realFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    var url = String(input && input.url || input);
    if (url.indexOf(DEMO_HOST) < 0) return realFetch(input, init);
    var body = {};
    if (/\/dtc\/clear/.test(url)) { dtcs = []; body = { ok: true }; }
    else if (/\/dtc/.test(url)) body = { codes: dtcs };
    else if (/\/health/.test(url)) body = { source: 'sim', link: 'connected', clients: 1, hz: 4, port: 'simulated', protocol: 'simulated', pidsPerSec: null };
    else if (/\/system/.test(url)) body = { cpuTempC: 41.5, uptimeS: 5400, load1: 0.4 };
    return Promise.resolve(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  };
  window.__civicTestNotes = {
    nowPlaying: { title: 'Night Drive', artist: 'Neon Coast', album: 'Low Beams', app: 'com.spotify.music', appLabel: 'Spotify',
      playing: true, durationMs: 214000, positionMs: 81000, art: art, canSeek: true, canQueue: true, queueTitle: 'Evening Commute',
      queue: ['Coastline (Radio Edit)', 'Parallel Lanes', 'Tail Lights', 'Overpass', 'Last Exit Home'].map(function (t, i) { return { id: 'q' + i, title: t }; }) },
    nav: es
      ? { active: true, app: 'com.google.android.apps.maps', title: '600 m', text: 'Gira a la derecha en Av. del Puerto', subText: '14 min · 13,8 km · llegada 6:12 p. m.' }
      : { active: true, app: 'com.google.android.apps.maps', title: '0.4 mi', text: 'Turn right onto Harbor Blvd', subText: '14 min · 8.6 mi · 6:12 PM ETA' },
    messages: [
      { key: 'm1', sender: 'Maya', conversation: 'Maya', text: es ? 'Llego 10 min tarde, guárdame un lugar 🙂' : 'Running 10 min late, save me a seat 🙂', time: ago(4), app: 'com.google.android.apps.messaging', appLabel: 'Messages', canReply: true },
      { key: 'm2', sender: 'Jordan', conversation: 'Weekend crew', text: es ? '¿Sendero mañana a las 8?' : 'Trail at 8 tomorrow?', time: ago(31), app: 'com.whatsapp', appLabel: 'WhatsApp', canReply: true }
    ],
    call: null
  };
  window.__civicTestComms = {
    favorites: [['Maya', '+15550100'], ['Jordan', '+15550101'], [es ? 'Mamá' : 'Mom', '+15550102'], ['Sam', '+15550103'], ['Riley', '+15550104'], ['Chris', '+15550105']]
      .map(function (f) { return { name: f[0], number: f[1], label: 'Mobile' }; }),
    recentCalls: [['Maya', 12, 'incoming'], ['Mom', 95, 'outgoing'], ['Jordan', 260, 'missed'], ['Sam', 1500, 'incoming'], ['Riley', 2900, 'outgoing']]
      .map(function (c) { return { name: c[0], number: '+1555010' + c[0].length, type: c[2], date: ago(c[1]), label: 'Mobile' }; }),
    events: [
      { title: es ? 'Reunión de equipo' : 'Team sync', begin: ago(-75), location: es ? 'Oficina centro' : 'Downtown Office', allDay: false },
      { title: es ? 'Cena con Maya' : 'Dinner with Maya', begin: ago(-210), location: 'Harbor Grill', allDay: false }
    ]
  };
  try {
    var settings = JSON.parse(localStorage.getItem('civicos.settings') || 'null');
    if (localStorage.getItem('mphdemo.v') !== '1' || !settings) {
      var trips = [];
      for (var d = 0; d < 21; d++) {
        var legs = [[8, rnd(11, 14), rnd(30, 38)], [17.5, rnd(11, 15), rnd(26, 34)]];
        if (d % 3 === 0) legs.push([12.5, rnd(3, 7), rnd(22, 28)]);
        legs.forEach(function (l) {
          var day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - (21 - d));
          var start = Math.floor(day.getTime() / 1000) + Math.round(l[0] * 3600);
          if (start > now - 3600) return;
          var moving = (l[1] / l[2]) * 3600, idle = rnd(60, 300), gallons = l[1] / rnd(31, 39);
          trips.unshift({ start: start, end: start + moving + idle, seconds: moving + idle, miles: l[1], movingSeconds: moving, idleSeconds: idle,
            maxSpeed: rnd(45, 72), avgSpeed: l[2], gallons: gallons, fuelSource: 'fuel level', mpg: l[1] / gallons });
        });
      }
      var segs = [];
      for (var i = 0; i < 120; i++) { var mpg = 33 + 5 * Math.sin(i / 9) + rnd(-2.5, 2.5); segs.push({ mi: 0.25, gal: 0.25 / mpg, t: now - (120 - i) * 40 }); }
      localStorage.setItem('civicos.trips', JSON.stringify(trips.slice(0, 100)));
      localStorage.setItem('civicos.energy', JSON.stringify({ segs: segs, cur: { mi: 0, gal: 0 }, fill: { t: now - 6 * 86400, level: 11.9 }, low: null, level: 9.7, calib: 1,
        fillups: [{ t: now - 6 * 86400, added: 9.8, level: 11.9, price: 3.89 }, { t: now - 15 * 86400, added: 10.1, level: 12.0, price: 3.95 }] }));
      localStorage.setItem('civicos.location', JSON.stringify({ lat: 32.72, lon: -117.16 }));
      settings = {
        obd: { source: 'daemon', daemonHost: DEMO_HOST, honda: true },
        display: { welcome: false },
        nav: { home: '12 Oak Lane', work: 'Downtown Office', favorites: [{ label: 'Gym', address: 'Fit Club' }, { label: 'Coffee', address: 'Bean There' }], split: true },
        profiles: { list: [{ id: 'p1', name: 'Alex' }, { id: 'p2', name: 'Sam' }], active: 'p1' }
      };
      localStorage.setItem('mphdemo.v', '1');
    }
    settings.obd = Object.assign({}, settings.obd, { source: 'daemon', daemonHost: DEMO_HOST }); // always the simulated car, never a real adapter
    if (q.has('lang')) {
      settings.display = Object.assign({}, settings.display, { lang: es ? 'es' : 'en', units: es ? 'kml' : 'us' });
    }
    localStorage.setItem('civicos.settings', JSON.stringify(settings));
  } catch (e) { /* storage blocked: the app runs on defaults */ }
})();

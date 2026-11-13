const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.resolve(__dirname, '../../../client/public/uploads/seed'),
  path.resolve(__dirname, '../../uploads/seed'),
];

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const svgs = {
  'brakes.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_brakes" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="rotor_brakes" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
    <linearGradient id="caliper_brakes" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_brakes)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>
  
  <g transform="translate(300, 195)">
    <!-- Outer Ventilated Disc -->
    <circle cx="0" cy="0" r="120" fill="url(#rotor_brakes)" stroke="#64748b" stroke-width="3"/>
    <circle cx="0" cy="0" r="105" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="8 6"/>
    <circle cx="0" cy="0" r="88" fill="none" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Slotted cooling grooves -->
    <path d="M-70,-15 Q-50,-5 -35,-25" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M35,-60 Q55,-40 70,-20" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M55,35 Q35,55 15,70" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M-35,60 Q-55,40 -65,15" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M-15,-65 Q0,-50 20,-60" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>

    <!-- Cross drilled holes -->
    <circle cx="-60" cy="-50" r="3" fill="#334155"/>
    <circle cx="-50" cy="-65" r="3" fill="#334155"/>
    <circle cx="55" cy="-60" r="3" fill="#334155"/>
    <circle cx="70" cy="-40" r="3" fill="#334155"/>
    <circle cx="65" cy="45" r="3" fill="#334155"/>
    <circle cx="50" cy="65" r="3" fill="#334155"/>
    <circle cx="-55" cy="55" r="3" fill="#334155"/>
    <circle cx="-70" cy="35" r="3" fill="#334155"/>

    <!-- Center Hub Hat -->
    <circle cx="0" cy="0" r="50" fill="#334155" stroke="#1e293b" stroke-width="3"/>
    <circle cx="0" cy="0" r="24" fill="#1e293b"/>
    <circle cx="0" cy="0" r="12" fill="#0f172a"/>

    <!-- 5 Wheel Stud Lug Nuts -->
    <circle cx="0" cy="-34" r="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <circle cx="32" cy="-10" r="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <circle cx="20" cy="28" r="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <circle cx="-20" cy="28" r="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <circle cx="-32" cy="-10" r="5" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>

    <!-- High Performance Red Caliper -->
    <path d="M-125,-105 C-80,-140 -25,-150 40,-135 L35,-75 C5,-85 -45,-80 -80,-55 Z" fill="url(#caliper_brakes)" stroke="#7f1d1d" stroke-width="3"/>
    <rect x="-95" y="-108" width="30" height="20" rx="3" fill="#f8fafc" opacity="0.9"/>
    <text x="-80" y="-94" font-family="Arial, sans-serif" font-size="8" font-weight="900" fill="#991b1b" text-anchor="middle">SPORT</text>
    <circle cx="-108" cy="-88" r="4" fill="#f8fafc"/>
    <circle cx="15" cy="-110" r="4" fill="#f8fafc"/>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Performance Braking System</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">BRAKE ROTORS &bull; CALIPERS &bull; CERAMIC PADS</text>
</svg>`,

  'engine.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_eng" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="metal_eng" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="50%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="turbo_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_eng)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(300, 190)">
    <!-- Engine Block Base -->
    <rect x="-95" y="-55" width="190" height="135" rx="10" fill="url(#metal_eng)" stroke="#0f172a" stroke-width="3"/>
    
    <!-- Cylinder Head / Valve Cover -->
    <rect x="-105" y="-95" width="210" height="42" rx="6" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <rect x="-90" y="-87" width="180" height="10" rx="3" fill="#64748b"/>
    <text x="0" y="-79" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#f8fafc" text-anchor="middle" letter-spacing="4">V6 TWIN TURBO</text>

    <!-- Spark Plug / Coil packs -->
    <circle cx="-60" cy="-62" r="5" fill="#f59e0b"/>
    <circle cx="-20" cy="-62" r="5" fill="#f59e0b"/>
    <circle cx="20" cy="-62" r="5" fill="#f59e0b"/>
    <circle cx="60" cy="-62" r="5" fill="#f59e0b"/>

    <!-- Pulleys & Serpentine Belt -->
    <circle cx="-50" cy="30" r="28" fill="#64748b" stroke="#334155" stroke-width="3"/>
    <circle cx="-50" cy="30" r="10" fill="#0f172a"/>
    <circle cx="45" cy="20" r="22" fill="#64748b" stroke="#334155" stroke-width="3"/>
    <circle cx="45" cy="20" r="8" fill="#0f172a"/>
    <circle cx="0" cy="55" r="18" fill="#64748b" stroke="#334155" stroke-width="3"/>

    <!-- Belt -->
    <path d="M-50,2 L45,-2 L45,42 L0,73 L-50,58 Z" fill="none" stroke="#0f172a" stroke-width="5" stroke-linejoin="round"/>

    <!-- Turbocharger Assembly on Side -->
    <g transform="translate(115, -45)">
      <circle cx="0" cy="0" r="32" fill="url(#turbo_grad)" stroke="#0369a1" stroke-width="3"/>
      <circle cx="0" cy="0" r="20" fill="#f0f9ff" stroke="#0284c7" stroke-width="2"/>
      <!-- Turbine blades -->
      <line x1="-12" y1="-12" x2="12" y2="12" stroke="#0284c7" stroke-width="2"/>
      <line x1="12" y1="-12" x2="-12" y2="12" stroke="#0284c7" stroke-width="2"/>
      <line x1="0" y1="-15" x2="0" y2="15" stroke="#0284c7" stroke-width="2"/>
      <path d="M-15,22 C-5,38 15,38 25,22" fill="none" stroke="#0369a1" stroke-width="3"/>
    </g>

    <!-- Alternator on left -->
    <rect x="-135" y="-10" width="38" height="50" rx="6" fill="#475569" stroke="#1e293b" stroke-width="2"/>
    <line x1="-130" y1="5" x2="-105" y2="5" stroke="#94a3b8" stroke-width="2"/>
    <line x1="-130" y1="15" x2="-105" y2="15" stroke="#94a3b8" stroke-width="2"/>
    <line x1="-130" y1="25" x2="-105" y2="25" stroke="#94a3b8" stroke-width="2"/>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Engine &amp; Drivetrain Components</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">BLOCKS &bull; TURBOCHARGERS &bull; GASKETS &bull; TIMING</text>
</svg>`,

  'suspension.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_susp" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="spring_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="shaft_grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#cbd5e1"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_susp)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(300, 190)">
    <!-- Top Strut Mount Hat -->
    <rect x="-42" y="-140" width="84" height="20" rx="5" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
    <circle cx="-25" cy="-148" r="4" fill="#cbd5e1"/>
    <circle cx="25" cy="-148" r="4" fill="#cbd5e1"/>

    <!-- Damper Piston Rod (Chrome Shaft) -->
    <rect x="-10" y="-120" width="20" height="75" fill="url(#shaft_grad)" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Coil Spring Wrap -->
    <path d="
      M -36,-105 Q 0,-115 36,-105 Q 42,-95 32,-90 Q 0,-100 -32,-90 Q -42,-100 -36,-105
      M -36,-80 Q 0,-90 36,-80 Q 42,-70 32,-65 Q 0,-75 -32,-65 Q -42,-75 -36,-80
      M -36,-55 Q 0,-65 36,-55 Q 42,-45 32,-40 Q 0,-50 -32,-40 Q -42,-50 -36,-55
      M -36,-30 Q 0,-40 36,-30 Q 42,-20 32,-15 Q 0,-25 -32,-15 Q -42,-25 -36,-30
      M -36,-5 Q 0,-15 36,-5 Q 42,5 32,10 Q 0,0 -32,10 Q -42,0 -36,-5
    " fill="url(#spring_grad)" stroke="#1e40af" stroke-width="2"/>

    <!-- Lower Shock Body Cylinder -->
    <rect x="-26" y="10" width="52" height="95" rx="6" fill="#334155" stroke="#1e293b" stroke-width="3"/>
    <rect x="-20" y="30" width="40" height="40" rx="3" fill="#1e293b"/>
    <text x="0" y="54" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#60a5fa" text-anchor="middle">GAS SHOCK</text>

    <!-- Lower Mounting Bushing Eyelet -->
    <circle cx="0" cy="120" r="18" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <circle cx="0" cy="120" r="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <rect x="-10" y="105" width="20" height="15" fill="#334155"/>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Suspension &amp; Steering</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">COILOVERS &bull; STRUTS &bull; BUSHINGS &bull; CONTROL ARMS</text>
</svg>`,

  'filters.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_filt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="oil_filt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_filt)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(300, 190)">
    <!-- Pleated Air Filter Panel (Background angle) -->
    <g transform="translate(60, -30) rotate(15)">
      <rect x="-80" y="-55" width="160" height="110" rx="6" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
      <rect x="-70" y="-45" width="140" height="90" fill="#fde047"/>
      <!-- Pleats lines -->
      <line x1="-55" y1="-45" x2="-55" y2="45" stroke="#a16207" stroke-width="2"/>
      <line x1="-40" y1="-45" x2="-40" y2="45" stroke="#a16207" stroke-width="2"/>
      <line x1="-25" y1="-45" x2="-25" y2="45" stroke="#a16207" stroke-width="2"/>
      <line x1="-10" y1="-45" x2="-10" y2="45" stroke="#a16207" stroke-width="2"/>
      <line x1="5" y1="-45" x2="5" y2="45" stroke="#a16207" stroke-width="2"/>
      <line x1="20" y1="-45" x2="20" y2="45" stroke="#a16207" stroke-width="2"/>
      <line x1="35" y1="-45" x2="35" y2="45" stroke="#a16207" stroke-width="2"/>
      <line x1="50" y1="-45" x2="50" y2="45" stroke="#a16207" stroke-width="2"/>
    </g>

    <!-- Spin-on Canister Oil Filter (Foreground) -->
    <g transform="translate(-60, 10)">
      <!-- Filter Body -->
      <rect x="-50" y="-60" width="100" height="115" rx="12" fill="url(#oil_filt)" stroke="#075985" stroke-width="3"/>
      <!-- Rubber O-ring Gasket Base -->
      <rect x="-44" y="55" width="88" height="14" rx="4" fill="#0f172a" stroke="#334155" stroke-width="2"/>
      <!-- Thread Plate -->
      <circle cx="0" cy="62" r="12" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <circle cx="0" cy="62" r="6" fill="#0f172a"/>

      <!-- Label -->
      <rect x="-42" y="-30" width="84" height="60" rx="4" fill="#ffffff" opacity="0.95"/>
      <text x="0" y="-12" font-family="Arial, sans-serif" font-size="10" font-weight="900" fill="#0369a1" text-anchor="middle">HIGH FLOW</text>
      <text x="0" y="4" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#334155" text-anchor="middle">SYNTHETIC</text>
      <text x="0" y="20" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#b91c1c" text-anchor="middle">OIL FILTER</text>
      <!-- Top grip flutes -->
      <line x1="-35" y1="-50" x2="-35" y2="-40" stroke="#bae6fd" stroke-width="2"/>
      <line x1="-15" y1="-50" x2="-15" y2="-40" stroke="#bae6fd" stroke-width="2"/>
      <line x1="15" y1="-50" x2="15" y2="-40" stroke="#bae6fd" stroke-width="2"/>
      <line x1="35" y1="-50" x2="35" y2="-40" stroke="#bae6fd" stroke-width="2"/>
    </g>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Filtration Systems</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">OIL &bull; ENGINE AIR &bull; CABIN &bull; FUEL FILTERS</text>
</svg>`,

  'electrical.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_elec" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="batt_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_elec)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(260, 190)">
    <!-- 12V Battery -->
    <!-- Case -->
    <rect x="-110" y="-45" width="170" height="120" rx="8" fill="url(#batt_grad)" stroke="#020617" stroke-width="3"/>
    <!-- Top Cover -->
    <rect x="-116" y="-60" width="182" height="18" rx="4" fill="#334155" stroke="#1e293b" stroke-width="2"/>
    <!-- Positive Terminal (+) Red -->
    <rect x="-85" y="-76" width="22" height="16" rx="3" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
    <text x="-74" y="-63" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">+</text>
    <!-- Negative Terminal (-) Black -->
    <rect x="15" y="-76" width="22" height="16" rx="3" fill="#475569" stroke="#1e293b" stroke-width="2"/>
    <text x="26" y="-64" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">&minus;</text>

    <!-- Battery Front Label -->
    <rect x="-95" y="-25" width="140" height="85" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="-25" y="-3" font-family="Arial, sans-serif" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle">AGM 12V 80Ah</text>
    <text x="-25" y="14" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#dc2626" text-anchor="middle">800 CCA HIGH CRANK</text>
    <!-- Lightning Bolt Icon -->
    <path d="M-28,24 L-20,24 L-24,38 L-14,38 L-30,54 L-26,42 L-32,42 Z" fill="#eab308"/>

    <!-- Spark Plug on Right -->
    <g transform="translate(110, -5) rotate(25)">
      <!-- Ceramic insulator -->
      <rect x="-8" y="-70" width="16" height="50" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
      <line x1="-8" y1="-55" x2="8" y2="-55" stroke="#cbd5e1" stroke-width="2"/>
      <line x1="-8" y1="-40" x2="8" y2="-40" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Hex nut -->
      <polygon points="-12,-20 12,-20 14,-5 -14,-5" fill="#64748b" stroke="#334155" stroke-width="2"/>
      <!-- Threaded barrel -->
      <rect x="-9" y="-5" width="18" height="40" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>
      <line x1="-9" y1="5" x2="9" y2="5" stroke="#475569" stroke-width="1.5"/>
      <line x1="-9" y1="15" x2="9" y2="15" stroke="#475569" stroke-width="1.5"/>
      <line x1="-9" y1="25" x2="9" y2="25" stroke="#475569" stroke-width="1.5"/>
      <!-- Electrode Tip -->
      <rect x="-2" y="35" width="4" height="15" fill="#1e293b"/>
      <path d="M-6,50 L-6,44 L-2,44" fill="none" stroke="#1e293b" stroke-width="2"/>
    </g>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Electrical &amp; Ignition</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">BATTERIES &bull; SPARK PLUGS &bull; ALTERNATORS &bull; STARTERS</text>
</svg>`,

  'lights.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_lights" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="beam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="lens" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0f2fe"/>
      <stop offset="50%" stop-color="#7dd3fc"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_lights)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(280, 190)">
    <!-- Light Beam Effect -->
    <polygon points="40,-35 220,-85 220,60 40,35" fill="url(#beam)"/>

    <!-- Headlight Housing -->
    <path d="M-130,-45 C-70,-75 20,-60 65,-25 C85,-5 85,25 65,45 C20,70 -70,60 -130,40 Z" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
    <!-- Clear Polycarbonate Lens Outline -->
    <path d="M-115,-35 C-60,-65 20,-50 55,-20 C70,-5 70,20 55,35 C20,58 -60,50 -115,30 Z" fill="#f0f9ff" opacity="0.35" stroke="#38bdf8" stroke-width="2"/>

    <!-- Dual Projector Lenses -->
    <circle cx="20" cy="0" r="28" fill="url(#lens)" stroke="#0369a1" stroke-width="2.5"/>
    <circle cx="20" cy="0" r="14" fill="#ffffff" opacity="0.8"/>
    <!-- Halo Ring (Angel Eye DRL) -->
    <circle cx="20" cy="0" r="33" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.9"/>

    <!-- Secondary Projector / Turn Signal -->
    <circle cx="-45" cy="0" r="22" fill="#0f172a" stroke="#ca8a04" stroke-width="2"/>
    <circle cx="-45" cy="0" r="14" fill="#eab308"/>

    <!-- LED Strip Line (DRL Eyebrow) -->
    <path d="M-100,-25 Q-30,-45 45,-25" fill="none" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Lighting &amp; Headlamp Assemblies</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">LED HEADLIGHTS &bull; TAIL LIGHTS &bull; FOG LAMPS &bull; BULBS</text>
</svg>`,

  'body.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_body" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="body_paint" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="50%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_body)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(300, 200)">
    <!-- Aerodynamic Car Silhouette -->
    <!-- Car Body Shell -->
    <path d="
      M -180,35
      C -180,20 -160,-5 -125,-15
      C -95,-22 -70,-55 -30,-65
      C 15,-75 80,-70 120,-45
      C 150,-25 170,-10 185,15
      C 192,28 190,40 175,40
      L 145,40
      C 140,15 105,15 100,40
      L -80,40
      C -85,15 -120,15 -125,40
      L -175,40
      Z
    " fill="url(#body_paint)" stroke="#172554" stroke-width="3"/>

    <!-- Cabin Glass / Windows -->
    <path d="
      M -65,-22
      C -45,-50 -20,-58 20,-58
      C 60,-58 100,-42 115,-22
      Z
    " fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
    <line x1="20" y1="-58" x2="20" y2="-22" stroke="#3b82f6" stroke-width="3"/>

    <!-- Front & Rear Wheels -->
    <g transform="translate(-102, 40)">
      <circle cx="0" cy="0" r="26" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
      <circle cx="0" cy="0" r="16" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <circle cx="0" cy="0" r="6" fill="#1e293b"/>
    </g>
    <g transform="translate(122, 40)">
      <circle cx="0" cy="0" r="26" fill="#1e293b" stroke="#0f172a" stroke-width="3"/>
      <circle cx="0" cy="0" r="16" fill="#94a3b8" stroke="#475569" stroke-width="2"/>
      <circle cx="0" cy="0" r="6" fill="#1e293b"/>
    </g>

    <!-- Side Character Line & Mirror -->
    <path d="M-130,-5 Q-20,-10 140,-5" fill="none" stroke="#60a5fa" stroke-width="2"/>
    <rect x="-35" y="-28" width="18" height="8" rx="4" fill="#1e293b"/>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Body Panels &amp; Exterior Trims</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">BUMPERS &bull; FENDERS &bull; HOODS &bull; MIRRORS &bull; GRILLES</text>
</svg>`,

  'tyres-wheels.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_tyre" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="rim_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_tyre)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(300, 190)">
    <!-- Outer Rubber Tyre -->
    <circle cx="0" cy="0" r="125" fill="#1e293b" stroke="#0f172a" stroke-width="4"/>
    <!-- Tyre Tread Grooves on edge -->
    <circle cx="0" cy="0" r="116" fill="none" stroke="#0f172a" stroke-width="4" stroke-dasharray="14 10"/>
    <circle cx="0" cy="0" r="102" fill="none" stroke="#334155" stroke-width="2"/>
    <text x="0" y="-106" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#64748b" text-anchor="middle" letter-spacing="3">245/45 R19 98Y</text>

    <!-- Alloy Wheel Rim -->
    <circle cx="0" cy="0" r="82" fill="url(#rim_grad)" stroke="#475569" stroke-width="3"/>
    <circle cx="0" cy="0" r="70" fill="#0f172a"/>

    <!-- 5 Split-Spoke Design -->
    <g stroke="url(#rim_grad)" stroke-width="12" stroke-linecap="round">
      <line x1="0" y1="-20" x2="0" y2="-68"/>
      <line x1="19" y1="-6" x2="65" y2="-21"/>
      <line x1="12" y1="16" x2="40" y2="55"/>
      <line x1="-12" y1="16" x2="-40" y2="55"/>
      <line x1="-19" y1="-6" x2="-65" y2="-21"/>
    </g>

    <!-- Center Cap & Studs -->
    <circle cx="0" cy="0" r="22" fill="#1e293b" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="0" cy="0" r="12" fill="#ef4444"/>
    <!-- 5 Lug Nuts -->
    <circle cx="0" cy="-14" r="3" fill="#ffffff"/>
    <circle cx="13" cy="-4" r="3" fill="#ffffff"/>
    <circle cx="8" cy="11" r="3" fill="#ffffff"/>
    <circle cx="-8" cy="11" r="3" fill="#ffffff"/>
    <circle cx="-13" cy="-4" r="3" fill="#ffffff"/>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Tyres &amp; Alloy Wheels</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">HIGH PERFORMANCE RADIALS &bull; SPORT ALLOY RIMS</text>
</svg>`,

  'oils-fluids.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_oil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="bottle_grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#047857"/>
      <stop offset="50%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#065f46"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_oil)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(300, 190)">
    <!-- Motor Oil Bottle Jug -->
    <!-- Handle Cutout & Body -->
    <path d="
      M -70,-80
      L -25,-80
      L -20,-115
      L 15,-115
      L 15,-80
      L 50,-60
      C 65,-45 75,-20 75,20
      L 75,100
      L -75,100
      L -75,-60
      Z
    " fill="url(#bottle_grad)" stroke="#064e3b" stroke-width="3"/>

    <!-- Handle Hole -->
    <path d="
      M -55,-40
      L -35,-40
      L -35,20
      L -55,20
      Z
    " fill="#f8fafc" stroke="#064e3b" stroke-width="2"/>

    <!-- Bottle Cap -->
    <rect x="-24" y="-130" width="44" height="18" rx="4" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>

    <!-- Translucent Sight Level Gauge on Side -->
    <rect x="60" y="-20" width="8" height="110" rx="3" fill="#fef08a" opacity="0.8"/>

    <!-- Label Shield -->
    <rect x="-25" y="-30" width="75" height="105" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Golden Droplet -->
    <path d="M12,-15 C12,-15 2,-2 2,8 C2,14 6,18 12,18 C18,18 22,14 22,8 C22,-2 12,-15 12,-15 Z" fill="#f59e0b"/>
    <text x="12" y="38" font-family="Arial, sans-serif" font-size="13" font-weight="900" fill="#0f172a" text-anchor="middle">5W-30</text>
    <text x="12" y="52" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#059669" text-anchor="middle">100% SYNTHETIC</text>
    <text x="12" y="64" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#64748b" text-anchor="middle">MOTOR OIL &bull; 4L</text>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Oils, Lubricants &amp; Fluids</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">SYNTHETIC MOTOR OILS &bull; BRAKE FLUID &bull; COOLANT &bull; ATF</text>
</svg>`,

  'default-part.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_def" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="16" fill="url(#bg_def)"/>
  <rect x="20" y="20" width="560" height="410" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/>

  <g transform="translate(300, 190)">
    <!-- Wrench & Gear -->
    <circle cx="0" cy="0" r="60" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/>
    <circle cx="0" cy="0" r="28" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
    <!-- Gear teeth -->
    <rect x="-8" y="-70" width="16" height="15" fill="#94a3b8"/>
    <rect x="-8" y="55" width="16" height="15" fill="#94a3b8"/>
    <rect x="-70" y="-8" width="15" height="16" fill="#94a3b8"/>
    <rect x="55" y="-8" width="15" height="16" fill="#94a3b8"/>
  </g>

  <text x="300" y="365" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">Genuine Auto Spare Part</text>
  <text x="300" y="388" font-family="Arial, sans-serif" font-size="11" letter-spacing="1.5" fill="#64748b" text-anchor="middle">CERTIFIED OEM REPLACEMENT</text>
</svg>`
};

for (const [filename, rawContent] of Object.entries(svgs)) {
  const content = rawContent
    .replace(/&bull;/g, '&#8226;')
    .replace(/&minus;/g, '&#8722;');

  for (const dir of targetDirs) {
    fs.writeFileSync(path.join(dir, filename), content.trim(), 'utf8');
  }
}

console.log('Successfully wrote', Object.keys(svgs).length, 'SVGs to target dirs.');


// High-fidelity SVG artwork for all 6 aliens and their Ultimate forms

export interface AlienArtData {
  normalSvg: string;
  ultimateSvg: string;
}

export const ALIEN_ART: Record<string, AlienArtData> = {
  swampfire: {
    normalSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="swamp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00ff66" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#00ff66" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="fire-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#ff3300"/>
          <stop offset="50%" stop-color="#ffaa00"/>
          <stop offset="100%" stop-color="#ffee00"/>
        </linearGradient>
        <linearGradient id="vine-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a7a3e"/>
          <stop offset="100%" stop-color="#144d24"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#swamp-glow)"/>
      <!-- Torso & Vines -->
      <path d="M160,260 Q130,340 150,440 L185,440 L195,330 L205,330 L215,440 L250,440 Q270,340 240,260 Z" fill="url(#vine-grad)" stroke="#00ff66" stroke-width="3"/>
      <!-- Chest Core -->
      <path d="M175,230 L225,230 L235,280 L200,310 L165,280 Z" fill="#ffaa00" stroke="#ff3300" stroke-width="4"/>
      <circle cx="200" cy="270" r="16" fill="#ffee00"/>
      <!-- Shoulders & Arms with Thorns -->
      <path d="M160,230 Q110,250 90,320 Q80,360 70,410 L100,420 Q120,350 145,280 L165,270 Z" fill="url(#vine-grad)" stroke="#00ff66" stroke-width="3"/>
      <path d="M240,230 Q290,250 310,320 Q320,360 330,410 L300,420 Q280,350 255,280 L235,270 Z" fill="url(#vine-grad)" stroke="#00ff66" stroke-width="3"/>
      <!-- Fire Palms -->
      <circle cx="85" cy="415" r="22" fill="url(#fire-grad)"/>
      <circle cx="315" cy="415" r="22" fill="url(#fire-grad)"/>
      <!-- Flame Crown Head -->
      <path d="M175,200 Q150,150 160,110 Q175,140 185,90 Q195,130 200,70 Q205,130 215,90 Q225,140 240,110 Q250,150 225,200 Z" fill="url(#fire-grad)" stroke="#ff3300" stroke-width="3"/>
      <!-- Face Mask & Eyes -->
      <path d="M180,185 L220,185 L215,215 L200,225 L185,215 Z" fill="#144d24" stroke="#00ff66" stroke-width="2"/>
      <polygon points="186,195 195,195 192,205" fill="#ffee00"/>
      <polygon points="214,195 205,195 208,205" fill="#ffee00"/>
    </svg>`,
    ultimateSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ult-swamp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0055ff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#0055ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="blue-plasma" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#002288"/>
          <stop offset="50%" stop-color="#0088ff"/>
          <stop offset="100%" stop-color="#aae5ff"/>
        </linearGradient>
        <linearGradient id="timber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4a3828"/>
          <stop offset="100%" stop-color="#241a12"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#ult-swamp-glow)"/>
      <!-- Armored Timber Body -->
      <path d="M140,230 L260,230 L250,330 L270,450 L220,450 L200,350 L180,450 L130,450 L150,330 Z" fill="url(#timber-grad)" stroke="#00aaff" stroke-width="4"/>
      <!-- Bio-Napalm Pods -->
      <circle cx="120" cy="250" r="32" fill="#0055ff" stroke="#aae5ff" stroke-width="4"/>
      <circle cx="280" cy="250" r="32" fill="#0055ff" stroke="#aae5ff" stroke-width="4"/>
      <circle cx="120" cy="250" r="18" fill="url(#blue-plasma)"/>
      <circle cx="280" cy="250" r="18" fill="url(#blue-plasma)"/>
      <!-- Heavy Timber Mask & Blue Horns -->
      <path d="M165,190 L235,190 L225,120 L200,100 L175,120 Z" fill="url(#timber-grad)" stroke="#0088ff" stroke-width="3"/>
      <!-- Blue Plasma Head Crest -->
      <path d="M175,110 Q160,60 170,30 Q185,70 200,20 Q215,70 230,30 Q240,60 225,110 Z" fill="url(#blue-plasma)" stroke="#aae5ff" stroke-width="3"/>
      <!-- Glowing Blue Eyes -->
      <circle cx="188" cy="155" r="8" fill="#aae5ff"/>
      <circle cx="212" cy="155" r="8" fill="#aae5ff"/>
    </svg>`
  },
  humungousaur: {
    normalSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hum-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00ff66" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#00ff66" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="dino-skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a66a38"/>
          <stop offset="100%" stop-color="#5c3818"/>
        </linearGradient>
        <linearGradient id="dino-belly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#d49b65"/>
          <stop offset="100%" stop-color="#99602e"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#hum-glow)"/>
      <!-- Massive Dino Tail -->
      <path d="M220,380 Q320,390 360,330 Q330,440 200,430 Z" fill="url(#dino-skin)" stroke="#2d1908" stroke-width="3"/>
      <!-- Huge Muscular Legs -->
      <path d="M120,330 L160,330 L170,450 L110,450 Z" fill="url(#dino-skin)" stroke="#2d1908" stroke-width="4"/>
      <path d="M240,330 L280,330 L290,450 L230,450 Z" fill="url(#dino-skin)" stroke="#2d1908" stroke-width="4"/>
      <!-- Colossal Torso & Chest Plates -->
      <path d="M110,180 Q200,160 290,180 Q310,280 270,350 L130,350 Q90,280 110,180 Z" fill="url(#dino-skin)" stroke="#2d1908" stroke-width="4"/>
      <path d="M150,195 Q200,185 250,195 L240,320 L160,320 Z" fill="url(#dino-belly)" stroke="#7a461b" stroke-width="3"/>
      <!-- Bicep Arms -->
      <path d="M110,190 Q50,220 50,300 Q60,360 85,390 L115,370 Q95,300 130,240 Z" fill="url(#dino-skin)" stroke="#2d1908" stroke-width="4"/>
      <path d="M290,190 Q350,220 350,300 Q340,360 315,390 L285,370 Q305,300 270,240 Z" fill="url(#dino-skin)" stroke="#2d1908" stroke-width="4"/>
      <!-- Horned Dino Head -->
      <path d="M160,150 Q130,90 145,50 Q170,70 200,60 Q230,70 255,50 Q270,90 240,150 Z" fill="url(#dino-skin)" stroke="#2d1908" stroke-width="4"/>
      <!-- Brow Horns & Snout -->
      <polygon points="140,55 125,20 160,40" fill="#2d1908"/>
      <polygon points="260,55 275,20 240,40" fill="#2d1908"/>
      <!-- Glowing Green Eyes -->
      <ellipse cx="178" cy="95" rx="7" ry="10" fill="#00ff66"/>
      <ellipse cx="222" cy="95" rx="7" ry="10" fill="#00ff66"/>
    </svg>`,
    ultimateSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ult-hum-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff1122" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#ff1122" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="ult-dino-skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2d5930"/>
          <stop offset="100%" stop-color="#142e17"/>
        </linearGradient>
        <linearGradient id="ult-carapace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4d8c52"/>
          <stop offset="100%" stop-color="#264729"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#ult-hum-glow)"/>
      <!-- Spiked Mace Tail -->
      <path d="M220,380 Q320,380 370,300 L380,315" stroke="#142e17" stroke-width="12"/>
      <circle cx="370" cy="300" r="28" fill="#142e17" stroke="#ff1122" stroke-width="4"/>
      <polygon points="370,265 375,245 385,270" fill="#999"/>
      <polygon points="400,300 420,305 395,315" fill="#999"/>
      <!-- Armored Dino Body -->
      <path d="M100,170 Q200,140 300,170 L280,350 L120,350 Z" fill="url(#ult-dino-skin)" stroke="#0d1f10" stroke-width="5"/>
      <!-- Spiked Shell Carapace -->
      <path d="M130,175 L270,175 L260,330 L140,330 Z" fill="url(#ult-carapace)" stroke="#ff1122" stroke-width="3"/>
      <!-- Bio-Gatling Missile Barrels (Hands) -->
      <rect x="40" y="320" width="45" height="70" rx="10" fill="#222" stroke="#ff1122" stroke-width="3"/>
      <circle cx="50" cy="390" r="5" fill="#ff1122"/>
      <circle cx="62" cy="390" r="5" fill="#ff1122"/>
      <circle cx="75" cy="390" r="5" fill="#ff1122"/>
      <rect x="315" y="320" width="45" height="70" rx="10" fill="#222" stroke="#ff1122" stroke-width="3"/>
      <circle cx="325" cy="390" r="5" fill="#ff1122"/>
      <circle cx="337" cy="390" r="5" fill="#ff1122"/>
      <circle cx="350" cy="390" r="5" fill="#ff1122"/>
      <!-- Armored Helmet Skull -->
      <path d="M150,130 Q120,70 140,30 Q170,50 200,45 Q230,50 260,30 Q280,70 250,130 Z" fill="#1a3d1e" stroke="#ff1122" stroke-width="4"/>
      <polygon points="135,35 110,5 155,25" fill="#333"/>
      <polygon points="265,35 290,5 245,25" fill="#333"/>
      <!-- Glowing Red Eyes -->
      <ellipse cx="178" cy="80" rx="8" ry="12" fill="#ff1122"/>
      <ellipse cx="222" cy="80" rx="8" ry="12" fill="#ff1122"/>
    </svg>`
  },
  'echo-echo': {
    normalSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="echo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00ff66" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#00ff66" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="echo-white" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#d6deda"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#echo-glow)"/>
      <!-- Compact Silicon Body -->
      <path d="M155,220 L245,220 L240,340 L260,450 L215,450 L200,360 L185,450 L140,450 L160,340 Z" fill="url(#echo-white)" stroke="#1a2e22" stroke-width="4"/>
      <!-- Silicon Sound Headphones (Ears) -->
      <circle cx="120" cy="140" r="32" fill="#111" stroke="#00ff66" stroke-width="4"/>
      <circle cx="120" cy="140" r="18" fill="#00ff66"/>
      <circle cx="280" cy="140" r="32" fill="#111" stroke="#00ff66" stroke-width="4"/>
      <circle cx="280" cy="140" r="18" fill="#00ff66"/>
      <!-- Round Head -->
      <circle cx="200" cy="140" r="60" fill="url(#echo-white)" stroke="#1a2e22" stroke-width="4"/>
      <!-- Sonic Mouth Speaker -->
      <path d="M170,165 Q200,195 230,165 Z" fill="#111" stroke="#00ff66" stroke-width="3"/>
      <!-- Big Silicon Eyes -->
      <ellipse cx="180" cy="130" rx="12" ry="18" fill="#00ff66"/>
      <ellipse cx="220" cy="130" rx="12" ry="18" fill="#00ff66"/>
      <!-- Soundwave stripes -->
      <line x1="175" y1="260" x2="225" y2="260" stroke="#00ff66" stroke-width="4"/>
      <line x1="180" y1="280" x2="220" y2="280" stroke="#00ff66" stroke-width="4"/>
    </svg>`,
    ultimateSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ult-echo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1a75ff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#1a75ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="ult-echo-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2678f2"/>
          <stop offset="100%" stop-color="#103c80"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#ult-echo-glow)"/>
      <!-- Detached Levitating Sonic Doom Discs -->
      <g>
        <circle cx="80" cy="120" r="26" fill="#111" stroke="#38a5ff" stroke-width="4"/>
        <circle cx="80" cy="120" r="14" fill="#38a5ff"/>
        <circle cx="320" cy="120" r="26" fill="#111" stroke="#38a5ff" stroke-width="4"/>
        <circle cx="320" cy="120" r="14" fill="#38a5ff"/>
        <circle cx="65" cy="260" r="28" fill="#111" stroke="#38a5ff" stroke-width="4"/>
        <circle cx="65" cy="260" r="16" fill="#38a5ff"/>
        <circle cx="335" cy="260" r="28" fill="#111" stroke="#38a5ff" stroke-width="4"/>
        <circle cx="335" cy="260" r="16" fill="#38a5ff"/>
      </g>
      <!-- Armored Metallic Body -->
      <path d="M145,200 L255,200 L245,340 L270,450 L220,450 L200,360 L180,450 L130,450 L155,340 Z" fill="url(#ult-echo-blue)" stroke="#38a5ff" stroke-width="4"/>
      <!-- Armored Mask -->
      <path d="M150,110 L250,110 L240,180 L200,200 L160,180 Z" fill="url(#ult-echo-blue)" stroke="#38a5ff" stroke-width="4"/>
      <!-- Glowing Blue Sonic Visor Eyes -->
      <ellipse cx="180" cy="145" rx="14" ry="10" fill="#aae5ff"/>
      <ellipse cx="220" cy="145" rx="14" ry="10" fill="#aae5ff"/>
    </svg>`
  },
  'big-chill': {
    normalSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="chill-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="chill-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00c8e6"/>
          <stop offset="100%" stop-color="#054b73"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#chill-glow)"/>
      <!-- Huge Folded Moth Wings / Cloak -->
      <path d="M200,140 Q60,160 40,320 Q90,440 200,450 Q310,440 360,320 Q340,160 200,140 Z" fill="url(#chill-blue)" stroke="#00e5ff" stroke-width="4"/>
      <!-- Spectral Slender Legs -->
      <line x1="180" y1="410" x2="175" y2="470" stroke="#00e5ff" stroke-width="4"/>
      <line x1="220" y1="410" x2="225" y2="470" stroke="#00e5ff" stroke-width="4"/>
      <!-- Hooded Ghost Head -->
      <path d="M160,120 Q200,60 240,120 Q250,180 200,200 Q150,180 160,120 Z" fill="#04273b" stroke="#00e5ff" stroke-width="4"/>
      <!-- Long Antennae -->
      <path d="M185,75 Q160,30 140,20" stroke="#00e5ff" stroke-width="4" fill="none"/>
      <path d="M215,75 Q240,30 260,20" stroke="#00e5ff" stroke-width="4" fill="none"/>
      <!-- Glowing Spectral Green Eyes -->
      <ellipse cx="180" cy="135" rx="12" ry="22" fill="#00ff66"/>
      <ellipse cx="220" cy="135" rx="12" ry="22" fill="#00ff66"/>
    </svg>`,
    ultimateSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ult-chill-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ff2200" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#ff2200" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="flame-frost" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff4500"/>
          <stop offset="50%" stop-color="#990000"/>
          <stop offset="100%" stop-color="#400000"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#ult-chill-glow)"/>
      <!-- Burning Flame Cloak Wings -->
      <path d="M200,130 Q50,150 30,320 Q80,450 200,460 Q320,450 370,320 Q350,150 200,130 Z" fill="url(#flame-frost)" stroke="#ff4500" stroke-width="5"/>
      <!-- Fire flame wing patterns -->
      <path d="M120,240 Q70,340 130,420" stroke="#ffaa00" stroke-width="4" fill="none"/>
      <path d="M280,240 Q330,340 270,420" stroke="#ffaa00" stroke-width="4" fill="none"/>
      <!-- Crimson Mask -->
      <path d="M160,110 Q200,50 240,110 Q250,170 200,190 Q150,170 160,110 Z" fill="#260000" stroke="#ff2200" stroke-width="4"/>
      <!-- Flaming Antennae -->
      <path d="M185,65 Q150,20 130,10" stroke="#ff4500" stroke-width="5" fill="none"/>
      <path d="M215,65 Q250,20 270,10" stroke="#ff4500" stroke-width="5" fill="none"/>
      <!-- Glowing Yellow Ice-Fire Eyes -->
      <ellipse cx="180" cy="125" rx="12" ry="20" fill="#ffee00"/>
      <ellipse cx="220" cy="125" rx="12" ry="20" fill="#ffee00"/>
    </svg>`
  },
  cannonbolt: {
    normalSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bolt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00ff66" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#00ff66" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bolt-armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f5e6b5"/>
          <stop offset="100%" stop-color="#c4ab66"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#bolt-glow)"/>
      <!-- Giant Spherical Armored Body -->
      <circle cx="200" cy="260" r="130" fill="#ffffff" stroke="#111" stroke-width="5"/>
      <!-- Yellow Armored Shell Plates -->
      <path d="M100,170 Q200,100 300,170 Q340,280 290,360 Q200,400 110,360 Q60,280 100,170 Z" fill="url(#bolt-armor)" stroke="#111" stroke-width="4"/>
      <!-- Thick Stumpy Feet -->
      <rect x="130" y="380" width="45" height="50" rx="12" fill="#111"/>
      <rect x="225" y="380" width="45" height="50" rx="12" fill="#111"/>
      <!-- Black & White Stripe Core -->
      <rect x="180" y="160" width="40" height="150" fill="#111"/>
      <!-- Head & Glowing Green Eyes -->
      <circle cx="200" cy="150" r="32" fill="#ffffff" stroke="#111" stroke-width="3"/>
      <circle cx="188" cy="148" r="7" fill="#00ff66"/>
      <circle cx="212" cy="148" r="7" fill="#00ff66"/>
    </svg>`,
    ultimateSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ult-bolt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#9aa0a6" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#9aa0a6" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="steel-armor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d4dadf"/>
          <stop offset="50%" stop-color="#80868b"/>
          <stop offset="100%" stop-color="#3c4043"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#ult-bolt-glow)"/>
      <!-- Spiked Metallic Gunmetal Armor -->
      <circle cx="200" cy="260" r="130" fill="url(#steel-armor)" stroke="#111" stroke-width="5"/>
      <!-- Heavy Triangular Spikes -->
      <polygon points="200,90 180,140 220,140" fill="#202124" stroke="#e8eaed" stroke-width="3"/>
      <polygon points="90,190 140,210 130,170" fill="#202124" stroke="#e8eaed" stroke-width="3"/>
      <polygon points="310,190 270,170 260,210" fill="#202124" stroke="#e8eaed" stroke-width="3"/>
      <polygon points="70,300 130,300 120,260" fill="#202124" stroke="#e8eaed" stroke-width="3"/>
      <polygon points="330,300 280,260 270,300" fill="#202124" stroke="#e8eaed" stroke-width="3"/>
      <!-- Heavy Rivets -->
      <circle cx="160" cy="220" r="6" fill="#333"/>
      <circle cx="240" cy="220" r="6" fill="#333"/>
      <!-- Metallic Visor Eyes -->
      <ellipse cx="186" cy="165" rx="8" ry="12" fill="#00e5ff"/>
      <ellipse cx="214" cy="165" rx="8" ry="12" fill="#00e5ff"/>
    </svg>`
  },
  spidermonkey: {
    normalSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spider-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#00ff66" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#00ff66" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="monkey-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3d6ee0"/>
          <stop offset="100%" stop-color="#183680"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#spider-glow)"/>
      <!-- Prehensile Tail with Web Nozzle -->
      <path d="M210,340 Q320,380 340,250 Q350,170 290,160" stroke="#183680" stroke-width="14" fill="none"/>
      <!-- 4 Acrobatic Arms -->
      <path d="M150,220 Q80,180 60,110" stroke="#3d6ee0" stroke-width="12" fill="none"/>
      <path d="M250,220 Q320,180 340,110" stroke="#3d6ee0" stroke-width="12" fill="none"/>
      <path d="M140,250 Q70,270 50,330" stroke="#3d6ee0" stroke-width="12" fill="none"/>
      <path d="M260,250 Q330,270 350,330" stroke="#3d6ee0" stroke-width="12" fill="none"/>
      <!-- Monkey Torso -->
      <ellipse cx="200" cy="260" rx="55" ry="75" fill="url(#monkey-blue)" stroke="#111" stroke-width="4"/>
      <!-- Head with 4 Eyes -->
      <circle cx="200" cy="150" r="45" fill="url(#monkey-blue)" stroke="#111" stroke-width="4"/>
      <!-- 4 Glowing Green Eyes -->
      <circle cx="185" cy="135" rx="7" fill="#00ff66"/>
      <circle cx="215" cy="135" rx="7" fill="#00ff66"/>
      <circle cx="190" cy="155" rx="5" fill="#00ff66"/>
      <circle cx="210" cy="155" rx="5" fill="#00ff66"/>
    </svg>`,
    ultimateSvg: `<svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ult-spider-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#aa00ff" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#aa00ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="gorilla-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7a24b3"/>
          <stop offset="100%" stop-color="#360854"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="250" r="180" fill="url(#ult-spider-glow)"/>
      <!-- 4 Giant Steel-Tipped Arachnid Spider Legs -->
      <path d="M140,220 Q50,110 30,50 L45,130" stroke="#360854" stroke-width="14" fill="none"/>
      <path d="M260,220 Q350,110 370,50 L355,130" stroke="#360854" stroke-width="14" fill="none"/>
      <path d="M130,280 Q30,290 20,440" stroke="#360854" stroke-width="14" fill="none"/>
      <path d="M270,280 Q370,290 380,440" stroke="#360854" stroke-width="14" fill="none"/>
      <!-- Colossal Gorilla Torso -->
      <path d="M120,180 Q200,150 280,180 L260,340 L140,340 Z" fill="url(#gorilla-purple)" stroke="#ff1122" stroke-width="4"/>
      <!-- Gorilla Chest Plate -->
      <ellipse cx="200" cy="240" rx="45" ry="35" fill="#4d1473"/>
      <!-- Monstrous Head with Mandible Fangs -->
      <circle cx="200" cy="130" r="48" fill="url(#gorilla-purple)" stroke="#ff1122" stroke-width="4"/>
      <!-- Fangs -->
      <polygon points="175,155 165,185 185,160" fill="#fff"/>
      <polygon points="225,155 235,185 215,160" fill="#fff"/>
      <!-- 4 Glowing Crimson Eyes -->
      <circle cx="185" cy="115" r="8" fill="#ff1122"/>
      <circle cx="215" cy="115" r="8" fill="#ff1122"/>
      <circle cx="190" cy="135" r="6" fill="#ff1122"/>
      <circle cx="210" cy="135" r="6" fill="#ff1122"/>
    </svg>`
  }
};

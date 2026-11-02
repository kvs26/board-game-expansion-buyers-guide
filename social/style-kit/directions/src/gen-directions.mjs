#!/usr/bin/env node
// THROWAWAY prototype for ticket 07: emits 6 style directions x (pin hero, IG cover, IG info) as HTML.
// Render with: cd .agents/skills/social-studio && node render.mjs <BATCH>
// Sample copy only (Catan expansions). Real batches fact-check every claim.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BATCH = path.resolve(process.argv[2]);
const SIZES = { pin: [1000, 1500], ig: [1080, 1440] };

const COPY = {
  hero: ['Which Catan', 'expansion', 'should you buy first?'],
  infoTitle: 'Seafarers or Cities & Knights?',
  rows: [
    ['Seafarers', 'Ships, islands and new scenario maps. Buy it if base Catan feels too small.'],
    ['Cities & Knights', 'Barbarian raids, commodities and a longer game. Buy it once you know base Catan well.'],
    ['Skip both if', 'your group still argues about the base-game robber rules.'],
  ],
  site: 'whichexpansion.com',
  tag: 'Board game expansion buyer\u2019s guide',
};

const hex = (c, x, y, s, extra = '') =>
  `<i class="hx" style="left:${x}px;top:${y}px;width:${s}px;height:${Math.round(s * 0.866)}px;background:${c};${extra}"></i>`;

const meeple = (fill, stroke = '#1B1340', cls = '') =>
  `<svg class="mp ${cls}" viewBox="0 0 100 100"><path d="M50 6C60 6 66 13 66 21c0 6-3 10-7 13 11 2 22 5 34 3 4 0 5 5 2 8-7 6-15 9-23 10 4 10 10 22 18 32 2 4 0 7-5 7H60c-5 0-8-5-10-12-2 7-5 12-10 12H15c-5 0-7-3-5-7 8-10 14-22 18-32-8-1-16-4-23-10-3-3-2-8 2-8 12 2 23-1 34-3-4-3-7-7-7-13C34 13 40 6 50 6Z" fill="${fill}" stroke="${stroke}" stroke-width="5" stroke-linejoin="round"/></svg>`;

const D = {};

/* ---------- A  BOX LID: 1960s game-box lid, screenprint ---------- */
D.a = {
  name: 'Box Lid',
  fonts: 'family=Alfa+Slab+One&family=Archivo:wght@500;800',
  check: ['40px "Alfa Slab One"', '800 30px Archivo'],
  css: `
body{background:#0F4C5C;font-family:Archivo,sans-serif;color:#F6EBD0;position:relative}
.frame{position:absolute;inset:36px;border:10px solid #F6EBD0;outline:6px solid #D9411E;outline-offset:-26px;overflow:hidden;background:#0F4C5C}
.rays{position:absolute;left:50%;top:44%;width:2400px;height:2400px;margin:-1200px;background:repeating-conic-gradient(#12606f 0 7.5deg,#0F4C5C 7.5deg 15deg)}
.hexes{position:absolute;inset:0}.hx{position:absolute;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);box-shadow:none;filter:drop-shadow(8px 8px 0 #0a2f39)}
h1{position:absolute;left:0;right:0;font:400 124px/1.0 "Alfa Slab One";text-align:center;color:#F6EBD0;text-shadow:7px 7px 0 #D9411E;letter-spacing:-1px}
.burst{position:absolute;width:230px;height:230px;border-radius:50%;background:#E8B93B;color:#0F4C5C;display:grid;place-items:center;text-align:center;font:400 44px/1 "Alfa Slab One";transform:rotate(-12deg);border:8px solid #F6EBD0;box-shadow:8px 8px 0 #D9411E}
.foot{position:absolute;left:0;right:0;bottom:56px;text-align:center;font:800 30px Archivo;letter-spacing:.04em}
.foot small{display:block;font:500 26px Archivo;opacity:.85;margin-top:6px}
.pin h1{top:790px}.pin .burst{right:60px;top:560px}.pin .hexes{top:90px}
.ig h1{top:700px;font-size:116px}.ig .burst{right:56px;top:500px}.ig .hexes{top:70px}
/* info */
.info .frame{background:#F6EBD0;color:#0F4C5C;outline-color:#0F4C5C;border-color:#0F4C5C}
.info .rays{display:none}
.info h2{position:absolute;left:70px;right:70px;top:90px;font:400 72px/1.05 "Alfa Slab One";color:#0F4C5C;text-shadow:5px 5px 0 #E8B93B}
.row{position:absolute;left:70px;right:70px;display:flex;gap:26px;align-items:flex-start}
.row b{flex:none;width:210px;background:#D9411E;color:#F6EBD0;font:400 32px/1.1 "Alfa Slab One";padding:16px 14px;text-align:center;box-shadow:6px 6px 0 #0F4C5C}
.row p{font:500 40px/1.3 Archivo;color:#0F4C5C}
.info .foot{color:#0F4C5C}
`,
  hero(kind) {
    const w = kind === 'pin' ? 1000 : 1080;
    const x0 = (w - 72) / 2 - 120;
    const cols = ['#E8B93B', '#D9411E', '#F6EBD0', '#2E9E8F', '#E8B93B', '#D9411E'];
    const pos = [[x0 - 180, 50], [x0 - 180, 258], [x0 + 180, 50], [x0 + 180, 258], [x0, 358], [x0, 150]];
    const hexes = pos.map((p, i) => hex(cols[i], p[0], p[1], 240)).join('');
    return `<div class="frame"><div class="rays"></div><div class="hexes">${hexes}</div>
<h1>${COPY.hero[0]}<br>${COPY.hero[1]}<br><span style="font-size:.62em">${COPY.hero[2]}</span></h1>
<div class="burst">Buy<br>smart</div>
<div class="foot">${COPY.site}<small>${COPY.tag}</small></div></div>`;
  },
  info() {
    const tops = [300, 640, 980];
    return `<div class="frame"><h2>${COPY.infoTitle}</h2>
${COPY.rows.map((r, i) => `<div class="row" style="top:${tops[i]}px"><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}
<div class="foot">${COPY.site}</div></div>`;
  },
};

/* ---------- B  NEON FELT: dark tabletop, neon, Three.js 3D dice ---------- */
D.b = {
  name: 'Neon Felt (3D)',
  fonts: 'family=Unbounded:wght@800;900&family=Space+Grotesk:wght@500;700',
  check: ['900 40px Unbounded', '700 30px "Space Grotesk"'],
  three: true,
  css: `
body{background:radial-gradient(120% 80% at 50% 25%,#0e3b30 0%,#071a16 55%,#03090a 100%);font-family:"Space Grotesk",sans-serif;color:#EFFFF9;position:relative}
body:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(45deg,#ffffff06 0 2px,transparent 2px 6px)}
canvas{position:absolute;left:0;top:0;width:100%;height:60%}
h1{position:absolute;left:64px;right:64px;font:900 92px/1.02 Unbounded;letter-spacing:-2px;text-shadow:0 0 28px #ff3ea588}
h1 em{font-style:normal;color:#3EF0FF;text-shadow:0 0 30px #3ef0ffaa}
.foot{position:absolute;left:64px;right:64px;bottom:54px;display:flex;justify-content:space-between;font:700 30px "Space Grotesk";color:#3EF0FF}
.foot span:last-child{color:#FF3EA5}
.pin h1{top:830px}.ig h1{top:760px}
.info{background:#05100e}
.info h2{position:absolute;left:64px;right:64px;top:90px;font:900 66px/1.08 Unbounded;text-shadow:0 0 24px #3ef0ff88}
.row{position:absolute;left:64px;right:64px;border:3px solid #FF3EA5;border-radius:18px;padding:26px 30px;box-shadow:0 0 24px #ff3ea566,inset 0 0 24px #ff3ea533;background:#0a1f1b}
.row:nth-of-type(2){border-color:#3EF0FF;box-shadow:0 0 24px #3ef0ff66,inset 0 0 24px #3ef0ff33}
.row b{display:block;font:800 40px Unbounded;margin-bottom:12px}
.row p{font:500 38px/1.3 "Space Grotesk";color:#cfe8e0}
`,
  hero() {
    return `<canvas></canvas>
<h1>${COPY.hero[0]}<br><em>${COPY.hero[1]}</em><br><span style="font-size:.7em">${COPY.hero[2]}</span></h1>
<div class="foot"><span>${COPY.site}</span><span>buyer\u2019s guide</span></div>`;
  },
  info() {
    const tops = [280, 650, 1020];
    return `<h2>${COPY.infoTitle}</h2>
${COPY.rows.map((r, i) => `<div class="row" style="top:${tops[i]}px"><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}
<div class="foot"><span>${COPY.site}</span><span></span></div>`;
  },
  script: `
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js"}}</script>
<script type="module">
window.__ready=false;
try{
import('three').then(T=>{
 const cv=document.querySelector('canvas');const W=window.innerWidth,H=Math.round(window.innerHeight*0.6);
 const r=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:true,preserveDrawingBuffer:true});r.setSize(W,H,false);r.setPixelRatio(1);
 window.__info.webgl=r.capabilities.isWebGL2?'webgl2':'webgl1';
 const s=new T.Scene();const cam=new T.PerspectiveCamera(38,W/H,0.1,100);cam.position.set(0,0.4,9);
 s.add(new T.HemisphereLight(0xaaffee,0x220033,0.9));
 const k=new T.DirectionalLight(0xff3ea5,3);k.position.set(-4,5,5);s.add(k);
 const c=new T.DirectionalLight(0x3ef0ff,3);c.position.set(5,-2,4);s.add(c);
 const mk=(geo,col,em,x,y,z,rx,ry,rz,sc)=>{
  const g=new T.Group();
  g.add(new T.Mesh(geo,new T.MeshStandardMaterial({color:col,emissive:em,emissiveIntensity:0.35,roughness:0.28,metalness:0.2,flatShading:true})));
  g.add(new T.LineSegments(new T.EdgesGeometry(geo),new T.LineBasicMaterial({color:0xffffff})));
  g.position.set(x,y,z);g.rotation.set(rx,ry,rz);g.scale.setScalar(sc);s.add(g);};
 mk(new T.IcosahedronGeometry(1,0),0x7a1fa0,0xff3ea5,-1.6,0.5,0,0.5,0.6,0.2,1.55);
 mk(new T.IcosahedronGeometry(1,0),0x0b7f8f,0x3ef0ff,1.9,-0.2,-1.2,0.9,0.2,0.7,1.25);
 mk(new T.BoxGeometry(1.4,1.4,1.4),0xcfd8dc,0x3ef0ff,0.7,1.5,-0.5,0.5,0.8,0.1,0.85);
 mk(new T.OctahedronGeometry(1,0),0xff3ea5,0xff3ea5,-2.7,-1.4,0.8,0.3,0.5,0.4,0.7);
 r.render(s,cam);window.__ready=true;
 }).catch(e=>{window.__info.error=String(e);window.__ready=true;});
}catch(e){window.__info.error=String(e);window.__ready=true;}
</script>`,
};

/* ---------- C  EDITORIAL: magazine, Bodoni on cool paper, cobalt ---------- */
D.c = {
  name: 'Editorial',
  fonts: 'family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,700&family=Inter:wght@400;600',
  check: ['900 40px "Bodoni Moda"', '600 30px Inter'],
  css: `
body{background:#E6E8EA;color:#0C1018;font-family:Inter,sans-serif;position:relative}
.mast{position:absolute;left:56px;right:56px;top:48px;display:flex;justify-content:space-between;align-items:baseline;border-bottom:4px solid #0C1018;padding-bottom:14px;font:600 26px Inter}
.mast b{font:900 36px "Bodoni Moda"}
.big{position:absolute;left:44px;font:900 330px/0.8 "Bodoni Moda";letter-spacing:-14px;color:#2B4BFF;white-space:nowrap}
.pin .big{top:150px}.ig .big{top:140px}
h1{position:absolute;left:56px;right:56px;font:700 96px/1.0 "Bodoni Moda";letter-spacing:-2px}
h1 i{font-weight:700}
.pin h1{top:790px}.ig h1{top:740px}
.deck{position:absolute;left:56px;width:620px;font:400 33px/1.4 Inter}
.pin .deck{top:1260px}.ig .deck{top:1190px}
.foot{position:absolute;left:56px;right:56px;bottom:46px;border-top:4px solid #0C1018;padding-top:14px;display:flex;justify-content:space-between;font:600 26px Inter}
.info h2{position:absolute;left:56px;right:56px;top:140px;font:900 100px/0.98 "Bodoni Moda";letter-spacing:-3px}
.row{position:absolute;left:56px;right:56px;display:grid;grid-template-columns:290px 1fr;gap:30px;border-top:4px solid #0C1018;padding-top:22px}
.row b{font:700 italic 50px/1 "Bodoni Moda";color:#2B4BFF}
.row p{font:400 40px/1.35 Inter}
`,
  hero() {
    return `<div class="mast"><b>Which Expansion</b><span>Issue: Catan</span></div>
<div class="big">Catan</div>
<h1>${COPY.hero[0]} ${COPY.hero[1]} <i>${COPY.hero[2]}</i></h1>
<p class="deck">Two real options, what each one changes, and who it is for.</p>
<div class="foot"><span>${COPY.site}</span><span>The buyer\u2019s guide</span></div>`;
  },
  info() {
    const tops = [500, 830, 1160];
    return `<div class="mast"><b>Which Expansion</b><span>Catan</span></div>
<h2>${COPY.infoTitle}</h2>
${COPY.rows.map((r, i) => `<div class="row" style="top:${tops[i]}px"><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}
<div class="foot"><span>${COPY.site}</span><span></span></div>`;
  },
};

/* ---------- D  STICKER POP: playful, chunky, meeple stickers ---------- */
D.d = {
  name: 'Sticker Pop',
  fonts: 'family=Lilita+One&family=Nunito:wght@700;900',
  check: ['40px "Lilita One"', '900 30px Nunito'],
  css: `
body{background:#B8A1FF;font-family:Nunito,sans-serif;color:#1B1340;position:relative}
body:before{content:"";position:absolute;inset:0;background:radial-gradient(#ffffff40 3px,transparent 3.5px) 0 0/44px 44px}
.mp{position:absolute;filter:drop-shadow(8px 8px 0 #1B1340)}
.card{position:absolute;left:56px;right:56px;background:#FFF7E0;border:8px solid #1B1340;border-radius:44px;box-shadow:14px 14px 0 #1B1340;padding:44px 48px}
h1{font:400 112px/0.98 "Lilita One";letter-spacing:0}
h1 span{display:inline-block;background:#C6F135;border:6px solid #1B1340;border-radius:18px;padding:0 18px;transform:rotate(-2deg);margin-top:8px}
.pill{position:absolute;left:56px;bottom:56px;background:#1B1340;color:#FFF7E0;font:900 32px Nunito;border-radius:60px;padding:16px 34px}
.pin .card{top:700px}.ig .card{top:640px}
.sticker{position:absolute;right:64px;bottom:60px;width:210px;height:210px;border-radius:50%;background:#FF7A1A;border:8px solid #1B1340;display:grid;place-items:center;text-align:center;font:400 46px/1 "Lilita One";transform:rotate(10deg);box-shadow:8px 8px 0 #1B1340;color:#1B1340}
.info{background:#C6F135}
.info h2{position:absolute;left:56px;right:56px;top:70px;font:400 90px/1 "Lilita One"}
.row{position:absolute;left:56px;right:56px;background:#FFF7E0;border:8px solid #1B1340;border-radius:34px;box-shadow:10px 10px 0 #1B1340;padding:26px 34px 26px 190px;min-height:250px}
.row b{display:block;font:400 54px "Lilita One";margin-bottom:6px}
.row p{font:700 38px/1.3 Nunito}
.row .mp{left:26px;top:34px;width:128px;height:128px;filter:none}
`,
  hero(kind) {
    const w = kind === 'pin' ? 1000 : 1080;
    const top = kind === 'pin' ? 80 : 60;
    return `${meeple('#FF7A1A', '#1B1340').replace('class="mp "', `class="mp" style="left:60px;top:${top + 140}px;width:300px;height:300px;transform:rotate(-12deg)"`)}
${meeple('#FFF7E0').replace('class="mp "', `class="mp" style="left:${w / 2 - 150}px;top:${top}px;width:340px;height:340px;transform:rotate(6deg)"`)}
${meeple('#2E9E8F').replace('class="mp "', `class="mp" style="right:60px;top:${top + 160}px;width:280px;height:280px;transform:rotate(14deg)"`)}
<div class="card"><h1>${COPY.hero[0]} ${COPY.hero[1]} <span>${COPY.hero[2]}</span></h1></div>
<div class="pill">${COPY.site}</div><div class="sticker">Pick<br>one!</div>`;
  },
  info() {
    const tops = [310, 640, 970];
    const fills = ['#FF7A1A', '#B8A1FF', '#2E9E8F'];
    return `<h2>${COPY.infoTitle}</h2>
${COPY.rows.map((r, i) => `<div class="row" style="top:${tops[i]}px">${meeple(fills[i]).replace('class="mp "', 'class="mp"')}<b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}
<div class="pill">${COPY.site}</div>`;
  },
};

/* ---------- E  SCORE PAD: ledger paper, ballpoint, tallies ---------- */
D.e = {
  name: 'Score Pad',
  fonts: 'family=Permanent+Marker&family=Caveat:wght@600;700&family=Archivo+Narrow:wght@600;700',
  check: ['40px "Permanent Marker"', '700 40px Caveat'],
  css: `
body{background:#DCE9E2;background-image:linear-gradient(#7fb0c466 2px,transparent 2px),linear-gradient(90deg,#7fb0c444 2px,transparent 2px);background-size:60px 60px;color:#1B3FA0;font-family:Caveat,cursive;position:relative}
body:after{content:"";position:absolute;left:120px;top:0;bottom:0;width:4px;background:#d9534f}
.hdr{position:absolute;left:170px;right:60px;top:70px;font:700 44px "Archivo Narrow";color:#0c1b2e;display:flex;justify-content:space-between}
h1{position:absolute;left:170px;right:60px;font:400 118px/1.05 "Permanent Marker";color:#1B3FA0;transform:rotate(-1.5deg)}
h1 u{text-decoration:none;background:linear-gradient(transparent 62%,#ffe45c 62% 92%,transparent 92%)}
.pin h1{top:180px}.ig h1{top:150px}
.tally{position:absolute;left:170px;font:700 90px Caveat;color:#d9534f;letter-spacing:6px}
.pin .tally{top:1010px}.ig .tally{top:930px}
.note{position:absolute;left:170px;right:70px;font:700 58px/1.2 Caveat;color:#1B3FA0}
.pin .note{top:1130px}.ig .note{top:1050px}
.foot{position:absolute;left:170px;right:60px;bottom:50px;font:700 40px "Archivo Narrow";color:#0c1b2e}
.circle{position:absolute;border:7px solid #d9534f;border-radius:50%}
.info h2{position:absolute;left:170px;right:60px;top:150px;font:400 76px/1.1 "Permanent Marker";transform:rotate(-1deg)}
.tbl{position:absolute;left:170px;right:60px;top:430px;border:5px solid #1B3FA0;background:#ffffffcc}
.tbl div{display:grid;grid-template-columns:260px 1fr;border-bottom:5px solid #1B3FA0}
.tbl div:last-child{border:0}
.tbl b{font:400 42px/1.1 "Permanent Marker";padding:34px 18px;border-right:5px solid #1B3FA0}
.tbl p{font:700 52px/1.2 Caveat;padding:30px 22px}
`,
  hero(kind) {
    return `<div class="hdr"><span>Player: you</span><span>Round 1</span></div>
<h1>${COPY.hero[0]} <u>${COPY.hero[1]}</u> ${COPY.hero[2]}</h1>
<div class="tally">||||  ||||  |||</div>
<div class="note">Two real options. We counted what each one changes.</div>
<div class="foot">${COPY.site}</div>`;
  },
  info() {
    return `<div class="hdr"><span>Score pad</span><span>Catan</span></div>
<h2>${COPY.infoTitle}</h2>
<div class="tbl">${COPY.rows.map(r => `<div><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}</div>
<div class="foot">${COPY.site}</div>`;
  },
};

/* ---------- F  PUNCHBOARD: kraft cardboard + die-cut tokens ---------- */
D.f = {
  name: 'Punchboard',
  fonts: 'family=Chivo:wght@400;700;900&family=Chivo+Mono:wght@500',
  check: ['900 40px Chivo', '400 30px Chivo'],
  css: `
body{background:#B98B5A;font-family:Chivo,sans-serif;color:#2b1d10;position:relative}
body:before{content:"";position:absolute;inset:0;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 .25 0 0 0 0 .15 0 0 0 0 .05 0 0 0 .55 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>");opacity:.55}
.tk{position:absolute;display:grid;place-items:center;box-shadow:inset 0 -10px 0 #0003,inset 0 6px 0 #fff4,0 0 0 6px #7a5532,0 10px 0 6px #5c3d20;color:#fff;font:900 44px Chivo}
.c{border-radius:50%}.h{clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);box-shadow:none}
.lbl{position:absolute;left:70px;right:70px;background:#F7F2E6;padding:44px 50px 50px;box-shadow:0 10px 0 #5c3d20;transform:rotate(-1deg)}
.lbl:before{content:"";position:absolute;left:50%;top:-30px;width:180px;height:56px;margin-left:-90px;background:#e8d9a066;transform:rotate(2deg)}
h1{font:900 98px/1.0 Chivo;letter-spacing:-2px}
h1 small{display:block;font:700 54px/1.15 Chivo;letter-spacing:0;margin-top:14px;color:#a8321e}
.pin .lbl{top:860px}.ig .lbl{top:790px}
.foot{position:absolute;left:70px;right:70px;bottom:54px;font:500 32px "Chivo Mono";color:#fff;text-shadow:0 3px 0 #5c3d20;display:flex;justify-content:space-between}
.info h2{position:absolute;left:70px;right:70px;top:90px;font:900 80px/1.03 Chivo;letter-spacing:-2px;color:#fff;text-shadow:0 6px 0 #5c3d20}
.row{position:absolute;left:70px;right:70px;background:#F7F2E6;box-shadow:0 8px 0 #5c3d20;padding:26px 30px 26px 170px;min-height:250px}
.row b{display:block;font:900 50px Chivo;margin-bottom:6px}
.row p{font:400 38px/1.35 Chivo}
.row .tk{left:30px;top:30px;width:110px;height:110px;font-size:40px}
`,
  hero(kind) {
    const t = kind === 'pin' ? 120 : 90;
    return `<div class="tk c" style="left:90px;top:${t + 40}px;width:260px;height:260px;background:#d9534f">1</div>
<div class="tk h" style="left:380px;top:${t}px;width:300px;height:260px;background:#2E86AB"></div>
<div class="tk c" style="left:700px;top:${t + 70}px;width:210px;height:210px;background:#E8B93B;color:#2b1d10">2</div>
<div class="tk" style="left:170px;top:${t + 380}px;width:190px;height:190px;background:#4c8c4a;border-radius:24px">3</div>
<div class="tk h" style="left:690px;top:${t + 350}px;width:220px;height:190px;background:#8e5ba8"></div>
<div class="lbl"><h1>${COPY.hero[0]} ${COPY.hero[1]}<small>${COPY.hero[2]}</small></h1></div>
<div class="foot"><span>${COPY.site}</span><span>buyer\u2019s guide</span></div>`;
  },
  info() {
    const tops = [290, 620, 950];
    const bg = ['#d9534f', '#2E86AB', '#4c8c4a'];
    return `<h2>${COPY.infoTitle}</h2>
${COPY.rows.map((r, i) => `<div class="row" style="top:${tops[i]}px"><div class="tk c" style="background:${bg[i]}">${i + 1}</div><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}
<div class="foot"><span>${COPY.site}</span><span></span></div>`;
  },
};

// ---- emit ----
const page = (d, kind, view, bodyW, bodyH) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${d.fonts}&display=block">
<style>*{box-sizing:border-box;margin:0;padding:0}html,body{width:${bodyW}px;height:${bodyH}px;overflow:hidden}${d.css}</style></head>
<body class="${kind}${view === 'info' ? ' info' : ''}">
${view === 'info' ? d.info(kind) : d.hero(kind)}
<script>window.__info={fonts:[]};document.fonts.ready.then(()=>{window.__info.fonts=${JSON.stringify(d.check)}.map(f=>[f,document.fonts.check(f)])});</script>
${d.three && view === 'hero' ? d.script : ''}
</body></html>`;

export { D };
if (process.argv[1].endsWith('gen-directions.mjs')) {
await mkdir(path.join(BATCH, 'pinterest'), { recursive: true });
await mkdir(path.join(BATCH, 'instagram'), { recursive: true });
for (const [id, d] of Object.entries(D)) {
  const [pw, ph] = SIZES.pin, [iw, ih] = SIZES.ig;
  await writeFile(path.join(BATCH, 'pinterest', `${id}-hero.html`), page(d, 'pin', 'hero', pw, ph));
  await writeFile(path.join(BATCH, 'instagram', `${id}-cover.html`), page(d, 'ig', 'hero', iw, ih));
  await writeFile(path.join(BATCH, 'instagram', `${id}-info.html`), page(d, 'ig', 'info', iw, ih));
}
console.log('wrote', Object.keys(D).length, 'directions');
}

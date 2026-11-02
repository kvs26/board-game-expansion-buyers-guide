#!/usr/bin/env node
// THROWAWAY prototype for ticket 07, round 3.
// Gamified takes on A (Box Lid), D (Sticker Pop), I (Airmail) + three new directions: L Arcade, M Trading Card, N Group Chat.
// Info slides become game UI (stat bars, quiz, stamp collecting, character select) instead of paragraphs.
// Stat ratings and chat lines are SAMPLE copy. Real batches fact-check every claim.
// Run: node gen-round3.mjs <batch-dir>   Render: cd .agents/skills/social-studio && node render.mjs <batch-dir>
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { D as D1 } from './gen-directions.mjs';
import { D as D2, page, COPY, SIZES, MEEPLE_PATH, HEX, stamp, meepleSvg } from './gen-round2.mjs';

const BATCH = path.resolve(process.argv[2]);
const VS = [
  { n: 'Seafarers', tag: 'Ships and islands', buy: 'Base Catan feels too small', st: [['Map size', 4], ['Game length', 2], ['Rules', 2]] },
  { n: 'Cities &amp; Knights', tag: 'Raids and trade', buy: 'You know base Catan cold', st: [['Map size', 2], ['Game length', 4], ['Rules', 5]] },
];
const SKIP = 'Skip both if you still argue about the robber';
const mp = (fill, stroke = '#1B1340', sw = 5, cls = 'mp', style = '') =>
  `<svg class="${cls}" style="${style}" viewBox="0 0 100 100"><path d="${MEEPLE_PATH}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/></svg>`;
const pips = (n, max = 5) => `<span class="pips">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
const stars = n => '\u2605'.repeat(n) + '\u2606'.repeat(5 - n);

const D = {};

/* ---------- A2  BOX LID . VERSUS: stat-bar duel ---------- */
D.a2 = {
  ...D1.a,
  name: 'Box Lid Versus',
  css: D1.a.css + `
.info .frame{display:flex;flex-direction:column;padding:50px 38px 30px;gap:24px}
.info h2{position:static;text-align:center;font-size:72px;text-shadow:5px 5px 0 #E8B93B}
.duel{display:grid;grid-template-columns:1fr 1fr;gap:26px;flex:1;min-height:0;position:relative}
.vs{position:absolute;left:50%;top:560px;transform:translate(-50%,-50%) rotate(-8deg);width:100px;height:100px;border-radius:50%;background:#E8B93B;border:7px solid #0F4C5C;display:grid;place-items:center;font:400 38px "Alfa Slab One";color:#0F4C5C;z-index:3;box-shadow:5px 5px 0 #D9411E}
.cd{background:#FFF8E3;border:6px solid #0F4C5C;box-shadow:8px 8px 0 #0F4C5C;display:flex;flex-direction:column;color:#0F4C5C}
.cd .hd{color:#F6EBD0;padding:22px 14px 18px;text-align:center;font:400 38px/1.05 "Alfa Slab One"}
.cd .tg{padding:16px 14px 8px;text-align:center;font:800 26px Archivo;text-transform:uppercase;letter-spacing:.04em}
.cd .stat{flex:1;display:flex;flex-direction:column;justify-content:center;padding:6px 46px}
.stat span.l{display:block;font:800 24px Archivo;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px}
.pips i{display:inline-block;width:36px;height:36px;margin-right:4px;border:4px solid #0F4C5C}
.pips i.on{background:#D9411E}
.buy{margin:auto 18px 20px;background:#E8B93B;border:5px solid #0F4C5C;padding:14px 12px;font:800 30px/1.2 Archivo;text-align:center}
.buy small{display:block;font:800 22px Archivo;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px}
.skip{background:#D9411E;color:#F6EBD0;border:6px solid #0F4C5C;box-shadow:8px 8px 0 #0F4C5C;font:400 36px/1.15 "Alfa Slab One";text-align:center;padding:22px 24px}
.info .foot{position:static;color:#0F4C5C;font-size:28px}
`,
  hero(kind) {
    return D1.a.hero(kind).replace('<div class="burst">Buy<br>smart</div>', '<div class="burst" style="font-size:38px">Swipe<br>to vote</div>');
  },
  info() {
    const cols = ['#D9411E', '#2E9E8F'];
    const card = (v, i) => `<div class="cd"><div class="hd" style="background:${cols[i]}">${v.n}</div><div class="tg">${v.tag}</div>
${v.st.map(s => `<div class="stat"><span class="l">${s[0]}</span>${pips(s[1])}</div>`).join('')}
<div class="buy"><small>Buy if</small>${v.buy}</div></div>`;
    return `<div class="frame"><h2>Pick your expansion</h2>
<div class="duel">${card(VS[0], 0)}${card(VS[1], 1)}<div class="vs">VS</div></div>
<div class="skip">${SKIP}</div><div class="foot">${COPY.site}</div></div>`;
  },
};

/* ---------- D2  STICKER POP . QUIZ ---------- */
D.d2 = {
  ...D1.d,
  name: 'Sticker Pop Quiz',
  css: D1.d.css + `
.info{background:#B8A1FF}
.qz{position:absolute;inset:0;padding:60px 52px 52px;display:flex;flex-direction:column;gap:26px}
.prog{display:flex;align-items:center;gap:20px}
.prog .bar{flex:1;height:36px;background:#fff;border:6px solid #1B1340;border-radius:30px;overflow:hidden}
.prog .bar i{display:block;height:100%;width:66%;background:#FF7A1A;border-right:6px solid #1B1340}
.prog span{font:400 44px "Lilita One"}
.qz h2{position:static;font:400 82px/1 "Lilita One"}
.ans{flex:1;background:#FFF7E0;border:8px solid #1B1340;border-radius:40px;box-shadow:10px 10px 0 #1B1340;padding:20px 30px;display:grid;grid-template-columns:100px 1fr;gap:26px;align-items:center}
.lt{width:100px;height:100px;border-radius:50%;background:#FF7A1A;border:6px solid #1B1340;display:grid;place-items:center;font:400 58px "Lilita One"}
.ans p{font:400 48px/1.08 "Lilita One"}
.res{margin-top:12px;display:inline-flex;align-items:center;gap:12px;background:#C6F135;border:5px solid #1B1340;border-radius:40px;padding:6px 26px 6px 14px;font:900 34px Nunito}
.res .mp{position:static;width:46px;height:46px;filter:none}
.qz .pill{position:static;align-self:flex-start}
`,
  hero(kind) {
    return D1.d.hero(kind).replace('Pick<br>one!', 'Quiz<br>time!').replace('<div class="pill">', '<div class="pill" style="left:56px">');
  },
  info() {
    const items = [
      ['A', 'Base Catan feels too small', 'Seafarers', '#FF7A1A'],
      ['B', 'You know base Catan cold', 'Cities &amp; Knights', '#2E9E8F'],
      ['C', 'Still arguing about the robber', 'Skip both for now', '#FFF7E0'],
    ];
    return `<div class="qz"><div class="prog"><div class="bar"><i></i></div><span>2/3</span></div>
<h2>What is your table like?</h2>
${items.map(it => `<div class="ans"><div class="lt">${it[0]}</div><div><p>${it[1]}</p><span class="res">${mp(it[3], '#1B1340', 6)} ${it[2]}</span></div></div>`).join('')}
<div class="pill">${COPY.site}</div></div>`;
  },
};

/* ---------- I2  AIRMAIL . STAMP COLLECTING ---------- */
D.i2 = {
  ...D2.i,
  name: 'Airmail Stamps',
  css: D2.i.css + `
.info{background:#E8452C}
.info .env{top:80px;bottom:110px}
.info h2{font-size:96px}
.stamps{position:absolute;left:40px;right:40px;top:150px;bottom:24px;display:flex;flex-direction:column;justify-content:space-between}
.it{display:grid;grid-template-columns:230px 1fr;gap:36px;align-items:center}
.it .stin{background:#F3C13A}
.it b{display:block;font:700 76px/1 Caveat;color:#D8352A}
.it .rt{font:400 28px "Special Elite";letter-spacing:.04em;margin:6px 0}
.it .by{font:400 31px/1.3 "Special Elite"}
`,
  hero(kind) {
    return D2.i.hero(kind).replace('pick<br>one!', 'swipe<br>to pick');
  },
  info() {
    const tint = ['#D8352A', '#2B59C3'];
    const row = (v, i) => `<div class="it">${stamp(meepleSvg(tint[i]) + `<small>${i ? 'KNIGHTS' : 'SEA'}</small>`, '#FBF1DC', 'position:relative;width:200px;height:240px;transform:rotate(' + (i ? 3 : -3) + 'deg)')}
<div><b>${v.n}</b><div class="rt">Map ${stars(v.st[0][1])}<br>Length ${stars(v.st[1][1])}<br>Rules ${stars(v.st[2][1])}</div><div class="by">Buy if: ${v.buy}.</div></div></div>`;
    return `<div class="env"><div class="tape"></div><h2>Collect a stamp</h2><div class="stamps">${row(VS[0], 0)}${row(VS[1], 1)}
<div class="it">${stamp('<div style="font:700 52px/1 Caveat;color:#D8352A;text-align:center">NOT<br>YET</div>', '#FBF1DC', 'position:relative;width:200px;height:200px;transform:rotate(-2deg)')}
<div><div class="by" style="font-size:36px">${SKIP}.</div></div></div></div></div>
<div class="foot" style="left:70px;bottom:40px">${COPY.site}</div>`;
  },
};

/* ---------- L  ARCADE: 1980s cabinet, character select ---------- */
D.l = {
  name: 'Arcade',
  fonts: 'family=Press+Start+2P&family=VT323',
  check: ['40px "Press Start 2P"', '40px VT323'],
  css: `
body{background:#12082E;color:#fff;font-family:VT323,monospace;position:relative}
body:before{content:"";position:absolute;inset:0;z-index:9;pointer-events:none;background:repeating-linear-gradient(0deg,#0000 0 3px,#0007 3px 4px)}
body:after{content:"";position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(#0000,#7b2cff55),repeating-linear-gradient(90deg,#ff3ea533 0 3px,transparent 3px 90px),repeating-linear-gradient(0deg,#ff3ea533 0 3px,transparent 3px 60px)}
.cab{position:absolute;inset:0;padding:56px 60px 50px;display:flex;flex-direction:column;z-index:2}
.hud{display:flex;justify-content:space-between;font:400 26px "Press Start 2P";color:#FFE14D;text-shadow:3px 3px 0 #000}
.hud b{color:#fff;font-weight:400}
h1{margin-top:56px;font:400 80px/1.3 "Press Start 2P";text-transform:uppercase;text-shadow:6px 6px 0 #FF2E93}
h1 em{font-style:normal;color:#3DF5FF;text-shadow:6px 6px 0 #0A5E73}
h1 small{display:block;margin-top:22px;font-size:34px;color:#FFE14D;text-shadow:4px 4px 0 #8A5A00}
.arena{margin-top:auto;display:flex;align-items:center;justify-content:space-between}
.fgt{width:370px;height:370px;border:10px solid;background:#0B0420;display:grid;place-items:center;box-shadow:0 0 0 10px #000,0 0 40px currentColor}
.fgt svg{width:250px;height:250px;filter:drop-shadow(8px 8px 0 #000)}
.vsx{font:400 64px "Press Start 2P";color:#FFE14D;text-shadow:5px 5px 0 #FF2E93}
.names{display:flex;justify-content:space-between;margin-top:34px;font:400 24px "Press Start 2P"}
.start{margin-top:46px;text-align:center;font:400 40px "Press Start 2P";color:#FFE14D;text-shadow:4px 4px 0 #8A5A00}
.foot{margin-top:30px;text-align:center;font:400 38px VT323;color:#B9B0FF;letter-spacing:.08em}
.sel{margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:28px;flex:1}
.ch{border:8px solid;background:#0B0420;box-shadow:0 0 0 8px #000;padding:20px 20px 24px;display:flex;flex-direction:column;gap:14px}
.ch .nm{font:400 25px/1.4 "Press Start 2P";min-height:72px}
.ch svg{width:210px;height:210px;align-self:center;filter:drop-shadow(6px 6px 0 #000);margin:10px 0}
.ch .st{flex:1;display:flex;flex-direction:column;justify-content:center}
.ch .lb{font:400 40px VT323;letter-spacing:.06em;color:#fff}
.seg{display:flex;gap:6px}.seg i{flex:1;height:34px;background:#2b1f5c}
.ch .by{margin-top:auto;font:400 36px/1.1 VT323;color:#FFE14D}
.cont{margin-top:30px;text-align:center;font:400 26px/1.6 "Press Start 2P";color:#FF2E93;text-shadow:3px 3px 0 #000;border:6px dashed #FF2E93;padding:22px}
.info h2{margin-top:44px;font:400 48px/1.3 "Press Start 2P";text-shadow:5px 5px 0 #FF2E93}
`,
  hero() {
    return `<div class="cab"><div class="hud"><span>1UP <b>000480</b></span><span>HI-SCORE <b>999999</b></span></div>
<h1>${COPY.hero[0]}<br><em>${COPY.hero[1]}</em><small>${COPY.hero[2]}</small></h1>
<div class="arena"><div class="fgt" style="border-color:#3DF5FF;color:#3DF5FF">${mp('#3DF5FF', '#0B0420', 4)}</div><div class="vsx">VS</div><div class="fgt" style="border-color:#FF2E93;color:#FF2E93">${mp('#FF2E93', '#0B0420', 4)}</div></div>
<div class="names"><span style="color:#3DF5FF">SEAFARERS</span><span style="color:#FF2E93">CITIES &amp; KNIGHTS</span></div>
<div class="start">PRESS START</div><div class="foot">${COPY.site} // swipe to choose</div></div>`;
  },
  info() {
    const c = ['#3DF5FF', '#FF2E93'];
    const ch = (v, i) => `<div class="ch" style="border-color:${c[i]}"><div class="nm" style="color:${c[i]}">${v.n.toUpperCase()}</div>${mp(c[i], '#0B0420', 4)}
${v.st.map(s => `<div class="st"><div class="lb">${s[0].toUpperCase()}</div><div class="seg">${Array.from({ length: 5 }, (_, k) => `<i style="${k < s[1] ? 'background:' + c[i] : ''}"></i>`).join('')}</div></div>`).join('')}
<div class="by">BUY IF: ${v.buy.toUpperCase()}</div></div>`;
    return `<div class="cab"><div class="hud"><span>SELECT YOUR EXPANSION</span><span>1P</span></div>
<h2>CHOOSE<br>YOUR FIGHTER</h2>
<div class="sel">${ch(VS[0], 0)}${ch(VS[1], 1)}</div>
<div class="cont">${SKIP.toUpperCase()}</div><div class="foot">${COPY.site}</div></div>`;
  },
};

/* ---------- M  TRADING CARD: holo foil hand of cards ---------- */
const cardFont = 'family=Cinzel:wght@700;900&family=Rajdhani:wght@600;700';
D.m = {
  name: 'Trading Card',
  fonts: cardFont,
  check: ['900 40px Cinzel', '700 30px Rajdhani'],
  css: `
body{background:radial-gradient(circle at 50% 28%,#4a2a8a,#150b30 68%);color:#fff;font-family:Rajdhani,sans-serif;position:relative}
body:before{content:"";position:absolute;inset:0;background:radial-gradient(#ffffff18 2px,transparent 2.5px) 0 0/36px 36px}
.card{position:absolute;border-radius:34px;padding:14px;background:linear-gradient(135deg,#ffd86b,#ff7ad9 30%,#6bd3ff 55%,#8dff9b 78%,#ffd86b);box-shadow:0 30px 60px #000b}
.in{height:100%;background:#1a1038;border-radius:22px;display:flex;flex-direction:column;overflow:hidden}
.nm{padding:16px 22px 12px;display:flex;justify-content:space-between;align-items:center;font:900 34px/1 Cinzel;background:linear-gradient(90deg,#2b1a5c,#1a1038)}
.nm span{font:700 26px Rajdhani;color:#FFD86B}
.art{position:relative;flex:1;margin:0 16px;border:5px solid #FFD86B;border-radius:14px;overflow:hidden;display:grid;place-items:center}
.art svg{width:52%;filter:drop-shadow(6px 8px 0 #0006);position:relative;z-index:2}
.art:before{content:"";position:absolute;inset:0;background:conic-gradient(from 0deg at 50% 60%,#ffffff22 0 10deg,transparent 10deg 20deg,#ffffff22 20deg 30deg,transparent 30deg 40deg,#ffffff22 40deg 50deg,transparent 50deg 60deg,#ffffff22 60deg 70deg,transparent 70deg 80deg,#ffffff22 80deg 90deg,transparent 90deg 360deg)}
.ty{margin:14px 16px 0;padding:8px 14px;background:#ffffff14;border-radius:10px;font:700 26px Rajdhani;letter-spacing:.08em;text-transform:uppercase;color:#FFD86B}
.sts{flex:1;display:flex;flex-direction:column;justify-content:space-evenly;padding:10px 22px}
.srow{display:grid;grid-template-columns:170px 1fr;gap:14px;align-items:center;font:700 30px Rajdhani;text-transform:uppercase}
.bar{height:28px;border-radius:14px;background:#0008;overflow:hidden}.bar i{display:block;height:100%;background:linear-gradient(90deg,#6bd3ff,#8dff9b)}
.fl{margin:6px 16px 16px;padding:12px 14px;background:#ffffff12;border-radius:10px;font:600 28px/1.15 Rajdhani;font-style:italic}
h1{position:absolute;left:50px;right:50px;top:70px;text-align:center;font:900 74px/1.05 Cinzel;text-shadow:0 6px 0 #FF2E93}
h1 em{font-style:normal;color:#FFD86B}
h1 small{display:block;font-size:44px;margin-top:14px;color:#6bd3ff;text-shadow:0 4px 0 #0A3E57}
.hint{position:absolute;left:0;right:0;text-align:center;font:700 38px Rajdhani;letter-spacing:.16em;color:#FFD86B;text-transform:uppercase}
.pin .hint{bottom:112px}.ig .hint{bottom:106px}
.foot{position:absolute;left:0;right:0;bottom:50px;text-align:center;font:700 34px Rajdhani;letter-spacing:.1em;color:#d8ccff}
.pin .fan1{left:70px;top:400px;width:440px;height:760px;transform:rotate(-8deg)}.pin .fan2{right:70px;top:440px;width:440px;height:760px;transform:rotate(7deg)}
.ig .fan1{left:70px;top:380px;width:440px;height:720px;transform:rotate(-8deg)}.ig .fan2{right:70px;top:420px;width:440px;height:720px;transform:rotate(7deg)}
.info h2{position:absolute;left:50px;right:50px;top:52px;text-align:center;font:900 62px/1 Cinzel;text-shadow:0 5px 0 #FF2E93}
.pair{position:absolute;left:34px;right:34px;top:150px;display:grid;grid-template-columns:1fr 1fr;gap:26px;height:900px}
.pair .card{position:relative}
.rib{position:absolute;left:34px;right:34px;top:1100px;background:linear-gradient(90deg,#FF2E93,#7a2cff);border:5px solid #FFD86B;border-radius:18px;padding:22px 28px;text-align:center;font:900 38px/1.2 Cinzel;box-shadow:0 14px 0 #0006}
.info .foot{bottom:40px}
`,
  hero() {
    const c = ['#3DB8F5', '#FF5D9E'];
    const mini = (v, i) => `<div class="card fan${i + 1}"><div class="in"><div class="nm">${v.n}<span>${i ? 'EPIC' : 'RARE'}</span></div>
<div class="art" style="background:linear-gradient(160deg,${c[i]},#1a1038)">${mp('#FFF7E0', '#1a1038', 4)}</div><div class="ty">Expansion &middot; ${v.tag}</div><div class="fl" style="margin-top:12px">Buy if: ${v.buy}.</div></div></div>`;
    return `<h1>${COPY.hero[0]} <em>${COPY.hero[1]}</em><small>${COPY.hero[2]}</small></h1>${mini(VS[0], 0)}${mini(VS[1], 1)}
<div class="hint">Pick a card &rarr; swipe</div><div class="foot">${COPY.site}</div>`;
  },
  info() {
    const c = ['#3DB8F5', '#FF5D9E'];
    const full = (v, i) => `<div class="card"><div class="in"><div class="nm" style="font-size:30px">${v.n}<span>${i ? 'EPIC' : 'RARE'}</span></div>
<div class="art" style="flex:none;height:300px;background:linear-gradient(160deg,${c[i]},#1a1038)">${mp('#FFF7E0', '#1a1038', 4)}</div><div class="ty">${v.tag}</div>
<div class="sts">${v.st.map(s => `<div class="srow"><span>${s[0]}</span><div class="bar"><i style="width:${s[1] * 20}%"></i></div></div>`).join('')}</div>
<div class="fl" style="margin-top:auto">Buy if: ${v.buy}.</div></div></div>`;
    return `<h2>Choose your card</h2><div class="pair">${full(VS[0], 0)}${full(VS[1], 1)}</div><div class="rib">${SKIP}</div><div class="foot">${COPY.site}</div>`;
  },
};

/* ---------- N  GROUP CHAT: the argument, then the answer ---------- */
const bub = (who, text, cls = '') => `<div class="m ${who === 'You' ? 'me' : ''} ${cls}">${who === 'You' ? '' : `<span class="who">${who}</span>`}<div class="b">${text}</div></div>`;
D.n = {
  name: 'Group Chat',
  fonts: 'family=Inter:wght@500;700;800',
  check: ['800 40px Inter', '500 30px Inter'],
  css: `
body{background:#fff;font-family:Inter,sans-serif;color:#111;position:relative}
.top{position:absolute;left:0;right:0;top:0;height:190px;background:#F4F4F8;border-bottom:3px solid #D8D8E0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
.av{display:flex}.av i{width:70px;height:70px;border-radius:50%;border:4px solid #F4F4F8;margin-left:-14px}
.top b{font:800 34px Inter}
.chat{position:absolute;left:0;right:0;top:190px;bottom:0;padding:34px 40px 56px;display:flex;flex-direction:column;gap:20px}
.m{max-width:80%;align-self:flex-start}.m.me{align-self:flex-end}
.who{display:block;font:700 24px Inter;color:#8A8A95;margin:0 0 6px 26px}
.b{background:#E9E9EE;border-radius:44px;padding:24px 36px;font:700 50px/1.2 Inter}
.me .b{background:#0A84FF;color:#fff}
.big .b{font-size:58px;font-weight:800;line-height:1.1}
.typ{align-self:flex-start;background:#E9E9EE;border-radius:44px;padding:20px 34px;display:flex;gap:10px}.typ i{width:18px;height:18px;border-radius:50%;background:#9A9AA6}
.lk{align-self:flex-end;width:88%;border-radius:36px;overflow:hidden;background:#F1F1F6;border:3px solid #D8D8E0}
.lk .h{background:#FF6B2C;color:#fff;padding:26px 34px;font:800 44px/1.1 Inter}
.lk .u{padding:18px 34px 22px;font:500 30px Inter;color:#555}
.pin .chat{padding-top:30px;gap:18px}
.react{position:absolute;right:-14px;bottom:-26px;background:#fff;border:3px solid #D8D8E0;border-radius:30px;padding:4px 14px;font-size:34px}
.m{position:relative}
.info .b{font-size:46px}
.sp{flex:1}
`,
  hero() {
    return `<div class="top"><div class="av"><i style="background:#FF8A5B"></i><i style="background:#5BC8FF"></i><i style="background:#A78BFF"></i></div><b>Catan Night</b></div>
<div class="chat">${bub('Jo', 'ok which Catan expansion should we buy first??', 'big')}
${bub('Sam', 'Seafarers')}${bub('Priya', 'no. Cities &amp; Knights')}${bub('Jo', 'someone just pick')}
<div class="typ"><i></i><i></i><i></i></div><div class="sp"></div>
${bub('You', 'wait. there is a guide')}
<div class="lk"><div class="h">${COPY.infoTitle}</div><div class="u">${COPY.site}</div></div></div>`;
  },
  info() {
    return `<div class="top"><div class="av"><i style="background:#FF8A5B"></i><i style="background:#5BC8FF"></i><i style="background:#A78BFF"></i></div><b>Catan Night</b></div>
<div class="chat">${bub('Jo', 'ok so which one??', 'big')}
${bub('You', 'Base feels too small? Seafarers. Ships and islands.')}
${bub('You', 'Know base cold? Cities &amp; Knights. Longer, harder game.')}
${bub('Sam', 'and if we still argue about the robber?')}
${bub('You', 'neither yet. fix that first.')}
<div class="sp"></div><div class="lk"><div class="h">${COPY.infoTitle}</div><div class="u">${COPY.site}</div></div></div>`;
  },
};

export { D, VS, SKIP, mp, stars };
if (process.argv[1].endsWith('gen-round3.mjs')) {
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

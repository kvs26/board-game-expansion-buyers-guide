#!/usr/bin/env node
// THROWAWAY prototype for ticket 07, round 2. Five new directions (G-K) from Pinterest Predicts 2026 + frontend-design.
// Same HTML contract as gen-directions.mjs. Render: cd .agents/skills/social-studio && node render.mjs <BATCH>
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

const MEEPLE_PATH = 'M50 6C60 6 66 13 66 21c0 6-3 10-7 13 11 2 22 5 34 3 4 0 5 5 2 8-7 6-15 9-23 10 4 10 10 22 18 32 2 4 0 7-5 7H60c-5 0-8-5-10-12-2 7-5 12-10 12H15c-5 0-7-3-5-7 8-10 14-22 18-32-8-1-16-4-23-10-3-3-2-8 2-8 12 2 23-1 34-3-4-3-7-7-7-13C34 13 40 6 50 6Z';
const HEX = 'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)';

const D = {};

/* ---------- G  NEO DECO: navy + brass, fan arch, chevrons (Pinterest Predicts 2026: Neo Deco) ---------- */
D.g = {
  name: 'Neo Deco',
  fonts: 'family=Limelight&family=Josefin+Sans:wght@400;600;700',
  check: ['40px Limelight', '600 30px "Josefin Sans"'],
  css: `
body{background:#0E1B33;color:#F3E9D2;font-family:"Josefin Sans",sans-serif;position:relative}
.frame{position:absolute;inset:34px;border:5px solid #C8A24B;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:70px 56px 52px}
.frame:before{content:"";position:absolute;inset:12px;border:2px solid #C8A24B77;pointer-events:none}
.fan{position:relative;width:860px;height:430px;overflow:hidden;flex:none}
.rays{position:absolute;left:0;right:0;bottom:-430px;height:860px;border-radius:50%;background:repeating-conic-gradient(from 0deg at 50% 50%,#C8A24B 0 5deg,#0E1B33 5deg 10deg)}
.fan i{position:absolute;left:50%;bottom:0;transform:translateX(-50%);border-radius:999px 999px 0 0}
.r1{width:540px;height:270px;background:#0E1B33;border:7px solid #C8A24B;border-bottom:0}
.r2{width:330px;height:165px;background:#C8A24B}
.r3{width:150px;height:75px;background:#0E1B33;border:6px solid #F3E9D2;border-bottom:0}
.chevs{display:flex;flex-direction:column;gap:12px;align-items:center;margin-top:34px}
.chevs b{display:block;width:300px;height:30px;background:#C8A24B;clip-path:polygon(0 0,50% 64%,100% 0,100% 36%,50% 100%,0 36%)}
.chevs b:nth-child(2){width:220px;background:#F3E9D2}.chevs b:nth-child(3){width:140px;background:#7A1F2B}
.mid{text-align:center}
h1{font:400 124px/1.04 Limelight;letter-spacing:1px}
h1 em{font-style:normal;color:#C8A24B}
h1 small{display:block;font:400 62px/1.25 Limelight;margin-top:14px}
.sub{margin-top:30px;font:700 25px "Josefin Sans";letter-spacing:.2em;white-space:nowrap;text-transform:uppercase;color:#C8A24B}
.foot{display:flex;gap:24px;align-items:center;font:600 34px "Josefin Sans";letter-spacing:.12em}
.dia{display:inline-block;width:16px;height:16px;background:#C8A24B;transform:rotate(45deg)}
.info .frame{justify-content:flex-start;gap:52px;padding-top:80px}
h2{font:400 76px/1.08 Limelight;text-align:center}
.rows{display:flex;flex-direction:column;gap:44px;width:100%;margin-top:6px}
.row{display:grid;grid-template-columns:120px 1fr;gap:34px;align-items:center;border-top:2px solid #C8A24B66;padding-top:36px}
.num{width:84px;height:84px;margin-left:12px;transform:rotate(45deg);border:4px solid #C8A24B;display:grid;place-items:center}
.num span{transform:rotate(-45deg);font:400 44px Limelight;color:#C8A24B}
.row b{display:block;font:400 48px/1.1 Limelight;color:#C8A24B;margin-bottom:10px}
.row p{font:400 38px/1.35 "Josefin Sans";color:#F3E9D2}
.info .foot{margin-top:auto}
`,
  hero() {
    return `<div class="frame"><div class="top"><div class="fan"><div class="rays"></div><i class="r1"></i><i class="r2"></i><i class="r3"></i></div><div class="chevs"><b></b><b></b><b></b></div></div>
<div class="mid"><h1>${COPY.hero[0]}<br><em>${COPY.hero[1]}</em><small>${COPY.hero[2]}</small></h1><div class="sub">${COPY.tag}</div></div>
<div class="foot"><i class="dia"></i>${COPY.site}<i class="dia"></i></div></div>`;
  },
  info() {
    return `<div class="frame"><h2>${COPY.infoTitle}</h2><div class="rows">${COPY.rows.map((r, i) => `<div class="row"><div class="num"><span>${i + 1}</span></div><div><b>${r[0]}</b><p>${r[1]}</p></div></div>`).join('')}</div>
<div class="foot"><i class="dia"></i>${COPY.site}<i class="dia"></i></div></div>`;
  },
};

/* ---------- H  BIG TOP: striped awning, ticket stubs (Pinterest Predicts 2026: FunHaus) ---------- */
const awning = (n, h) => `<div class="awn" style="height:${h}px">${Array.from({ length: n }, (_, i) => `<i style="background:${i % 2 ? '#FFF8E7' : '#D62828'}"></i>`).join('')}</div>`;
D.h = {
  name: 'Big Top',
  fonts: 'family=Bowlby+One&family=DM+Sans:wght@500;700',
  check: ['40px "Bowlby One"', '700 30px "DM Sans"'],
  css: `
body{background:#F3E3C3;color:#17203A;font-family:"DM Sans",sans-serif;position:relative}
.awn{position:absolute;left:0;right:0;top:0;display:flex;filter:drop-shadow(0 16px 0 #17203A22)}
.awn i{flex:1;display:block;border-radius:0 0 50% 50%/0 0 70px 70px}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:0 64px 56px}
h1{font:400 128px/1.0 "Bowlby One";text-align:center;letter-spacing:-2px}
h1 em{font-style:normal;color:#D62828}
.marquee{align-self:center;margin-top:34px;background:#17203A;color:#FFF8E7;font:400 56px/1.15 "Bowlby One";padding:14px 40px 18px;transform:rotate(-2deg);box-shadow:10px 10px 0 #D62828}
.ticket{margin-top:54px;display:flex;justify-content:space-between;align-items:center;background:#17203A;color:#F3E3C3;padding:26px 70px;font:700 32px "DM Sans";letter-spacing:.14em;text-transform:uppercase;-webkit-mask:radial-gradient(circle 24px at 0 50%,transparent 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 24px at 100% 50%,transparent 98%,#000) right/51% 100% no-repeat}
.ticket span+span{color:#E8B93B}
.ball{position:absolute;border-radius:50%;background:repeating-conic-gradient(#D62828 0 30deg,#FFF8E7 30deg 60deg);box-shadow:inset -26px -30px 50px #0004,inset 18px 18px 36px #fff6,0 24px 0 #17203A22}
.ball.b2{background:repeating-conic-gradient(#17203A 0 30deg,#E8B93B 30deg 60deg)}
.pin .ball.b1{width:380px;height:380px;left:60px;top:340px}.pin .ball.b2{width:250px;height:250px;right:70px;top:450px}
.ig .ball.b1{width:360px;height:360px;left:60px;top:320px}.ig .ball.b2{width:240px;height:240px;right:70px;top:420px}
.info .awn{height:150px}
.info .wrap{justify-content:flex-start;padding-top:210px;gap:40px}
h2{font:400 72px/1.05 "Bowlby One";text-align:center}
.tk{display:grid;grid-template-columns:170px 1fr;background:#FFF8E7;box-shadow:10px 10px 0 #17203A;-webkit-mask:radial-gradient(circle 20px at 170px 0,transparent 98%,#000) top/100% 51% no-repeat,radial-gradient(circle 20px at 170px 100%,transparent 98%,#000) bottom/100% 51% no-repeat}
.tk .st{background:#D62828;color:#FFF8E7;display:grid;place-items:center;font:400 96px "Bowlby One";border-right:4px dashed #FFF8E7}
.tk div+div{padding:26px 36px}
.tk b{display:block;font:400 46px/1.1 "Bowlby One";margin-bottom:8px}
.tk p{font:500 37px/1.35 "DM Sans"}
.info .ticket{margin-top:auto}
`,
  hero(kind) {
    return `${awning(9, 250)}<div class="ball b1"></div><div class="ball b2"></div>
<div class="wrap"><h1>${COPY.hero[0]}<br><em>${COPY.hero[1]}</em></h1><div class="marquee">${COPY.hero[2]}</div>
<div class="ticket"><span>Admit one</span><span>${COPY.site}</span></div></div>`;
  },
  info() {
    return `${awning(9, 120)}<div class="wrap"><h2>${COPY.infoTitle}</h2>
${COPY.rows.map((r, i) => `<div class="tk"><div class="st">${i + 1}</div><div><b>${r[0]}</b><p>${r[1]}</p></div></div>`).join('')}
<div class="ticket"><span>Admit one</span><span>${COPY.site}</span></div></div>`;
  },
};

/* ---------- I  AIRMAIL: envelope, stamps, postmark (Pinterest Predicts 2026: Pen Pals) ---------- */
const stamp = (inner, hole, style) => {
  const e = 'position:absolute;background-image:radial-gradient(circle at 10px 10px,' + hole + ' 6px,transparent 6.5px);';
  return `<div class="stamp" style="${style}"><div class="stin">${inner}</div>` +
    `<i style="${e}left:-10px;right:-10px;top:-10px;height:20px;background-size:20px 20px;background-repeat:repeat-x"></i>` +
    `<i style="${e}left:-10px;right:-10px;bottom:-10px;height:20px;background-size:20px 20px;background-repeat:repeat-x"></i>` +
    `<i style="${e}top:-10px;bottom:-10px;left:-10px;width:20px;background-size:20px 20px;background-repeat:repeat-y"></i>` +
    `<i style="${e}top:-10px;bottom:-10px;right:-10px;width:20px;background-size:20px 20px;background-repeat:repeat-y"></i></div>`;
};
const meepleSvg = fill => `<svg viewBox="0 0 100 100" style="width:100%;height:100%"><path d="${MEEPLE_PATH}" fill="${fill}" stroke="#1D2B64" stroke-width="4" stroke-linejoin="round"/></svg>`;
D.i = {
  name: 'Airmail',
  fonts: 'family=Caveat:wght@600;700&family=Special+Elite',
  check: ['700 40px Caveat', '40px "Special Elite"'],
  css: `
body{background:#E8452C;position:relative;color:#1D2B64}
body:before{content:"";position:absolute;inset:0;background:radial-gradient(#ffffff22 3px,transparent 3.5px) 0 0/48px 48px}
.env{position:absolute;left:62px;right:62px;background:#FBF1DC;border:28px solid transparent;border-image:repeating-linear-gradient(45deg,#D8352A 0 24px,#FBF1DC 24px 48px,#2B59C3 48px 72px,#FBF1DC 72px 96px) 28;box-shadow:16px 22px 0 #0003;transform:rotate(-2.5deg)}
.pin .env{top:150px;height:1090px}.ig .env{top:120px;height:1040px}
.from{position:absolute;left:34px;top:26px;font:400 28px/1.35 "Special Elite";color:#1D2B64cc}
.stamp{position:absolute;background:#fff;padding:10px;box-shadow:4px 6px 0 #0002}
.stin{width:100%;height:100%;background:#F3C13A;display:grid;place-items:center;position:relative;padding:12px}
.stin small{position:absolute;left:10px;bottom:6px;font:400 17px "Special Elite";color:#1D2B64}
.pm{position:absolute;width:250px;height:250px;border:6px double #1D2B64;border-radius:50%;display:grid;place-items:center;text-align:center;font:400 24px/1.2 "Special Elite";color:#1D2B64;opacity:.8;transform:rotate(-14deg)}
.pm:before{content:"";position:absolute;left:-190px;right:240px;top:76px;height:90px;background:repeating-linear-gradient(0deg,#1D2B64 0 5px,transparent 5px 28px);opacity:.8}
.msg{position:absolute;left:46px;right:46px;text-align:left}
.pin .msg{top:330px}.ig .msg{top:300px}
h1{font:700 150px/.92 Caveat;color:#1D2B64;letter-spacing:-1px}
h1 em{font-style:normal;color:#D8352A;background:linear-gradient(transparent 60%,#F3C13A 60% 90%,transparent 90%)}
.ask{margin-top:34px;font:400 56px/1.2 "Special Elite"}
.addr{position:absolute;left:46px;bottom:44px;font:700 52px/1.3 Caveat;color:#1D2B64}
.addr span{display:block;border-bottom:3px solid #1D2B6466;width:560px}
.sticker{position:absolute;width:210px;height:210px;border-radius:50%;background:#2B59C3;border:8px solid #fff;display:grid;place-items:center;box-shadow:6px 8px 0 #0003;transform:rotate(12deg);font:700 54px/1 Caveat;color:#fff;text-align:center}
.pin .sticker{right:70px;top:1210px}.ig .sticker{right:70px;top:1160px}
.tape{position:absolute;left:50%;top:-30px;width:210px;height:64px;margin-left:-105px;background:#F3C13A99;transform:rotate(3deg)}
.foot{position:absolute;left:70px;bottom:52px;font:400 36px "Special Elite";color:#FBF1DC}
.info .env{top:90px;bottom:120px;height:auto;transform:rotate(-1.2deg)}
.info h2{position:absolute;left:46px;top:30px;font:700 100px/1 Caveat;color:#D8352A}
.letter{position:absolute;left:46px;right:46px;top:170px;bottom:30px;display:flex;flex-direction:column;justify-content:space-between}
.entry b{display:block;font:700 66px/1 Caveat;color:#D8352A}
.entry p{font:400 33px/1.45 "Special Elite";margin-top:4px;background:repeating-linear-gradient(transparent 0 47px,#2B59C355 47px 48px)}
`,
  hero(kind) {
    return `<div class="env"><div class="tape"></div>
<div class="from">From: your tabletop<br>whichexpansion.com</div>
${stamp(meepleSvg('#D8352A') + '<small>1ST CLASS</small>', '#FBF1DC', 'right:44px;top:30px;width:150px;height:180px;transform:rotate(3deg)')}
${stamp('<div style="width:100%;height:100%;background:#2B59C3;clip-path:' + HEX + '"></div>', '#FBF1DC', 'right:226px;top:62px;width:130px;height:156px;transform:rotate(-5deg)')}
<div class="pm" style="right:-20px;top:120px">WHICH<br>EXPANSION<br>NOV 2026</div>
<div class="msg"><h1>${COPY.hero[0]} <em>${COPY.hero[1]}</em></h1><div class="ask">${COPY.hero[2]}</div></div>
<div class="addr"><span>To: you, mid-argument</span><span>at the game table</span></div></div>
<div class="sticker">pick<br>one!</div><div class="foot">${COPY.site}</div>`;
  },
  info() {
    return `<div class="env"><div class="tape"></div><h2>Dear player,</h2><div class="letter">${COPY.rows.map(r => `<div class="entry"><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}</div>
${stamp(meepleSvg('#F3C13A'), '#FBF1DC', 'right:40px;top:30px;width:120px;height:140px;transform:rotate(4deg)')}</div>
<div class="foot" style="left:70px;bottom:44px">${COPY.site}</div>`;
  },
};

/* ---------- J  JELLY: inflated gel meeples, puffy type (Pinterest Predicts 2026: Gimme Gummy) ---------- */
const jelly = (id, c1, c2, style) => `<svg viewBox="0 0 100 100" class="jl" style="${style};filter:drop-shadow(0 22px 20px ${c2}88)"><defs><radialGradient id="g${id}" cx="34%" cy="24%" r="90%"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".22" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs><path d="${MEEPLE_PATH}" fill="url(#g${id})" stroke="#fff" stroke-opacity=".75" stroke-width="2.2" stroke-linejoin="round"/><ellipse cx="38" cy="15" rx="8.5" ry="3.6" fill="#fff" opacity=".9" transform="rotate(-24 38 15)"/><ellipse cx="22" cy="58" rx="4" ry="2" fill="#fff" opacity=".55" transform="rotate(-50 22 58)"/></svg>`;
const bubble = (x, y, s) => `<i class="bub" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px"></i>`;
D.j = {
  name: 'Jelly',
  fonts: 'family=Fredoka:wght@500;600;700',
  check: ['700 40px Fredoka', '600 30px Fredoka'],
  css: `
body{background:radial-gradient(circle at 18% 8%,#FFE9F2,transparent 46%),radial-gradient(circle at 84% 84%,#D6F6EA,transparent 46%),linear-gradient(160deg,#FFC9E1,#DCCBFF);font-family:Fredoka,sans-serif;color:#4A2468;position:relative}
.jl{position:absolute}
.bub{position:absolute;border-radius:50%;background:radial-gradient(circle at 30% 28%,#fff 0 8%,#ffffff66 9%,#ffffff22 60%,#ffffff55 100%);border:3px solid #ffffffaa}
h1{position:absolute;left:50px;right:50px;text-align:center;font:700 134px/1.0 Fredoka;color:#fff;-webkit-text-stroke:22px #FF4F9A;paint-order:stroke fill;text-shadow:0 12px 0 #C81E78,0 28px 34px #c81e7866;letter-spacing:1px}
h1 em{font-style:normal;-webkit-text-stroke-color:#FF8A1F;text-shadow:0 12px 0 #C25F00,0 28px 34px #c25f0066}
h1 small{display:block;font-size:72px;-webkit-text-stroke:16px #8A5CFF;text-shadow:0 10px 0 #5B2FC9,0 24px 30px #5b2fc966;margin-top:22px}
.pin h1{top:790px}.ig h1{top:730px}
.pill{position:absolute;left:50%;transform:translateX(-50%);bottom:56px;background:#fff;border:6px solid #FF4F9A;border-radius:80px;padding:14px 50px;font:600 40px Fredoka;color:#C81E78;box-shadow:0 12px 0 #C81E7855;white-space:nowrap}
.info h2{position:absolute;left:50px;right:50px;top:70px;text-align:center;font:700 80px/1.05 Fredoka;color:#fff;-webkit-text-stroke:16px #8A5CFF;paint-order:stroke fill;text-shadow:0 9px 0 #5B2FC9}
.card{position:absolute;left:56px;right:56px;background:#ffffffb8;border:7px solid #fff;border-radius:60px;box-shadow:0 24px 40px #a45bd566,inset 0 -14px 24px #ffffff88;padding:34px 40px 34px 220px}
.card b{display:block;font:700 56px/1.1 Fredoka;color:#6A2C91;margin-bottom:8px}
.card p{font:500 37px/1.3 Fredoka;color:#4A2468}
.card .jl{left:36px;top:50%;margin-top:-72px;width:144px;height:144px}
`,
  hero(kind) {
    const t = kind === 'pin' ? 80 : 60;
    return `${bubble(60, t + 380, 120)}${bubble(850, t + 60, 90)}${bubble(900, t + 420, 60)}${bubble(120, t + 20, 70)}
${jelly('a', '#FF9EC4', '#FF3D8B', `left:40px;top:${t + 190}px;width:380px;height:380px;transform:rotate(-12deg)`)}
${jelly('b', '#FFD58A', '#FF8A1F', `left:${kind === 'pin' ? 300 : 330}px;top:${t + 20}px;width:440px;height:440px;transform:rotate(5deg)`)}
${jelly('c', '#B9A6FF', '#7B4DFF', `right:30px;top:${t + 210}px;width:370px;height:370px;transform:rotate(13deg)`)}
<h1>${COPY.hero[0]}<br><em>${COPY.hero[1]}</em><small>${COPY.hero[2]}</small></h1><div class="pill">${COPY.site}</div>`;
  },
  info() {
    const tops = [300, 640, 980];
    const cols = [['#FF9EC4', '#FF3D8B'], ['#FFD58A', '#FF8A1F'], ['#B9A6FF', '#7B4DFF']];
    return `${bubble(920, 150, 80)}${bubble(40, 1180, 100)}<h2>${COPY.infoTitle}</h2>
${COPY.rows.map((r, i) => `<div class="card" style="top:${tops[i]}px">${jelly('r' + i, cols[i][0], cols[i][1], '')}<b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}
<div class="pill">${COPY.site}</div>`;
  },
};

/* ---------- K  FIELD GUIDE: stencil, specimens, expedition log (Pinterest Predicts 2026: Khaki Coded) ---------- */
D.k = {
  name: 'Field Guide',
  fonts: 'family=Stardos+Stencil:wght@700&family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@500;600',
  check: ['700 40px "Stardos Stencil"', '500 24px "IBM Plex Mono"'],
  css: `
body{background:#D9CCA8;color:#2F3320;font-family:"Barlow Condensed",sans-serif;position:relative}
body:before{content:"";position:absolute;inset:0;background:linear-gradient(#6b5e3b26 1px,transparent 1px) 0 0/40px 40px,linear-gradient(90deg,#6b5e3b26 1px,transparent 1px) 0 0/40px 40px}
.frame{position:absolute;inset:40px;border:4px solid #2F3320;display:flex;flex-direction:column}
.bar{background:#2F3320;color:#D9CCA8;font:500 26px "IBM Plex Mono";letter-spacing:.12em;padding:14px 28px;display:flex;justify-content:space-between;text-transform:uppercase}
.plate{position:relative;flex:1;min-height:0}
.spec{position:absolute}
.spec i{display:block;clip-path:${HEX}}
.lbl{position:absolute;font:600 23px "IBM Plex Mono";background:#F4ECD3;border:2px solid #2F3320;padding:4px 12px;white-space:nowrap}
.ld{position:absolute;border-top:3px dashed #2F3320}
.compass{position:absolute;right:46px;top:36px;width:150px;height:150px}
.stamp{position:absolute;border:6px double #B5532A;color:#B5532A;font:700 44px/1 "Stardos Stencil";padding:10px 22px;transform:rotate(-8deg);letter-spacing:.06em}
.title{padding:0 40px}
h1{font:700 116px/1.0 "Stardos Stencil";text-transform:uppercase;letter-spacing:1px}
h1 em{font-style:normal;color:#B5532A}
.tape{display:inline-block;margin-top:24px;background:#2F3320;color:#F4ECD3;font:700 62px/1 "Barlow Condensed";letter-spacing:.04em;padding:10px 26px 12px;text-transform:uppercase;transform:rotate(-1.5deg)}
.foot{margin-top:34px;border-top:4px solid #2F3320;padding:16px 40px 18px;display:flex;justify-content:space-between;gap:24px;white-space:nowrap;font:600 26px "IBM Plex Mono";letter-spacing:.02em}
.title{padding-bottom:0}
.info .bar{margin-bottom:0}
.info .body{flex:1;padding:44px 40px 0;display:flex;flex-direction:column;gap:34px}
h2{font:700 82px/1.02 "Stardos Stencil";text-transform:uppercase}
.entry{border:4px solid #2F3320;background:#F4ECD3;position:relative;padding:28px 34px 28px 34px}
.entry .tag{position:absolute;right:20px;top:-20px;background:#B5532A;color:#F4ECD3;font:600 22px "IBM Plex Mono";padding:6px 14px;letter-spacing:.1em}
.entry b{display:block;font:700 54px/1.05 "Stardos Stencil";text-transform:uppercase;margin-bottom:8px}
.entry p{font:600 40px/1.3 "Barlow Condensed"}
.info .foot{margin-top:auto}
`,
  hero(kind) {
    const ph = kind === 'pin' ? 640 : 590;
    return `<div class="frame"><div class="bar"><span>Expedition log no. 037</span><span>Catan region</span></div>
<div class="plate" style="min-height:${ph}px">
<svg class="compass" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#2F3320" stroke-width="3"/><polygon points="50,6 58,50 50,94 42,50" fill="#2F3320"/><polygon points="6,50 50,42 94,50 50,58" fill="#B5532A"/><circle cx="50" cy="50" r="5" fill="#D9CCA8"/></svg>
<div class="spec" style="left:70px;top:150px"><i style="width:260px;height:225px;background:#6B7A3A"></i></div>
<div class="spec" style="left:400px;top:70px"><i style="width:320px;height:277px;background:#B5532A"></i></div>
<div class="spec" style="left:650px;top:330px"><i style="width:220px;height:190px;background:#8C7B4A"></i></div>
<div class="ld" style="left:190px;top:340px;width:180px;transform:rotate(30deg);transform-origin:left"></div><div class="lbl" style="left:70px;top:400px">FIG. 1 &middot; SEAFARERS</div>
<div class="ld" style="left:560px;top:355px;width:120px;transform:rotate(-8deg);transform-origin:left"></div><div class="lbl" style="left:500px;top:395px">FIG. 2 &middot; C&amp;K</div>
<div class="lbl" style="left:70px;top:70px">47.6062&deg; N</div>
<div class="stamp" style="left:70px;bottom:50px">VERIFIED</div></div>
<div class="title"><h1>${COPY.hero[0]}<br><em>${COPY.hero[1]}</em></h1><div class="tape">${COPY.hero[2]}</div></div>
<div class="foot"><span>${COPY.site}</span><span>Buyer\u2019s guide</span></div></div>`;
  },
  info() {
    const tags = ['KEEP IF', 'KEEP IF', 'SKIP IF'];
    return `<div class="frame"><div class="bar"><span>Field notes</span><span>Catan region</span></div>
<div class="body"><h2>${COPY.infoTitle}</h2>${COPY.rows.map((r, i) => `<div class="entry"><span class="tag">SPECIMEN 0${i + 1}</span><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}</div>
<div class="foot"><span>${COPY.site}</span><span>No. 037</span></div></div>`;
  },
};

// ---- emit ----
const page = (d, kind, view, w, h) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${d.fonts}&display=block">
<style>*{box-sizing:border-box;margin:0;padding:0}html,body{width:${w}px;height:${h}px;overflow:hidden}${d.css}</style></head>
<body class="${kind}${view === 'info' ? ' info' : ''}">
${view === 'info' ? d.info(kind) : d.hero(kind)}
<script>window.__info={fonts:[]};document.fonts.ready.then(()=>{window.__info.fonts=${JSON.stringify(d.check)}.map(f=>[f,document.fonts.check(f)])});</script>
</body></html>`;

export { D, page, COPY, SIZES, MEEPLE_PATH, HEX, stamp, meepleSvg };
if (process.argv[1].endsWith('gen-round2.mjs')) {
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

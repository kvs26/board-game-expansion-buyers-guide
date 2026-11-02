import { D as D3, mp } from '../../../style-kit/directions/src/gen-round3.mjs';
import { COPY } from '../../../style-kit/directions/src/gen-round2.mjs';
const D = {};
/* ---------- O  SCRATCH CARD: lottery ticket, foil, reveal ---------- */
const foilMask = [[16, 74], [26, 68], [36, 62], [46, 55], [56, 48], [66, 42], [76, 35], [86, 28]].map(p => `radial-gradient(circle 115px at ${p[0]}% ${p[1]}%,#0000 97%,#000 100%)`).join(',');
D.o = {
  name: 'Scratch Card',
  fonts: 'family=Bungee&family=DM+Sans:wght@500;700',
  check: ['40px Bungee', '700 30px "DM Sans"'],
  css: `
body{background:#0B3D2E;color:#0B3D2E;font-family:"DM Sans",sans-serif;position:relative}
body:before{content:"";position:absolute;inset:0;background:radial-gradient(#FFD23F44 3px,transparent 3.5px) 0 0/60px 60px}
.tk{position:absolute;left:56px;right:56px;top:64px;bottom:140px;border-radius:48px;background:linear-gradient(160deg,#FFD23F,#FF9F1C);padding:18px;box-shadow:0 22px 0 #05231a}
.tin{height:100%;background:#FFF3C4;border-radius:34px;border:6px dashed #0B3D2E;padding:36px 40px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;font:700 30px "DM Sans";letter-spacing:.14em;text-transform:uppercase}
.top b{background:#0B3D2E;color:#FFD23F;padding:6px 18px;border-radius:30px}
h1{margin-top:28px;font:400 92px/1 Bungee;text-transform:uppercase}
h1 em{font-style:normal;color:#E5266A}
h1 small{display:block;margin-top:16px;font:700 46px/1.1 "DM Sans";text-transform:none}
.pan{position:relative;flex:1;margin-top:30px;border-radius:28px;overflow:hidden;border:6px solid #0B3D2E}
.rev{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#FFE9A8,#FF86B4);display:flex;align-items:center;justify-content:center;gap:10px}
.rev .q{font:400 300px/1 Bungee;color:#0B3D2E;opacity:.9;margin:0 -30px}
.rev .mp{width:320px;height:320px}
.foil{position:absolute;inset:0;background:repeating-linear-gradient(115deg,#D9DADF 0 10px,#BFC1C9 10px 20px),#ccc;-webkit-mask:${foilMask};-webkit-mask-composite:source-in;mask:${foilMask};mask-composite:intersect}
.foil:after{content:"SCRATCH";position:absolute;left:8%;top:10%;font:400 78px Bungee;color:#8b8d97;transform:rotate(-8deg);letter-spacing:.06em}
.coin{position:absolute;right:26px;bottom:24px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF1A8,#FFB400);border:8px solid #0B3D2E;display:grid;place-items:center;text-align:center;font:400 26px/1.1 Bungee;transform:rotate(12deg);z-index:3}
.foot{position:absolute;left:0;right:0;bottom:50px;text-align:center;font:700 38px "DM Sans";color:#FFF3C4;letter-spacing:.06em}
.info h2{position:absolute;left:56px;right:56px;top:60px;text-align:center;font:400 74px/1 Bungee;color:#FFD23F;text-shadow:0 6px 0 #05231a}
.list{position:absolute;left:56px;right:56px;top:190px;bottom:150px;display:flex;flex-direction:column;gap:30px}
.ct{flex:1;display:grid;grid-template-columns:1fr 370px;background:linear-gradient(160deg,#FFD23F,#FF9F1C);padding:12px;border-radius:40px;box-shadow:0 14px 0 #05231a}
.ct>div{background:#FFF3C4;border-radius:30px}
.ct .if{display:flex;flex-direction:column;justify-content:center;padding:0 36px;border-right:6px dashed #0B3D2E;border-radius:30px 0 0 30px}
.if small{font:700 26px "DM Sans";letter-spacing:.16em;text-transform:uppercase;color:#E5266A}
.if p{font:700 46px/1.1 "DM Sans";margin-top:8px}
.ct .ans{position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:radial-gradient(circle,#FFE9A8,#FF86B4);border-radius:0 30px 30px 0;padding-right:70px}
.ans .mp{width:84px;height:84px}
.ans b{font:400 38px/1.05 Bungee;text-align:center}
.ans .fl{position:absolute;right:0;top:0;bottom:0;width:90px;background:repeating-linear-gradient(115deg,#D9DADF 0 10px,#BFC1C9 10px 20px);clip-path:polygon(40% 0,100% 0,100% 100%,0 100%,30% 70%,10% 45%)}
.ans .fl:after{content:"SCRATCH";position:absolute;left:34px;top:50%;font:400 22px Bungee;color:#8b8d97;transform:rotate(90deg) translate(-40%,-30%);transform-origin:left top;white-space:nowrap}
`,
  hero() {
    return `<div class="tk"><div class="tin"><div class="top"><span>Lucky pick</span><b>No. 037</b></div>
<h1>${COPY.hero[0]} <em>${COPY.hero[1]}</em><small>${COPY.hero[2]}</small></h1>
<div class="pan"><div class="rev">${mp('#FF7A1A', '#0B3D2E', 5)}<span class="q">?</span>${mp('#2B59C3', '#0B3D2E', 5)}</div><div class="foil"></div><div class="coin">SWIPE<br>TO<br>REVEAL</div></div></div></div>
<div class="foot">${COPY.site}</div>`;
  },
  info() {
    const rows = [['If', 'Base Catan feels too small', 'Seafarers', '#FF7A1A'], ['If', 'You know base Catan cold', 'Cities &amp; Knights', '#2B59C3'], ['If', 'You still argue about the robber', 'Neither yet', '#0B3D2E']];
    return `<h2>Scratch your match</h2><div class="list">${rows.map(r => `<div class="ct"><div class="if"><small>${r[0]}</small><p>${r[1]}</p></div><div class="ans">${mp(r[3], '#0B3D2E', 5)}<b>${r[2]}</b><i class="fl"></i></div></div>`).join('')}</div>
<div class="foot">${COPY.site}</div>`;
  },
};

/* ---------- Q  TIER LIST: where would you put them? ---------- */
const chip = (t, c) => `<div class="chip">${mp(c, '#111', 5)}<span>${t}</span></div>`;
D.q = {
  name: 'Tier List',
  fonts: 'family=Archivo+Black&family=Inter:wght@500;700',
  check: ['40px "Archivo Black"', '700 30px Inter'],
  css: `
body{background:#141414;color:#fff;font-family:Inter,sans-serif;position:relative}
.wrap{position:absolute;inset:0;padding:60px 50px 50px;display:flex;flex-direction:column}
h1{font:400 84px/1.03 "Archivo Black";text-transform:uppercase}
h1 em{font-style:normal;color:#FFDF7F}
h1 small{display:block;margin-top:14px;font-size:46px;color:#9a9a9a}
.board{margin-top:36px;border:4px solid #000;display:flex;flex-direction:column;background:#1f1f1f}
.tr{display:grid;grid-template-columns:170px 1fr;border-bottom:4px solid #000;min-height:190px}
.tr:last-child{border:0}
.lb{display:grid;place-items:center;color:#000;font:400 78px "Archivo Black";text-align:center}
.cell{display:flex;align-items:center;gap:20px;padding:14px 26px;flex-wrap:wrap}
.pool{margin-top:34px;display:flex;gap:22px;flex-wrap:wrap;align-items:center;border:4px dashed #555;border-radius:24px;padding:26px}
.chip{display:flex;align-items:center;gap:16px;background:#fff;color:#111;border-radius:22px;padding:12px 28px 12px 16px;font:400 40px "Archivo Black";box-shadow:0 8px 0 #000}
.chip .mp{width:68px;height:68px}
.drag{margin-top:26px;font:700 42px Inter;color:#FFDF7F}
.foot{margin-top:auto;display:flex;justify-content:space-between;font:700 34px Inter;color:#9a9a9a}
.note{font:700 38px/1.15 Inter;color:#fff}
.note small{display:block;font:500 28px Inter;color:#9a9a9a;margin-top:4px}
.info .tr{flex:1}
.info .board{flex:1}
.info .chip{font-size:44px}
`,
  hero() {
    const tiers = [['S', '#FF7F7F', 'Buy first'], ['A', '#FFBF7F', 'Buy later'], ['B', '#FFDF7F', 'Maybe'], ['C', '#BFFF7F', 'Skip for now']];
    return `<div class="wrap"><h1>${COPY.hero[0]} <em>${COPY.hero[1]}</em><small>${COPY.hero[2]}</small></h1>
<div class="board">${tiers.map(t => `<div class="tr"><div class="lb" style="background:${t[1]}">${t[0]}</div><div class="cell"><span style="font:700 34px Inter;color:#6b6b6b">${t[2]}</span></div></div>`).join('')}</div>
<div class="pool">${chip('Seafarers', '#2B59C3')}${chip('C&amp;K', '#E5531F')}</div>
<div class="drag">Where would you put them? Swipe &rarr;</div>
<div class="foot"><span>${COPY.site}</span><span>Tier list</span></div></div>`;
  },
  info() {
    const rows = [['S', '#FF7F7F', chip('Seafarers', '#2B59C3'), 'Base Catan feels too small'], ['A', '#FFBF7F', chip('Cities &amp; Knights', '#E5531F'), 'You know base Catan cold'], ['C', '#BFFF7F', chip('Both', '#777'), 'You still argue about the robber']];
    return `<div class="wrap"><h1 style="font-size:70px">Seafarers<br>or <em>Cities &amp; Knights?</em></h1>
<div class="board">${rows.map(r => `<div class="tr"><div class="lb" style="background:${r[1]}">${r[0]}</div><div class="cell" style="flex-direction:column;align-items:flex-start;justify-content:center;gap:12px">${r[2]}<div class="note">${['Buy first if', 'Buy later if', 'Skip both if'][rows.indexOf(r)]}:<small>${r[3]}</small></div></div></div>`).join('')}</div>
<div class="foot" style="margin-top:34px"><span>${COPY.site}</span><span>Tier list</span></div></div>`;
  },
};

export { D };

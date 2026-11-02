#!/usr/bin/env node
// THROWAWAY prototype for ticket 07, round 4.
// Keeps A2 + I2 (gamified, approved).
// Adds gamified ideas: O Scratch Card, P Match Day (sports scoreboard).
// Stats, chat lines and scores are SAMPLE copy. Real batches fact-check every claim.
// Run: node gen-round4.mjs <batch-dir>   Render: cd .agents/skills/social-studio && node render.mjs <batch-dir>
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { D as D3, VS, SKIP, mp } from './gen-round3.mjs';
import { page, COPY, SIZES } from './gen-round2.mjs';

const BATCH = path.resolve(process.argv[2]);
const D = { a2: D3.a2, i2: D3.i2 };

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

/* ---------- P  MATCH DAY: sports broadcast scoreboard ---------- */
D.p = {
  name: 'Match Day',
  fonts: 'family=Anton&family=Barlow+Condensed:wght@600;700',
  check: ['40px Anton', '700 30px "Barlow Condensed"'],
  css: `
body{background:#0A1230;color:#fff;font-family:"Barlow Condensed",sans-serif;position:relative}
body:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(115deg,#ffffff08 0 40px,transparent 40px 80px)}
.wrap{position:absolute;inset:0;padding:56px 50px 0;display:flex;flex-direction:column}
.bc{display:flex;align-items:center;gap:20px;font:700 34px "Barlow Condensed";letter-spacing:.14em;text-transform:uppercase}
.live{background:#FF2D2D;padding:6px 20px;border-radius:8px;font-weight:700}
.sc{margin-top:56px;display:grid;grid-template-columns:1fr 150px 1fr;align-items:stretch;border-radius:20px;overflow:hidden;box-shadow:0 16px 0 #000a}
.tm{padding:30px 20px 26px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px}
.tm .mp{width:250px;height:250px;filter:drop-shadow(5px 6px 0 #0006)}
.tm b{font:400 46px/1 Anton;text-transform:uppercase;letter-spacing:.02em}
.tm small{font:700 28px "Barlow Condensed";letter-spacing:.1em;text-transform:uppercase;opacity:.85}
.mid{background:#C8FF2E;color:#0A1230;display:flex;flex-direction:column;align-items:center;justify-content:center;font:400 72px/1 Anton}
.mid small{font:700 26px "Barlow Condensed";letter-spacing:.14em}
.score{margin-top:34px;display:flex;justify-content:center;gap:26px}
.score i{font:400 190px/1 Anton;font-style:normal;background:#fff;color:#0A1230;width:210px;text-align:center;border-radius:16px;padding:14px 0}
.score span{align-self:center;font:400 90px Anton;color:#C8FF2E}
h1{margin-top:56px;font:400 124px/1.02 Anton;text-transform:uppercase}
h1 em{font-style:normal;color:#C8FF2E}
h1 small{display:block;font-size:66px;margin-top:10px;color:#FF7A3C}
.tick{margin-top:auto;margin-left:-50px;margin-right:-50px;background:#C8FF2E;color:#0A1230;padding:20px 50px;font:700 36px "Barlow Condensed";letter-spacing:.12em;text-transform:uppercase;display:flex;justify-content:space-between}
.info h2{margin-top:36px;font:400 100px/1 Anton;text-transform:uppercase}
.info h2 em{font-style:normal;color:#C8FF2E}
.fin{margin-top:26px;display:grid;grid-template-columns:1fr 130px 1fr;align-items:center;background:#fff;color:#0A1230;border-radius:18px;padding:22px 30px;font:400 46px/1 Anton;text-transform:uppercase}
.fin i{font-style:normal;text-align:center;font-size:84px;background:#0A1230;color:#C8FF2E;border-radius:12px;padding:6px 0}
.fin span:last-child{text-align:right}
.rds{margin-top:30px;display:flex;flex-direction:column;gap:20px;flex:1}
.rd{flex:1;display:grid;grid-template-columns:140px 1fr 240px;align-items:center;background:#16214a;border-left:14px solid #C8FF2E;border-radius:12px;padding:0 30px 0 26px;gap:20px}
.rd .n{font:400 40px Anton;color:#C8FF2E;letter-spacing:.04em}
.rd p{font:700 44px/1.05 "Barlow Condensed";text-transform:uppercase}
.rd .w{justify-self:end;background:#FF7A3C;color:#0A1230;font:400 34px Anton;padding:10px 20px;border-radius:10px;text-align:center;text-transform:uppercase;line-height:1.1}
.rd .w.b{background:#3DA9FF}
.motm{margin-top:24px;background:#FF7A3C;color:#0A1230;padding:20px 28px;border-radius:14px;font:700 40px/1.1 "Barlow Condensed";text-transform:uppercase}
.motm b{font:400 40px Anton;margin-right:12px}
.info .tick{margin-top:28px}
`,
  hero() {
    return `<div class="wrap"><div class="bc"><span class="live">Live</span><span>Catan Expansion Cup</span></div>
<div class="sc"><div class="tm" style="background:#2563EB">${mp('#fff', '#0A1230', 4)}<b>Seafarers</b><small>Ships &amp; islands</small></div>
<div class="mid">VS<small>KICK-OFF</small></div>
<div class="tm" style="background:#E5531F">${mp('#FFD23F', '#0A1230', 4)}<b>Cities &amp; Knights</b><small>Raids &amp; trade</small></div></div>
<div class="score"><i>?</i><span>-</span><i>?</i></div>
<h1>${COPY.hero[0]} <em>${COPY.hero[1]}</em><small>${COPY.hero[2]}</small></h1>
<div class="tick"><span>${COPY.site}</span><span>Swipe for the result &rarr;</span></div></div>`;
  },
  info() {
    return `<div class="wrap"><div class="bc"><span class="live" style="background:#C8FF2E;color:#0A1230">Full time</span><span>Catan Expansion Cup</span></div>
<h2>Match <em>report</em></h2>
<div class="fin"><span>Seafarers</span><i>2-1</i><span>C&amp;K</span></div>
<div class="rds">
<div class="rd"><span class="n">ROUND 1</span><p>Easier to learn</p><span class="w">Seafarers</span></div>
<div class="rd"><span class="n">ROUND 2</span><p>Bigger map</p><span class="w">Seafarers</span></div>
<div class="rd"><span class="n">ROUND 3</span><p>Deeper, longer game</p><span class="w b">C&amp;K</span></div></div>
<div class="motm"><b>VERDICT</b>Seafarers first. Cities &amp; Knights once you know base cold. Skip both if you still argue about the robber.</div>
<div class="tick"><span>${COPY.site}</span><span>Full time</span></div></div>`;
  },
};


await mkdir(path.join(BATCH, 'pinterest'), { recursive: true });
await mkdir(path.join(BATCH, 'instagram'), { recursive: true });
for (const [id, d] of Object.entries(D)) {
  const [pw, ph] = SIZES.pin, [iw, ih] = SIZES.ig;
  await writeFile(path.join(BATCH, 'pinterest', `${id}-hero.html`), page(d, 'pin', 'hero', pw, ph));
  await writeFile(path.join(BATCH, 'instagram', `${id}-cover.html`), page(d, 'ig', 'hero', iw, ih));
  await writeFile(path.join(BATCH, 'instagram', `${id}-info.html`), page(d, 'ig', 'info', iw, ih));
}
console.log('wrote', Object.keys(D).length, 'directions');

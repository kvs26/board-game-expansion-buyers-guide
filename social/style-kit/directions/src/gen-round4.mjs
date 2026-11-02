#!/usr/bin/env node
// THROWAWAY prototype for ticket 07, round 4.
// Keeps A2 + I2 (gamified, approved). Redesigns N (group chat) properly as N2 (iOS dark mode).
// Adds gamified ideas: O Scratch Card, P Match Day (sports scoreboard), Q Tier List.
// Stats, chat lines and scores are SAMPLE copy. Real batches fact-check every claim.
// Run: node gen-round4.mjs <batch-dir>   Render: cd .agents/skills/social-studio && node render.mjs <batch-dir>
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { D as D3, VS, SKIP, mp } from './gen-round3.mjs';
import { page, COPY, SIZES } from './gen-round2.mjs';

const BATCH = path.resolve(process.argv[2]);
const D = { a2: D3.a2, i2: D3.i2 };

/* ---------- N2  GROUP CHAT, properly designed: iOS dark mode ---------- */
const av = [['J', '#FF8A5B'], ['S', '#5BC8FF'], ['P', '#A78BFF']];
const bub = (who, text, o = {}) => `<div class="m ${who === 'You' ? 'me' : ''} ${o.last ? 'last' : ''} ${o.big ? 'big' : ''}">${o.first && who !== 'You' ? `<div class="who">${who}</div>` : ''}<div class="b">${text}${o.tap ? `<i class="tap">${o.tap}</i>` : ''}</div></div>`;
const phone = inner => `<div class="sb"><span>9:41</span><span class="ic"><span class="sig"><i style="height:10px"></i><i style="height:16px"></i><i style="height:22px"></i><i style="height:28px"></i></span><span class="batt"><i></i></span></span></div>
<div class="hd"><span class="back">&#8249;</span><div class="av">${av.map(a => `<i style="background:${a[1]}">${a[0]}</i>`).join('')}</div><b>Catan Night</b><small>3 people</small></div>
<div class="chat">${inner}</div>
<div class="inp"><div class="plus">+</div><div class="fld">iMessage</div></div>`;
const link = `<div class="lk"><div class="im">${mp('#FFF7E0', '#7A2E00', 4, 'mp', 'width:100px;height:100px;transform:rotate(-10deg)')}${mp('#2B1A66', '#FFF7E0', 4, 'mp', 'width:76px;height:76px;transform:rotate(14deg);margin-left:-10px;margin-top:24px')}</div>
<div class="t">Seafarers or C&amp;K?</div><div class="u">${COPY.site}</div></div>`;
D.n2 = {
  name: 'Group Chat (iOS)',
  fonts: 'family=Inter:wght@500;600;700;800',
  check: ['800 40px Inter', '600 30px Inter'],
  css: `
body{background:#000;color:#fff;font-family:Inter,sans-serif;position:relative}
.sb{position:absolute;left:0;right:0;top:0;height:96px;display:flex;justify-content:space-between;align-items:center;padding:18px 70px 0;font:700 38px Inter}
.ic{display:flex;gap:16px;align-items:center}
.sig{display:flex;gap:5px;align-items:flex-end}.sig i{width:9px;background:#fff;border-radius:2px}
.batt{width:62px;height:30px;border:3px solid #ffffff88;border-radius:10px;padding:3px}.batt i{display:block;height:100%;width:78%;background:#fff;border-radius:5px}
.hd{position:absolute;left:0;right:0;top:96px;height:176px;background:#161618;border-bottom:2px solid #2c2c30;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}
.back{position:absolute;left:40px;top:52px;font:500 96px/1 Inter;color:#0A84FF}
.av{display:flex;margin-bottom:6px}.av i{width:76px;height:76px;border-radius:50%;border:4px solid #161618;margin-left:-16px;display:grid;place-items:center;font:700 32px Inter;font-style:normal;color:#10101a}
.hd b{font:700 32px Inter}.hd small{font:500 24px Inter;color:#8e8e93}
.chat{position:absolute;left:0;right:0;top:272px;bottom:176px;padding:14px 38px;display:flex;flex-direction:column;gap:10px}
.chat>*{flex-shrink:0}
.chat>.sp{flex:1 1 0;flex-shrink:1}
.ts{align-self:center;font:600 24px Inter;color:#8e8e93;margin:6px 0 10px}
.m{max-width:84%;position:relative;align-self:flex-start}.m.me{align-self:flex-end}
.who{font:600 24px Inter;color:#8e8e93;margin:10px 0 6px 32px}
.b{position:relative;background:#26262b;border-radius:44px;padding:18px 34px;font:500 45px/1.2 Inter}
.me .b{background:#0A84FF}
.big .b{font:700 54px/1.1 Inter}
.b b{font-weight:800}
.last .b:before{content:"";position:absolute;bottom:0;left:-12px;width:30px;height:36px;background:#26262b;border-bottom-right-radius:30px}
.last .b:after{content:"";position:absolute;bottom:0;left:-32px;width:32px;height:38px;background:#000;border-bottom-right-radius:24px}
.me.last .b:before{left:auto;right:-12px;background:#0A84FF;border-bottom-right-radius:0;border-bottom-left-radius:30px}
.me.last .b:after{left:auto;right:-32px;border-bottom-right-radius:0;border-bottom-left-radius:24px}
.tap{position:absolute;top:-34px;right:-22px;width:70px;height:70px;border-radius:50%;background:#3a3a40;border:6px solid #000;display:grid;place-items:center;font-size:34px;font-style:normal}
.me .tap{right:auto;left:-22px;background:#0A84FF}
.typ{align-self:flex-start;margin-top:6px;background:#26262b;border-radius:44px;padding:26px 36px;display:flex;gap:10px;position:relative}
.typ i{width:20px;height:20px;border-radius:50%;background:#8e8e93}.typ i:nth-child(2){opacity:.7}.typ i:nth-child(3){opacity:.4}
.lk{align-self:flex-end;width:88%;background:#26262b;border-radius:40px;overflow:hidden;margin-top:8px}
.lk .im{height:130px;background:linear-gradient(135deg,#FF8A3C,#E5481A);display:flex;align-items:center;justify-content:center;overflow:hidden}
.lk .t{padding:20px 32px 4px;font:800 42px/1.15 Inter}.lk .u{padding:0 32px 22px;font:500 28px Inter;color:#8e8e93}
.dl{align-self:flex-end;font:600 24px Inter;color:#8e8e93;margin:4px 12px 0 0}
.sp{flex:1}
.inp{position:absolute;left:0;right:0;bottom:0;height:150px;padding:0 38px 34px;display:flex;align-items:center;gap:22px;background:linear-gradient(#0000,#000 40%)}
.plus{width:80px;height:80px;border-radius:50%;background:#26262b;display:grid;place-items:center;font:500 56px Inter;color:#8e8e93}
.fld{flex:1;height:80px;border:3px solid #3a3a3f;border-radius:44px;padding:0 32px;display:flex;align-items:center;font:500 34px Inter;color:#6d6d73}
`,
  hero() {
    return phone(`<div class="ts">Today 9:41 PM</div>
${bub('Jo', 'ok which Catan expansion should we buy first??', { first: 1, last: 1, big: 1 })}
${bub('Sam', 'Seafarers', { first: 1, last: 1, tap: '\ud83d\udc4d' })}
${bub('Priya', 'no. Cities &amp; Knights', { first: 1, last: 1, tap: '\ud83d\ude02' })}
<div class="typ"><i></i><i></i><i></i></div><div class="sp"></div>
${bub('You', 'wait. there is a guide', { last: 1 })}${link}`);
  },
  info() {
    return phone(`<div class="ts">Today 9:44 PM</div>
${bub('Jo', 'ok so which one??', { first: 1, last: 1, big: 1 })}
${bub('You', '<b>Seafarers</b> \u26f5 if base Catan feels too small')}
${bub('You', '<b>Cities &amp; Knights</b> \u2694\ufe0f once you know base cold', { last: 1, tap: '\ud83d\udc4d' })}
${bub('Sam', 'still arguing about the robber?', { first: 1, last: 1 })}
${bub('You', '<b>neither yet.</b> fix that first', { last: 1, tap: '\ud83d\ude02' })}
${bub('You', '<u>whichexpansion.com</u>', { last: 1 })}<div class="sp"></div><div class="dl">Delivered</div>`);
  },
};

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

await mkdir(path.join(BATCH, 'pinterest'), { recursive: true });
await mkdir(path.join(BATCH, 'instagram'), { recursive: true });
for (const [id, d] of Object.entries(D)) {
  const [pw, ph] = SIZES.pin, [iw, ih] = SIZES.ig;
  await writeFile(path.join(BATCH, 'pinterest', `${id}-hero.html`), page(d, 'pin', 'hero', pw, ph));
  await writeFile(path.join(BATCH, 'instagram', `${id}-cover.html`), page(d, 'ig', 'hero', iw, ih));
  await writeFile(path.join(BATCH, 'instagram', `${id}-info.html`), page(d, 'ig', 'info', iw, ih));
}
console.log('wrote', Object.keys(D).length, 'directions');

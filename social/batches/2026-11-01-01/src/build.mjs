#!/usr/bin/env node
// Batch 2026-11-01-01 generator. Mix of three kit styles: a2 Box Lid, o Scratch Card, i2 Airmail.
// One style per carousel/pin. Run from the repo root:
//   node sites/board-game-expansion-buyers-guide/social/batches/2026-11-01-01/src/build.mjs <batch-dir>
import { mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { D as D3, mp } from '../../../style-kit/directions/src/gen-round3.mjs';
import { COPY, stamp, meepleSvg } from '../../../style-kit/directions/src/gen-round2.mjs';
import { D as DO } from './styles-o.mjs';

const BATCH = path.resolve(process.argv[2]);
const SIZES = { pin: [1000, 1500], ig: [1080, 1440] };
const SITE = COPY.site;

/* ---------- style definitions: kit CSS + the layouts this batch needs ---------- */
const S = {
  a2: { ...D3.a2, css: D3.a2.css + `
.info .frame{display:flex;flex-direction:column;padding:50px 50px 30px;gap:26px}
.info h2{position:static;text-align:center;font-size:68px;line-height:1.06;text-shadow:5px 5px 0 #E8B93B}
.kk{align-self:center;background:#D9411E;color:#F6EBD0;font:400 36px "Alfa Slab One";padding:10px 30px;box-shadow:6px 6px 0 #0F4C5C;transform:rotate(-2deg)}
.rws{flex:1;min-height:0;display:flex;flex-direction:column;gap:26px;justify-content:center}
.rw{flex:1;max-height:400px;display:grid;grid-template-columns:270px 1fr;border:6px solid #0F4C5C;box-shadow:8px 8px 0 #0F4C5C;background:#FFF8E3;color:#0F4C5C}
.rw b{background:#D9411E;color:#F6EBD0;display:grid;place-items:center;text-align:center;padding:14px;font:400 36px/1.1 "Alfa Slab One"}
.rw:nth-child(2) b{background:#2E9E8F}
.rw:nth-child(3) b{background:#E8B93B;color:#0F4C5C}
.rw p{padding:18px 28px;display:flex;align-items:center;font:500 44px/1.22 Archivo}
.rws.three .rw p{font-size:38px}
` },
  o: { ...DO.o, css: DO.o.css + `
.info h2{font-size:60px;line-height:1.05;top:60px}
.list{top:230px}
.ct .if p{font-size:42px}
.dt .pan{margin-top:20px}
.dt .rev{flex-direction:column;align-items:flex-start;justify-content:center;gap:26px;padding:40px 44px}
.dt .rev p{font:700 70px/1.12 "DM Sans";color:#0B3D2E;max-width:88%}
.dt .rev .mp{position:absolute;right:30px;bottom:24px;width:200px;height:200px;opacity:.9}
.dt h1{font-size:74px}
` },
  i2: { ...D3.i2, css: D3.i2.css + `
.info h2{left:46px;right:46px;top:34px;font-size:80px;line-height:1}
.stamps{top:230px;justify-content:space-around;gap:0}
.it b{font-size:70px}
.it .by{font-size:34px}
` },
};

/* ---------- layouts ---------- */
const a2Info = ({ k, title, rows, strip }) => `<div class="frame" data-c>${k ? `<div class="kk">${k}</div>` : ''}<h2>${title}</h2>
<div class="rws${rows.length > 2 ? ' three' : ''}">${rows.map(r => `<div class="rw" data-c><b>${r[0]}</b><p>${r[1]}</p></div>`).join('')}</div>
<div class="skip">${strip}</div><div class="foot">${SITE}</div></div>`;

const oInfo = ({ title, rows }) => `<h2>${title}</h2><div class="list">${rows.map(r => `<div class="ct"><div class="if" data-c><small>${r[0]}</small><p>${r[1]}</p></div><div class="ans">${mp(r[3] || '#FF7A1A', '#0B3D2E', 5)}<b>${r[2]}</b><i class="fl"></i></div></div>`).join('')}</div>
<div class="foot">${SITE}</div>`;
const oDetail = ({ k, tag = 'Cheap pick', title, lines }) => `<div class="tk dt"><div class="tin"><div class="top"><span>${tag}</span><b>${k}</b></div>
<h1 style="margin-top:24px">${title}</h1><div class="pan"><div class="rev" data-c>${lines.map(l => `<p>${l}</p>`).join('')}${mp('#FF7A1A', '#0B3D2E', 5)}</div></div></div></div>
<div class="foot">${SITE}</div>`;

const COLS = ['#D8352A', '#2B59C3', '#E0A81C'];
const i2Info = ({ title, rows }) => `<div class="env"><div class="tape"></div><h2>${title}</h2><div class="stamps">${rows.map((r, i) => `<div class="it">${stamp(meepleSvg(COLS[i % 3]) + `<small>${r[0]}</small>`, '#FBF1DC', `position:relative;width:200px;height:240px;transform:rotate(${i % 2 ? 3 : -3}deg)`)}
<div data-c><b>${r[1]}</b><div class="by">${r[2]}</div></div></div>`).join('')}</div></div>
<div class="foot" style="left:70px;bottom:40px">${SITE}</div>`;

/* hero: the kit's big-headline layout. Text lines + the small badge text are swapped in per post. */
const heroHtml = (st, kind, x, badge) => {
  COPY.hero = x;
  let out = S[st].hero(kind);
  if (st === 'a2') {
    out = out.replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${x[0]}<br>${x[1]}<br><span style="font-size:.62em">${x[2]}</span></h1>`);
    out = out.replace(/<div class="burst"[^>]*>[\s\S]*?<\/div>/, `<div class="burst" style="font-size:38px">${badge}</div>`);
  }
  if (st === 'o') out = out.replace('SWIPE<br>TO<br>REVEAL', badge);
  if (st === 'i2') out = out.replace('swipe<br>to pick', badge);
  return out;
};

/* ---------- content ---------- */
// Every fact comes from catalog.json (reason / adds / sources.facts) for that expansion page.
const H = (slug, st, lines, badge) => ({ slug, st, hero: lines, badge });
const PINS = [
  // traffic
  H('p01-catan-first', 'a2', ['Seafarers', 'first', 'then Cities &amp; Knights'], 'Buy<br>first'),
  H('p02-pandemic-on-the-brink', 'a2', ['On the Brink', 'first', 'Pandemic expansions'], 'Buy<br>first'),
  H('p03-wingspan-oceania-first', 'a2', ['Oceania', 'first', 'then European'], 'Buy<br>first'),
  { slug: 'p04-prelude-first', st: 'i2', info: { title: 'Terraforming Mars: the order', rows: [
    ['NO.1', 'Prelude', 'Cuts the slow opening rounds. Almost no new rules.'],
    ['NO.2', 'Colonies', 'Buy after Prelude.'],
    ['NO.3', 'Turmoil', 'Adds the most rules and time.']] } },
  { slug: 'p05-catan-56-matching-box', st: 'i2', info: { title: 'CATAN with 5 or 6 players?', rows: [
    ['STEP 1', 'Base 5-6 box', 'You need the base-game 5-6 box first.'],
    ['STEP 2', 'Matching boxes', 'Each expansion needs its own matching 5-6 box.'],
    ['CHECK', 'Count heads', 'Only buy them if 5 or 6 really show up.']] } },
  // reach
  H('p06-explorers-pirates-vs-cities-knights', 'o', ['Pick one,', 'not both', 'Explorers &amp; Pirates can&rsquo;t combine with Cities &amp; Knights'], 'PICK<br>ONE'),
  H('p07-usa-1910-needs-usa-box', 'a2', ['USA 1910', 'USA box only', 'not the Europe box'], 'Not<br>Europe'),
  { slug: 'p08-king-of-tokyo-power-up-first', st: 'i2', info: { title: 'King of Tokyo: buy this first', rows: [
    ['NO.1', 'Power Up!', 'Evolution cards need it.'],
    ['NO.2', 'Halloween pack', 'Its Evolution cards only work with Power Up!']] } },
  { slug: 'p09-root-exiles-partisans-ten-dollars', st: 'o', info: { title: 'A cheap Root add-on worth owning', rows: [
    ['Price', 'Exiles and Partisans Deck, about $10', '$10'], ['Fit', 'Easy to add to any Root game', 'EASY', '#2B59C3'], ['Fans', 'A reviewer says every Root owner should have it', 'FANS', '#E5266A']] } },
  { slug: 'p10-ark-nova-marine-worlds-golden-geek', st: 'o', info: { title: 'Ark Nova: Marine Worlds, worth it?', rows: [
    ['Award', '2023 Golden Geek Best Expansion', '2023'], ['Reviews', 'Alternate action cards and faster card-row churn', 'REVIEWS', '#2B59C3'], ['Rating', '8.9 on BoardGameGeek', 'BGG', '#E5266A']] } },
  H('p11-spirit-island-nature-incarnate-last', 'a2', ['Nature', 'Incarnate', 'is not the first buy'], 'Buy<br>last'),
  { slug: 'p12-dominion-fifteen-expansions', st: 'o', info: { title: 'Dominion has 15 expansions', rows: [
    ['On our list', 'Fifteen expansions in all', '15'], ['Buy first', 'Seaside. Most guides call it the best first one', 'SEASIDE', '#2B59C3'], ['Why', 'Duration cards add planning without many extra rules', 'WHY', '#E5266A']] } },
  { slug: 'p13-7-wonders-dont-mix-editions', st: 'i2', info: { title: '7 Wonders: don&rsquo;t mix editions', rows: [
    ['NO.1', 'Cities (2nd Ed.)', 'Widely called one of the best. Buy first.'],
    ['NO.2', 'One edition only', 'The publisher warns against mixing editions.']] } },
  H('p14-splendor-silk-road', 'a2', ['Splendor', 'Silk Road', 'adds variety'], '$18.99<br>list'),
];

const IG = [
  { slug: 'c1-catan-first-five', st: 'i2', slides: [
    { hero: ['Which CATAN', 'expansion', 'first? Swipe.'], badge: 'swipe' },
    { info: { title: 'The CATAN order', rows: [['NO.1', 'Seafarers', 'Islands and ships, not much heavier.'], ['NO.2', 'Cities &amp; Knights', 'Deeper and longer.'], ['NO.3', 'Traders &amp; Barbarians', 'Smaller variants, 2-player rules.']] } },
    { info: { title: 'Before you buy', rows: [['CHECK', '5-6 players?', 'Each expansion needs its own matching 5-6 box.'], ['NOTE', 'Explorers &amp; Pirates', 'Can&rsquo;t combine with Cities &amp; Knights.']] } },
  ] },
  { slug: 'c2-five-expansion-traps', st: 'a2', slides: [
    { hero: ['5 expansion', 'mistakes', 'to avoid'], badge: 'Swipe' },
    { info: { k: 'Trap 1', title: 'One 5-6 box per expansion', rows: [['The rule', 'Each expansion needs its own matching 5-6 box'], ['Also', 'You need the base-game 5-6 box first']], strip: 'Count your boxes first' } },
    { info: { k: 'Trap 2', title: 'Explorers &amp; Pirates + Cities &amp; Knights', rows: [['The rule', 'They can&rsquo;t be combined'], ['Fix', 'Pick one expansion for that game night']], strip: 'Choose one, not both' } },
    { info: { k: 'Trap 3', title: 'USA 1910 needs the USA box', rows: [['Works', 'The original USA box'], ['Does not', 'The Europe box']], strip: 'Check the box first' } },
    { info: { k: 'Trap 4', title: 'Don&rsquo;t mix 7 Wonders editions', rows: [['Warning', 'The publisher warns against mixing editions'], ['Fix', 'Use 2nd edition expansions with the 2nd edition game']], strip: 'Same edition only' } },
    { info: { k: 'Trap 5', title: 'Power Up! before Halloween', rows: [['Why', 'The Halloween pack&rsquo;s Evolution cards only work with Power Up!'], ['Fix', 'Buy Power Up! first']], strip: 'Buy Power Up! first' } },
  ] },
  { slug: 'c3-first-expansions-under-20', st: 'o', slides: [
    { hero: ['4 cheap', 'expansions', 'worth it?'], badge: 'SWIPE<br>TO<br>REVEAL' },
    { detail: { k: '~$10', title: 'Root: Exiles and Partisans Deck', lines: ['Cheap and easy to add', 'A reviewer says every Root owner should have it'] } },
    { detail: { k: '$12.95', title: 'Ark Nova: Zoo Map Pack 2', lines: ['5 maps for about $13', 'Does not need Marine Worlds'] } },
    { detail: { k: '$19.95', title: 'Terraforming Mars: Prelude', lines: ['Cuts the slow opening rounds', 'Almost no new rules'] } },
    { detail: { k: '$18.99', title: 'Splendor: The Silk Road', lines: ['Variety without added complexity', 'Easy to teach. List prices when we checked'] } },
  ] },
  { slug: 'c4-buy-order-matters', st: 'a2', slides: [
    { hero: ['Buy order', 'matters', 'Four games. Swipe.'], badge: 'Swipe' },
    { info: { k: 'Game 1', title: 'Spirit Island', rows: [['First', 'Branch &amp; Claw. Small and cheap'], ['Then', 'Jagged Earth. Needed before Nature Incarnate'], ['Last', 'Nature Incarnate. Hardest Spirits']], strip: 'Nature Incarnate last' } },
    { info: { k: 'Game 2', title: 'Pandemic', rows: [['First', 'On the Brink. Extra roles and a 5th player'], ['Then', 'In the Lab. Needs On the Brink too']], strip: 'Start with On the Brink' } },
    { info: { k: 'Game 3', title: 'Terraforming Mars', rows: [['First', 'Prelude. Cuts the slow opening rounds'], ['Then', 'Colonies. Buy after Prelude'], ['Last', 'Turmoil. Most rules and time']], strip: 'Start with Prelude' } },
    { info: { k: 'Game 4', title: 'Scythe', rows: [['First', 'The Rise of Fenris. First for most groups'], ['Then', 'Invaders from Afar. 6-7 players or more factions']], strip: 'Fenris first' } },
  ] },
  { slug: 's1-ark-nova-marine-worlds', st: 'o', slides: [
    { detail: { k: '2023', tag: 'Award winner', title: 'Ark Nova: Marine Worlds', lines: ['Golden Geek Best Expansion', '8.9 on BoardGameGeek'] } },
  ] },
  { slug: 's2-dominion-fifteen', st: 'i2', slides: [
    { info: { title: 'Dominion: 15 expansions', rows: [['NO.1', 'Seaside', 'Most guides call it the best first expansion.'], ['WHY', 'Duration cards', 'Planning without many extra rules.'], ['ALL', '15 on our list', 'Full ranking: link in bio.']] } },
  ] },
];

/* ---------- page + render ---------- */
const CHECK = `window.addEventListener('load',()=>{const bad=[...document.querySelectorAll('[data-c]')].filter(e=>e.scrollHeight>e.clientHeight+3||e.scrollWidth>e.clientWidth+3);if(bad.length)window.__info.error='overflow in '+bad.length+' box(es): '+bad.map(e=>e.className+' '+e.scrollHeight+'>'+e.clientHeight).join('; ');});`;
const page = (d, kind, view, html) => {
  const [w, hh] = SIZES[kind];
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${d.fonts}&display=block">
<style>*{box-sizing:border-box;margin:0;padding:0}html,body{width:${w}px;height:${hh}px;overflow:hidden}${d.css}</style></head>
<body class="${kind === 'pin' ? 'pin' : 'ig'}${view === 'info' ? ' info' : ''}">${html}
<script>window.__info={fonts:[]};${CHECK}document.fonts.ready.then(()=>{window.__info.fonts=${JSON.stringify(d.check)}.map(f=>[f,document.fonts.check(f)])});</script>
</body></html>`;
};
const infoHtml = (st, x) => st === 'a2' ? a2Info(x) : st === 'o' ? oInfo(x) : i2Info(x);

await rm(path.join(BATCH, 'pinterest'), { recursive: true, force: true });
await rm(path.join(BATCH, 'instagram'), { recursive: true, force: true });
await mkdir(path.join(BATCH, 'pinterest'), { recursive: true });
for (const p of PINS) {
  const html = p.hero ? page(S[p.st], 'pin', 'hero', heroHtml(p.st, 'pin', p.hero, p.badge)) : page(S[p.st], 'pin', 'info', infoHtml(p.st, p.info));
  await writeFile(path.join(BATCH, 'pinterest', `${p.slug}.html`), html);
}
for (const post of IG) {
  const d = S[post.st];
  const render = s => {
    if (s.hero) return page(d, 'ig', 'hero', heroHtml(post.st, 'ig', s.hero, s.badge));
    if (s.detail) return page(d, 'ig', 'info', oDetail(s.detail));
    return page(d, 'ig', 'info', infoHtml(post.st, s.info));
  };
  if (post.slides.length === 1) {
    await mkdir(path.join(BATCH, 'instagram'), { recursive: true });
    await writeFile(path.join(BATCH, 'instagram', `${post.slug}.html`), render(post.slides[0]));
  } else {
    const dir = path.join(BATCH, 'instagram', post.slug);
    await mkdir(dir, { recursive: true });
    for (const [i, s] of post.slides.entries()) await writeFile(path.join(dir, `slide-${String(i + 1).padStart(2, '0')}.html`), render(s));
  }
}
console.log('wrote', PINS.length, 'pins,', IG.length, 'instagram posts');

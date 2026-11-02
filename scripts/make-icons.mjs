// Render the brand mark (fanned cards, picked card carries a meeple) to every
// icon the site and social profiles use. The SVG built here is the source of truth.
// Run from the site root: node scripts/make-icons.mjs   (then: python3 scripts/make-images.py for the OG cover)
// Uses the Playwright install that ships with the repo-level social-studio skill.
import { chromium } from '../../../.agents/skills/social-studio/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const NAVY = '#1D2A44', CORAL = '#FF6B4A', TEAL = '#5BC0BE', SAND = '#F3E3C3', CREAM = '#FBF6EC';
const MEEPLE = 'M50 6C60 6 66 13 66 21c0 6-3 10-7 13 11 2 22 5 34 3 4 0 5 5 2 8-7 6-15 9-23 10 4 10 10 22 18 32 2 4 0 7-5 7H60c-5 0-8-5-10-12-2 7-5 12-10 12H15c-5 0-7-3-5-7 8-10 14-22 18-32-8-1-16-4-23-10-3-3-2-8 2-8 12 2 23-1 34-3-4-3-7-7-7-13C34 13 40 6 50 6Z';
const card = (fill, rot, inner = '') => `<g transform="rotate(${rot} 256 450)"><rect x="168" y="124" width="176" height="248" rx="24" fill="${fill}" stroke="${NAVY}" stroke-width="12"/>${inner}</g>`;
const MARK = card(TEAL, -20) + card(SAND, 20) + card(CORAL, 0, `<g transform="translate(184 175) scale(1.44)"><path d="${MEEPLE}" fill="${CREAM}"/></g>`);

// tile: 'round' (app-icon corners), 'square' (full bleed), 'none' (cards only, for the navy header)
const logoSvg = ({ tile = 'round', scale = 1 } = {}) => {
  const box = tile === 'none' ? '50 54 412 412' : '0 0 512 512';
  const bg = tile === 'none' ? '' : `<rect width="512" height="512" rx="${tile === 'round' ? 112 : 0}" fill="${NAVY}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">${bg}<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${MARK}</g></svg>`;
};

const browser = await chromium.launch();
const page = await browser.newPage();
async function png(svg, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`);
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

// ICO with embedded PNGs (supported by every current browser).
function ico(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(([size, buf], i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, e); head.writeUInt8(size >= 256 ? 0 : size, e + 1);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(buf.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  return Buffer.concat([head, ...pngs.map(([, b]) => b)]);
}

const round = logoSvg();
writeFileSync('public/favicon.svg', round);
writeFileSync('public/logo.png', await png(round, 512));
writeFileSync('public/apple-touch-icon.png', await png(logoSvg({ tile: 'square' }), 180));
writeFileSync('public/icon-192.png', await png(logoSvg({ tile: 'square', scale: 0.86 }), 192));
writeFileSync('public/icon-512.png', await png(logoSvg({ tile: 'square', scale: 0.86 }), 512));
const icoPngs = [];
for (const s of [16, 32, 48]) icoPngs.push([s, await png(round, s)]);
writeFileSync('public/favicon.ico', ico(icoPngs));
writeFileSync('social/avatar/logo.svg', round);
writeFileSync('social/avatar/profile.png', await png(logoSvg({ tile: 'square' }), 1000));
writeFileSync('/tmp/header-mark.svg', logoSvg({ tile: 'none' }));
await browser.close();
console.log('ok');

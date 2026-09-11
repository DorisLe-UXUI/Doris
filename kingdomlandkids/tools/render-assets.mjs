// Renders the OG image and PNG icons with headless Chromium.
//   NODE_PATH=$(npm root -g) node tools/render-assets.mjs
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..', 'static', 'assets');
// In sandboxed CI the browser must go through the egress proxy to reach Google Fonts.
const proxy = process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {};
const browser = await chromium.launch(proxy);
const shot = async (file, w, h, dest, scale = 1) => {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ignoreHTTPSErrors: !!process.env.HTTPS_PROXY });
  await page.goto('file://' + path.join(here, file));
  if (scale !== 1) await page.addStyleTag({ content: `body{zoom:${scale}}` }); // icon.html is authored at 512px
  await page.evaluate(() => Promise.all([document.fonts.load('800 28px Inter'), document.fonts.load('600 28px Inter'), document.fonts.load('800 92px "Playfair Display"'), document.fonts.load('italic 400 92px "Playfair Display"'), document.fonts.load('400 74px "Lilita One"')]).catch(() => null)); await page.waitForTimeout(600); // let web fonts settle
  await page.screenshot({ path: dest, type: 'png' });
  await page.close();
  console.log('wrote', path.relative(process.cwd(), dest));
};
await shot('og.html', 1200, 630, path.join(out, 'og', 'og-home.png'));
await shot('icon.html', 512, 512, path.join(out, 'img', 'logo-512.png'));
await shot('icon.html', 192, 192, path.join(out, 'img', 'logo-192.png'), 192 / 512);
await shot('icon.html', 180, 180, path.join(out, 'img', 'apple-touch-icon.png'), 180 / 512);
await shot('icon.html', 32, 32, path.join(out, 'img', 'favicon-32.png'), 32 / 512);
await browser.close();

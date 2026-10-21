// Usage: node scripts/screenshots.mjs <baseUrl> <outDir> <path...>  (full-page shots at 375px and 1440px)
import { chromium } from "@playwright/test";
const [,, base, out, ...paths] = process.argv;
const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
for (const [name, vp] of [["mobile", { width: 375, height: 812 }], ["desktop", { width: 1440, height: 900 }]]) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: name === "mobile" ? 2 : 1 });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "load" });
    const file = `${out}/${(p === "/" ? "home" : p.slice(1).replaceAll("/", "_"))}-${name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
}
await browser.close();

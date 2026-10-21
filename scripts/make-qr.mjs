// Writes printable QR codes (PNG + SVG) into /public/qr/.
// Usage: npm run qr        (always includes /join; /book is included for reprinted cards)
import { mkdirSync } from "node:fs";
import QRCode from "qrcode";

const SITE = "https://www.avidaluna.com";
const targets = [
  { name: "join", url: `${SITE}/join` },
  { name: "book", url: `${SITE}/book` },
];
const outDir = new URL("../public/qr/", import.meta.url);
mkdirSync(outDir, { recursive: true });

const options = {
  errorCorrectionLevel: "M",
  margin: 4,
  color: { dark: "#3E4436", light: "#FFFFFF" },
};

for (const t of targets) {
  await QRCode.toFile(new URL(`${t.name}.png`, outDir).pathname, t.url, { ...options, width: 1200 });
  await QRCode.toFile(new URL(`${t.name}.svg`, outDir).pathname, t.url, { ...options, type: "svg" });
  console.log(`public/qr/${t.name}.png and .svg -> ${t.url}`);
}

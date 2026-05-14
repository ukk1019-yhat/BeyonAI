// Run with: node generate-icons.js
// Generates PNG icons for the extension using Canvas API (Node.js + canvas package)
// If you don't have canvas installed, just use any 16x16, 48x48, 128x128 PNG files named icon16.png etc.

const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0a0a0f";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Orange circle
  ctx.fillStyle = "#c47d3b";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // E letter
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("E", size / 2, size / 2);

  return canvas.toBuffer("image/png");
}

try {
  [16, 48, 128].forEach(size => {
    const buf = generateIcon(size);
    fs.writeFileSync(path.join(__dirname, "icons", `icon${size}.png`), buf);
    console.log(`Generated icon${size}.png`);
  });
} catch (e) {
  console.log("canvas not available — create icons manually or install: npm install canvas");
}

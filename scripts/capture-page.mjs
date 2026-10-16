import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const [url, outputPath, widthArg = "1440", heightArg = "900"] = process.argv.slice(2);

if (!url || !outputPath) {
  throw new Error("Usage: node scripts/capture-page.mjs <url> <output> [width] [height]");
}

const width = Number(widthArg);
const height = Number(heightArg);
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const profilePath = await mkdtemp(path.join(os.tmpdir(), "pursha-edge-"));
const debugPort = width < 768 ? 9334 : 9333;

const browser = spawn(
  edgePath,
  [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profilePath}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function getPageTarget() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
      const targets = await response.json();
      const target = targets.find((entry) => entry.type === "page");
      if (target) return target;
    } catch {
      // Browser is still starting.
    }
    await delay(150);
  }
  throw new Error("Edge DevTools endpoint did not become ready.");
}

const target = await getPageTarget();
const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result || {});
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId;
    nextId += 1;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await send("Page.navigate", { url });
  await delay(1800);

  const { cssContentSize } = await send("Page.getLayoutMetrics");
  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: cssContentSize.width,
      height: cssContentSize.height,
      scale: 1,
    },
  });

  await writeFile(outputPath, Buffer.from(screenshot.data, "base64"));
  process.stdout.write(`Captured ${cssContentSize.width}x${cssContentSize.height} to ${outputPath}\n`);
} finally {
  socket.close();
  browser.kill();
  const resolvedTemp = path.resolve(profilePath);
  const resolvedSystemTemp = path.resolve(os.tmpdir());
  if (resolvedTemp.startsWith(resolvedSystemTemp)) {
    await rm(resolvedTemp, { recursive: true, force: true }).catch(() => undefined);
  }
}

#!/usr/bin/env bun
/**
 * Rich Menu Setup Script
 * Usage: bun run rich-menu/setup.ts
 *
 * Required env vars (in .env.local):
 *   VITE_LINE_CHANNEL_ACCESS_TOKEN
 *   VITE_LIFF_ID
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const TOKEN = process.env.VITE_LINE_CHANNEL_ACCESS_TOKEN;
const LIFF_ID = process.env.VITE_LIFF_ID;

if (!TOKEN) {
  console.error("❌  VITE_LINE_CHANNEL_ACCESS_TOKEN is not set");
  process.exit(1);
}
if (!LIFF_ID) {
  console.error("❌  VITE_LIFF_ID is not set");
  process.exit(1);
}

const BASE = "https://api.line.me";
const DATA_BASE = "https://api-data.line.me";
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// Replace {LIFF_ID} placeholder in layout.json
const layoutPath = resolve(import.meta.dir, "layout.json");
const layoutRaw = readFileSync(layoutPath, "utf-8").replace(
  /\{LIFF_ID\}/g,
  LIFF_ID,
);
const layout = JSON.parse(layoutRaw);

async function createRichMenu(): Promise<string> {
  console.log("📋  Creating rich menu...");
  const res = await fetch(`${BASE}/v2/bot/richmenu`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(layout),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create rich menu failed: ${res.status} ${err}`);
  }
  const { richMenuId } = (await res.json()) as { richMenuId: string };
  console.log(`✅  Rich menu created: ${richMenuId}`);
  return richMenuId;
}

async function uploadImage(richMenuId: string): Promise<void> {
  const imagePath = resolve(import.meta.dir, "background.png");
  let imageData: Buffer;
  try {
    imageData = readFileSync(imagePath);
  } catch {
    console.warn("⚠️   background.png not found — skipping image upload");
    console.warn("    Open rich-menu/template.html in browser, screenshot it,");
    console.warn(
      "    save as rich-menu/background.png, then re-run this script.",
    );
    return;
  }

  console.log("🖼️   Uploading background image...");
  const res = await fetch(
    `${DATA_BASE}/v2/bot/richmenu/${richMenuId}/content`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "image/png",
      },
      body: imageData,
    },
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload image failed: ${res.status} ${err}`);
  }
  console.log("✅  Image uploaded");
}

async function setDefaultRichMenu(richMenuId: string): Promise<void> {
  console.log("📌  Setting as default rich menu...");
  const res = await fetch(`${BASE}/v2/bot/user/all/richmenu/${richMenuId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Set default failed: ${res.status} ${err}`);
  }
  console.log("✅  Set as default rich menu");
}

async function deleteExistingDefaultRichMenu(): Promise<void> {
  const res = await fetch(`${BASE}/v2/bot/user/all/richmenu`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (res.ok) {
    const { richMenuId } = (await res.json()) as { richMenuId?: string };
    if (richMenuId) {
      console.log(`🗑️   Removing old default rich menu: ${richMenuId}`);
      await fetch(`${BASE}/v2/bot/richmenu/${richMenuId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
    }
  }
}

async function main() {
  console.log("🚀  SP ConsTrack — Rich Menu Setup\n");
  await deleteExistingDefaultRichMenu();
  const richMenuId = await createRichMenu();
  await uploadImage(richMenuId);
  await setDefaultRichMenu(richMenuId);
  console.log("\n🎉  Done! Rich menu is live.");
}

main().catch((err) => {
  console.error("❌ ", err.message);
  process.exit(1);
});

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
import sharp from "sharp";

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

async function prepareImage(): Promise<{ data: Buffer; contentType: string }> {
  const imagePath = resolve(import.meta.dir, "background.png");
  let raw: Buffer;
  try {
    raw = readFileSync(imagePath);
  } catch {
    throw new Error(
      "background.png not found.\n" +
        "    Open rich-menu/template.html in browser, screenshot it,\n" +
        "    save as rich-menu/background.png (2500×1686px), then re-run.",
    );
  }

  const sizeMB = raw.length / 1_048_576;
  if (sizeMB <= 1) {
    console.log(`🖼️   Image ready (${sizeMB.toFixed(2)} MB)`);
    return { data: raw, contentType: "image/png" };
  }

  // Over 1 MB — compress to JPEG at decreasing quality until under limit
  console.log(`🗜️   Image is ${sizeMB.toFixed(2)} MB — compressing to JPEG...`);
  for (const quality of [85, 75, 65, 50]) {
    const compressed = await sharp(raw)
      .resize(2500, 1686, { fit: "fill" })
      .jpeg({ quality })
      .toBuffer();
    const compressedMB = compressed.length / 1_048_576;
    if (compressedMB <= 1) {
      console.log(
        `✅  Compressed to ${compressedMB.toFixed(2)} MB (JPEG q${quality})`,
      );
      return { data: compressed, contentType: "image/jpeg" };
    }
  }
  throw new Error("Could not compress image below 1 MB — try a simpler design");
}

async function uploadImage(richMenuId: string): Promise<void> {
  const { data, contentType } = await prepareImage();

  console.log("📤  Uploading background image...");
  const res = await fetch(
    `${DATA_BASE}/v2/bot/richmenu/${richMenuId}/content`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": contentType,
      },
      body: data,
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

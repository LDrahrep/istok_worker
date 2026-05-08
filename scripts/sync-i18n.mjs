#!/usr/bin/env node
// Re-generate lib/i18n/strings.ts from the iOS app's .strings files.
// Defaults assume the iOS repo is cloned next to istok-worker:
//   ../ISTOK-One/ISTOK One/Localization/{en,ru}.lproj/Localizable.strings
//
// Override the source root with the ISTOK_ONE_IOS_ROOT env var.
//
// Usage:
//   node scripts/sync-i18n.mjs
//   ISTOK_ONE_IOS_ROOT="/path/to/ISTOK-One" node scripts/sync-i18n.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

const iosRoot = process.env.ISTOK_ONE_IOS_ROOT
  ?? resolve(repoRoot, "../ISTOK-One");
const localizationRoot = resolve(iosRoot, "ISTOK One/Localization");

function parseStrings(filePath) {
  const text = readFileSync(filePath, "utf8");
  const out = {};
  // "key" = "value"; allowing escaped quotes inside the value.
  const re = /"((?:\\.|[^"\\])*)"\s*=\s*"((?:\\.|[^"\\])*)"\s*;/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const key = m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    const raw = m[2].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    out[key] = raw;
  }
  return out;
}

const en = parseStrings(resolve(localizationRoot, "en.lproj/Localizable.strings"));
const ru = parseStrings(resolve(localizationRoot, "ru.lproj/Localizable.strings"));

const enKeys = Object.keys(en).sort();
const ruKeys = Object.keys(ru).sort();
const onlyEn = enKeys.filter((k) => !ruKeys.includes(k));
const onlyRu = ruKeys.filter((k) => !enKeys.includes(k));

if (onlyEn.length > 0 || onlyRu.length > 0) {
  console.error("✖ key drift between en and ru:");
  if (onlyEn.length) console.error("  only in en:", onlyEn);
  if (onlyRu.length) console.error("  only in ru:", onlyRu);
  process.exit(1);
}

function fmt(obj, keys) {
  return keys
    .map((k) => {
      const v = obj[k]
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");
      return `  "${k}": "${v}",`;
    })
    .join("\n");
}

const out = `// AUTO-GENERATED from iOS Localization/{en,ru}.lproj/Localizable.strings.
// Re-run scripts/sync-i18n.mjs after iOS adds/changes a key. The two maps
// must remain key-aligned — the \`Record<keyof typeof en, string>\` annotation
// on \`ru\` enforces this at build.

export const en = {
${fmt(en, enKeys)}
} as const;

export const ru: Record<keyof typeof en, string> = {
${fmt(ru, enKeys)}
};

export type LangKey = keyof typeof en;
`;

const target = resolve(repoRoot, "lib/i18n/strings.ts");
writeFileSync(target, out, "utf8");
console.log(`✓ wrote ${enKeys.length} keys × 2 langs → ${target}`);

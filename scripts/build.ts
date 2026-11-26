import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { stripTypeScriptTypes } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const slug = process.argv[2] ?? "max-muerte";
let staging: string | undefined;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value).every((entry: unknown) => typeof entry === "string")
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

try {
  if (process.argv.length > 3 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Usage: npm run build -- [person-slug], using lowercase letters, numbers, and single hyphens.",
    );
  }

  const person = path.join(root, "people", slug);
  const [template, profileText, sharedSource] = await Promise.all([
    readFile(path.join(person, "index.html"), "utf8"),
    readFile(path.join(person, "profile.json"), "utf8"),
    readFile(path.join(root, "src", "shared.ts"), "utf8"),
  ]);
  const profile: unknown = JSON.parse(profileText);
  if (!isStringRecord(profile)) {
    throw new Error("profile.json must be an object with string values.");
  }

  const html = template.replace(
    /\{\{\s*([A-Za-z][A-Za-z0-9_]*)\s*\}\}/g,
    (_match: string, key: string): string => {
      const value = profile[key];
      if (!Object.hasOwn(profile, key) || typeof value !== "string") {
        throw new Error(`Missing profile value for {{${key}}}.`);
      }
      return escapeHtml(value);
    },
  );
  if (html.includes("{{")) {
    throw new Error(
      "Unresolved or unsupported template marker in the rendered page.",
    );
  }

  const dist = path.join(root, "dist");
  await mkdir(dist, { recursive: true });
  staging = await mkdtemp(path.join(dist, `.${slug}-build-`));
  const assets = path.join(staging, "assets");
  await mkdir(assets);
  await Promise.all([
    cp(path.join(root, "src", "shared.css"), path.join(assets, "shared.css")),
    writeFile(
      path.join(assets, "shared.js"),
      stripTypeScriptTypes(sharedSource, { mode: "strip" }),
    ),
  ]);
  await cp(path.join(person, "assets"), assets, { recursive: true });
  await cp(path.join(person, "theme.css"), path.join(assets, "theme.css"));
  await writeFile(path.join(staging, "index.html"), html);

  const output = path.join(dist, slug);
  await rm(output, { recursive: true, force: true });
  await rename(staging, output);
  staging = undefined;
  console.log(`Built ${slug}: ${output}`);
} catch (error) {
  if (staging) await rm(staging, { recursive: true, force: true });
  console.error(`Build failed: ${errorMessage(error)}`);
  process.exitCode = 1;
}

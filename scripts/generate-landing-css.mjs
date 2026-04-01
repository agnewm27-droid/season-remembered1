import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "landing.html"), "utf8");
const m = html.match(/<style>([\s\S]*?)<\/style>/);
if (!m) throw new Error("No style block");
let css = m[1];

css = css.replace(/:root\s*\{/g, ".landing-root {");
css = css.replace(/\*\s*\{[^}]+\}/, "");
css = css.replace(/html\s*\{[^}]+\}/, "");
css = css.replace(/body\s*\{/g, ".landing-root {");
css = css.replace(/^\s*nav\s*\{/gm, ".landing-root nav {");
css = css.replace(/^\s*footer\s*\{/gm, ".landing-root footer {");
css = css.replace(
  /margin-left: -10px; first-child \{ margin-left: 0; \}/,
  "margin-left: -10px;"
);
css = css.replace(/'Playfair Display', serif/g, "var(--font-playfair), serif");

css = css.replace(
  /@media \(max-width: 900px\) \{(\s*)nav \{/g,
  "@media (max-width: 900px) {$1.landing-root nav {"
);
css = css.replace(
  /(\@media \(max-width: 900px\) \{[\s\S]*?)(\n    footer \{)/,
  "$1\n    .landing-root footer {"
);

const navIdx = css.indexOf(".landing-root nav {");
if (navIdx === -1) throw new Error("nav block not found");
const reset =
  "\n  .landing-root * { margin: 0; padding: 0; box-sizing: border-box; }\n\n  ";
css = css.slice(0, navIdx) + reset + css.slice(navIdx);

const out = path.join(root, "app", "landing.css");
fs.writeFileSync(
  out,
  "/* Scoped from landing.html — Playfair via var(--font-playfair), Lato on .landing-root */\n" +
    css.trim() +
    "\n"
);
console.log("Wrote", out);

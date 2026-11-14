/**
 * Verificación offline del sitio estático de English C1 Suite.
 * Comprueba enlaces locales, activos referenciados y ausencia de rutas absolutas
 * que se romperían al publicar bajo el subdirectorio `/english-c1-suite/`.
 *
 * @author Ismael Sallami Moreno
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = resolve(ROOT, "site");

/**
 * Recorre recursivamente un directorio devolviendo rutas absolutas de archivos.
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

const files = walk(SITE);
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const errors = [];

for (const htmlFile of htmlFiles) {
  const raw = readFileSync(htmlFile, "utf8");
  const relFile = htmlFile.slice(SITE.length + 1);

  // Comprueba que no existan rutas locales de máquina ni rutas raíz absolutas.
  if (/(\/home\/|file:\/\/|127\.0\.0\.1|localhost)/i.test(raw)) {
    errors.push(`${relFile}: contiene una ruta local o de desarrollo`);
  }

  const rootAbsMatch = raw.match(/(?:href|src)\s*=\s*["']\/[^"']*["']/i);
  if (rootAbsMatch) {
    errors.push(`${relFile}: usa ruta absoluta desde raíz (${rootAbsMatch[0]})`);
  }

  // Valida atributos href/src locales (excluyendo plantillas JS `${...}`).
  const attrRe = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = attrRe.exec(raw)) !== null) {
    const ref = match[1].trim();
    if (
      !ref ||
      ref.includes("${") ||
      /^\$\d+$/.test(ref) ||
      /^(https?:|mailto:|data:|javascript:|#|tel:)/i.test(ref)
    ) {
      continue;
    }
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    let target = resolve(dirname(htmlFile), decodeURIComponent(clean));
    if (clean.endsWith("/")) {
      target = resolve(target, "index.html");
    }
    if (!existsSync(target)) {
      errors.push(`${relFile}: enlace roto -> ${ref}`);
    }
  }
}

// Comprueba todas las imágenes referenciadas en el JS del simulador Aptis.
const aptisHtml = readFileSync(resolve(SITE, "aptis/index.html"), "utf8");
const imgRe = /images\/[a-zA-Z0-9_.-]+\.(?:jpg|jpeg|png|webp|svg)/g;
for (const imgRef of new Set(aptisHtml.match(imgRe) ?? [])) {
  const full = resolve(SITE, "aptis", imgRef);
  if (!existsSync(full)) {
    errors.push(`aptis/index.html: falta imagen ${imgRef}`);
  }
}

// Comprueba los documentos Markdown listados en guides/index.html.
const guidesHtml = readFileSync(resolve(SITE, "guides/index.html"), "utf8");
const mdRe = /\.\/data\/[a-zA-Z0-9_.-]+\.md/g;
for (const mdRef of new Set(guidesHtml.match(mdRe) ?? [])) {
  const full = resolve(SITE, "guides", mdRef);
  if (!existsSync(full)) {
    errors.push(`guides/index.html: falta guía ${mdRef}`);
  }
}

if (errors.length > 0) {
  console.error("Errores encontrados:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(`OK: ${htmlFiles.length} HTML verificados y todos los enlaces/activos resuelven.`);

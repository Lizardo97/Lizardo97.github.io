import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ignoredProtocols = /^(?:https?:|mailto:|tel:|data:|#)/i;
const errors = [];

const walk = (directory) => readdirSync(directory)
    .flatMap((entry) => {
        const path = join(directory, entry);

        return statSync(path).isDirectory() ? walk(path) : [path];
    });

const htmlFiles = walk(root).filter((path) => extname(path) === ".html");
const cssFiles = walk(root).filter((path) => extname(path) === ".css");
const jsFiles = walk(root).filter((path) => extname(path) === ".js");

const addError = (file, message) => {
    errors.push(`${file}: ${message}`);
};

for (const htmlFile of htmlFiles) {
    const html = readFileSync(htmlFile, "utf8");
    const relativeName = relative(root, htmlFile);

    if (!/<html\s+lang="es-PE"/i.test(html)) {
        addError(relativeName, 'falta lang="es-PE".');
    }

    if (!/<meta\s+name="viewport"/i.test(html)) {
        addError(relativeName, "falta la configuración del viewport.");
    }

    if (!/<title>[^<]+<\/title>/i.test(html)) {
        addError(relativeName, "falta un título.");
    }

    if (relativeName !== "404.html" && !/<meta\s+name="description"/i.test(html)) {
        addError(relativeName, "falta la descripción.");
    }

    if (relativeName !== "404.html" && !/<link\s+rel="canonical"/i.test(html)) {
        addError(relativeName, "falta la URL canónica.");
    }

    const headings = html.match(/<h1[\s>]/gi) ?? [];
    if (headings.length !== 1) {
        addError(relativeName, `debe tener un h1 y se encontraron ${headings.length}.`);
    }

    if (/\sstyle\s*=/i.test(html)) {
        addError(relativeName, "contiene estilos en línea.");
    }

    if (/\son[a-z]+\s*=/i.test(html)) {
        addError(relativeName, "contiene eventos JavaScript en línea.");
    }

    const inlineScripts = [...html.matchAll(/<script\b([^>]*)>/gi)]
        .filter((match) => !/\bsrc\s*=/i.test(match[1]))
        .filter((match) => !/\btype="application\/ld\+json"/i.test(match[1]));

    if (inlineScripts.length > 0) {
        addError(relativeName, "contiene JavaScript ejecutable en línea.");
    }

    const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
    for (const image of images) {
        const attributes = image[1];

        if (!/\balt="[^"]*"/i.test(attributes)) {
            addError(relativeName, "una imagen no declara texto alternativo.");
        }

        if (!/\bwidth="\d+"/i.test(attributes) || !/\bheight="\d+"/i.test(attributes)) {
            addError(relativeName, "una imagen no declara ancho y alto.");
        }
    }

    const externalLinks = [...html.matchAll(/<a\b([^>]*\btarget="_blank"[^>]*)>/gi)];
    for (const link of externalLinks) {
        if (!/\brel="[^"]*\bnoopener\b[^"]*"/i.test(link[1])) {
            addError(relativeName, "un enlace externo no usa rel=\"noopener\".");
        }
    }

    const references = [...html.matchAll(/\b(?:href|src)="([^"]+)"/gi)]
        .map((match) => match[1]);

    for (const reference of references) {
        if (ignoredProtocols.test(reference)) {
            continue;
        }

        const cleanReference = reference.split(/[?#]/, 1)[0];
        const target = resolve(dirname(htmlFile), cleanReference);

        if (!existsSync(target)) {
            addError(relativeName, `no existe ${reference}.`);
        }
    }
}

if (htmlFiles.length !== 6) {
    errors.push(`Se esperaban 6 documentos HTML y se encontraron ${htmlFiles.length}.`);
}

const markupAndScripts = [...htmlFiles, ...jsFiles]
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

for (const cssFile of cssFiles) {
    const css = readFileSync(cssFile, "utf8");
    const classes = new Set(
        [...css.matchAll(/\.([a-z][a-z0-9_-]*)/gi)]
            .map((match) => match[1]),
    );

    for (const className of classes) {
        const classReference = new RegExp(`(?:class="[^"]*\\b${className}\\b|["']${className}["'])`);

        if (!classReference.test(markupAndScripts)) {
            addError(relative(root, cssFile), `la clase .${className} no tiene referencias.`);
        }
    }
}

if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
} else {
    console.log(`Validación correcta: ${htmlFiles.length} documentos HTML y sus recursos locales.`);
}

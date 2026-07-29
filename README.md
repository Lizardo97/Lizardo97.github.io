# Portafolio de Lizardo Del Aguila

Sitio estático que presenta el perfil profesional y una selección de proyectos
de desarrollo web y Android de Lizardo Manuel Del Aguila Carrasco.

## Contenido

- Presentación profesional y áreas de especialización.
- Cuatro proyectos con contexto, aporte y decisiones técnicas.
- Casos individuales con enlaces a las versiones disponibles.
- Currículum descargable y canales de contacto.
- Metadatos sociales, datos estructurados, sitemap y página 404.

## Tecnologías

- HTML5 semántico.
- CSS responsivo sin frameworks.
- JavaScript sin dependencias externas.
- GitHub Pages para la publicación estática.

## Estructura

```text
.
├── assets/
│   ├── css/
│   ├── docs/
│   ├── images/
│   └── js/
├── projects/
├── tests/
├── 404.html
├── index.html
├── robots.txt
└── sitemap.xml
```

## Ejecución local

Con Apache iniciado en XAMPP, abre:

```text
http://localhost/Portfolio-LizardoDelAguila/
```

## Validación

Desde la raíz del proyecto:

```powershell
node tests\validate.mjs
```

El comando comprueba la estructura HTML, metadatos, encabezados, imágenes,
enlaces locales, seguridad básica de enlaces externos y ausencia de estilos o
eventos en línea.

## Publicación

El contenido puede publicarse directamente con GitHub Pages. El archivo
`.nojekyll` indica que los archivos estáticos deben entregarse sin procesamiento
de Jekyll.

## Autor

Lizardo Manuel Del Aguila Carrasco.

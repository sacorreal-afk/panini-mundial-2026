# Mi Album Mundial 2026 — PWA

App web instalable (PWA) para gestionar la colección personal del Álbum Panini Mundial 2026 — edición Latinoamérica.

---

## ¿Qué es esto?

Una aplicación web que se instala en el iPhone (o cualquier celular) como si fuera una app nativa:
- Funciona offline
- Tiene ícono propio en la pantalla de inicio
- Pantalla completa, sin barra de navegador
- Datos guardados en cada celular individualmente
- Sin App Store, sin costos, sin Apple Developer Program

---

## Para ti (Andrés) — Subir la app a internet por primera vez

### Paso 1: Probar la app en tu computador antes de subirla

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre en el navegador la URL que muestra (normalmente http://localhost:5173). Deberías ver la app funcionando exactamente como en el artifact.

### Paso 2: Crear el repositorio en GitHub

1. Entra a [github.com](https://github.com) e inicia sesión.
2. Toca el botón verde **New** o ve a [github.com/new](https://github.com/new).
3. **Repository name**: escribe `panini-mundial-2026` (importante: debe ser exactamente este nombre, o cambia el `REPO_NAME` en `vite.config.js`).
4. Marca **Public** (necesario para usar GitHub Pages gratis).
5. **NO marques** ninguna opción de "Add a README", ".gitignore", "license" — vamos a subir nuestros propios archivos.
6. Click en **Create repository**.

### Paso 3: Subir el código (sin Git, por interfaz web)

1. En la página del repo recién creado, verás "Quick setup" con varias opciones.
2. Toca el link **"uploading an existing file"** (el segundo enlace).
3. Arrastra TODA la carpeta del proyecto (todos los archivos y carpetas excepto `node_modules` si la creaste).
4. Abajo, en "Commit changes", escribe un mensaje tipo `Primera versión` y toca **Commit changes**.

### Paso 4: Activar GitHub Pages

1. En tu repo, ve a **Settings** (arriba a la derecha).
2. En el menú lateral izquierdo, baja hasta **Pages**.
3. En "Source", selecciona **GitHub Actions** (no "Deploy from a branch").
4. Eso es todo — no hay que tocar nada más. La acción `.github/workflows/deploy.yml` se encarga del build automáticamente cada vez que subas un cambio.

### Paso 5: Esperar el primer build

1. Vuelve a la página principal de tu repo.
2. Toca la pestaña **Actions** (arriba).
3. Verás un workflow corriendo (puede tomar 2-5 minutos la primera vez).
4. Cuando termine con un check verde, tu app estará disponible en:
   `https://TU-USUARIO.github.io/panini-mundial-2026/`

### Paso 6: Abrir la URL en el iPhone para instalarla

Ver siguiente sección.

---

## Para tu familia — Instalar la app en el iPhone

1. Abre **Safari** (importante: tiene que ser Safari, no Chrome ni otro navegador).
2. Entra a la URL: `https://TU-USUARIO.github.io/panini-mundial-2026/`
3. Toca el ícono de **Compartir** (cuadrado con flecha hacia arriba) en la barra inferior.
4. Desplázate hacia abajo y toca **Añadir a la pantalla de inicio**.
5. Ponle el nombre que quieras (sale "Mi Álbum" por defecto).
6. Toca **Añadir**.

Ahora tienes un ícono de la app en tu pantalla de inicio igual que cualquier app nativa. Al abrirla:
- Funciona en pantalla completa, sin barra de Safari.
- Funciona offline (sin internet) después de abrirla la primera vez.
- Los datos se guardan en el iPhone.

---

## Para hacer cambios futuros

### Si subiste por interfaz web

1. Edita el archivo en GitHub directamente (toca el lápiz).
2. Commit el cambio.
3. La acción de GitHub re-construirá la app automáticamente en 2-3 minutos.

### Si quieres trabajar localmente (recomendado)

1. Instala [GitHub Desktop](https://desktop.github.com/) — más amigable que Git por línea de comandos.
2. Toca **Clone a repository** y elige tu repo.
3. Edita los archivos en tu computador.
4. En GitHub Desktop, escribe un mensaje de cambio y dale **Commit to main** + **Push origin**.
5. La acción de GitHub se encarga del resto.

---

## Estructura del proyecto

```
panini-mundial-2026/
├── public/                 # Archivos estáticos (íconos PWA)
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── favicon.png
├── src/
│   ├── App.jsx            # Componente principal (toda la lógica de la app)
│   ├── main.jsx           # Punto de entrada de React
│   ├── index.css          # Estilos globales + Tailwind + Google Fonts
│   └── utils/
│       └── storage.js     # Wrapper localStorage (reemplaza window.storage)
├── .github/workflows/
│   └── deploy.yml         # Auto-build y deploy a GitHub Pages
├── index.html             # HTML base con meta tags PWA iOS
├── vite.config.js         # Config Vite + plugin PWA
├── tailwind.config.js     # Config Tailwind
├── postcss.config.js      # Config PostCSS
└── package.json
```

---

## Limitaciones conocidas

- **Datos por dispositivo**: cada miembro de la familia tiene sus propios datos en su iPhone. Si quieren compartir entre dispositivos, usen la pestaña **Backup** para exportar/importar JSON.
- **Sin notificaciones push**: no es posible en PWA en iOS de forma confiable. Si en el futuro lo necesitas, hay que migrar a app nativa.
- **Cambios en Settings de iOS afectan**: si el usuario borra los datos de Safari, se pierde la colección. Recomendar exportar backups periódicamente.

---

## Tecnología

- **React 18** + **Vite 5** (build moderno y rápido)
- **Tailwind CSS** (estilos)
- **Recharts** (gráficas)
- **vite-plugin-pwa** (genera service worker y manifest automáticamente)
- **localStorage** (persistencia local, ~5-10 MB disponibles)

---

## Disclaimer legal

Esta es una aplicación **NO oficial** desarrollada por aficionados para uso personal/familiar. No está afiliada con Panini, FIFA ni ninguna empresa relacionada. Las marcas "Panini", "FIFA", "FIFA World Cup" pertenecen a sus respectivos dueños. Este software se distribuye sin fines comerciales y solo para gestión personal de la colección física que el usuario haya adquirido legítimamente.

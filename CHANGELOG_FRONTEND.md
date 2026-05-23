# CHANGELOG — Frontend (Next.js / UI)

> Registro de todos los cambios en la capa de presentación: páginas, componentes, estilos, rutas y experiencia de usuario.

---

## [0.1.0] — 2026-05-23 — Setup inicial

### Agregado
- Proyecto Next.js 16 con TypeScript, Tailwind CSS v4 y App Router
- Estructura de rutas con grupos de layout:
  - `(auth)/` → login, register
  - `(dashboard)/` → panel administrativo con sidebar
  - `tienda/[slug]/` → tienda pública del negocio
- **Landing page** completa (`/`):
  - Navbar fijo con efecto glass
  - Hero section con CTA doble
  - Grid de 8 features con hover cards
  - Sección de testimonios
  - CTA final con gradiente
  - Footer
- **Layout del Dashboard** (`(dashboard)/layout.tsx`):
  - Sidebar fijo de 256px con navegación por íconos
  - 7 módulos en el menú principal
  - Indicador de ruta activa con gradiente
  - Panel de tienda pública con link rápido
  - Topbar con nombre de sección activa
- **Dashboard principal** (`/dashboard`):
  - Banner de bienvenida con gradiente y acciones rápidas
  - 4 tarjetas de métricas con badge de cambio
  - Panel de acciones rápidas (5 shortcuts)
  - Recomendación IA del día
  - Lista de productos recientes
- **Sistema de tokens CSS** (`globals.css`):
  - Paleta de colores brand (50-900)
  - Variables de sombra, radio y superficie
  - Animaciones: fadeIn, slideInRight, shimmer
  - Clases utilitarias: `.gradient-brand`, `.gradient-text`, `.glass`, `.card-hover`, `.skeleton`, `.fade-in`
- **Constantes globales** (`lib/constants.ts`):
  - `APP_NAME`, `APP_DESCRIPTION`
  - `BUSINESS_CATEGORIES`, `BUSINESS_THEMES`, `BUSINESS_TONES`
  - `THEME_COLORS` por tema
  - `ROUTES` centralizados
  - `AI_MODELS`
- **Utilidades** (`lib/utils.ts`):
  - `cn()` — merge de clases con clsx + tailwind-merge
  - `formatPrice()` — formato COP/Latinoamérica
  - `slugify()` — normalización de slugs con soporte español
  - `getInitials()`, `truncate()`, `formatDate()`
  - `buildWhatsAppUrl()`, `buildTelegramUrl()`

### Dependencias agregadas
- `lucide-react` — iconos
- `clsx` + `tailwind-merge` + `class-variance-authority` — gestión de clases
- `react-hook-form` + `zod` + `@hookform/resolvers` — formularios con validación
- `next-themes` — modo oscuro (preparado)

### Decisiones de diseño (UI-UX-PROMAX)
- **Paleta**: Púrpura (#6c63ff) como brand + Rosa (#ff4d70) como accent — transmite creatividad y energía, apto para emprendedores jóvenes
- **Tipografía**: Geist Sans (legible, moderna, sin serif) — óptima para UI
- **Escala de espaciado**: 8px base — consistencia visual en todos los componentes
- **Animación**: fadeIn 250ms ease-out en todas las páginas — sensación fluida sin distracción
- **Layout sidebar**: 256px fijo en desktop — suficiente para labels completos
- **Responsive**: Mobile-first preparado, sidebar colapsable pendiente

---

---

## [0.2.0] — 2026-05-23 — Páginas completas + shadcn/ui

### Agregado
- **shadcn/ui inicializado** con Tailwind v4 — CSS variables mergeadas con design tokens propios
- **Componentes shadcn instalados**: Button, Card, Input, Label, Badge, Textarea, Select, Dialog, Progress, Avatar, Separator, Skeleton, Sonner (reemplaza Toast deprecated)
- **`(auth)/layout.tsx`** — Layout dividido 50/50: panel decorativo con gradiente brand (desktop) + panel formulario. Responsive mobile-first.
- **`/login`** — Formulario con react-hook-form + zod. Validación en tiempo real, estado de carga con spinner.
- **`/register`** — Formulario en 2 pasos: (1) datos personales, (2) datos del negocio. Barra de progreso animada. Selección de categoría con radio cards visuales.
- **`/productos`** — CRUD completo con:
  - Stats de inventario (total, activos, valor total)
  - Lista de productos con thumbnail emoji, precio, stock, estado activo/inactivo
  - Contenido generado por IA visible inline con badge
  - Buscador de productos
  - Modal de nuevo producto con formulario básico
  - Botón "Mejorar con IA" por producto con estado de carga
- **`/marketing`** — Generador de marketing IA con:
  - Selector de tipo de contenido (5 tipos)
  - Selector de objetivo (4 opciones con radio cards)
  - Textarea de descripción del producto
  - Panel de resultado: preview estilo post social, CTA, hashtags con chips
  - Botones: Regenerar, Copiar todo, Crear banner
  - Historial de contenido generado reciente
- **`/imagenes`** — Mejora de imágenes con IA:
  - Drop zone con drag & drop + click para seleccionar
  - Preview de imagen subida
  - 4 estilos de imagen (food delivery, instagram, banner, fondo blanco)
  - Textarea de descripción opcional
  - Panel de resultado con URL de Pollinations
  - Estados: vacío, cargando (spinner grande + skeleton), resultado
- **`/agente`** — Chat con Agente de Negocios IA:
  - Interfaz de chat tipo messenger con burbujas izquierda/derecha
  - Indicador de escritura (3 puntos animados)
  - 6 quick prompts en chips horizontales (solo cuando es el inicio)
  - Auto-scroll al último mensaje
  - Timestamps por mensaje
- **`/bot`** — Configuración del Bot de Telegram:
  - Estado de conexión visual (activo/desconectado)
  - Campo de token del bot
  - Selección de tono (3 opciones con radio cards)
  - FAQs editables (agregar/eliminar)
  - Preview estilo chat de Telegram con fondo oscuro real
- **`/metricas`** — Métricas del negocio:
  - 4 KPI cards con badge de variación
  - Barra de progreso por producto más visto
  - 2 insights de IA con acción
  - Feed de actividad reciente
- **`/tienda/[slug]`** — Tienda pública del emprendedor:
  - Header con avatar del negocio, nombre, descripción
  - Botones directos a WhatsApp y Telegram
  - Grid 2 columnas de productos con imagen (emoji)
  - Badge "Últimas unidades" si stock ≤ 5
  - Precio con color del tema del negocio
  - Botón "Pedir →" que abre WhatsApp con mensaje pre-armado
  - Footer con crédito a VendeMás IA

### Dependencias instaladas
- Shadcn/ui componentes (ver lista arriba)
- `sonner` — notificaciones toast modernas
- `tw-animate-css` — animaciones adicionales de Tailwind

---

## [0.4.0] — 2026-05-23 — Migración al Apple Design System

### Motivación
Se integró el Apple Design System generado por `npx getdesign@latest add apple` (`DESIGN.md`).
El objetivo: remplazar la paleta púrpura/gradiente por el lenguaje visual de Apple — sobrio, centrado en el contenido, con un único color interactivo (Action Blue #0066cc) y tipografía SF Pro con tracking negativo.

### Modificado

#### `src/app/globals.css` — Design tokens migrados
- **Eliminado**: `--brand-500` (#6c63ff púrpura), `--accent-500` (rosa), `.gradient-brand`, `.gradient-text`, `.glass` con blur decorativo
- **Nuevas variables de color**:
  - `--apple-blue: #0066cc` — único color interactivo
  - `--apple-blue-focus: #0071e3` — focus ring
  - `--apple-blue-dark: #2997ff` — links sobre superficies oscuras
  - `--canvas: #ffffff`, `--canvas-parchment: #f5f5f7`, `--surface-pearl: #fafafc`
  - `--surface-tile-1/2/3: #272729 / #2a2a2c / #252527` — tiles oscuros
  - `--surface-black: #000000` — nav global
  - `--ink: #1d1d1f`, `--ink-80: #333333`, `--ink-48: #7a7a7a`
  - `--hairline: #e0e0e0`, `--divider-soft: #f0f0f0`
  - `--product-shadow: rgba(0,0,0,0.22) 3px 5px 30px` — única sombra del sistema
- **Tipografía base**: `SF Pro Text, system-ui, -apple-system, sans-serif`, 17px, weight 400, letter-spacing -0.374px
- **H1-H6**: `SF Pro Display`, weight 600, line-height 1.1
- **Nuevas clases utilitarias**:
  - `.btn-primary` — pill Action Blue (padding 11px 22px, border-radius 9999px)
  - `.btn-secondary` — pill ghost (blanco, borde hairline, texto azul)
  - `.btn-dark` — rect utility (ink background, 8px radius)
  - `.btn-hero` — large pill (18px/300, 14px 28px)
  - `.input-rect` — input rect (11px radius, focus ring azul)
  - `.input-apple` — input pill (para búsquedas)
  - `.card-apple` — store utility card (18px radius, hairline border, padding 24px)
  - `.global-nav` — nav black 44px
  - `.tile-light`, `.tile-parchment`, `.tile-dark`, `.tile-dark-2`, `.tile-black` — tiles de sección
  - `.text-hero`, `.text-display`, `.text-display-md`, `.text-lead`, `.text-tagline`, `.text-body`, `.text-caption`, `.text-fine` — escala tipográfica
  - `.link-blue`, `.link-blue-dark` — links en superficies claras/oscuras
  - `.divider` — hairline 1px
  - `.product-img` — única sombra del sistema

#### `src/app/page.tsx` — Landing page reimaginada
- **Nav**: Negro absoluto (#000), 44px, sin efecto glass
- **Tile 1 (Hero)**: Canvas blanco, headline `text-hero` SF Pro Display 56px/-0.28px, subtítulo 21px/400, CTAs pill azul + ghost
- **Tile 2 (Stats)**: Parchment #f5f5f7, 3 métricas en azul SF Display 40px
- **Tile 3 (Features)**: Dark tile #272729, 8 cards con borde translúcido, sin gradiente
- **Tile 4 (Testimonials)**: Canvas blanco, store-utility-cards con avatar azul
- **Tile 5 (CTA)**: Dark tile 2 (#2a2a2c), headline + párrafo 300 weight + btn-hero
- **Footer**: Parchment, hairline border, texto ink-48, links azules
- Eliminados: círculos decorativos, gradient CTAs, glass navbar

#### `src/app/(auth)/layout.tsx` — Auth layout Apple
- Panel izquierdo: `#1d1d1f` (ink dark), no gradient
- Blockquote: SF Pro Display 34px/-0.374px
- Avatar: círculo azul simple
- Feature list: checkmarks en círculos azules
- Panel derecho: canvas blanco puro

#### `src/app/(auth)/login/page.tsx` y `register/page.tsx`
- Inputs → `.input-rect` (11px radius, focus ring azul)
- Botones → `.btn-primary` pill
- Headlines: SF Pro Display 34px/-0.374px
- Labels: 14px/600/-0.224px
- Error banners: bg #fff0f0, border #fecdd3, texto #b91c1c
- Progress bar (register): 3px height, `--apple-blue` fill

#### `src/app/(dashboard)/layout.tsx` — Sidebar Apple black
- Sidebar: `#000` (pure black), 240px
- Logo: SF Pro Display 17px/600 blanco
- Nav activo: fondo `#0066cc` + texto blanco
- Nav inactivo: texto rgba(255,255,255,0.55), hover rgba(255,255,255,0.08)
- Tienda link: panel con borde azul translúcido, texto `#2997ff`
- Avatar usuario: círculo azul 32px
- Topbar: canvas blanco, 52px, headline SF Pro Display 17px/600

#### Todas las páginas del dashboard
- Eliminados: `.gradient-brand`, `.card-hover` con shadow, variantes `--brand-*`
- Reemplazado por: `.card-apple`, `.btn-primary`, `.btn-secondary`, `.btn-dark`, colores `#0066cc`
- Valores numéricos: SF Pro Display 34px/600/#0066cc
- Historial/listas: hover background #f5f5f7, borderRadius 11px
- Badge de estado: pill coloreado (verde para activo, azul para info)
- Modales: `box-shadow: rgba(0,0,0,0.22) 3px 5px 30px` (única sombra)

#### `src/app/tienda/[slug]/page.tsx` — Tienda pública Apple
- Nav: negro 44px
- Header: canvas blanco, avatar con `product-shadow`
- CTAs: pills WhatsApp verde + Telegram azul
- Producto cards: `.card-apple` con zona de imagen parchment
- Emoji producto: `filter: drop-shadow` suave
- Precio: SF Pro Display 21px/600
- Botón "Pedir": pill Action Blue
- Footer: parchment + hairline

### Reglas Apple cumplidas
- ✅ Sin gradientes decorativos
- ✅ Una única sombra en el sistema (product-shadow)
- ✅ Un único color interactivo (#0066cc)
- ✅ Patrón de tiles alternados: light / parchment / dark / light / dark-2
- ✅ Nav global negro 44px
- ✅ CTAs en pill (border-radius 9999px)
- ✅ SF Pro Display para headlines, SF Pro Text para body/UI
- ✅ Tracking negativo (-0.374px body, -0.28px hero)
- ✅ Sin color de enfoque secundario
- ✅ Spacing: xxs 4px → section 80px

## Próximos cambios planificados

- [ ] Conectar formularios con Convex (auth real)
- [ ] Conectar `/productos` con Convex CRUD
- [ ] Conectar `/marketing` con `/api/ai/marketing`
- [ ] Conectar `/imagenes` con Pollinations + HuggingFace reales
- [ ] Conectar `/agente` con Groq via `/api/ai/chat`
- [ ] Conectar `/bot` con Telegram Webhook
- [ ] Sidebar responsive con hamburger en mobile
- [ ] Onboarding flow guiado (3 pasos post-registro)
- [ ] Página `/tienda/[slug]` con datos reales de Convex
- [ ] Middleware de protección de rutas

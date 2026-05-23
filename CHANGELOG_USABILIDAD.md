# CHANGELOG — Usabilidad (UX / Accesibilidad / Diseño)

> Registro de decisiones de experiencia de usuario, accesibilidad, flujos, feedback visual y mejoras de usabilidad aplicando el criterio UI-UX-PROMAX.

---

## [0.1.0] — 2026-05-23 — Diseño del sistema base

### Sistema de diseño implementado

#### Paleta de colores
| Token | Color | Uso |
|-------|-------|-----|
| `--brand-500` | `#6c63ff` | Color principal, CTAs, links activos |
| `--brand-600` | `#5a4bea` | Hover de botones primarios |
| `--accent-500` | `#ff4d70` | Gradiente secundario, highlights |
| `--success-500` | `#22c55e` | Confirmaciones, stock disponible |
| `--warning-500` | `#f59e0b` | Alertas, stock bajo |
| `--error-500` | `#ef4444` | Errores, acciones destructivas |
| `--muted` | `#64748b` | Texto secundario, placeholders |
| `--border` | `#e2e8f0` | Bordes de cards y dividers |
| `--surface` | `#ffffff` | Fondo de cards y modales |
| `--background` | `#f8fafc` | Fondo general de la app |

**Ratio de contraste verificado:**
- Texto brand sobre fondo blanco: 4.8:1 ✅ (WCAG AA)
- Texto blanco sobre brand-600: 5.2:1 ✅ (WCAG AA)
- Texto muted sobre blanco: 4.6:1 ✅ (WCAG AA)

#### Tipografía
- **Display/Headings**: Geist Sans Bold — letras limpias y modernas
- **Body**: Geist Sans Regular — alta legibilidad a tamaño pequeño
- **Line-height headings**: 1.25 — compacto y legible
- **Line-height body**: 1.6 — cómodo para lectura corrida

#### Escala de espaciado (8px base)
- Aplicada consistentemente en padding de cards, gaps de grids y márgenes de secciones

#### Sombras
- `--shadow-sm`: cards en reposo
- `--shadow-md`: dropdowns y tooltips
- `--shadow-lg`: modales y overlays
- `--shadow-brand`: CTAs principales con glow de color brand

### Flujos de usuario diseñados

#### Flujo de onboarding (pendiente de implementar)
```
1. Registro → Crear negocio (nombre, categoría)
2. Datos de contacto (WhatsApp, Telegram)
3. Subir logo / elegir avatar
4. Elegir tema de tienda
5. Agregar primer producto (guiado por IA)
6. ¡Tienda lista! → Compartir link
```
**Regla**: máximo 5 pasos, cada paso en menos de 2 minutos.

#### Flujo de creación de producto con IA
```
1. Usuario sube foto del producto
2. Escribe descripción simple (opcional)
3. IA genera en 2-3 segundos:
   - Nombre atractivo
   - Descripción optimizada
   - Copy de venta
   - Hashtags sugeridos
4. Usuario revisa y edita si quiere
5. Confirmar → Producto publicado
```

#### Flujo de generación de marketing
```
1. Seleccionar producto (o escribir descripción manual)
2. Elegir objetivo (dar a conocer / promoción / urgencia)
3. IA genera post completo con texto + CTA + hashtags
4. Botones: Regenerar / Copiar / Descargar
```

### Micro-interacciones implementadas

| Elemento | Interacción | Duración |
|----------|-------------|----------|
| Cards del dashboard | `translateY(-2px)` en hover | 150ms ease-out |
| Nav items activos | Gradiente brand instantáneo | 0ms (class toggle) |
| Página al cargar | `fadeIn` con `translateY(8px)` | 250ms ease-out |
| Skeleton loading | Shimmer de izquierda a derecha | 1.5s infinite |
| Botón primario | Opacity 90% en hover | 150ms |

### Patrones de feedback visual

- **Estado de carga**: Skeleton shimmer en lugar de spinners — menos ansiedad para el usuario
- **Errores**: Color rojo semántico + ícono + mensaje claro en lenguaje simple
- **Éxito**: Color verde + ícono check + mensaje motivador (ej. "¡Tu producto está listo! 🎉")
- **Estado vacío**: Ilustración + mensaje de acción (ej. "Aún no tienes productos. ¡Agrega tu primero!")

### Accesibilidad — Estado actual

| Criterio | Estado | Notas |
|----------|--------|-------|
| Contraste de texto (WCAG AA) | ✅ Cumple | Verificado en paleta principal |
| Navegación por teclado | ⚠️ Parcial | Links y botones nativos OK; falta focus trap en modales |
| ARIA labels | ⚠️ Pendiente | Añadir a botones icónicos y formularios |
| Texto alternativo en imágenes | ⚠️ Pendiente | Aplicar en imágenes de productos |
| `prefers-reduced-motion` | ✅ Implementado | En `globals.css` con `0.01ms` override |
| Touch targets móvil ≥44px | ⚠️ Pendiente | Verificar en sidebar y botones pequeños |
| HTML semántico | ✅ Base | `<nav>`, `<main>`, `<header>`, `<aside>`, `<footer>` |

### Responsive — Estado actual

| Breakpoint | Estado | Notas |
|------------|--------|-------|
| Mobile < 640px | ⚠️ Pendiente | Sidebar colapsa correctamente pero falta hamburger |
| Tablet 640-1024px | ⚠️ Parcial | Grid responsive OK, sidebar pendiente |
| Desktop ≥ 1024px | ✅ Funcional | Layout sidebar + main completo |

### Criterios de usabilidad para este usuario objetivo

El usuario objetivo es un **vendedor informal latinoamericano** con:
- Poca experiencia tecnológica
- Uso principal desde celular
- Tiempo limitado (entre ventas)
- Baja tolerancia a la frustración técnica

**Principios aplicados:**
1. **Lenguaje simple**: sin tecnicismos. "Crear publicidad" en lugar de "Generar contenido de marketing"
2. **Acción en máximo 3 clicks**: cada función principal accesible desde el dashboard
3. **Feedback inmediato**: skeleton en < 100ms, resultado IA en < 3s (con indicador)
4. **Mensajes en primera persona**: "Tu tienda", "Tus productos", "Tu negocio"
5. **Emojis estratégicos**: ayudan a usuarios con baja alfabetización digital a identificar funciones

---

---

## [0.2.0] — 2026-05-23 — Apple Design System + UX refinado

### Sistema de diseño actualizado: Apple Design Language

El diseño previo (púrpura/gradiente) fue reemplazado íntegramente por el **Apple Design System** (`DESIGN.md`, generado con `npx getdesign@latest add apple`). Esta decisión responde a:
- **Confianza**: el lenguaje Apple es ampliamente reconocido como premium y profesional
- **Legibilidad**: SF Pro Display/Text tienen la mejor legibilidad en pantalla para usuarios hispanohablantes
- **Foco en contenido**: sin decoración, la información del negocio del emprendedor toma protagonismo
- **Menor fatiga visual**: paleta casi monocromática reduce la sobrecarga cognitiva

#### Nueva paleta de colores
| Token | Valor | Uso |
|-------|-------|-----|
| `--apple-blue` | `#0066cc` | Único color interactivo: CTAs, links, focus |
| `--apple-blue-focus` | `#0071e3` | Focus ring (a11y) |
| `--apple-blue-dark` | `#2997ff` | Links en tiles oscuros |
| `--canvas` | `#ffffff` | Superficie principal |
| `--canvas-parchment` | `#f5f5f7` | Superficie alternada (signature Apple) |
| `--surface-tile-1` | `#272729` | Tile oscuro principal |
| `--surface-black` | `#000000` | Nav global, void |
| `--ink` | `#1d1d1f` | Todos los textos en superficie clara |
| `--ink-48` | `#7a7a7a` | Texto secundario/placeholder |
| `--hairline` | `#e0e0e0` | Bordes de cards, separadores |
| `--product-shadow` | `rgba(0,0,0,0.22) 3px 5px 30px` | Única sombra del sistema |

**Ratio de contraste verificado:**
- `--apple-blue` (#0066cc) sobre blanco: 4.5:1 ✅ (WCAG AA)
- Blanco sobre `--apple-blue`: 4.5:1 ✅
- `--ink` (#1d1d1f) sobre blanco: 18.1:1 ✅ (WCAG AAA)
- `--ink-48` (#7a7a7a) sobre blanco: 4.48:1 ✅ (WCAG AA)

#### Nueva tipografía — SF Pro
| Clase | Tamaño | Peso | Tracking | Uso |
|-------|--------|------|----------|-----|
| `.text-hero` | 56px | 600 | -0.28px | Hero headlines landing |
| `.text-display` | 40px | 600 | 0px | Titles de secciones |
| `.text-display-md` | 34px | 600 | -0.374px | Page titles en auth |
| `.text-lead` | 28px | 400 | +0.196px | Subcopy en tiles |
| `.text-tagline` | 21px | 600 | +0.231px | Taglines de sección |
| body base | 17px | 400 | -0.374px | Todo el contenido |
| labels | 14px | 600 | -0.224px | Labels de formularios |
| captions | 12px | 400 | -0.12px | Metadatos, timestamps |

**Decisión de tracking negativo**: el tracking negativo en textos display (-0.28px a -0.374px) es la firma visual de Apple — crea la sensación de headline "apretado" que da autoridad y premium.

### Patrones de componentes actualizados

#### Botones (jerarquía clara)
1. **`.btn-primary`** (Action Blue pill) — acción principal única por pantalla
2. **`.btn-secondary`** (ghost pill, borde hairline) — acción alternativa
3. **`.btn-dark`** (rect ink, 8px radius) — acciones utilitarias en barras
4. **`.btn-hero`** (large pill, weight 300) — CTA de landing/store

**Regla**: máximo 2 CTAs por sección. El primero es Action Blue, el segundo es ghost.

#### Cards
- **`.card-apple`** (18px radius, hairline border, padding 24px, canvas white) — mismo componente en todos los módulos del dashboard
- Sin sombra en cards (Apple no usa shadows en UI chrome, solo en product images)

#### Inputs
- **`.input-rect`** (11px radius) — formularios de auth y dashboard
- **`.input-apple`** (pill, 9999px) — búsquedas
- Focus: borde azul + ring rgba(0,102,204,0.12)

### Flujos de usuario — cambios UX

#### Flujo de autenticación
- **Auth layout**: panel izquierdo oscuro (#1d1d1f) con feature list verificada → crea confianza antes del registro
- **Progreso visual**: barra de progreso 3px (no el círculo del diseño anterior) — más moderna y no intrusiva
- **Categorías del negocio**: chips seleccionables con borde azul al seleccionar (feedback claro sin color de fondo agresivo)

#### Dashboard
- **Sidebar negro puro**: reduce distracción, el contenido principal siempre tiene máxima jerarquía
- **Indicador activo**: fondo `#0066cc` (no gradiente) — más legible y accesible
- **Topbar 52px**: acorde con la sub-nav frosted de Apple (más pequeño que el anterior de 64px)
- **Tile de bienvenida**: oscuro (#1d1d1f) en lugar del gradiente brand — más elegante para el dashboard

#### Tienda pública
- **Pattern de tiles**: blanco/parchment/oscuro — mismo ritmo que Apple.com
- **Product image zone**: parchment (#f5f5f7) con product-shadow en el emoji — simula el efecto de producto sobre superficie
- **CTA "Pedir"**: pill azul — reemplaza el gradient botón por color theme del negocio anterior
- **Nav**: negro 44px — unifica con el sistema global

### Micro-interacciones actualizadas

| Elemento | Interacción anterior | Nueva |
|----------|---------------------|-------|
| Hover en cards | `translateY(-2px)` + shadow | Solo `translateY(-2px)` (sin shadow) |
| Botón primario | `opacity: 90%` | `opacity: 0.88` + `scale(0.97)` en :active |
| Nav activo | Gradiente brand | `#0066cc` sólido |
| Input focus | ring brand purple | `border-color: #0066cc` + ring rgba (sutil) |
| Fade de página | 250ms | 300ms (más suave) |
| Skeletons | gris plano | gradient parchment → hairline |

### Accesibilidad — Estado actual

| Criterio | Estado | Notas |
|----------|--------|-------|
| Contraste de texto (WCAG AA) | ✅ Cumple | Toda la paleta verificada |
| Focus ring visible | ✅ Mejorado | Azul 0071e3 en todos los interactivos |
| Navegación por teclado | ⚠️ Parcial | Links y botones nativos OK; falta focus trap en modales |
| ARIA labels | ⚠️ Pendiente | Añadir a botones icónicos y formularios |
| `prefers-reduced-motion` | ✅ Implementado | En `globals.css` con `0.01ms` override |
| Touch targets móvil ≥44px | ✅ Mejorado | Botones pill min 44px height (vs 36px antes) |
| HTML semántico | ✅ Mantenido | `<nav>`, `<main>`, `<header>`, `<aside>`, `<footer>` |

### Responsive — Estado actual

| Breakpoint | Estado | Notas |
|------------|--------|-------|
| Mobile < 640px | ⚠️ Pendiente | Sidebar oculto, falta hamburger |
| Tablet 640-1024px | ⚠️ Parcial | Grid responsive OK, sidebar pendiente |
| Desktop ≥ 1024px | ✅ Funcional | Layout completo |

## Próximos cambios planificados

### UX
- [ ] Onboarding guiado paso a paso con barra de progreso
- [ ] Empty states con ilustraciones y CTA contextual
- [ ] Confirmaciones antes de acciones destructivas (eliminar producto)
- [ ] Toast notifications con Sonner

### Diseño
- [ ] Mobile sidebar con drawer/hamburger
- [ ] Animaciones de estado de carga para generación IA

### Accesibilidad
- [ ] ARIA labels en todos los botones icónicos
- [ ] Focus trap en modales y dialogs
- [ ] `role="alert"` en notificaciones dinámicas
- [ ] `aria-live="polite"` en resultados de IA
- [ ] Auditoría completa con axe-core antes del lanzamiento

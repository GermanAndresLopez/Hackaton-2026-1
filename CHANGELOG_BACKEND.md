# CHANGELOG — Backend (Convex / AI Gateway)

> Registro de todos los cambios en la capa de servidor: base de datos, autenticación, serverless functions, AI Gateway y APIs.

---

## [0.1.0] — 2026-05-23 — Arquitectura base

### Agregado

#### Convex — Base de datos y backend
- **Schema completo** (`convex/schema.ts`) con 6 tablas:
  - `users` — usuarios con índices por email y clerkId
  - `businesses` — negocios con índices por userId y slug
  - `products` — productos con índices por businessId y estado activo
  - `generatedContent` — historial de contenido IA generado
  - `conversations` — conversaciones de clientes (Telegram/WhatsApp)
  - `metrics` — métricas diarias por negocio
- Tipado fuerte con `v` de Convex para todos los campos
- Soporte de campos opcionales para datos de IA (`aiGenerated`, `metadata`)

#### AI Gateway Layer (`src/lib/ai/gateway.ts`)
- **KeyRotator**: rotación automática de API keys para evitar rate limits
  - Soporte múltiples keys por proveedor (hasta 3 Groq, 2 HuggingFace)
  - Rotación round-robin indexada
- **Cache en memoria**:
  - TTL de 1 hora por entrada
  - Límite de 500 entradas con limpieza automática
  - Key de cache por tarea + primeros 100 chars del prompt
- **Routing inteligente por tarea**:
  - `copywriting` → Groq + llama-3.3-70b-versatile
  - `marketing` → Groq + llama-3.3-70b-versatile
  - `branding` → Groq + mixtral-8x7b-32768
  - `chat` → Groq + llama-3.1-8b-instant (fast)
  - `image` → Pollinations (gratuito, sin key)
  - `banner` → HuggingFace + SDXL
- **Cadena de fallback para texto**:
  1. Groq (principal)
  2. OpenRouter (placeholder)
  3. Gemini (placeholder)
- **Soporte de imágenes**:
  - Pollinations: URL directa (sin auth, 1024x1024)
  - HuggingFace: Base64 blob para SDXL
- **Método utilitario** `AIGateway.parseJSON()` — extrae JSON de respuestas IA con fallback

#### Prompts base (`src/lib/ai/prompts.ts`)
- `PROMPTS.marketing(business, product, goal)` — post + CTA + hashtags en JSON
- `PROMPTS.productDescription(name, description, category)` — nombre + descripción + copy optimizados
- `PROMPTS.branding(idea)` — 3 nombres + slogan + colores + tono + estrategia
- `PROMPTS.chat(businessName, context, message)` — respuesta contextualizada del bot
- `PROMPTS.imageBanner(product, style)` — prompt para generación visual
- `PROMPTS.ideas(category, location)` — 5 ideas de negocio con inversión y pasos
- `PROMPTS.salesTips(businessName, products, metrics)` — 3 recomendaciones de ventas IA
- `SYSTEM_PROMPTS.assistant` — personalidad del asistente general

#### Tipos globales (`src/types/index.ts`)
- Interfaces: `User`, `Business`, `Product`, `GeneratedContent`, `Conversation`, `Message`, `Metric`
- Types: `UserRole`, `BusinessCategory`, `BusinessTheme`, `AIProvider`, `ContentType`
- Interfaces AI: `AIRequest`, `AIResponse`, `AIGatewayConfig`

#### Store de estado (`src/store/useBusinessStore.ts`)
- Zustand con persistencia en localStorage (`vendemasIA-business`)
- Estado: `currentBusiness`, `products`, `generatedContent`, `isLoading`, `error`
- Acciones: `setBusiness`, `addProduct`, `updateProduct`, `removeProduct`, `addGeneratedContent`
- Solo persiste `currentBusiness` (evitar estado pesado en localStorage)

---

## [0.2.0] — 2026-05-23 — Integración shadcn + utils restaurados

### Modificado
- **`src/lib/utils.ts`** — shadcn/ui reemplazó el archivo con solo `cn()`. Restauradas todas las utilidades:
  - `formatPrice(price, currency)` — formato Intl colombiano (COP)
  - `slugify(text)` — normalización de slugs con soporte NFD (tildes en español)
  - `truncate(text, length)` — corte con elipsis
  - `getInitials(name)` — primeras 2 letras del nombre
  - `formatDate(timestamp)` — formato fecha es-CO
  - `buildWhatsAppUrl(phone, message)` — URL wa.me con mensaje pre-armado
  - `buildTelegramUrl(username)` — URL t.me limpia

### Variables de entorno requeridas
```env
# Convex
NEXT_PUBLIC_CONVEX_URL=

# Groq (rotación de keys)
GROQ_API_KEY_1=
GROQ_API_KEY_2=
GROQ_API_KEY_3=

# HuggingFace
HUGGINGFACE_API_KEY_1=
HUGGINGFACE_API_KEY_2=

# Fallbacks (opcionales)
OPENROUTER_API_KEY=
GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Dependencias backend agregadas
- `convex` — base de datos realtime + serverless functions
- `groq` — SDK oficial de Groq
- `zod` — validación de datos
- `react-hook-form` + `@hookform/resolvers` — validación en formularios

---

---

## [0.3.0] — 2026-05-23 — Base de datos de prueba (Mock DB)

### Agregado

#### Seed Data (`src/lib/db/seedData.ts`)
- **3 negocios de prueba** con perfiles realistas:
  - `biz_001` — Brownies de María (comida / tema artesanal)
  - `biz_002` — Ropa Urbana KLD (ropa / tema callejero)
  - `biz_003` — Accesorios Cata (artesanías / tema premium)
- **3 usuarios** asociados a cada negocio
- **9 productos** distribuidos entre los 3 negocios, con datos completos:
  - Campos `aiGenerated` en los productos estrella (nombre, descripción, copy, hashtags)
  - Variedad de precios, stocks y categorías reales
  - 1 producto inactivo (`prod_005`) para probar toggle
- **4 contenidos generados** por IA (posts, slogans, campañas)
- **3 conversaciones** de clientes en Telegram con historial de mensajes reales
- **2 registros de métricas** con `productViews` y `productQueries` por negocio

#### Mock Database (`src/lib/db/mockDb.ts`)
- Estado mutable en memoria — se reinicia con el servidor
- **`db.users`**: `findByEmail`, `findById`, `create`
- **`db.businesses`**: `findByUserId`, `findBySlug`, `findById`, `list`, `create`, `update`
- **`db.products`**: `findByBusinessId`, `findActiveByBusinessId`, `findById`, `create`, `update`, `delete`, `toggleActive`, `addAIGenerated`
- **`db.generatedContent`**: `findByBusinessId`, `create`, `delete`
- **`db.conversations`**: `findByBusinessId`, `findById`, `create`, `addMessage`
- **`db.metrics`**: `findByBusinessId`, `incrementView`, `incrementMessage`
- **`db.getStats(businessId)`** — agrega stats del negocio en un solo objeto
- **`db.reset()`** — restaura el estado original del seed (útil para testing)
- Helpers exportados: `currentBusiness()`, `currentProducts()`, `currentMetrics()`, `currentContent()`, `currentConversations()`
- `CURRENT_BUSINESS_ID = "biz_001"` — negocio activo para pruebas

#### Páginas conectadas al Mock DB
- **`/dashboard`** — stats reales de `db.getStats()`, productos recientes del mock
- **`/productos`** — lista completa del mock, búsqueda funcional, `toggleActive` y `addAIGenerated` persistentes en sesión
- **`/metricas`** — KPIs y top productos calculados desde `mockDb`

## Próximos cambios planificados

### Convex functions (serverless)
- [ ] `convex/businesses.ts` — CRUD de negocios
- [ ] `convex/products.ts` — CRUD de productos con paginación
- [ ] `convex/generatedContent.ts` — guardar y listar contenido IA
- [ ] `convex/conversations.ts` — historial de conversaciones
- [ ] `convex/metrics.ts` — incrementar y consultar métricas

### API Routes (Next.js)
- [ ] `app/api/ai/marketing/route.ts` — endpoint de generación de marketing
- [ ] `app/api/ai/product/route.ts` — mejora de descripción de producto
- [ ] `app/api/ai/image/route.ts` — generación de imagen
- [ ] `app/api/ai/branding/route.ts` — generación de branding
- [ ] `app/api/ai/chat/route.ts` — chat del bot

### Autenticación
- [ ] Integrar Convex Auth o Clerk
- [ ] Middleware de protección de rutas
- [ ] Onboarding flow post-registro

### Bot Telegram
- [ ] Webhook receiver (`app/api/telegram/route.ts`)
- [ ] Contexto de negocio inyectado por businessId
- [ ] Persistencia de conversaciones en Convex

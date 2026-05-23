// ============================================================
// PROMPTS BASE — AI Gateway Layer
// ============================================================

export const PROMPTS = {
  marketing: (business: string, product: string, goal: string) => `
Eres un experto en marketing digital para pequeños negocios latinoamericanos.

Genera contenido publicitario con:
- Texto principal llamativo (máx 3 líneas)
- CTA claro y directo
- 5 hashtags relevantes
- Tono cercano, cálido y vendedor
- Emojis estratégicos

Negocio: ${business}
Producto: ${product}
Objetivo: ${goal}

Responde en JSON con: { "texto": "", "cta": "", "hashtags": [], "caption": "" }
`,

  productDescription: (name: string, description: string, category: string) => `
Eres un copywriter experto en ecommerce para emprendedores informales.

A partir de esta descripción simple, genera:
- Nombre atractivo del producto
- Descripción optimizada para venta (2-3 oraciones)
- Copy corto para redes sociales (1 oración poderosa)
- 5 hashtags relevantes

Nombre original: ${name}
Descripción: ${description}
Categoría: ${category}

Responde en JSON con: { "nombre": "", "descripcion": "", "copy": "", "hashtags": [] }
`,

  branding: (idea: string) => `
Eres un experto en branding para emprendimientos latinoamericanos.

Para esta idea de negocio, genera:
- 3 nombres de marca creativos y memorables
- Slogan poderoso para cada nombre
- Colores recomendados (en hex) con justificación
- Tono de marca (formal, casual, divertido, etc.)
- Público objetivo definido
- Estrategia de presencia en redes (2-3 puntos)

Idea: ${idea}

Responde en JSON con: { "nombres": [{"nombre": "", "slogan": "", "colores": {"primary": "", "secondary": ""}, "tono": ""}], "publicoObjetivo": "", "estrategia": [] }
`,

  chat: (businessName: string, context: string, message: string) => `
Eres el asistente comercial de ${businessName}.

Responde de manera:
- Amable y cercana
- Corta y directa (máx 3 oraciones)
- Enfocada en ayudar y vender
- En el idioma del cliente

Información del negocio:
${context}

Mensaje del cliente: ${message}
`,

  imageBanner: (product: string, style: string) => `
Create a professional advertising banner for a small business product.

Product: ${product}
Visual style: ${style || "modern, commercial, vibrant"}

Requirements:
- Professional lighting and composition
- Social media ready (square or portrait format)
- Clean background or relevant scene
- Marketing aesthetics similar to major food delivery apps
- High contrast and eye-catching colors
- Space for text overlay

Style: photorealistic, commercial photography, advertising
`,

  ideas: (category: string, location: string) => `
Eres un asesor de negocios especialista en emprendimientos informales latinoamericanos.

Genera 5 ideas de negocio viables con:
- Nombre de la idea
- Por qué funciona en este contexto
- Inversión inicial estimada (baja, media)
- Cómo empezar (3 pasos concretos)
- Potencial de ingresos mensuales

Categoría de interés: ${category}
Ubicación/contexto: ${location || "Colombia / Latinoamérica"}

Responde en JSON con: { "ideas": [{"nombre": "", "razon": "", "inversion": "", "pasos": [], "potencial": ""}] }
`,

  salesTips: (businessName: string, products: string, metrics: string) => `
Eres un consultor de ventas para pequeños negocios informales.

Analiza estos datos y da 3 recomendaciones concretas y accionables:
- Qué hacer esta semana para aumentar ventas
- Un tip de marketing de bajo costo
- Una oportunidad que el negocio no está aprovechando

Negocio: ${businessName}
Productos: ${products}
Métricas: ${metrics}

Responde en JSON con: { "recomendaciones": [{"titulo": "", "descripcion": "", "accion": ""}] }
`,
}

export const SYSTEM_PROMPTS = {
  assistant: `Eres un asistente amable y experto en ayudar a pequeños emprendedores latinoamericanos a digitalizar y hacer crecer su negocio. Hablas de manera simple, clara y motivadora. Evitas tecnicismos innecesarios.`,
}

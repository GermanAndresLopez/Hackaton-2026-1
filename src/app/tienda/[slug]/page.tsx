import { buildWhatsAppUrl, buildTelegramUrl, formatPrice } from "@/lib/utils"

// Datos mock — reemplazar con Convex query
const BUSINESS = {
  name: "Brownies de María",
  description: "Repostería artesanal hecha con amor y los mejores ingredientes. Pedidos todos los días.",
  category: "Repostería",
  emoji: "🍫",
  whatsapp: "573001234567",
  telegram: "browniesdemaria",
}

const PRODUCTS = [
  { id: "1", name: "Brownies de Chocolate Belga", description: "Recién horneados cada mañana. Suaves por dentro, crujientes por fuera.", price: 15000, stock: 20, emoji: "🍫", isActive: true },
  { id: "2", name: "Café Artesanal Premium", description: "Tostado suave de origen colombiano 100%.", price: 8000, stock: 50, emoji: "☕", isActive: true },
  { id: "3", name: "Cupcakes Personalizados", description: "Perfectos para cumpleaños y eventos especiales.", price: 5000, stock: 30, emoji: "🧁", isActive: true },
  { id: "4", name: "Torta de 3 Leches", description: "Tradicional y esponjosa. Solo los fines de semana.", price: 45000, stock: 5, emoji: "🎂", isActive: true },
]

export default function TiendaPublicaPage({ params }: { params: { slug: string } }) {
  const waUrl = buildWhatsAppUrl(BUSINESS.whatsapp, `Hola, me interesa hacer un pedido en ${BUSINESS.name}`)
  const tgUrl = buildTelegramUrl(BUSINESS.telegram)

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif' }}>

      {/* ── Nav ── */}
      <nav style={{ background: '#000', height: '44px', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.224px' }}>VendeMás IA</span>
      </nav>

      {/* ── Business header — canvas white ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '18px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', background: '#f5f5f7', border: '1px solid #e0e0e0',
              boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px',
            }}>
              {BUSINESS.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '6px' }}>
                {BUSINESS.name}
              </h1>
              <p style={{ fontSize: '14px', color: '#7a7a7a', lineHeight: 1.5, marginBottom: '20px', letterSpacing: '-0.224px' }}>
                {BUSINESS.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#25D366', color: '#fff', fontSize: '14px', fontWeight: 400, padding: '10px 20px', borderRadius: '9999px', textDecoration: 'none', letterSpacing: '-0.224px', transition: 'opacity 120ms' }}>
                  💬 WhatsApp
                </a>
                <a href={tgUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#229ED9', color: '#fff', fontSize: '14px', fontWeight: 400, padding: '10px 20px', borderRadius: '9999px', textDecoration: 'none', letterSpacing: '-0.224px', transition: 'opacity 120ms' }}>
                  ✈️ Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '24px' }}>
          Nuestros Productos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRODUCTS.filter(p => p.isActive).map((product) => (
            <div key={product.id} className="card-apple" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Product image area */}
              <div style={{
                height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '72px', background: '#f5f5f7', borderBottom: '1px solid #e0e0e0',
              }}>
                <span style={{ filter: 'drop-shadow(rgba(0,0,0,0.22) 3px 5px 20px)' }}>{product.emoji}</span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', lineHeight: 1.3, letterSpacing: '-0.374px' }}>
                    {product.name}
                  </h3>
                  {product.stock <= 5 && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: '9999px', flexShrink: 0, letterSpacing: '0.02em' }}>
                      Últimas unidades
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#7a7a7a', lineHeight: 1.5, marginBottom: '16px', letterSpacing: '-0.224px' }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '21px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.374px' }}>
                    {formatPrice(product.price)}
                  </p>
                  <a
                    href={buildWhatsAppUrl(BUSINESS.whatsapp, `Hola, me interesa este producto: *${product.name}* (${formatPrice(product.price)})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#0066cc', color: '#fff', fontSize: '14px', fontWeight: 400, padding: '8px 18px', borderRadius: '9999px', textDecoration: 'none', letterSpacing: '-0.224px', transition: 'opacity 120ms' }}
                  >
                    Pedir →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer — parchment ── */}
      <footer style={{ background: '#f5f5f7', borderTop: '1px solid #e0e0e0', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
          Tienda creada con{" "}
          <a href="/" style={{ color: '#0066cc', fontWeight: 600, textDecoration: 'none' }}>VendeMás IA</a>
          {" "}· {BUSINESS.name}
        </p>
      </footer>
    </div>
  )
}

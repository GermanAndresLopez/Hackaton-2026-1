import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { currentBusiness, currentProducts, db } from "@/lib/db/mockDb"
import { ROUTES } from "@/lib/constants"

export default function DashboardPage() {
  const business = currentBusiness()
  const products = currentProducts()
  const stats = db.getStats(business.id)
  const recentProducts = products.slice(0, 3)

  const STATS = [
    { label: "Productos activos", value: String(stats.activeProducts), sub: `${stats.totalProducts} en total` },
    { label: "Visitas a tu tienda", value: String(stats.totalViews), sub: "+23% este mes" },
    { label: "Mensajes recibidos", value: String(stats.totalMessages), sub: "+8 hoy" },
    { label: "Contenido generado", value: String(stats.contentGenerated), sub: "+5 esta semana" },
  ]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Welcome banner — card claro ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e0e0e0',
        padding: '32px 40px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc', letterSpacing: '-0.224px', marginBottom: '6px' }}>
            Bienvenido de vuelta
          </p>
          <h2 style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontSize: '28px', fontWeight: 600, color: '#1d1d1f',
            lineHeight: 1.1, letterSpacing: '-0.28px', marginBottom: '6px',
          }}>
            {business.name}
          </h2>
          <p style={{ fontSize: '15px', color: '#7a7a7a', letterSpacing: '-0.374px' }}>
            Tu centro de control para crecer más con IA.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexShrink: 0 }}>
          <Link href={ROUTES.productos}
            style={{
              background: '#0066cc', color: '#fff',
              fontSize: '14px', fontWeight: 400,
              padding: '10px 20px', borderRadius: '9999px',
              textDecoration: 'none', letterSpacing: '-0.224px',
              display: 'inline-block',
            }}>
            + Agregar producto
          </Link>
          <Link href={ROUTES.marketing}
            style={{
              background: '#f5f5f7', color: '#1d1d1f',
              fontSize: '14px', fontWeight: 400,
              padding: '10px 20px', borderRadius: '9999px',
              border: '1px solid #e0e0e0',
              textDecoration: 'none', letterSpacing: '-0.224px',
              display: 'inline-block',
            }}>
            Generar marketing
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
        {STATS.map((stat, i) => (
          <div key={i} className="card-apple">
            <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, color: '#0066cc', lineHeight: 1, marginBottom: '4px' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '2px', letterSpacing: '-0.224px' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Quick actions */}
        <div className="card-apple">
          <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '16px', letterSpacing: '-0.374px' }}>
            Acciones rápidas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {QUICK_ACTIONS.map((action, i) => (
              /* CSS hover via .row-hover — no JS event handlers needed */
              <div key={i} className="row-hover" style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '11px',
              }}>
                <span style={{ fontSize: '20px' }}>{action.icon}</span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>{action.label}</p>
                  <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tip + Recent products */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* AI recommendation */}
          <div style={{ background: '#e8f1fb', borderRadius: '18px', border: '1px solid #c5d9f0', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ fontSize: '24px', flexShrink: 0 }}>💡</div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0058b3', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                  Recomendación IA del día
                </p>
                <p style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: 1.5, letterSpacing: '-0.224px' }}>
                  Tus clientes preguntan mucho por domicilios. Considera agregar{" "}
                  <strong>envío gratis los fines de semana</strong> como promoción. Los negocios
                  que lo hacen aumentan consultas en un 40%.
                </p>
                <Link href={ROUTES.marketing} style={{ display: 'inline-block', marginTop: '10px', fontSize: '13px', fontWeight: 600, color: '#0066cc', textDecoration: 'none', letterSpacing: '-0.224px' }}>
                  → Crear campaña para esto
                </Link>
              </div>
            </div>
          </div>

          {/* Recent products */}
          <div className="card-apple">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '17px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>
                Productos recientes
              </h3>
              <Link href={ROUTES.productos} style={{ fontSize: '13px', color: '#0066cc', textDecoration: 'none', letterSpacing: '-0.224px' }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {recentProducts.map((p) => (
                <div key={p.id} className="row-hover" style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '11px',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '11px',
                    background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0,
                  }}>
                    {p.images[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{p.category}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>{formatPrice(p.price)}</p>
                    <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{p.stock} en stock</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ height: '1px', background: '#e0e0e0', margin: '12px 0' }} />
            <Link href={ROUTES.productos}
              className="btn-primary"
              style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: '14px', padding: '10px' }}>
              + Agregar producto
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const QUICK_ACTIONS = [
  { icon: "📦", label: "Nuevo producto", description: "Agregar con ayuda de IA" },
  { icon: "✦", label: "Generar post", description: "Para Instagram o Facebook" },
  { icon: "▣", label: "Mejorar imagen", description: "Convierte foto en publicidad" },
  { icon: "◈", label: "Pedir consejo", description: "Al agente de negocios IA" },
  { icon: "↗", label: "Ver mi tienda", description: "Como la ve el cliente" },
]

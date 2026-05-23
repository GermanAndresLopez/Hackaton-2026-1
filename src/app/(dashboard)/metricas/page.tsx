import { currentMetrics, currentProducts, db, CURRENT_BUSINESS_ID } from "@/lib/db/mockDb"

export default function MetricasPage() {
  const metrics = currentMetrics()
  const products = currentProducts()
  const stats = db.getStats(CURRENT_BUSINESS_ID)
  const productViews = (metrics?.productViews ?? {}) as Record<string, number>

  const topProducts = products
    .map(p => ({ ...p, views: productViews[p.id] ?? 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)

  const maxViews = topProducts[0]?.views ?? 1

  const KPIS = [
    { label: "Visitas a tienda",    value: String(stats.totalViews),       change: "+23% esta semana" },
    { label: "Mensajes clientes",   value: String(stats.totalMessages),    change: "+12% esta semana" },
    { label: "Productos activos",   value: String(stats.activeProducts),   change: `${stats.totalProducts} en total` },
    { label: "Contenido generado",  value: String(stats.contentGenerated), change: "+5 esta semana" },
  ]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Métricas
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Entiende cómo está creciendo tu negocio
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '20px' }}>
        {KPIS.map((kpi, i) => (
          <div key={i} className="card-apple">
            <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, color: '#0066cc', lineHeight: 1, marginBottom: '4px' }}>
              {kpi.value}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '2px', letterSpacing: '-0.224px' }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, letterSpacing: '-0.12px' }}>{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top productos */}
        <div className="card-apple">
          <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '20px', letterSpacing: '-0.374px' }}>
            Productos más vistos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {topProducts.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', width: '32px', textAlign: 'center', flexShrink: 0 }}>{p.images[0]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.224px' }}>
                      {p.name}
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc', marginLeft: '8px', flexShrink: 0, letterSpacing: '-0.224px' }}>{p.views}</p>
                  </div>
                  <div style={{ height: '4px', background: '#f5f5f7', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: '#0066cc', borderRadius: '9999px',
                      width: `${(p.views / maxViews) * 100}%`,
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="card-apple">
          <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '20px', letterSpacing: '-0.374px' }}>
            Insights de IA
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} style={{ padding: '16px', background: '#e8f1fb', borderRadius: '11px', border: '1px solid #c5d9f0' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0058b3', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                  {insight.title}
                </p>
                <p style={{ fontSize: '13px', color: '#1d1d1f', lineHeight: 1.5, letterSpacing: '-0.224px' }}>
                  {insight.text}
                </p>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#0066cc', marginTop: '8px', letterSpacing: '-0.12px' }}>
                  {insight.cta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card-apple" style={{ marginTop: '20px' }}>
        <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '16px', letterSpacing: '-0.374px' }}>
          Actividad de la semana
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {ACTIVITY.map((a, i) => (
            /* .row-hover handles CSS hover — no JS event handlers */
            <div key={i} className="row-hover" style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '10px 12px', borderRadius: '11px',
            }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{a.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#1d1d1f', letterSpacing: '-0.224px' }}>{a.label}</p>
                <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{a.time}</p>
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px',
                background: a.positive ? '#d1fae5' : '#e8f1fb',
                color: a.positive ? '#065f46' : '#0058b3',
                letterSpacing: '0.02em', flexShrink: 0,
              }}>
                {a.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const AI_INSIGHTS = [
  {
    title: "Oportunidad de domicilios",
    text: "El 68% de tus clientes pregunta por envío a domicilio. Considera agregar esta opción para aumentar ventas.",
    cta: "→ Crear promoción de envío",
  },
  {
    title: "Pico de actividad los viernes",
    text: "Los viernes entre 6-9 PM tu tienda tiene 3× más visitas. Publica contenido antes de esa hora para maximizar alcance.",
    cta: "→ Programar un post para el viernes",
  },
]

const ACTIVITY = [
  { icon: "👁️", label: "Nueva visita a tu tienda", time: "Hace 5 minutos", value: "+1 visita", positive: true },
  { icon: "💬", label: "Mensaje de cliente en Telegram", time: "Hace 23 minutos", value: "1 mensaje", positive: false },
  { icon: "✦", label: "Marketing generado por IA", time: "Hace 2 horas", value: "Post Instagram", positive: false },
  { icon: "📦", label: "Producto actualizado", time: "Hace 1 día", value: "Brownies", positive: false },
  { icon: "👁️", label: "Pico de visitas", time: "Ayer a las 7 PM", value: "42 visitas", positive: true },
]

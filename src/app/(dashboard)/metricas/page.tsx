"use client"

import { formatPrice } from "@/lib/utils"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import { Eye, MessageCircle, Sparkles, Package, type LucideIcon } from "lucide-react"

export default function MetricasPage() {
  const currentBusiness = useBusinessStore((state) => state.currentBusiness)
  const businessId = currentBusiness?._id

  // Consulta de productos reales
  const products = useQuery(api.products.list, { businessId }) ?? []
  
  // Usar visitas y estadísticas simuladas de forma estática hasta integrar la tabla de métricas en Convex
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.isActive).length

  // Simular algunas visualizaciones basadas en los productos del catálogo
  const topProducts = products
    .map((p, index) => ({ 
      ...p, 
      views: 120 - index * 15 > 0 ? 120 - index * 15 : 5 
    }))
    .slice(0, 5)

  const maxViews = topProducts[0]?.views ?? 1

  const KPIS = [
    { label: "Visitas a tienda",    value: "254",          change: "+23% esta semana" },
    { label: "Mensajes clientes",   value: "67",           change: "+12% esta semana" },
    { label: "Productos activos",   value: String(activeProducts),   change: `${totalProducts} en total` },
    { label: "Contenido generado",  value: "14",           change: "+5 esta semana" },
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
          {topProducts.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#7a7a7a', textAlign: 'center', padding: '24px' }}>
              No tienes productos suficientes en tu catálogo para generar esta métrica.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topProducts.map((p) => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#f0f0f5', borderRadius: '8px' }}>
                    <Package size={18} style={{ color: '#7a7a7a' }} />
                  </div>
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
          )}
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
            <div key={i} className="row-hover" style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '10px 12px', borderRadius: '11px',
            }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0f0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <a.icon size={16} style={{ color: '#0066cc' }} />
              </div>
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

const ACTIVITY: { icon: LucideIcon; label: string; time: string; value: string; positive: boolean }[] = [
  { icon: Eye,           label: "Nueva visita a tu tienda",       time: "Hace 5 minutos",   value: "+1 visita",      positive: true },
  { icon: MessageCircle, label: "Mensaje de cliente en Telegram", time: "Hace 23 minutos",  value: "1 mensaje",      positive: false },
  { icon: Sparkles,      label: "Marketing generado por IA",      time: "Hace 2 horas",     value: "Post Instagram", positive: false },
  { icon: Package,       label: "Producto actualizado",           time: "Hace 1 día",       value: "Brownies",       positive: false },
  { icon: Eye,           label: "Pico de visitas",                time: "Ayer a las 7 PM",  value: "42 visitas",     positive: true },
]

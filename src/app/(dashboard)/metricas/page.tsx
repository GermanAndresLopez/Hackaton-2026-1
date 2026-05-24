"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import { Eye, MessageCircle, Sparkles, Package, TrendingUp } from "lucide-react"

// Helper function to format relative time for recent events
const formatRelativeTime = (timeMs: number) => {
  const diff = Date.now() - timeMs
  const mins = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (mins < 1) return "Hace unos momentos"
  if (mins < 60) return `Hace ${mins} ${mins === 1 ? 'minuto' : 'minutos'}`
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  return `Hace ${days} ${days === 1 ? 'día' : 'días'}`
}

export default function MetricasPage() {
  const currentBusiness = useBusinessStore((state) => state.currentBusiness)
  const businessId = currentBusiness?._id

  // Convex Query for Real Dashboard Metrics
  const dashboardData = useQuery(
    api.metrics.getDashboardMetrics, 
    businessId ? { businessId } : "skip"
  )

  // ── LOADING STATE (Skeletons) ──
  if (dashboardData === undefined) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div className="animate-pulse bg-gray-200" style={{ width: '140px', height: '32px', borderRadius: '8px', marginBottom: '8px' }} />
          <div className="animate-pulse bg-gray-100" style={{ width: '260px', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* KPIs Skeletons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-apple" style={{ minHeight: '110px' }}>
              <div className="animate-pulse bg-gray-200" style={{ width: '60px', height: '36px', borderRadius: '6px', marginBottom: '10px' }} />
              <div className="animate-pulse bg-gray-100" style={{ width: '110px', height: '14px', borderRadius: '4px', marginBottom: '6px' }} />
              <div className="animate-pulse bg-gray-100" style={{ width: '70px', height: '10px', borderRadius: '3px' }} />
            </div>
          ))}
        </div>

        {/* Charts Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ marginBottom: '24px' }}>
          <div className="card-apple" style={{ height: '280px' }}>
            <div className="animate-pulse bg-gray-200" style={{ width: '180px', height: '18px', borderRadius: '4px', marginBottom: '24px' }} />
            <div className="animate-pulse bg-gray-100" style={{ width: '100%', height: '160px', borderRadius: '12px' }} />
          </div>
          <div className="card-apple" style={{ height: '280px' }}>
            <div className="animate-pulse bg-gray-200" style={{ width: '180px', height: '18px', borderRadius: '4px', marginBottom: '24px' }} />
            <div className="animate-pulse bg-gray-100" style={{ width: '100%', height: '160px', borderRadius: '12px' }} />
          </div>
        </div>
      </div>
    )
  }

  // If there's no business selected
  if (!businessId) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', padding: '64px 24px' }}>
        <Package size={48} style={{ color: '#c0c0c0', margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px' }}>Ningún negocio seleccionado</h3>
        <p style={{ fontSize: '14px', color: '#7a7a7a' }}>Selecciona o crea un negocio en tu panel de control para ver las métricas.</p>
      </div>
    )
  }

  const {
    totalViews,
    totalMessages,
    activeProducts,
    totalProducts,
    totalContentGenerated,
    topProducts,
    activity,
    platformDistribution,
    dailyTrend
  } = dashboardData

  // Prepare KPI objects
  const KPIS = [
    { label: "Visitas a tienda",    value: String(totalViews),          change: "Visualizaciones totales" },
    { label: "Mensajes clientes",   value: String(totalMessages),       change: "Recibidos vía IA" },
    { label: "Productos activos",   value: String(activeProducts),      change: `${totalProducts} en catálogo` },
    { label: "Contenido generado",  value: String(totalContentGenerated), change: "Marketing e imágenes" },
  ]

  // Top views calculation
  const maxViews = topProducts[0]?.views ?? 1

  // Platform Doughnut calculations
  const totalChats = (platformDistribution?.telegram || 0) + (platformDistribution?.whatsapp || 0)
  const telegramPercent = totalChats > 0 ? Math.round((platformDistribution.telegram / totalChats) * 100) : 0
  const whatsappPercent = totalChats > 0 ? Math.round((platformDistribution.whatsapp / totalChats) * 100) : 0

  // SVG Area Trend calculations
  const maxTrendVal = Math.max(
    ...dailyTrend.map((d: any) => Math.max(d.conversations, d.content)),
    4 // baseline height scale
  )
  
  const svgWidth = 500
  const svgHeight = 160
  const paddingX = 30
  const paddingY = 20
  const graphWidth = svgWidth - paddingX * 2
  const graphHeight = svgHeight - paddingY * 2
  
  const getCoords = (index: number, val: number) => {
    const x = paddingX + (index * graphWidth) / 6
    const y = svgHeight - paddingY - (val / maxTrendVal) * graphHeight
    return { x, y }
  }

  // Conversation Trend coords
  const convPoints = dailyTrend.map((d: any, i: number) => getCoords(i, d.conversations))
  const convLinePath = convPoints.length > 0 
    ? `M ${convPoints.map((p: any) => `${p.x},${p.y}`).join(' L ')}` 
    : ''
  const convAreaPath = convPoints.length > 0 
    ? `${convLinePath} L ${convPoints[convPoints.length - 1].x},${svgHeight - paddingY} L ${convPoints[0].x},${svgHeight - paddingY} Z` 
    : ''

  // Content Trend coords
  const contentPoints = dailyTrend.map((d: any, i: number) => getCoords(i, d.content))
  const contentLinePath = contentPoints.length > 0 
    ? `M ${contentPoints.map((p: any) => `${p.x},${p.y}`).join(' L ')}` 
    : ''
  const contentAreaPath = contentPoints.length > 0 
    ? `${contentLinePath} L ${contentPoints[contentPoints.length - 1].x},${svgHeight - paddingY} L ${contentPoints[0].x},${svgHeight - paddingY} Z` 
    : ''

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '32px' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Métricas
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Entiende cómo está creciendo tu negocio
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
        {KPIS.map((kpi, i) => (
          <div key={i} className="card-apple" style={{ background: '#fff' }}>
            <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, color: '#0066cc', lineHeight: 1, marginBottom: '6px' }}>
              {kpi.value}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '2px', letterSpacing: '-0.224px' }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: '12px', color: '#8e8e93', fontWeight: 500, letterSpacing: '-0.12px' }}>
              {kpi.change}
            </p>
          </div>
        ))}
      </div>

      {/* Visual Analytics / Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ marginBottom: '24px' }}>
        
        {/* Trend Area Chart Card */}
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#1d1d1f', letterSpacing: '-0.3px' }}>
              Tendencia de Actividad (Semana)
            </h3>
            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0066cc' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0066cc' }} /> Chats
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#bf5af2' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#bf5af2' }} /> Marketing IA
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: '160px', overflowX: 'auto' }}>
            <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066cc" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0066cc" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bf5af2" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#bf5af2" stopOpacity={0}/>
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              {Array.from({ length: 4 }).map((_, i) => {
                const y = paddingY + (i * graphHeight) / 3
                return (
                  <line key={i} x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#f2f2f7" strokeWidth="1" strokeDasharray="4,4" />
                )
              })}

              {/* Areas */}
              {convAreaPath && <path d={convAreaPath} fill="url(#colorChats)" />}
              {contentAreaPath && <path d={contentAreaPath} fill="url(#colorContent)" />}

              {/* Lines */}
              {convLinePath && <path d={convLinePath} fill="none" stroke="#0066cc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
              {contentLinePath && <path d={contentLinePath} fill="none" stroke="#bf5af2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

              {/* Glow Points */}
              {convPoints.map((p: any, i: number) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#0066cc" strokeWidth="2" />
              ))}
              {contentPoints.map((p: any, i: number) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#bf5af2" strokeWidth="2" />
              ))}

              {/* X Axis Labels */}
              {dailyTrend.map((d: any, i: number) => {
                const x = paddingX + (i * graphWidth) / 6
                return (
                  <text key={i} x={x} y={svgHeight - 4} textAnchor="middle" style={{ fontSize: '10px', fill: '#8e8e93', fontWeight: 500, fontFamily: 'system-ui' }}>
                    {d.dayLabel}
                  </text>
                )
              })}
            </svg>
          </div>
        </div>

        {/* Channels Doughnut Chart Card */}
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontWeight: 600, fontSize: '16px', color: '#1d1d1f', letterSpacing: '-0.3px', marginBottom: '16px' }}>
            Distribución de Canales de Cliente
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '20px', flex: 1 }}>
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f4f4f7" strokeWidth="12" />
              
              {totalChats === 0 ? (
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#d1d5db" strokeWidth="10" strokeDasharray="6,4" />
              ) : (
                <>
                  {whatsappPercent > 0 && (
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#25D366" 
                      strokeWidth="12" 
                      strokeDasharray={`${(whatsappPercent / 100) * 251.3} 251.3`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  {telegramPercent > 0 && (
                    <circle 
                      cx="50" cy="50" r="40" 
                      fill="transparent" 
                      stroke="#0088cc" 
                      strokeWidth="12" 
                      strokeDasharray={`${(telegramPercent / 100) * 251.3} 251.3`}
                      strokeDashoffset={`-${(whatsappPercent / 100) * 251.3}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                </>
              )}
              
              <text x="50" y="47" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '11px', fontWeight: 700, fill: '#1d1d1f', fontFamily: 'system-ui' }}>
                {totalChats}
              </text>
              <text x="50" y="58" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '7px', fontWeight: 600, fill: '#8e8e93', textTransform: 'uppercase', fontFamily: 'system-ui' }}>
                Chats
              </text>
            </svg>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '140px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#25D366' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>WhatsApp</span>
                <span style={{ fontSize: '12px', color: '#8e8e93', marginLeft: 'auto' }}>{whatsappPercent}% ({platformDistribution?.whatsapp || 0})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#0088cc' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>Telegram</span>
                <span style={{ fontSize: '12px', color: '#8e8e93', marginLeft: 'auto' }}>{telegramPercent}% ({platformDistribution?.telegram || 0})</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Top Products View Progress Card */}
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
                  <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#f5f5f7', borderRadius: '8px' }}>
                    <Package size={18} style={{ color: '#7a7a7a' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.224px' }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc', marginLeft: '8px', flexShrink: 0, letterSpacing: '-0.224px' }}>
                        {p.views} {p.views === 1 ? 'vista' : 'vistas'}
                      </p>
                    </div>
                    <div style={{ height: '5px', background: '#f5f5f7', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', background: 'linear-gradient(90deg, #0066cc, #00c7fc)', borderRadius: '9999px',
                        width: `${(p.views / maxViews) * 100}%`,
                        transition: 'width 0.5s ease-out'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights Card */}
        <div className="card-apple">
          <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '20px', letterSpacing: '-0.374px' }}>
            Insights de IA
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} style={{ padding: '16px', background: '#f5f7fa', borderRadius: '14px', border: '1px solid #ebebeb' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0058b3', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                  {insight.title}
                </p>
                <p style={{ fontSize: '13px', color: '#1d1d1f', lineHeight: 1.5, letterSpacing: '-0.224px' }}>
                  {insight.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#0066cc', marginTop: '8px', cursor: 'pointer' }}>
                  <TrendingUp size={14} /> {insight.cta}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Real Recent Activity List */}
      <div className="card-apple" style={{ marginTop: '20px' }}>
        <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '16px', letterSpacing: '-0.374px' }}>
          Actividad Reciente
        </h3>
        
        {activity.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#7a7a7a', textAlign: 'center', padding: '24px' }}>
            Aún no hay actividad registrada para tu negocio.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {activity.map((a: any, i: number) => {
              const IconComp = a.type === "product" ? Package : a.type === "content" ? Sparkles : a.type === "view" ? Eye : MessageCircle
              return (
                <div key={i} className="row-hover" style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '10px 12px', borderRadius: '11px',
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComp size={16} style={{ color: '#0066cc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#1d1d1f', letterSpacing: '-0.224px' }}>
                      {a.label}
                    </p>
                    <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
                      {formatRelativeTime(a.timeMs)}
                    </p>
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
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}

const AI_INSIGHTS = [
  {
    title: "Oportunidad de domicilios",
    text: "El 68% de tus clientes pregunta por envío a domicilio. Considera agregar esta opción para aumentar ventas.",
    cta: "Configurar opciones de envío",
  },
  {
    title: "Pico de actividad los viernes",
    text: "Los viernes entre 6-9 PM tu tienda tiene 3× más visitas. Publica contenido antes de esa hora para maximizar alcance.",
    cta: "Crear post para el viernes",
  },
]


"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import {
  Eye, MessageCircle, Sparkles, Package, TrendingUp,
  ArrowUpRight, BarChart2,
} from "lucide-react"

// ─── Helpers ────────────────────────────────────────────────────────────────

const relTime = (ms: number) => {
  const diff = Date.now() - ms
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (m < 1) return "Hace unos momentos"
  if (m < 60) return `Hace ${m} min`
  if (h < 24) return `Hace ${h} h`
  return `Hace ${d} día${d !== 1 ? "s" : ""}`
}

const CONTENT_LABELS: Record<string, string> = {
  marketing_post: "Post de marketing",
  image:          "Imagen generada",
  slogan:         "Slogan",
  description:    "Descripción",
  otro:           "Otro contenido",
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ w, h, r = 8 }: { w: string; h: number; r?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{ width: w, height: h, borderRadius: r, background: '#ebebeb' }}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MetricasPage() {
  const currentBusiness = useBusinessStore(s => s.currentBusiness)
  const businessId = currentBusiness?._id

  const data = useQuery(
    api.metrics.getDashboardMetrics,
    businessId ? { businessId } : "skip"
  )

  // Loading
  if (data === undefined) {
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <Skeleton w="160px" h={28} />
          <div style={{ marginTop: "8px" }}><Skeleton w="240px" h={16} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "20px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-apple" style={{ minHeight: 110 }}>
              <Skeleton w="60px" h={32} /><div style={{ marginTop: 10 }}><Skeleton w="100px" h={14} /></div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {[...Array(2)].map((_, i) => <div key={i} className="card-apple" style={{ height: 200 }}><Skeleton w="160px" h={18} /></div>)}
        </div>
      </div>
    )
  }

  if (!businessId) return null

  const {
    totalViews            = 0,
    totalContentGenerated = 0,
    activeProducts        = 0,
    totalProducts         = 0,
    topProducts           = [],
    contentByType         = [],
    platformDistribution  = { telegram: 0, whatsapp: 0 },
    weekdayActivity       = [],
    activity              = [],
  } = data ?? {}

  const totalChats = (platformDistribution?.telegram || 0) + (platformDistribution?.whatsapp || 0)
  const maxViews   = topProducts[0]?.views ?? 1

  const KPIS = [
    { icon: Eye,      label: "Visitas a tienda",   value: totalViews,            sub: "Total acumulado",        color: "#0066cc", bg: "#e8f1fb" },
    { icon: Sparkles, label: "Contenido generado", value: totalContentGenerated, sub: "Marketing e imágenes",   color: "#d97706", bg: "#fef3c7" },
  ]

  const maxViews2   = Math.max(...(weekdayActivity as any[]).map((d: any) => d.views   || 0), 1)
  const maxWa       = Math.max(...(weekdayActivity as any[]).map((d: any) => d.waClicks || 0), 1)
  const maxWeekday  = Math.max(maxViews2, maxWa, 1)

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "40px" }}>

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: "28px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.5px", marginBottom: "4px" }}>
          Métricas
        </h2>
        <p style={{ fontSize: "14px", color: "#7a7a7a" }}>
          Entiende cómo está creciendo tu negocio
        </p>
      </div>

      {/* KPI Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px", marginBottom: "14px" }}>
        {KPIS.map((k, i) => (
          <div key={i} className="card-apple" style={{ background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={17} style={{ color: k.color }} />
              </div>
              <ArrowUpRight size={14} style={{ color: "#c0c0c0" }} />
            </div>
            <p style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: "32px", fontWeight: 700, color: k.color, lineHeight: 1, letterSpacing: "-1px", marginBottom: "6px" }}>
              {k.value}
            </p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#1d1d1f", marginBottom: "2px", letterSpacing: "-0.2px" }}>{k.label}</p>
            <p style={{ fontSize: "11px", color: "#8e8e93" }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Productos activos + Gráfico días de la semana */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "14px", marginBottom: "20px" }}>

        {/* Productos activos */}
        <div style={{ background: "#d1fae5", borderRadius: "16px", padding: "20px", border: "1px solid #bbf7d0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
            <Package size={14} style={{ color: "#059669" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#059669" }}>Productos activos</span>
          </div>
          <p style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: "40px", fontWeight: 700, color: "#1d1d1f", lineHeight: 1, letterSpacing: "-1.5px" }}>
            {activeProducts}
          </p>
          <p style={{ fontSize: "11px", color: "#7a7a7a", marginTop: "8px" }}>{totalProducts} en catálogo</p>
        </div>

        {/* Barras por día de la semana */}
        <div className="card-apple">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#e8f1fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart2 size={15} style={{ color: "#0066cc" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.3px" }}>Vistas y pedidos por día</h3>
                <p style={{ fontSize: "11px", color: "#8e8e93" }}>Vistas a tienda · Clicks en "Pedir por WhatsApp"</p>
              </div>
            </div>
            {/* Leyenda */}
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#0066cc" }} />
                <span style={{ fontSize: "10px", color: "#7a7a7a" }}>Vistas</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#25D366" }} />
                <span style={{ fontSize: "10px", color: "#7a7a7a" }}>WhatsApp</span>
              </div>
            </div>
          </div>

          {weekdayActivity.length === 0 ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <p style={{ fontSize: "13px", color: "#8e8e93" }}>Sin datos todavía</p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "6px", height: "100px", alignItems: "flex-end" }}>
              {(weekdayActivity as any[]).map((d: any, i: number) => {
                const vPct  = ((d.views   || 0) / maxWeekday) * 100
                const wPct  = ((d.waClicks || 0) / maxWeekday) * 100
                const isMaxV = (d.views || 0) === maxViews2 && maxViews2 > 1
                const isMaxW = (d.waClicks || 0) === maxWa && maxWa > 1
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", gap: "3px" }}>
                    {/* Números encima */}
                    <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
                      {(d.views || 0) > 0 && (
                        <span style={{ fontSize: "9px", fontWeight: 700, color: isMaxV ? "#0066cc" : "#b0b0b0" }}>{d.views}</span>
                      )}
                      {(d.waClicks || 0) > 0 && (
                        <span style={{ fontSize: "9px", fontWeight: 700, color: isMaxW ? "#25D366" : "#b0b0b0" }}>·{d.waClicks}</span>
                      )}
                    </div>
                    {/* Barras dobles */}
                    <div style={{ width: "100%", display: "flex", gap: "2px", alignItems: "flex-end", height: "72px" }}>
                      <div style={{
                        flex: 1, borderRadius: "4px 4px 0 0", minHeight: "3px",
                        height: `${Math.max(vPct, (d.views || 0) > 0 ? 4 : 0)}%`,
                        background: isMaxV ? "#0066cc" : "#c5d9f0",
                      }} />
                      <div style={{
                        flex: 1, borderRadius: "4px 4px 0 0", minHeight: "3px",
                        height: `${Math.max(wPct, (d.waClicks || 0) > 0 ? 4 : 0)}%`,
                        background: isMaxW ? "#25D366" : "#bbf7d0",
                      }} />
                    </div>
                    <span style={{ fontSize: "10px", color: "#8e8e93", marginTop: "2px" }}>{d.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row: Top productos + Plataformas + Contenido */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>

        {/* Top productos más vistos */}
        <div className="card-apple">
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.3px", marginBottom: "16px" }}>
            Productos más vistos
          </h3>
          {topProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Package size={28} style={{ color: "#c0c0c0", margin: "0 auto 8px" }} />
              <p style={{ fontSize: "13px", color: "#8e8e93" }}>Aún no hay productos</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {topProducts.map((p, i) => (
                <div key={p._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700,
                    background: i === 0 ? "#fef3c7" : i === 1 ? "#f0f0f5" : "#fafafa",
                    color: i === 0 ? "#d97706" : "#7a7a7a",
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#1d1d1f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.name}
                      </p>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#0066cc", flexShrink: 0, marginLeft: "6px" }}>
                        {p.views}
                      </span>
                    </div>
                    <div style={{ height: 4, background: "#f0f0f5", borderRadius: 9999 }}>
                      <div style={{
                        height: "100%", borderRadius: 9999,
                        background: i === 0 ? "linear-gradient(90deg,#0066cc,#2997ff)" : "#0066cc40",
                        width: `${(p.views / maxViews) * 100}%`,
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Distribución de plataformas */}
        <div className="card-apple">
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.3px", marginBottom: "16px" }}>
            Canales de contacto
          </h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f0f0f5" strokeWidth="12" />
              {totalChats === 0 ? (
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e0e0e0" strokeWidth="10" strokeDasharray="6 4" />
              ) : (
                <>
                  {(platformDistribution?.whatsapp || 0) > 0 && (
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#25D366" strokeWidth="12"
                      strokeDasharray={`${((platformDistribution.whatsapp / totalChats) * 251.3).toFixed(1)} 251.3`}
                      transform="rotate(-90 50 50)" />
                  )}
                  {(platformDistribution?.telegram || 0) > 0 && (
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0088cc" strokeWidth="12"
                      strokeDasharray={`${((platformDistribution.telegram / totalChats) * 251.3).toFixed(1)} 251.3`}
                      strokeDashoffset={`-${((platformDistribution.whatsapp / totalChats) * 251.3).toFixed(1)}`}
                      transform="rotate(-90 50 50)" />
                  )}
                </>
              )}
              <text x="50" y="47" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "13px", fontWeight: 700, fill: "#1d1d1f", fontFamily: "system-ui" }}>{totalChats}</text>
              <text x="50" y="59" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#8e8e93", fontFamily: "system-ui" }}>CHATS</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              {[
                { label: "WhatsApp", count: platformDistribution?.whatsapp || 0, color: "#25D366" },
                { label: "Telegram", count: platformDistribution?.telegram || 0, color: "#0088cc" },
              ].map(ch => (
                <div key={ch.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: ch.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#1d1d1f", flex: 1 }}>{ch.label}</span>
                  <span style={{ fontSize: "12px", color: "#8e8e93" }}>
                    {totalChats > 0 ? `${Math.round((ch.count / totalChats) * 100)}%` : "0%"} ({ch.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido por tipo */}
        <div className="card-apple">
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.3px", marginBottom: "16px" }}>
            Contenido generado
          </h3>
          {contentByType.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Sparkles size={28} style={{ color: "#c0c0c0", margin: "0 auto 8px" }} />
              <p style={{ fontSize: "13px", color: "#8e8e93" }}>Aún no has generado contenido</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {contentByType.map((c, i) => {
                const total = contentByType.reduce((s, x) => s + x.count, 0)
                const pct   = Math.round((c.count / total) * 100)
                const COLORS = ["#0066cc", "#7c3aed", "#059669", "#d97706", "#ef4444"]
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "#1d1d1f" }}>
                        {CONTENT_LABELS[c.type] || c.type}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: COLORS[i % COLORS.length] }}>
                        {c.count} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: 5, background: "#f0f0f5", borderRadius: 9999 }}>
                      <div style={{ height: "100%", borderRadius: 9999, background: COLORS[i % COLORS.length], width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
              <p style={{ fontSize: "11px", color: "#8e8e93", textAlign: "right", marginTop: "4px" }}>
                {totalContentGenerated} piezas en total
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="card-apple">
        <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.3px", marginBottom: "14px" }}>
          Actividad reciente
        </h3>
        {activity.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#8e8e93", textAlign: "center", padding: "20px" }}>
            Aún no hay actividad registrada.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {activity.map((a: any, i: number) => {
              const icons: Record<string, any> = { product: Package, content: Sparkles, view: Eye, chat: MessageCircle }
              const colors: Record<string, string> = { product: "#0066cc", content: "#7c3aed", view: "#059669", chat: "#d97706" }
              const bgs: Record<string, string>    = { product: "#e8f1fb", content: "#f3eeff",  view: "#d1fae5",  chat: "#fef3c7" }
              const IconC = icons[a.type] || TrendingUp
              const col   = colors[a.type] || "#0066cc"
              const bg    = bgs[a.type]    || "#e8f1fb"
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 10px", borderRadius: "12px" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9f9f9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <IconC size={15} style={{ color: col }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 500, color: "#1d1d1f", letterSpacing: "-0.2px" }}>{a.label}</p>
                    <p style={{ fontSize: "11px", color: "#8e8e93" }}>{relTime(a.timeMs)}</p>
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: 9999,
                    background: a.positive ? "#d1fae5" : "#f0f0f5",
                    color: a.positive ? "#065f46" : "#7a7a7a",
                    flexShrink: 0,
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

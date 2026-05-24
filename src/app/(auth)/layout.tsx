import Link from "next/link"
import Image from "next/image"

const FEATURES = [
  "Tienda pública lista en 5 minutos",
  "Marketing profesional generado por IA",
  "Bot de atención automática 24/7",
  "100 % gratuito para empezar",
]

const STATS = [
  { value: "5M+", label: "Micronegocios en Colombia" },
  { value: "40%", label: "Más consultas con IA" },
  { value: "24/7", label: "Atención automatizada" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── LEFT PANEL ──────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col"
        style={{
          background: "linear-gradient(160deg, rgb(130, 147, 255) 0%, rgb(2, 56, 107) 55%, rgb(8, 32, 85) 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "40px 48px 40px",
        }}
      >
        {/* Subtle grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }} />

        {/* Glow blob */}
        <div style={{
          position: "absolute", top: "-80px", right: "-60px",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,102,204,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "0", left: "-40px",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,102,204,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

     

        {/* ── App mockup ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "24px 0" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>

            {/* Main card — dashboard preview */}
            <div style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "18px",
              padding: "20px 22px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#0066cc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff", letterSpacing: "-0.224px" }}>Mi Negocio Dashboard</span>
                <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
                  {["#ef4444","#f59e0b","#22c55e"].map(c => (
                    <div key={c} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                {[
                  { v: "254", l: "Visitas" },
                  { v: "67", l: "Mensajes" },
                  { v: "14", l: "Contenido" },
                ].map((s) => (
                  <div key={s.l} style={{ background: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 10px 8px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p style={{ fontSize: "20px", fontWeight: 700, color: "#4da6ff", lineHeight: 1, marginBottom: "2px" }}>{s.v}</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", letterSpacing: "-0.1px" }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* AI post preview */}
              <div style={{ background: "rgba(0,102,204,0.15)", borderRadius: "11px", padding: "12px 14px", border: "1px solid rgba(0,102,204,0.25)", marginBottom: "10px" }}>
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#4da6ff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>✦ Post generado por IA</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, letterSpacing: "-0.12px" }}>
                   Brownies recién horneados · Promoción fin de semana: compra 2 y recibe envío gratis. ¡Solo hasta el domingo!
                </p>
                <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                  {["#Brownies","#Artesanal","#Repostería"].map(t => (
                    <span key={t} style={{ fontSize: "10px", color: "#4da6ff", background: "rgba(0,102,204,0.2)", padding: "2px 7px", borderRadius: "9999px", letterSpacing: "-0.1px" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Products row */}
              <div style={{ display: "flex", gap: "6px" }}>
                {["Brownies $15K","Cupcakes $8K","Torta $45K"].map((p) => (
                  <div key={p} style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "7px 6px", textAlign: "center" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", letterSpacing: "-0.1px", lineHeight: 1.3 }}>{p}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating bot card */}
            <div style={{
              position: "absolute", top: "-28px", right: "-24px",
              background: "rgba(255, 255, 255, 0.58)", border: "1px solid rgba(255,255,255,0.42)",
              borderRadius: "14px", padding: "12px 14px", backdropFilter: "blur(16px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)", minWidth: "170px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#fff" }}>Bot activo en Telegram</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "7px 9px" }}>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", lineHeight: 1.4 }}>
                  Cliente: "¿hacen domicilios?" <br/>
                  <span style={{ color: "#4da6ff" }}>Bot: Sí, con costo de $5.000 🛵</span>
                </p>
              </div>
            </div>

            {/* Floating metrics badge */}
            <div style={{
              position: "absolute", bottom: "-22px", left: "-20px",
              background: "rgba(231, 231, 231, 0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px", padding: "10px 14px", backdropFilter: "blur(16px)",
              boxShadow: "0 8px 24px rgba(250, 250, 250, 0.4)", display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(0,102,204,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#4da6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="#4da6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>+40%</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "1px" }}>consultas este mes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Stats row */}
          <div style={{ display: "flex", gap: "24px", marginBottom: "28px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: '"SF Pro Display"', fontSize: "22px", fontWeight: 700, color: "#fff", letterSpacing: "-0.28px", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "3px", letterSpacing: "-0.1px" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {FEATURES.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#0066cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="9" height="7" fill="none" viewBox="0 0 9 7">
                    <path d="M1 3.5l2 2L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", letterSpacing: "-0.224px" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center items-center"
        style={{ background: "#ffffff", padding: "40px 24px", overflowY: "auto" }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>

          {/* Mobile logo */}
          <Link
            href="/"
            className="lg:hidden"
            style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "36px", textDecoration: "none" }}
          >
            <Image src="/logo-bg.png" alt="Punto de Arranque" width={32} height={32} style={{ borderRadius: "6px", objectFit: "contain" }} />
            <span style={{
              fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
              fontWeight: 700, fontSize: "16px", color: "#1d1d1f",
            }}>
              Punto de Arranque
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}

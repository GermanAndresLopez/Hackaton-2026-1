import Link from "next/link"
import { ROUTES } from "@/lib/constants"

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif' }}>

      {/* ── Global Nav (pure black, 44px) ── */}
      <nav className="global-nav sticky top-0 z-50" style={{ background: '#000', height: '44px' }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <span className="text-white font-semibold text-sm tracking-tight">Punto de Arranque</span>
          <div className="flex items-center gap-6">
            <Link href={ROUTES.login}
              className="text-xs text-white/70 hover:text-white transition-colors"
              style={{ letterSpacing: '-0.12px' }}>
              Inicia sesión
            </Link>
            <Link href={ROUTES.register}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '6px 16px' }}>
              Empieza gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── TILE 1: Hero — canvas white ── */}
      <section className="tile-light fade-in" style={{ padding: '80px 24px 80px', textAlign: 'center' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-tagline mb-4" style={{ color: '#0066cc', fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif' }}>
            IA para emprendedores de Latinoamérica
          </p>
          <h1 className="text-hero mb-6"
              style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: 'clamp(40px, 6vw, 56px)', fontWeight: 600, lineHeight: 1.07, letterSpacing: '-0.28px', color: '#1d1d1f' }}>
            Haz crecer tu negocio<br />con inteligencia artificial
          </h1>
          <p style={{ fontSize: '21px', fontWeight: 400, lineHeight: 1.38, color: '#6e6e73', maxWidth: '640px', margin: '0 auto 40px', letterSpacing: 0 }}>
            Crea tu tienda online, genera marketing profesional y automatiza
            la atención a tus clientes — sin conocimientos técnicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href={ROUTES.register} className="btn-hero" style={{ fontSize: '17px', fontWeight: 400 }}>
              Crear mi negocio gratis
            </Link>
            <Link href="#modulos" className="btn-secondary">
              Ver cómo funciona
            </Link>
          </div>
          <p style={{ color: '#7a7a7a', fontSize: '12px', marginTop: '20px', letterSpacing: '-0.12px' }}>
            Sin tarjeta de crédito · Listo en 5 minutos · Empieza gratis
          </p>
        </div>
      </section>

      {/* ── TILE 2: Stats — parchment ── */}
      <section className="tile-parchment" style={{ padding: '48px 24px' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '40px', fontWeight: 600, color: '#0066cc', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '14px', color: '#7a7a7a', marginTop: '6px', letterSpacing: '-0.224px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TILE 3: Features — dark ── */}
      <section id="modulos" className="tile-dark" style={{ padding: '80px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#2997ff', fontSize: '21px', fontWeight: 600, fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', letterSpacing: '0.231px', marginBottom: '12px' }}>
              8 módulos
            </p>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '40px', fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>
              Todo lo que necesitas para vender más
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="card-apple" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '17px', marginBottom: '8px', letterSpacing: '-0.374px' }}>{f.title}</h3>
                <p style={{ color: '#cccccc', fontSize: '14px', lineHeight: 1.43, letterSpacing: '-0.224px' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TILE 4: Testimonials — canvas white ── */}
      <section className="tile-light" style={{ padding: '80px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#0066cc', fontSize: '21px', fontWeight: 600, fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', letterSpacing: '0.231px', marginBottom: '12px' }}>
              Historias reales
            </p>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '40px', fontWeight: 600, color: '#1d1d1f', lineHeight: 1.1 }}>
              Para vendedores como tú
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card-apple" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '17px', lineHeight: 1.47, color: '#1d1d1f', letterSpacing: '-0.374px', marginBottom: '24px' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: '#0066cc', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: '15px', flexShrink: 0
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', letterSpacing: '-0.224px' }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TILE 5: CTA final — dark tile ── */}
      <section className="tile-dark-2" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div className="max-w-2xl mx-auto">
          <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '40px', fontWeight: 600, color: '#fff', lineHeight: 1.1, marginBottom: '16px' }}>
            ¿Listo para digitalizar tu negocio?
          </h2>
          <p style={{ color: '#cccccc', fontSize: '21px', fontWeight: 300, lineHeight: 1.5, marginBottom: '40px' }}>
            Únete a miles de emprendedores que ya venden más con IA.
          </p>
          <Link href={ROUTES.register} className="btn-hero">
            Empezar gratis ahora →
          </Link>
        </div>
      </section>

      {/* ── Footer — parchment ── */}
      <footer className="tile-parchment" style={{ padding: '40px 24px', borderTop: '1px solid #e0e0e0' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
            © 2026 Punto de Arranque · Hecho para emprendedores latinoamericanos
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href={ROUTES.login}    className="link-blue" style={{ fontSize: '12px', letterSpacing: '-0.12px' }}>Iniciar sesión</Link>
            <Link href={ROUTES.register} className="link-blue" style={{ fontSize: '12px', letterSpacing: '-0.12px' }}>Registrarse</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

const STATS = [
  { value: "5 min", label: "para tener tu tienda lista" },
  { value: "100%", label: "gratis para empezar" },
  { value: "24/7", label: "atención automática con IA" },
]

const FEATURES = [
  { icon: "🏪", title: "Tienda Pública", description: "Comparte tu negocio con un link. Tus clientes ven productos y te contactan al instante." },
  { icon: "🤖", title: "Marketing", description: "Genera posts, slogans y campañas profesionales para redes sociales en segundos." },
  { icon: "🖼️", title: "Imágenes Pro", description: "Convierte fotos caseras en publicidad al nivel de grandes marcas con nuestra IA." },
  { icon: "💬", title: "Bot de Atención", description: "Responde a tus clientes 24/7 en Telegram con un asistente entrenado en tu negocio." },
  { icon: "📦", title: "Gestión de Productos", description: "Sube tus productos y la IA genera nombres atractivos, descripciones y hashtags." },
  { icon: "💡", title: "Agente de Negocios", description: "Tu asesor comercial personal que te da ideas, estrategias y recomendaciones." },
  { icon: "📊", title: "Métricas Simples", description: "Ve qué productos te preguntan más y recibe sugerencias para aumentar ventas." },
  { icon: "🎨", title: "Branding IA", description: "Crea tu identidad visual: nombre, colores, slogan y tono de marca en segundos." },
]

const TESTIMONIALS = [
  { quote: "Antes tardaba horas haciendo publicidad para mis brownies. Ahora la IA me la genera en segundos.", name: "María González", business: "Brownies Artesanales" },
  { quote: "Mi tienda online quedó lista en 10 minutos. Mis clientes ya pueden ver todo desde el celular.", name: "Andrés Torres", business: "Ropa Urbana KLD" },
  { quote: "El bot de Telegram responde a mis clientes cuando estoy dormido. ¡Vendí mientras dormía!", name: "Catalina Ruiz", business: "Accesorios Cata" },
]

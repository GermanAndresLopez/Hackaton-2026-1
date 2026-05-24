import Link from "next/link"
import Image from "next/image"
import { ROUTES } from "@/lib/constants"
import {
  Store, Sparkles, Package, MessageSquare,
  BarChart2, Lightbulb, Zap, Check, ArrowRight,
  ShoppingBag, Star, Users, Clock, TrendingUp,
  Cpu, ImageIcon, Brush,
} from "lucide-react"

// ─── Data ───────────────────────────────────────────────────────────────────

const STATS = [
  { icon: Clock,     value: "5 min",   label: "para tener tu tienda lista" },
  { icon: Users,     value: "+1 000",  label: "emprendedores activos" },
  { icon: Zap,       value: "24/7",    label: "atención automática con IA" },
  { icon: TrendingUp,value: "100%",    label: "gratis para empezar" },
]

const FEATURES = [
  { icon: Store,        title: "Tienda pública",       description: "Comparte tu negocio con un enlace. Tus clientes ven productos y te contactan al instante." },
  { icon: Sparkles,     title: "Marketing con IA",     description: "Genera posts, slogans y campañas profesionales para redes sociales en segundos." },
  { icon: ImageIcon,    title: "Imágenes pro",         description: "Convierte fotos caseras en publicidad de alto nivel con nuestra inteligencia artificial." },
  { icon: MessageSquare,title: "Bot de atención",      description: "Responde a tus clientes 24/7 en Telegram con un asistente entrenado en tu negocio." },
  { icon: Package,      title: "Gestión de productos", description: "Sube tus productos y la IA genera nombres atractivos, descripciones y hashtags." },
  { icon: Lightbulb,    title: "Agente de negocios",   description: "Tu asesor comercial personal que te da ideas, estrategias y recomendaciones." },
  { icon: BarChart2,    title: "Métricas simples",     description: "Ve qué productos generan más interés y recibe sugerencias para aumentar ventas." },
  { icon: Brush,        title: "Branding con IA",      description: "Crea tu identidad visual: nombre, colores, slogan y tono de marca en segundos." },
]

const STEPS = [
  { n: "01", icon: Cpu,       title: "Crea tu cuenta",        body: "Regístrate gratis en menos de 2 minutos. Sin tarjeta de crédito." },
  { n: "02", icon: Package,   title: "Agrega tus productos",  body: "Sube fotos y la IA genera los textos, precios y categorías por ti." },
  { n: "03", icon: ShoppingBag, title: "Comparte y vende",    body: "Comparte tu enlace de tienda por WhatsApp, Instagram o TikTok." },
]

const TESTIMONIALS = [
  {
    quote: "Antes tardaba horas haciendo publicidad para mis brownies. Ahora la IA me la genera en segundos y mis ventas subieron un 40%.",
    name: "María González",
    business: "Brownies Artesanales · Bogotá",
    avatar: "MG",
  },
  {
    quote: "Mi tienda online quedó lista en 10 minutos. Mis clientes ya pueden ver todo desde el celular sin que yo tenga que explicar nada.",
    name: "Andrés Torres",
    business: "Ropa Urbana KLD · Medellín",
    avatar: "AT",
  },
  {
    quote: "El bot de Telegram responde a mis clientes cuando estoy dormido. La semana pasada vendí tres pedidos mientras dormía.",
    name: "Catalina Ruiz",
    business: "Accesorios Cata · Cali",
    avatar: "CR",
  },
]

const FREE_FEATURES = [
  { text: "Tienda pública con enlace propio",   included: true  },
  { text: "Hasta 5 productos",                  included: true  },
  { text: "Generador de marketing con IA",       included: true  },
  { text: "Ruta de crecimiento personalizada",   included: true  },
  { text: "Bot de atención en Telegram",         included: false },
  { text: "Métricas de tu negocio",              included: false },
  { text: "Productos ilimitados",                included: false },
]

const PRO_FEATURES = [
  { text: "Tienda pública con enlace propio",   included: true },
  { text: "Productos ilimitados",               included: true },
  { text: "Generador de marketing con IA",       included: true },
  { text: "Bot de atención en Telegram",         included: true },
  { text: "Ruta de crecimiento personalizada",   included: true },
  { text: "Métricas de tu negocio",              included: true },
  { text: "Soporte prioritario",                 included: true },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main style={{ fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>

      {/* ════════════════════════ NAV ════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        height: '52px', display: 'flex', alignItems: 'center', padding: '0 32px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <Image src="/logo-bg.png" alt="logo" width={28} height={28} style={{ borderRadius: '6px', objectFit: 'contain' }} priority />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.374px', fontFamily: '"SF Pro Display", system-ui, sans-serif' }}>
              Punto de Arranque
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href={ROUTES.login} style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none',
              padding: '6px 14px', borderRadius: '9999px', letterSpacing: '-0.12px',
              transition: 'color 120ms',
            }}>
              Iniciar sesión
            </Link>
            <Link href={ROUTES.register} style={{
              background: '#0066cc', color: '#fff', fontSize: '13px', fontWeight: 600,
              padding: '7px 18px', borderRadius: '9999px', textDecoration: 'none',
              letterSpacing: '-0.12px', transition: 'background 120ms',
            }}>
              Empieza gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════ HERO ════════════════════════ */}
      <section style={{
        background: '#fff', padding: '88px 32px 80px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '1160px', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 520px', gap: '64px', alignItems: 'center',
        }}>
          {/* Left copy */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#e8f1fb', border: '1px solid #c5d9f0',
              borderRadius: '9999px', padding: '5px 14px', marginBottom: '28px',
            }}>
              <Zap size={12} style={{ color: '#0066cc' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#0058b3', letterSpacing: '-0.12px' }}>
                IA para emprendedores · Colombia
              </span>
            </div>

            <h1 style={{
              fontFamily: '"SF Pro Display", system-ui, sans-serif',
              fontSize: 'clamp(38px, 5vw, 58px)', fontWeight: 600, lineHeight: 1.05,
              letterSpacing: '-1.5px', color: '#1d1d1f', marginBottom: '22px',
            }}>
              Digitaliza tu negocio.<br />
              <span style={{ color: '#0066cc' }}>Empieza a vender hoy.</span>
            </h1>

            <p style={{
              fontSize: '19px', color: '#6e6e73', lineHeight: 1.48,
              marginBottom: '36px', maxWidth: '480px', letterSpacing: '-0.2px',
            }}>
              Crea tu tienda online, genera marketing profesional y
              automatiza la atención a clientes — sin conocimientos técnicos,
              en menos de 5 minutos.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '28px' }}>
              <Link href={ROUTES.register} style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: '#0066cc', color: '#fff', fontWeight: 600,
                fontSize: '16px', padding: '14px 28px', borderRadius: '9999px',
                textDecoration: 'none', letterSpacing: '-0.2px',
              }}>
                Crear mi negocio gratis <ArrowRight size={16} />
              </Link>
              <Link href="#como-funciona" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: '#0066cc', fontWeight: 600, fontSize: '15px',
                textDecoration: 'none', letterSpacing: '-0.2px',
              }}>
                Ver cómo funciona
              </Link>
            </div>

            {/* Trust */}
            <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
              {["Sin tarjeta de crédito", "Listo en 5 minutos", "Siempre gratis"].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Check size={13} style={{ color: '#22c55e' }} />
                  <span style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product mockup */}
          <div style={{ position: 'relative' }}>
            {/* Browser frame */}
            <div style={{
              borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.07)',
            }}>
              {/* Browser chrome */}
              <div style={{ background: '#f0f0f0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                <div style={{ flex: 1, background: '#fff', borderRadius: '5px', height: '22px', marginLeft: '8px', display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#7a7a7a' }}>puntodearranque.co/tienda/brownies-mary</span>
                </div>
              </div>
              {/* Store preview */}
              <div style={{ background: 'linear-gradient(140deg, #003f99 0%, #0055cc 55%, #1a7ee8 100%)', padding: '28px 24px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={24} style={{ color: '#fff' }} />
                  </div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.4px' }}>Brownies de Mary</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Bogotá · Postres artesanales</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {["Todos", "Brownies", "Tortas", "Bebidas"].map((c, i) => (
                    <span key={c} style={{
                      padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 500,
                      background: i === 0 ? '#fff' : 'rgba(255,255,255,0.18)',
                      color: i === 0 ? '#0055cc' : '#fff',
                    }}>{c}</span>
                  ))}
                </div>
              </div>
              {/* Products grid */}
              <div style={{ background: '#f5f5f7', padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {MOCK_PRODUCTS.map((p, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                    <div style={{ height: '70px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={22} style={{ color: p.color }} />
                    </div>
                    <div style={{ padding: '8px' }}>
                      <p style={{ fontSize: '10px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.1px' }}>{p.name}</p>
                      <p style={{ fontSize: '11px', color: '#0066cc', fontWeight: 700, marginTop: '2px' }}>{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div style={{
              position: 'absolute', bottom: '-18px', left: '-24px',
              background: '#fff', borderRadius: '14px', padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e8f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={17} style={{ color: '#0066cc' }} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#7a7a7a', letterSpacing: '-0.1px' }}>Ventas esta semana</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.3px' }}>+$348.000</p>
              </div>
            </div>

            {/* Floating chat */}
            <div style={{
              position: 'absolute', top: '60px', right: '-28px',
              background: '#fff', borderRadius: '14px', padding: '10px 14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxWidth: '180px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: '10px', fontWeight: 600, color: '#22c55e' }}>Bot activo</span>
              </div>
              <p style={{ fontSize: '11px', color: '#1d1d1f', lineHeight: 1.4 }}>
                "Hola! Los brownies de maracuyá están disponibles desde $12.000 🍫"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ STATS ════════════════════════ */}
      <section style={{ background: '#f5f5f7', padding: '48px 32px', borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e8f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={18} style={{ color: '#0066cc' }} />
                </div>
              </div>
              <p style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '32px', fontWeight: 700, color: '#1d1d1f', lineHeight: 1, letterSpacing: '-1px' }}>
                {s.value}
              </p>
              <p style={{ fontSize: '13px', color: '#7a7a7a', marginTop: '5px', letterSpacing: '-0.12px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════ FEATURES ════════════════════════ */}
      <section style={{ background: '#1c1c1e', padding: '88px 32px' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#2997ff', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Plataforma completa
            </p>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, color: '#fff', letterSpacing: '-1px', lineHeight: 1.08 }}>
              Todo lo que necesitas<br />para vender más
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '18px', padding: '24px',
                transition: 'background 200ms',
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0,102,204,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <f.icon size={20} style={{ color: '#2997ff' }} />
                </div>
                <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '15px', marginBottom: '8px', letterSpacing: '-0.3px' }}>{f.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.5, letterSpacing: '-0.1px' }}>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ HOW IT WORKS ════════════════════════ */}
      <section id="como-funciona" style={{ background: '#fff', padding: '88px 32px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p style={{ color: '#0066cc', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Así de fácil
            </p>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-1px' }}>
              De cero a tu primera venta<br />en menos de una hora
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: '40px', left: 'calc(16.6% + 20px)', right: 'calc(16.6% + 20px)', height: '1px', background: 'linear-gradient(90deg, #e0e0e0 0%, #0066cc 50%, #e0e0e0 100%)' }} />
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '20px',
                  background: i === 1 ? '#0066cc' : '#f0f7ff',
                  border: `2px solid ${i === 1 ? '#0066cc' : '#ddeafa'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', position: 'relative', zIndex: 1,
                  boxShadow: i === 1 ? '0 8px 24px rgba(0,102,204,0.35)' : 'none',
                }}>
                  <s.icon size={30} style={{ color: i === 1 ? '#fff' : '#0066cc' }} />
                </div>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#0066cc', letterSpacing: '1px', marginBottom: '8px' }}>{s.n}</span>
                <h3 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '18px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px', letterSpacing: '-0.3px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#7a7a7a', lineHeight: 1.5, letterSpacing: '-0.1px' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ PHOTO BREAK ════════════════════════ */}
      <section style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=1400&auto=format&fit=crop&q=80"
          alt="Emprendedores colombianos"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,30,80,0.78) 0%, rgba(0,50,130,0.45) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 64px' }}>
          <div style={{ maxWidth: '520px' }}>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '14px' }}>
              Hecho para Colombia
            </p>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', color: '#fff', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.8px', marginBottom: '20px' }}>
              Millones de emprendedores.<br />Una sola plataforma.
            </h2>
            <Link href={ROUTES.register} style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: '#fff', color: '#0066cc', fontWeight: 700,
              fontSize: '14px', padding: '12px 24px', borderRadius: '9999px', textDecoration: 'none',
            }}>
              Unirme ahora <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════ TESTIMONIALS ════════════════════════ */}
      <section style={{ background: '#f5f5f7', padding: '88px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '14px' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
            </div>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-1px' }}>
              Vendedores como tú ya están<br />usando Punto de Arranque
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '20px', padding: '28px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '16px' }}>
                    {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />)}
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: 1.55, color: '#1d1d1f', letterSpacing: '-0.2px', marginBottom: '24px' }}>
                    "{t.quote}"
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0055cc, #1a7ee8)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '14px', flexShrink: 0, letterSpacing: '-0.2px',
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', letterSpacing: '-0.2px' }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: '#7a7a7a' }}>{t.business}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ PLAN / PRICING ════════════════════════ */}
      <section style={{ background: '#fff', padding: '88px 32px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ color: '#0066cc', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Planes
            </p>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-1px', marginBottom: '14px' }}>
              Empieza gratis, crece con Pro
            </h2>
            <p style={{ fontSize: '17px', color: '#6e6e73', letterSpacing: '-0.2px' }}>
              Elige el plan que se adapta a tu momento. Cambia cuando quieras.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

            {/* ── Plan Gratis ── */}
            <div style={{
              border: '1.5px solid #e0e0e0', borderRadius: '24px', padding: '36px',
              background: '#fafafa',
            }}>
              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#7a7a7a', marginBottom: '16px' }}>Gratis</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '6px' }}>
                <span style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '52px', fontWeight: 700, color: '#1d1d1f', lineHeight: 1, letterSpacing: '-2px' }}>$0</span>
                <span style={{ fontSize: '16px', color: '#7a7a7a', fontWeight: 400 }}>COP / mes</span>
              </div>
              <p style={{ fontSize: '13px', color: '#7a7a7a', marginBottom: '28px' }}>Para empezar sin riesgos</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '32px' }}>
                {FREE_FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: f.included ? '#e8f1fb' : '#f5f5f5',
                    }}>
                      {f.included
                        ? <Check size={11} style={{ color: '#0066cc' }} />
                        : <span style={{ width: '8px', height: '1.5px', background: '#c0c0c0', display: 'block', borderRadius: '2px' }} />
                      }
                    </div>
                    <span style={{ fontSize: '14px', color: f.included ? '#1d1d1f' : '#b0b0b0', letterSpacing: '-0.1px' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <Link href={ROUTES.register} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                background: '#fff', color: '#0066cc', fontWeight: 600,
                fontSize: '15px', padding: '13px', borderRadius: '9999px', textDecoration: 'none',
                border: '1.5px solid #0066cc',
              }}>
                Empezar gratis
              </Link>
            </div>

            {/* ── Plan Pro ── */}
            <div style={{
              border: '2px solid #0066cc', borderRadius: '24px', padding: '36px',
              background: 'linear-gradient(160deg, #f0f7ff 0%, #fff 100%)',
              boxShadow: '0 0 0 5px rgba(0,102,204,0.07), 0 8px 32px rgba(0,102,204,0.12)',
              position: 'relative',
            }}>
              {/* Badge */}
              <div style={{
                position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                background: '#0066cc', color: '#fff', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.5px', textTransform: 'uppercase',
                padding: '4px 16px', borderRadius: '9999px', whiteSpace: 'nowrap',
              }}>
                Más popular
              </div>

              <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#0066cc', marginBottom: '16px' }}>Pro</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '6px' }}>
                <span style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '52px', fontWeight: 700, color: '#1d1d1f', lineHeight: 1, letterSpacing: '-2px' }}>$20.000</span>
                <span style={{ fontSize: '16px', color: '#7a7a7a', fontWeight: 400 }}>COP / mes</span>
              </div>
              <p style={{ fontSize: '13px', color: '#7a7a7a', marginBottom: '28px' }}>Para negocios en crecimiento</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '32px' }}>
                {PRO_FEATURES.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#e8f1fb',
                    }}>
                      <Check size={11} style={{ color: '#0066cc' }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#1d1d1f', letterSpacing: '-0.1px' }}>{f.text}</span>
                  </div>
                ))}
              </div>

              <Link href={ROUTES.register} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                background: '#0066cc', color: '#fff', fontWeight: 700,
                fontSize: '15px', padding: '14px', borderRadius: '9999px', textDecoration: 'none',
                boxShadow: '0 4px 18px rgba(0,102,204,0.35)',
              }}>
                Empezar con Pro <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ CTA FINAL ════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #001a4d 0%, #003399 50%, #0055cc 100%)',
        padding: '88px 32px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={34} style={{ color: '#fff' }} />
            </div>
          </div>
          <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 600, color: '#fff', lineHeight: 1.08, letterSpacing: '-1px', marginBottom: '16px' }}>
            ¿Listo para digitalizar<br />tu negocio?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '18px', lineHeight: 1.5, marginBottom: '40px', letterSpacing: '-0.2px' }}>
            Únete a miles de emprendedores que ya venden más con inteligencia artificial.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <Link href={ROUTES.register} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', color: '#0055cc', fontWeight: 700,
              fontSize: '16px', padding: '15px 32px', borderRadius: '9999px', textDecoration: 'none',
            }}>
              Crear mi negocio gratis <ArrowRight size={16} />
            </Link>
            <Link href={ROUTES.login} style={{
              display: 'inline-flex', alignItems: 'center',
              color: 'rgba(255,255,255,0.8)', fontWeight: 500,
              fontSize: '15px', padding: '15px 24px', borderRadius: '9999px', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer style={{ background: '#1c1c1e', padding: '36px 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Image src="/logo-bg.png" alt="logo" width={22} height={22} style={{ borderRadius: '4px', objectFit: 'contain', opacity: 0.8 }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '-0.12px' }}>
              © 2026 Punto de Arranque · Hecho para emprendedores 
            </span>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href={ROUTES.login}    style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', textDecoration: 'none', letterSpacing: '-0.12px' }}>Iniciar sesión</Link>
            <Link href={ROUTES.register} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', textDecoration: 'none', letterSpacing: '-0.12px' }}>Registrarse</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

// ─── Mock data for hero preview ───────────────────────────────────────────────

const MOCK_PRODUCTS = [
  { name: "Brownie Maracuyá",   price: "$12.000", bg: "#fef3c7", color: "#d97706" },
  { name: "Torta Red Velvet",   price: "$45.000", bg: "#fce7f3", color: "#db2777" },
  { name: "Brownie Oreo",       price: "$14.000", bg: "#f0fdf4", color: "#16a34a" },
]

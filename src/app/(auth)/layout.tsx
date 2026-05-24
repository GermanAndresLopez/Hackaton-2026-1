import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif' }}>

      {/* ── Left panel — Apple dark tile ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
           style={{ background: '#1d1d1f', color: '#fff' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '20px', color: '#fff', letterSpacing: '-0.28px' }}>
            Punto de Arranque
          </span>
        </Link>

        {/* Quote */}
        <div>
          <blockquote style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.374px', color: '#fff', marginBottom: '24px' }}>
            "Digitaliza tu negocio en minutos con el poder de la IA"
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: '#0066cc', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: '15px', flexShrink: 0
            }}>
              M
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '14px', color: '#fff', letterSpacing: '-0.224px' }}>María González</p>
              <p style={{ fontSize: '12px', color: '#cccccc', letterSpacing: '-0.12px' }}>Emprendedora · Brownies Artesanales</p>
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['Tienda pública lista en 5 minutos', 'Marketing generado por IA', 'Bot de atención 24/7', '100% gratuito para empezar'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="10" height="8" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '14px', color: '#cccccc', letterSpacing: '-0.224px' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form (canvas white) ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-8"
           style={{ background: '#ffffff' }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden" style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', textDecoration: 'none' }}>
            <span style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '20px', color: '#1d1d1f' }}>
              Punto de Arranque
            </span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}

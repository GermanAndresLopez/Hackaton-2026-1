"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ROUTES } from "@/lib/constants"

const NAV_ITEMS = [
  { href: ROUTES.dashboard,  icon: "⌂",  label: "Dashboard" },
  { href: ROUTES.productos,  icon: "◫",  label: "Productos" },
  { href: ROUTES.marketing,  icon: "✦",  label: "Marketing IA" },
  { href: ROUTES.imagenes,   icon: "▣",  label: "Imágenes IA" },
  { href: ROUTES.agente,     icon: "◈",  label: "Agente IA" },
  { href: ROUTES.bot,        icon: "◎",  label: "Bot Telegram" },
  { href: ROUTES.metricas,   icon: "↗",  label: "Métricas" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#f5f5f7',
      fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Sidebar — blanco con borde hairline ── */}
      <aside style={{
        width: '232px',
        background: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0, left: 0,
        zIndex: 40,
      }}>

        {/* Logo */}
        <div style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <span style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            color: '#1d1d1f',
            letterSpacing: '-0.374px',
          }}>
            VendeMás IA
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#7a7a7a',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '4px 10px 8px',
          }}>
            Menú
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#ffffff' : '#1d1d1f',
                      background: isActive ? '#0066cc' : 'transparent',
                      textDecoration: 'none',
                      transition: 'background 120ms ease-out, color 120ms ease-out',
                      letterSpacing: '-0.224px',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f5'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                      }
                    }}
                  >
                    <span style={{
                      fontSize: '15px',
                      color: isActive ? '#fff' : '#7a7a7a',
                      width: '18px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Tienda pública */}
          <div style={{
            margin: '16px 0 0',
            padding: '12px',
            background: '#e8f1fb',
            borderRadius: '10px',
            border: '1px solid #c5d9f0',
          }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#0058b3',
              marginBottom: '6px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Mi Tienda
            </p>
            <Link
              href="/tienda/mi-negocio"
              target="_blank"
              style={{ fontSize: '12px', color: '#0066cc', textDecoration: 'none', letterSpacing: '-0.12px' }}
            >
              Ver tienda pública →
            </Link>
          </div>
        </nav>

        {/* User footer */}
        <div style={{ borderTop: '1px solid #e0e0e0', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#0066cc', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: '13px', flexShrink: 0,
            }}>
              M
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: 600, color: '#1d1d1f',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                letterSpacing: '-0.224px',
              }}>
                Brownies de María
              </p>
              <p style={{ fontSize: '11px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
                Plan gratuito
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, marginLeft: '232px', minHeight: '100vh' }}>

        {/* Top bar */}
        <header style={{
          height: '52px',
          background: '#ffffff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <h1 style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            color: '#1d1d1f',
            letterSpacing: '-0.374px',
          }}>
            {NAV_ITEMS.find(i => i.href === pathname)?.label ?? 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button style={{
              fontSize: '13px', color: '#7a7a7a',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 12px', borderRadius: '8px',
              letterSpacing: '-0.224px',
              transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              Configuración
            </button>
            <button style={{
              fontSize: '13px', color: '#ef4444',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 12px', borderRadius: '8px',
              letterSpacing: '-0.224px',
              transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fff0f0')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              Salir
            </button>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: '32px' }} className="fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}

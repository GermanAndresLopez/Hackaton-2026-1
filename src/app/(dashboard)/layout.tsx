"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useEffect } from "react"
import {
  LayoutDashboard, Package, Sparkles, ImageIcon,
  Bot, Send, TrendingUp, type LucideIcon,
} from "lucide-react"

const NAV_ITEMS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: ROUTES.dashboard,  icon: LayoutDashboard, label: "Dashboard" },
  { href: ROUTES.productos,  icon: Package,          label: "Productos" },
  { href: ROUTES.marketing,  icon: Sparkles,         label: "Marketing IA" },
  { href: ROUTES.bot,        icon: Send,             label: "Bot Telegram" },
  { href: ROUTES.metricas,   icon: TrendingUp,       label: "Métricas" },
]

/* Navbar height — used for the sticky offset */
const NAV_H = 56

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const currentBusiness = useBusinessStore((s) => s.currentBusiness)
  const currentUser     = useBusinessStore((s) => s.currentUser)
  const resetStore      = useBusinessStore((s) => s.reset)

  useEffect(() => {
    if (!currentBusiness) router.push(ROUTES.login)
  }, [currentBusiness, router])

  if (!currentBusiness) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#f5f5f7',
      }}>
        <span style={{
          width: '32px', height: '32px',
          border: '3px solid rgba(0,102,204,0.2)',
          borderTopColor: '#0066cc', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite', display: 'inline-block',
        }} />
      </div>
    )
  }

  const businessName = currentBusiness.name || "Mi Negocio"
  const userInitial  = (currentUser?.name || businessName).charAt(0).toUpperCase()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7',
      fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
    }}>

      {/* ── Top navigation bar ── */}
      <header style={{
        height: `${NAV_H}px`,
        background: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 40,
        padding: '0 24px',
        gap: '0',
      }}>

        {/* Logo */}
        <Link
          href={ROUTES.dashboard}
          style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#1d1d1f',
            letterSpacing: '-0.374px',
            textDecoration: 'none',
            flexShrink: 0,
            marginRight: '28px',
          }}
        >
          Punto de Arranque
        </Link>

        {/* Divider */}
        <div style={{ width: '1px', height: '22px', background: '#e0e0e0', marginRight: '24px', flexShrink: 0 }} />

        {/* Nav items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffffff' : '#1d1d1f',
                  background: isActive ? '#0066cc' : 'transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'background 120ms ease-out, color 120ms ease-out',
                  letterSpacing: '-0.224px',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f5'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                }}
              >
                <item.icon
                  size={15}
                  style={{ color: isActive ? '#fff' : '#7a7a7a', flexShrink: 0 }}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>

          {/* Ver tienda */}
          <Link
            href={`/tienda/${currentBusiness.slug}`}
            target="_blank"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#0066cc',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: '#e8f1fb',
              border: '1px solid #c5d9f0',
              letterSpacing: '-0.12px',
              whiteSpace: 'nowrap',
              transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#d0e6f8'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#e8f1fb'}
          >
            Ver tienda →
          </Link>

          {/* Divider */}
          <div style={{ width: '1px', height: '22px', background: '#e0e0e0' }} />

          {/* User avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: '#0066cc', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '12px', flexShrink: 0,
            }}>
              {userInitial}
            </div>
            <span style={{
              fontSize: '13px', fontWeight: 600, color: '#1d1d1f',
              letterSpacing: '-0.224px', maxWidth: '140px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {businessName}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '22px', background: '#e0e0e0' }} />

          {/* Configuración */}
          <button
            style={{
              fontSize: '13px', color: '#7a7a7a',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 10px', borderRadius: '8px',
              letterSpacing: '-0.224px',
              transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            Configuración
          </button>

          {/* Salir */}
          <button
            onClick={() => { resetStore(); router.push(ROUTES.login) }}
            style={{
              fontSize: '13px', color: '#ef4444',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 10px', borderRadius: '8px',
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

      {/* ── Page content ── */}
      <main style={{ paddingTop: `${NAV_H}px`, minHeight: '100vh' }}>
        <div style={{ padding: '32px' }} className="fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}

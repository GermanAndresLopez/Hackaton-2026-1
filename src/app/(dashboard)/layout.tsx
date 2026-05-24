"use client"

import Link from "next/link"
import Image from "next/image"
import { createPortal } from "react-dom"
import { usePathname, useRouter } from "next/navigation"
import { ROUTES } from "@/lib/constants"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useEffect, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { toast } from "sonner"
import {
  LayoutDashboard, Package, Sparkles,
  Send, TrendingUp, Settings, X, Phone, Loader2, Check, MessageCircle,
  type LucideIcon,
} from "lucide-react"
import { useQuery } from "convex/react"
import { OnboardingModal } from "@/components/ui/OnboardingModal"

const NAV_ITEMS: { href: string; icon: LucideIcon; label: string }[] = [
  { href: ROUTES.dashboard,  icon: LayoutDashboard, label: "Dashboard" },
  { href: ROUTES.productos,  icon: Package,          label: "Productos" },
  { href: ROUTES.marketing,  icon: Sparkles,         label: "Marketing" },
  { href: ROUTES.bot,        icon: Send,             label: "Bot Telegram" },
  { href: ROUTES.metricas,   icon: TrendingUp,       label: "Métricas" },
]

const NAV_H = 56

const INPUT_S: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '11px',
  border: '1.5px solid #e0e0e0', background: '#fafafa',
  fontSize: '15px', fontFamily: '"SF Pro Text", system-ui, sans-serif',
  letterSpacing: '-0.224px', color: '#1d1d1f', outline: 'none',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  const currentBusiness = useBusinessStore((s) => s.currentBusiness)
  const currentUser     = useBusinessStore((s) => s.currentUser)
  const resetStore      = useBusinessStore((s) => s.reset)
  const setBusiness     = useBusinessStore((s) => s.setBusiness)

  const [mounted, setMounted]       = useState(false)
  const [showSettings, setShow]     = useState(false)
  const [whatsapp, setWhatsapp]     = useState("")
  const [telegram, setTelegram]     = useState("")
  const [isSaving, setIsSaving]     = useState(false)
  const [saved, setSaved]           = useState(false)
  const [onboardingDone, setOnboardingDone] = useState(false)

  const updateBusiness = useMutation(api.businesses.updateBusiness)
  const reactiveBusiness = useQuery(api.businesses.getById, currentBusiness?._id ? { id: currentBusiness._id as any } : "skip")
  const activeBusiness = reactiveBusiness || currentBusiness

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted && !currentBusiness) router.push(ROUTES.login)
  }, [currentBusiness, router, mounted])

  // lock body scroll when open
  useEffect(() => {
    if (showSettings) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [showSettings])

  if (!mounted || !currentBusiness) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7' }}>
        <span style={{ width: '32px', height: '32px', border: '3px solid rgba(0,102,204,0.2)', borderTopColor: '#0066cc', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
      </div>
    )
  }

  const needsOnboarding = activeBusiness && !(activeBusiness as any).growthRoute && !onboardingDone

  const businessName = currentBusiness.name || "Mi Negocio"
  const userInitial  = (currentUser?.name || businessName).charAt(0).toUpperCase()

  const openSettings = () => {
    setWhatsapp((currentBusiness as any).whatsapp || "")
    setTelegram((currentBusiness as any).telegram || "")
    setSaved(false)
    setShow(true)
  }

  const handleSave = async () => {
    if (!currentBusiness._id) return
    setIsSaving(true)
    try {
      const updated = await updateBusiness({
        id: currentBusiness._id,
        updates: { 
          whatsapp: whatsapp.trim() || undefined,
          telegram: telegram.trim() || undefined 
        },
      })
      if (updated) setBusiness(updated as any)
      setSaved(true)
      toast.success("Número de WhatsApp actualizado")
      setTimeout(() => { setShow(false); setSaved(false) }, 1100)
    } catch (err: any) {
      toast.error(err?.message || "Error al guardar. Intenta de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif' }}>

      {/* ── Top navigation bar ── */}
      <header style={{
        height: `${NAV_H}px`, background: '#ffffff', borderBottom: '1px solid #e0e0e0',
        display: 'flex', alignItems: 'center', position: 'fixed',
        top: 0, left: 0, right: 0, zIndex: 40, padding: '0 24px', gap: '0',
      }}>

        {/* Logo */}
        <Link href={ROUTES.dashboard} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0, marginRight: '28px' }}>
          <Image src="/logo-bg.png" alt="Punto de Arranque" width={36} height={36} style={{ objectFit: 'contain', borderRadius: '6px' }} priority />
          <span style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 700, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.374px', whiteSpace: 'nowrap' }}>
            Punto de Arranque
          </span>
        </Link>

        <div style={{ width: '1px', height: '22px', background: '#e0e0e0', marginRight: '24px', flexShrink: 0 }} />

        {/* Nav items */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px',
                borderRadius: '8px', fontSize: '13px', fontWeight: isActive ? 600 : 400,
                color: isActive ? '#ffffff' : '#1d1d1f', background: isActive ? '#0066cc' : 'transparent',
                textDecoration: 'none', whiteSpace: 'nowrap',
                transition: 'background 120ms ease-out, color 120ms ease-out', letterSpacing: '-0.224px',
              }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = '#f0f0f5' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
              >
                <item.icon size={15} style={{ color: isActive ? '#fff' : '#7a7a7a', flexShrink: 0 }} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link href={`/tienda/${currentBusiness.slug}`} target="_blank" style={{
            fontSize: '12px', fontWeight: 600, color: '#0066cc', textDecoration: 'none',
            padding: '6px 12px', borderRadius: '9999px', background: '#e8f1fb',
            border: '1px solid #c5d9f0', letterSpacing: '-0.12px', whiteSpace: 'nowrap', transition: 'background 120ms',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#d0e6f8'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#e8f1fb'}
          >
            Ver tienda →
          </Link>

          <div style={{ width: '1px', height: '22px', background: '#e0e0e0' }} />

          {/* User avatar + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0066cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', flexShrink: 0, overflow: 'hidden' }}>
              {(currentBusiness as any).logo
                ? <img src={(currentBusiness as any).logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : userInitial
              }
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {businessName}
            </span>
          </div>

          <div style={{ width: '1px', height: '22px', background: '#e0e0e0' }} />

          {/* Configuración */}
          <button
            onClick={openSettings}
            style={{ fontSize: '13px', color: '#1d1d1f', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', letterSpacing: '-0.224px', transition: 'background 120ms', display: 'flex', alignItems: 'center', gap: '5px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Settings size={14} style={{ color: '#7a7a7a' }} /> Configuración
          </button>

          {/* Salir */}
          <button
            onClick={() => { resetStore(); router.push(ROUTES.login) }}
            style={{ fontSize: '13px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', letterSpacing: '-0.224px', transition: 'background 120ms' }}
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
          {needsOnboarding ? (
            <OnboardingModal 
              businessId={activeBusiness._id} 
              onComplete={() => {
                setOnboardingDone(true)
                if (reactiveBusiness) setBusiness(reactiveBusiness as any)
              }} 
            />
          ) : (
            children
          )}
        </div>
      </main>

      {/* ── Settings Modal ── */}
      {showSettings && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.44)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShow(false)}
        >
          <div
            className="fade-in"
            style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={15} style={{ color: '#0066cc' }} />
                </div>
                <div>
                  <p style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '16px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.32px' }}>Configuración</p>
                  <p style={{ fontSize: '12px', color: '#7a7a7a' }}>Datos de contacto de tu negocio</p>
                </div>
              </div>
              <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a7a7a', display: 'flex', padding: '4px' }}>
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px', letterSpacing: '-0.2px' }}>
                <Phone size={13} style={{ color: '#25D366' }} /> Número de WhatsApp
              </label>
              <input
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="Ej: 573001234567"
                style={INPUT_S}
                onFocus={e => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none' }}
              />
              <p style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '6px', lineHeight: 1.4 }}>
                Incluye el código de país sin +. Para Colombia: <strong>57</strong> seguido del número.
              </p>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px', letterSpacing: '-0.2px', marginTop: '16px' }}>
                <Send size={13} style={{ color: '#0088cc' }} /> Usuario o Enlace de Telegram
              </label>
              <input
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                placeholder="Ej: t.me/mibot_bot o @mibot_bot"
                style={INPUT_S}
                onFocus={e => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none' }}
              />
              <p style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '6px', lineHeight: 1.4 }}>
                Asegúrate de haber guardado tu Token en la sección de <strong>Bot Telegram</strong> para que funcione.
              </p>
            </div>

            {/* Footer */}
            <div style={{ padding: '0 24px 22px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShow(false)}
                style={{ flex: 1, padding: '11px', borderRadius: '9999px', border: '1.5px solid #e0e0e0', background: '#fff', fontSize: '14px', fontWeight: 500, color: '#1d1d1f', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  flex: 1, padding: '11px', borderRadius: '9999px', border: 'none',
                  background: saved ? '#16a34a' : '#0066cc',
                  color: '#fff', fontSize: '14px', fontWeight: 600,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.75 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'background 250ms',
                }}
              >
                {isSaving
                  ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                  : saved
                  ? <><Check size={15} /> Guardado</>
                  : 'Guardar'
                }
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import { ROUTES } from "@/lib/constants"
import { toast } from "sonner"
import {
  Package, Sparkles, ImageIcon, Bot, ExternalLink,
  Lightbulb, type LucideIcon,
} from "lucide-react"

export default function DashboardPage() {
  const currentBusiness = useBusinessStore((state) => state.currentBusiness)
  const setBusiness = useBusinessStore((state) => state.setBusiness)
  const businessId = currentBusiness?._id

  // Consulta de productos reales
  const products = useQuery(api.products.list, businessId ? { businessId } : "skip") ?? []
  const updateBusiness = useMutation(api.businesses.updateBusiness)
  
  const [whatsapp, setWhatsapp] = useState("")
  const [isSavingContact, setIsSavingContact] = useState(false)

  useEffect(() => {
    if (currentBusiness?.whatsapp) {
      setWhatsapp(currentBusiness.whatsapp)
    }
  }, [currentBusiness?.whatsapp])
  
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.isActive).length
  const recentProducts = products.slice(0, 3)

  const STATS = [
    { label: "Productos activos", value: String(activeProducts), sub: `${totalProducts} en total` },
    { label: "Visitas a tu tienda", value: "0", sub: "Sin visitas aún" },
    { label: "Mensajes recibidos", value: "0", sub: "0 hoy" },
    { label: "Contenido generado", value: "0", sub: "0 esta semana" },
  ]

  if (!currentBusiness) {
    return null
  }

  const handleShareLink = () => {
    const url = `${window.location.origin}/tienda/${currentBusiness.slug}`
    navigator.clipboard.writeText(url)
    toast.success("Enlace copiado al portapapeles")
  }

  const handleSaveContact = async () => {
    if (!businessId) return
    setIsSavingContact(true)
    try {
      const updated = await updateBusiness({
        id: businessId,
        updates: { whatsapp }
      })
      setBusiness(updated)
      toast.success("Configuración de contacto guardada")
    } catch (err) {
      toast.error("Error al guardar la configuración")
    } finally {
      setIsSavingContact(false)
    }
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Welcome banner ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #e0e0e0',
        padding: '32px 40px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#0066cc', letterSpacing: '-0.224px', marginBottom: '6px' }}>
            Bienvenido de vuelta
          </p>
          <h2 style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontSize: '28px', fontWeight: 600, color: '#1d1d1f',
            lineHeight: 1.1, letterSpacing: '-0.28px', marginBottom: '6px',
          }}>
            {currentBusiness.name}
          </h2>
          <p style={{ fontSize: '15px', color: '#7a7a7a', letterSpacing: '-0.374px' }}>
            Tu centro de control para crecer más con IA.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexShrink: 0 }}>
          <Link href={ROUTES.productos}
            style={{
              background: '#0066cc', color: '#fff',
              fontSize: '14px', fontWeight: 400,
              padding: '10px 20px', borderRadius: '9999px',
              textDecoration: 'none', letterSpacing: '-0.224px',
              display: 'inline-block',
            }}>
            + Agregar producto
          </Link>
          <Link href={ROUTES.marketing}
            style={{
              background: '#f5f5f7', color: '#1d1d1f',
              fontSize: '14px', fontWeight: 400,
              padding: '10px 20px', borderRadius: '9999px',
              border: '1px solid #e0e0e0',
              textDecoration: 'none', letterSpacing: '-0.224px',
              display: 'inline-block',
            }}>
            Generar marketing
          </Link>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: '24px' }}>
        {STATS.map((stat, i) => (
          <div key={i} className="card-apple">
            <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, color: '#0066cc', lineHeight: 1, marginBottom: '4px' }}>
              {stat.value}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '2px', letterSpacing: '-0.224px' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tienda Pública Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ marginBottom: '24px' }}>
        <div className="card-apple">
          <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.374px' }}>
            Mi Tienda Pública
          </h3>
          <p style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.224px', marginBottom: '16px' }}>
            Comparte tu tienda con clientes para recibir pedidos directamente.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleShareLink}
              style={{
                flex: 1, background: '#f5f5f7', color: '#1d1d1f',
                fontSize: '14px', fontWeight: 500, padding: '10px',
                borderRadius: '8px', border: '1px solid #e0e0e0', cursor: 'pointer',
              }}
            >
              Copiar enlace
            </button>
            <Link
              href={`/tienda/${currentBusiness.slug}`}
              target="_blank"
              style={{
                flex: 1, background: '#0066cc', color: '#fff',
                fontSize: '14px', fontWeight: 500, padding: '10px',
                borderRadius: '8px', textAlign: 'center', textDecoration: 'none',
              }}
            >
              Ver tienda
            </Link>
          </div>
        </div>

        <div className="card-apple">
          <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.374px' }}>
            Configuración de Contacto
          </h3>
          <p style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.224px', marginBottom: '16px' }}>
            Actualiza el número donde recibirás los pedidos de WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej: 573001234567"
              style={{
                flex: 1, padding: '10px', borderRadius: '8px',
                border: '1px solid #e0e0e0', fontSize: '14px',
              }}
            />
            <button
              onClick={handleSaveContact}
              disabled={isSavingContact}
              style={{
                background: '#0066cc', color: '#fff',
                fontSize: '14px', fontWeight: 500, padding: '10px 20px',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                opacity: isSavingContact ? 0.7 : 1
              }}
            >
              {isSavingContact ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Quick actions */}
        <div className="card-apple">
          <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '16px', letterSpacing: '-0.374px' }}>
            Acciones rápidas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {QUICK_ACTIONS.map((action, i) => (
              <div key={i} className="row-hover" style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', borderRadius: '11px',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0f0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <action.icon size={16} style={{ color: '#0066cc' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>{action.label}</p>
                  <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tip + Recent products */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* AI recommendation placeholder */}
          <div style={{ background: '#e8f1fb', borderRadius: '18px', border: '1px solid #c5d9f0', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <Lightbulb size={24} style={{ color: '#0066cc', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0058b3', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                  Recomendación IA del día
                </p>
                <p style={{ fontSize: '14px', color: '#1d1d1f', lineHeight: 1.5, letterSpacing: '-0.224px' }}>
                  Para recibir recomendaciones personalizadas basadas en el contexto de tu negocio en Colombia, completa tu perfil y cuéntanos sobre tus necesidades en la sección del Agente IA.
                </p>
              </div>
            </div>
          </div>

          {/* Recent products */}
          <div className="card-apple">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '17px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>
                Productos recientes
              </h3>
              <Link href={ROUTES.productos} style={{ fontSize: '13px', color: '#0066cc', textDecoration: 'none', letterSpacing: '-0.224px' }}>
                Ver todos →
              </Link>
            </div>
            {recentProducts.length === 0 ? (
              <p style={{ fontSize: '14px', color: '#7a7a7a', padding: '12px', textAlign: 'center' }}>
                No tienes productos registrados.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {recentProducts.map((p) => (
                  <div key={p._id} className="row-hover" style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '11px',
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '11px',
                      background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Package size={22} style={{ color: '#7a7a7a' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{p.category}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>{formatPrice(p.price)}</p>
                      <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{p.stock} en stock</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ height: '1px', background: '#e0e0e0', margin: '12px 0' }} />
            <Link href={ROUTES.productos}
              className="btn-primary"
              style={{ display: 'flex', width: '100%', justifyContent: 'center', fontSize: '14px', padding: '10px' }}>
              Gestionar catálogo
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

const QUICK_ACTIONS: { icon: LucideIcon; label: string; description: string }[] = [
  { icon: Package,      label: "Nuevo producto", description: "Agregar a tu catálogo" },
  { icon: Sparkles,     label: "Generar post",   description: "Para Instagram o Facebook" },
  { icon: ExternalLink, label: "Ver mi tienda",  description: "Como la ve el cliente" },
]

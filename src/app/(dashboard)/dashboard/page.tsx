"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import { ROUTES } from "@/lib/constants"
import { toast } from "sonner"
import { useAction } from "convex/react"
import {
  Package, Sparkles, ExternalLink,
  Lightbulb, Loader2, Link2, type LucideIcon,
} from "lucide-react"

export default function DashboardPage() {
  const storeBusiness = useBusinessStore((state) => state.currentBusiness)
  const setBusiness = useBusinessStore((state) => state.setBusiness)
  const businessId = storeBusiness?._id

  // Obtener negocio reactivo desde Convex para ver actualizaciones en tiempo real
  const reactiveBusiness = useQuery(api.businesses.getById, businessId ? { id: businessId as any } : "skip")
  
  // Usar el reactivo si está disponible, sino el del store
  const currentBusiness = reactiveBusiness || storeBusiness

  // Consulta de productos reales
  const products = useQuery(api.products.list, businessId ? { businessId } : "skip") ?? []
  const updateBusiness = useMutation(api.businesses.updateBusiness)

  // Consulta de conversaciones pendientes
  const conversations = useQuery(api.conversations.listByBusiness, businessId ? { businessId } : "skip")
  const pendingPaymentsCount = conversations?.filter((c: any) => !c.isResolved).length || 0
  
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

  // Oportunidades state
  const colombiaContext = useQuery(api.growth.getColombiaContext)
  const analyzeProfile = useAction(api.growth.analyzeProfile)
  const [profileInput, setProfileInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  const handleAnalyze = async () => {
    if (!profileInput || !businessId) return
    setIsAnalyzing(true)
    try {
      await analyzeProfile({
        businessId,
        profileDescription: profileInput
      })
      toast.success("¡Perfil analizado con éxito!")
      setShowEditForm(false)
    } catch (error) {
      console.error(error)
      toast.error("Hubo un error al analizar el perfil.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper to find full entity details from ID
  const getEntityDetails = (entityId: string) => {
    return colombiaContext?.entidades?.find((e: any) => e.id === entityId)
  }

  const growthRoute = currentBusiness?.growthRoute
  const needsAnalysis = !growthRoute || showEditForm

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

      {/* ── Telegram Pending Payments Notification Banner ── */}
      {pendingPaymentsCount > 0 && (
        <div style={{
          background: '#ffffff',
          borderRadius: '18px',
          border: '1px solid #e0e0e0',
          padding: '20px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#1d1d1f',
          boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '11px',
              background: '#e8f1fb',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}>
              💳
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.374px', margin: 0 }}>
                  Tienes {pendingPaymentsCount} {pendingPaymentsCount === 1 ? 'pedido listo' : 'pedidos listos'} para cerrar
                </p>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0066cc' }} />
              </div>
              <p style={{ fontSize: '13px', color: '#7a7a7a', marginTop: '2px', margin: '2px 0 0', letterSpacing: '-0.224px' }}>
                {pendingPaymentsCount === 1 ? 'Un cliente' : `${pendingPaymentsCount} clientes`} en Telegram {pendingPaymentsCount === 1 ? 'está esperando' : 'están esperando'} tus datos de pago para finalizar su compra.
              </p>
            </div>
          </div>
          <Link href={ROUTES.bot} style={{
            background: '#0066cc', color: '#fff',
            fontSize: '13px', fontWeight: 600,
            padding: '10px 18px', borderRadius: '9999px',
            textDecoration: 'none', letterSpacing: '-0.224px',
            display: 'inline-block',
            boxShadow: '0 2px 8px rgba(0,102,204,0.15)',
          }}>
            Atender Clientes →
          </Link>
        </div>
      )}

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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', flexShrink: 0, alignItems: 'center' }}>
          {/* Icon-only: ver tienda */}
          <Link
            href={`/tienda/${currentBusiness.slug}`}
            target="_blank"
            title="Ver tienda"
            style={{
              width: '38px', height: '38px', borderRadius: '9999px',
              background: '#f5f5f7', border: '1px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', flexShrink: 0, transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#e8f1fb'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#f5f5f7'}
          >
            <ExternalLink size={16} style={{ color: '#0066cc' }} />
          </Link>

          {/* Icon-only: copiar enlace */}
          <button
            onClick={handleShareLink}
            title="Copiar enlace de tienda"
            style={{
              width: '38px', height: '38px', borderRadius: '9999px',
              background: '#f5f5f7', border: '1px solid #e0e0e0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0, transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e8f1fb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f5f5f7')}
          >
            <Link2 size={16} style={{ color: '#0066cc' }} />
          </button>

          <div style={{ width: '1px', height: '24px', background: '#e0e0e0', flexShrink: 0 }} />

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

      {/* ── AI Opportunity Connector (moved here, after stats) ── */}
      {needsAnalysis ? (
        <div style={{ background: '#e8f1fb', borderRadius: '18px', border: '1px solid #c5d9f0', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <Lightbulb size={24} style={{ color: '#0066cc', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0058b3', marginBottom: '4px', letterSpacing: '-0.224px' }}>
                Conector de Oportunidades (Colombia)
              </p>
              <p style={{ fontSize: '13px', color: '#1d1d1f', lineHeight: 1.5, letterSpacing: '-0.224px' }}>
                Cuéntanos sobre ti y tu negocio. La IA analizará tu perfil y te conectará con las entidades de apoyo ideales para tu etapa (SENA, iNNpulsa, Bancóldex, etc.).
              </p>
            </div>
          </div>
          <textarea
            value={profileInput}
            onChange={(e) => setProfileInput(e.target.value)}
            placeholder="Ej: Soy una mujer cabeza de hogar que hace postres desde casa para eventos. Necesito formalizar mi negocio y conseguir un crédito..."
            rows={3}
            style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              border: '1px solid #c5d9f0', fontSize: '14px', marginBottom: '12px',
              resize: 'none', outline: 'none', background: '#fff',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            {showEditForm && growthRoute && (
              <button onClick={() => setShowEditForm(false)} style={{ background: 'none', border: '1px solid #0066cc', color: '#0066cc', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
            )}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !profileInput}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '10px 20px' }}
            >
              {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {isAnalyzing ? "Analizando tu perfil..." : "Analizar mi perfil"}
            </button>
          </div>
        </div>
      ) : (
        <div className="card-apple" style={{ marginBottom: '24px', padding: '28px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: '#0066cc', color: '#fff', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                {growthRoute.identityName}
              </div>
              <span style={{ fontSize: '13px', color: '#7a7a7a', fontWeight: 500 }}>Etapa: {growthRoute.stage}</span>
            </div>
            <button
              onClick={() => { setProfileInput(""); setShowEditForm(true); }}
              style={{ color: '#0066cc', background: 'none', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.224px' }}
            >
              Re-analizar
            </button>
          </div>

          {/* AI advice */}
          <div style={{ background: '#e8f1fb', borderRadius: '12px', padding: '16px 18px', border: '1px solid #c5d9f0', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <Lightbulb size={16} style={{ color: '#0066cc', flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '14px', color: '#0058b3', lineHeight: 1.6, letterSpacing: '-0.224px' }}>
              {growthRoute.customAdvice}
            </p>
          </div>

          {/* Entities */}
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#7a7a7a', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Entidades recomendadas para ti
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {growthRoute.recommendedEntities.map((id: string) => {
              const entity = getEntityDetails(id)
              if (!entity) return null
              return (
                <div key={id} style={{
                  background: '#f5f5f7',
                  border: '1px solid #e0e0e0',
                  padding: '18px',
                  borderRadius: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#0058b3', letterSpacing: '-0.224px' }}>{entity.nombre}</p>
                  <p style={{ fontSize: '12px', color: '#7a7a7a', lineHeight: 1.5 }}>
                    {entity.necesidades_que_resuelve.join(", ")}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                    {entity.foco.slice(0, 2).map((foco: string) => (
                      <span key={foco} style={{
                        fontSize: '11px', fontWeight: 600,
                        background: '#e8f1fb', color: '#0066cc',
                        padding: '3px 10px', borderRadius: '9999px',
                        border: '1px solid #c5d9f0',
                      }}>
                        {foco}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Tienda Pública Section ── */}
      

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

        {/* Recent products */}
        <div className="card-apple lg:col-span-2">
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
  )
}

const QUICK_ACTIONS: { icon: LucideIcon; label: string; description: string }[] = [
  { icon: Package,      label: "Nuevo producto", description: "Agregar a tu catálogo" },
  { icon: Sparkles,     label: "Generar post",   description: "Para Instagram o Facebook" },
  { icon: ExternalLink, label: "Ver mi tienda",  description: "Como la ve el cliente" },
]

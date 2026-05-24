"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { buildWhatsAppUrl, buildTelegramUrl, formatPrice } from "@/lib/utils"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Minus, Plus, ShoppingCart } from "lucide-react"

export default function TiendaPublicaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [categoryFilter, setCategoryFilter] = useState("Todas")
  const [cart, setCart] = useState<Record<string, number>>({})

  // Fetch business by slug
  const business = useQuery(api.businesses.getBySlug, { slug })
  
  // Fetch products by businessId, only if business is loaded
  const products = useQuery(api.products.list, business ? { businessId: business._id } : "skip")

  if (business === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7' }}>
        <span style={{ width: '32px', height: '32px', border: '3px solid rgba(0,102,204,0.2)', borderTopColor: '#0066cc', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
      </div>
    )
  }

  if (business === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7' }}>
        <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '24px', fontWeight: 600, color: '#1d1d1f' }}>
          Tienda no encontrada
        </p>
      </div>
    )
  }

  const activeProducts = products?.filter(p => p.isActive) || []
  const uniqueCategories = Array.from(new Set(activeProducts.map(p => p.category))).filter(Boolean)
  
  const filteredProducts = activeProducts.filter(p => 
    categoryFilter === "Todas" || p.category === categoryFilter
  )

  // Fallback to name if emoji not set
  const emoji = "🏪" 
  
  const waUrl = business.whatsapp ? buildWhatsAppUrl(business.whatsapp, `Hola, me interesa hacer un pedido en ${business.name}`) : null
  const tgUrl = business.telegram ? buildTelegramUrl(business.telegram) : null

  // Cart functions
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const newQty = (prev[productId] || 0) + delta
      if (newQty <= 0) {
        const newCart = { ...prev }
        delete newCart[productId]
        return newCart
      }
      return { ...prev, [productId]: newQty }
    })
  }

  const getCartTotal = () => {
    let total = 0
    let count = 0
    for (const [id, qty] of Object.entries(cart)) {
      const product = activeProducts.find(p => p._id === id)
      if (product) {
        total += product.price * qty
        count += qty
      }
    }
    return { total, count }
  }

  const { total: cartTotal, count: cartCount } = getCartTotal()

  const generateCartMessage = () => {
    let message = `Hola, quiero realizar el siguiente pedido:\n\n`
    for (const [id, qty] of Object.entries(cart)) {
      const product = activeProducts.find(p => p._id === id)
      if (product) {
        message += `- ${qty}x *${product.name}* (${formatPrice(product.price)})\n`
      }
    }
    message += `\n*Total estimado: ${formatPrice(cartTotal)}*`
    return message
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif', paddingBottom: cartCount > 0 ? '100px' : '0' }}>
      {/* ── Nav ── */}
      <nav style={{ background: '#000', height: '44px', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.224px' }}>Punto de Arranque</span>
      </nav>

      {/* ── Business header — canvas white ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '18px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', background: '#f5f5f7', border: '1px solid #e0e0e0',
              boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px',
            }}>
              {emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '6px' }}>
                {business.name}
              </h1>
              {business.description && (
                <p style={{ fontSize: '14px', color: '#7a7a7a', lineHeight: 1.5, marginBottom: '20px', letterSpacing: '-0.224px' }}>
                  {business.description}
                </p>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {waUrl && (
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#25D366', color: '#fff', fontSize: '14px', fontWeight: 400, padding: '10px 20px', borderRadius: '9999px', textDecoration: 'none', letterSpacing: '-0.224px', transition: 'opacity 120ms' }}>
                    💬 WhatsApp
                  </a>
                )}
                {tgUrl && (
                  <a href={tgUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#229ED9', color: '#fff', fontSize: '14px', fontWeight: 400, padding: '10px 20px', borderRadius: '9999px', textDecoration: 'none', letterSpacing: '-0.224px', transition: 'opacity 120ms' }}>
                    ✈️ Telegram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', margin: 0 }}>
            Nuestros Productos
          </h2>
          
          {uniqueCategories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '8px 14px', borderRadius: '9999px', border: '1px solid #e0e0e0',
                background: '#fff', fontSize: '13px', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.224px', outline: 'none', cursor: 'pointer', color: '#1d1d1f'
              }}
            >
              <option value="Todas">Todas las categorías</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
        </div>

        {products === undefined ? (
           <p style={{ fontSize: '14px', color: '#7a7a7a', padding: '12px', textAlign: 'center' }}>
             Cargando productos...
           </p>
        ) : activeProducts.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#7a7a7a', padding: '12px', textAlign: 'center' }}>
            No hay productos disponibles.
          </p>
        ) : filteredProducts.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#7a7a7a', padding: '12px', textAlign: 'center' }}>
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="card-apple" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Product image area */}
                <div style={{
                  height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '72px', background: '#f5f5f7', borderBottom: '1px solid #e0e0e0', overflow: 'hidden'
                }}>
                  {product.images && product.images[0] && product.images[0].startsWith("http") ? (
                    <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ filter: 'drop-shadow(rgba(0,0,0,0.22) 3px 5px 20px)' }}>{product.images?.[0] || "📦"}</span>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', lineHeight: 1.3, letterSpacing: '-0.374px' }}>
                      {product.name}
                    </h3>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#4b5563', background: '#f3f4f6', padding: '2px 8px', borderRadius: '9999px', flexShrink: 0, letterSpacing: '0.02em' }}>
                      {product.category}
                    </span>
                  </div>
                  {product.description && (
                    <p style={{ fontSize: '13px', color: '#7a7a7a', lineHeight: 1.5, marginBottom: '16px', letterSpacing: '-0.224px' }}>
                      {product.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '21px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.374px' }}>
                      {formatPrice(product.price)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f5f5f7', borderRadius: '999px', padding: '4px' }}>
                      <button 
                        onClick={() => updateQuantity(product._id, -1)}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', background: cart[product._id] ? '#fff' : 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: cart[product._id] ? '#1d1d1f' : '#a1a1aa', boxShadow: cart[product._id] ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                        disabled={!cart[product._id]}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f', minWidth: '20px', textAlign: 'center' }}>
                        {cart[product._id] || 0}
                      </span>
                      <button 
                        onClick={() => updateQuantity(product._id, 1)}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1d1d1f', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer — parchment ── */}
      <footer style={{ background: '#f5f5f7', borderTop: '1px solid #e0e0e0', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
          Tienda creada con{" "}
          <a href="/" style={{ color: '#0066cc', fontWeight: 600, textDecoration: 'none' }}>Punto de Arranque</a>
          {" "}· {business.name}
        </p>
      </footer>

      {/* Floating Cart Widget */}
      {cartCount > 0 && business.whatsapp && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1d1d1f', color: '#fff', padding: '16px 24px', borderRadius: '999px',
          display: 'flex', alignItems: 'center', gap: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          zIndex: 100, width: 'calc(100% - 48px)', maxWidth: '400px', justifyContent: 'space-between'
        }} className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }}>
              <ShoppingCart size={20} />
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, opacity: 0.8 }}>{cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}</p>
              <p style={{ fontSize: '16px', fontWeight: 700 }}>{formatPrice(cartTotal)}</p>
            </div>
          </div>
          <a
            href={buildWhatsAppUrl(business.whatsapp, generateCartMessage())}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              background: '#25D366', color: '#fff', padding: '12px 20px', borderRadius: '999px', 
              fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'transform 120ms',
            }}
          >
            Finalizar Pedido
          </a>
        </div>
      )}
    </div>
  )
}

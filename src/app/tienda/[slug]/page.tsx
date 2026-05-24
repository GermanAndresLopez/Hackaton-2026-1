"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import { buildWhatsAppUrl, buildTelegramUrl, formatPrice } from "@/lib/utils"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import {
  Minus, Plus, ShoppingCart, ShoppingBag, Package,
  MessageCircle, Send, ArrowRight, Store,
} from "lucide-react"

export default function TiendaPublicaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [categoryFilter, setCategoryFilter] = useState("Todas")
  const [cart, setCart] = useState<Record<string, number>>({})
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const recordView = useMutation(api.products.recordProductView)

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    recordView({ productId: product._id })
  }


  const business = useQuery(api.businesses.getBySlug, { slug })
  const products = useQuery(api.products.list, business ? { businessId: business._id } : "skip")

  // ── Loading ──
  if (business === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7' }}>
        <span style={{ width: '36px', height: '36px', border: '3px solid rgba(0,102,204,0.15)', borderTopColor: '#0066cc', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
      </div>
    )
  }

  // ── Not found ──
  if (business === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7', gap: '16px' }}>
        <Store size={48} style={{ color: '#c0c0c0' }} />
        <p style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '22px', fontWeight: 600, color: '#1d1d1f' }}>
          Tienda no encontrada
        </p>
        <p style={{ fontSize: '14px', color: '#7a7a7a' }}>
          El enlace puede ser incorrecto o la tienda ya no existe.
        </p>
      </div>
    )
  }

  const activeProducts = products?.filter(p => p.isActive) ?? []
  const uniqueCategories = Array.from(new Set(activeProducts.map(p => p.category))).filter(Boolean)
  const filteredProducts = activeProducts.filter(p =>
    categoryFilter === "Todas" || p.category === categoryFilter
  )

  const waUrl = business.whatsapp
    ? buildWhatsAppUrl(business.whatsapp, `Hola, me interesa hacer un pedido en ${business.name}`)
    : null
  // Solo se muestra Telegram si configuró ambos (el enlace y el token del bot)
  const tgUrl = (business.telegram && business.botToken) 
    ? buildTelegramUrl(business.telegram) 
    : null

  // ── Cart helpers ──
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const newQty = (prev[productId] || 0) + delta
      if (newQty <= 0) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      return { ...prev, [productId]: newQty }
    })
  }

  const getCartSummary = () => {
    let total = 0, count = 0
    for (const [id, qty] of Object.entries(cart)) {
      const p = activeProducts.find(p => p._id === id)
      if (p) { total += p.price * qty; count += qty }
    }
    return { total, count }
  }

  const generateCartMessage = () => {
    let msg = `Hola! Quiero realizar el siguiente pedido en ${business.name}:\n\n`
    for (const [id, qty] of Object.entries(cart)) {
      const p = activeProducts.find(p => p._id === id)
      if (p) msg += `- ${qty}x ${p.name} — ${formatPrice(p.price)}\n`
    }
    msg += `\nTotal estimado: ${formatPrice(cartSummary.total)}`
    return msg
  }

  const cartSummary = getCartSummary()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7',
      fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
      paddingBottom: cartSummary.count > 0 ? '110px' : '0',
    }}>

      {/* ── Sticky top bar ── */}
      <nav style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        height: '48px',
        display: 'flex', alignItems: 'center',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 50,
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: '"SF Pro Display", system-ui, sans-serif',
          fontWeight: 700, fontSize: '14px', color: '#1d1d1f', letterSpacing: '-0.224px',
        }}>
          Punto de Arranque
        </span>
        {cartSummary.count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0066cc', color: '#fff', padding: '5px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600 }}>
            <ShoppingCart size={14} />
            {cartSummary.count} {cartSummary.count === 1 ? 'ítem' : 'ítems'}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(140deg, #003f99 0%, #0055cc 45%, #1a7ee8 100%)',
        padding: '52px 24px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* subtle texture blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '10%', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '28px', position: 'relative' }}>
          {/* Logo / Icon */}
          <div style={{
            width: '88px', height: '88px', borderRadius: '22px', flexShrink: 0,
            background: 'rgba(255,255,255,0.12)',
            border: '2px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            overflow: 'hidden',
          }}>
            {(business as any).logo
              ? <img src={(business as any).logo} alt={business.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <ShoppingBag size={38} style={{ color: '#fff' }} />
            }
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Tienda oficial
            </p>
            <h1 style={{
              fontFamily: '"SF Pro Display", system-ui, sans-serif',
              fontSize: '32px', fontWeight: 700, color: '#fff',
              letterSpacing: '-0.5px', marginBottom: '10px', lineHeight: 1.15,
            }}>
              {business.name}
            </h1>
            {business.description && (
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.55, marginBottom: '22px', maxWidth: '480px' }}>
                {business.description}
              </p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#25D366', color: '#fff',
                  fontSize: '14px', fontWeight: 600,
                  padding: '10px 20px', borderRadius: '9999px',
                  textDecoration: 'none', letterSpacing: '-0.12px',
                  boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
                  transition: 'opacity 150ms',
                }}>
                  <MessageCircle size={16} /> WhatsApp
                </a>
              )}
              {tgUrl && (
                <a href={tgUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontSize: '14px', fontWeight: 600,
                  padding: '10px 20px', borderRadius: '9999px',
                  textDecoration: 'none', letterSpacing: '-0.12px',
                  transition: 'opacity 150ms',
                }}>
                  <Send size={16} /> Telegram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Products section ── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Section title + stats */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{
            fontFamily: '"SF Pro Display", system-ui, sans-serif',
            fontSize: '22px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.374px',
          }}>
            Catálogo
          </h2>
          {activeProducts.length > 0 && (
            <span style={{ fontSize: '13px', color: '#7a7a7a' }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>

        {/* Category pill filters */}
        {uniqueCategories.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '28px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {['Todas', ...uniqueCategories].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  flexShrink: 0,
                  padding: '8px 18px', borderRadius: '9999px',
                  background: categoryFilter === cat ? '#0066cc' : '#fff',
                  color: categoryFilter === cat ? '#fff' : '#1d1d1f',
                  border: `1.5px solid ${categoryFilter === cat ? '#0066cc' : '#e0e0e0'}`,
                  fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                  transition: 'all 150ms ease-out',
                  letterSpacing: '-0.12px',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {products === undefined ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
            <span style={{ width: '32px', height: '32px', border: '3px solid rgba(0,102,204,0.15)', borderTopColor: '#0066cc', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
          </div>
        ) : activeProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <Package size={48} style={{ color: '#c0c0c0', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '17px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px' }}>Sin productos disponibles</p>
            <p style={{ fontSize: '14px', color: '#7a7a7a' }}>Esta tienda todavía no tiene productos publicados.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <p style={{ fontSize: '15px', color: '#7a7a7a' }}>No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            {filteredProducts.map((product) => {
              const qty = cart[product._id] || 0
              const hasImage = product.images?.[0]?.startsWith("http") || product.images?.[0]?.startsWith("data:")

              return (
                <div
                  key={product._id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid #ebebeb',
                    boxShadow: qty > 0
                      ? '0 0 0 2px #0066cc, 0 4px 20px rgba(0,102,204,0.12)'
                      : '0 2px 12px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 200ms ease-out',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Image */}
                  <div 
                    onClick={() => handleProductClick(product)}
                    style={{
                      height: '210px',
                      background: '#f5f5f7',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    {hasImage ? (
                      <img
                        src={product.images![0]}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Package size={52} style={{ color: '#d0d0d0' }} />
                    )}
                    {/* Category badge over image */}
                    <span style={{
                      position: 'absolute', top: '12px', left: '12px',
                      fontSize: '11px', fontWeight: 700,
                      background: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(8px)',
                      color: '#0058b3',
                      padding: '3px 10px', borderRadius: '9999px',
                      letterSpacing: '-0.05em',
                      border: '1px solid rgba(0,102,204,0.15)',
                    }}>
                      {product.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div 
                      onClick={() => handleProductClick(product)}
                      style={{ cursor: 'pointer', flex: 1, display: 'flex', flexDirection: 'column' }}
                    >
                      <h3 style={{
                        fontFamily: '"SF Pro Display", system-ui, sans-serif',
                        fontSize: '15px', fontWeight: 600, color: '#1d1d1f',
                        letterSpacing: '-0.224px', marginBottom: '6px', lineHeight: 1.35,
                      }}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p style={{
                          fontSize: '13px', color: '#7a7a7a', lineHeight: 1.55,
                          letterSpacing: '-0.12px', marginBottom: '16px',
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          flex: 1,
                        }}>
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Price + counter */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <p style={{
                        fontFamily: '"SF Pro Display", system-ui, sans-serif',
                        fontSize: '20px', fontWeight: 700, color: '#1d1d1f',
                        letterSpacing: '-0.374px',
                      }}>
                        {formatPrice(product.price)}
                      </p>

                      {/* Qty control */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0',
                        background: '#f5f5f7', borderRadius: '9999px',
                        border: qty > 0 ? '1.5px solid #0066cc' : '1.5px solid transparent',
                        overflow: 'hidden',
                        transition: 'border-color 200ms',
                      }}>
                        <button
                          onClick={() => updateQuantity(product._id, -1)}
                          disabled={qty === 0}
                          style={{
                            width: '36px', height: '36px', border: 'none',
                            background: 'transparent', cursor: qty ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: qty ? '#1d1d1f' : '#c0c0c0',
                            transition: 'color 150ms',
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{
                          minWidth: '24px', textAlign: 'center',
                          fontSize: '14px', fontWeight: 700,
                          color: qty > 0 ? '#0066cc' : '#1d1d1f',
                          transition: 'color 200ms',
                        }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, 1)}
                          style={{
                            width: '36px', height: '36px', border: 'none',
                            background: qty > 0 ? '#0066cc' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: qty > 0 ? '#fff' : '#1d1d1f',
                            borderRadius: '0 9999px 9999px 0',
                            transition: 'background 200ms, color 200ms',
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid #e0e0e0',
        padding: '32px 24px',
        textAlign: 'center',
        background: '#fff',
        marginTop: '16px',
      }}>
        <p style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>
          {business.name} · Tienda creada con{" "}
          <a href="/" style={{ color: '#0066cc', fontWeight: 600, textDecoration: 'none' }}>
            Punto de Arranque
          </a>
        </p>
      </footer>

      {/* ── Floating cart ── */}
      {cartSummary.count > 0 && business.whatsapp && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            background: '#fff',
            borderRadius: '20px',
            padding: '14px 16px 14px 20px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', gap: '20px',
            zIndex: 100,
            width: 'calc(100% - 48px)',
            maxWidth: '440px',
          }}
        >
          {/* Cart info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: '#f0f0f5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ShoppingCart size={18} style={{ color: '#0066cc' }} />
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '2px' }}>
                {cartSummary.count} {cartSummary.count === 1 ? 'producto' : 'productos'}
              </p>
              <p style={{
                fontFamily: '"SF Pro Display", system-ui, sans-serif',
                fontSize: '17px', fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.374px',
              }}>
                {formatPrice(cartSummary.total)}
              </p>
            </div>
          </div>

          {/* CTA */}
          <a
            href={buildWhatsAppUrl(business.whatsapp, generateCartMessage())}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#25D366', color: '#fff',
              padding: '12px 18px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700, textDecoration: 'none',
              letterSpacing: '-0.12px', flexShrink: 0,
              boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
              transition: 'opacity 150ms',
            }}
          >
            Pedir <ArrowRight size={15} />
          </a>
        </div>
      )}

      {/* ── Product details modal ── */}
      {selectedProduct && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200,
            padding: '20px',
          }} 
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            style={{
              background: '#fff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.05)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10, color: '#1d1d1f',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>

            {/* Product Image */}
            <div style={{
              height: '240px', background: '#f5f5f7', display: 'flex',
              alignItems: 'center', justifyContent: 'center', position: 'relative',
              overflow: 'hidden', flexShrink: 0
            }}>
              {selectedProduct.images?.[0]?.startsWith("http") || selectedProduct.images?.[0]?.startsWith("data:") ? (
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Package size={64} style={{ color: '#d0d0d0' }} />
              )}
              
              <span style={{
                position: 'absolute', top: '16px', left: '16px',
                fontSize: '11px', fontWeight: 700,
                background: '#e8f1fb', color: '#0058b3',
                padding: '4px 12px', borderRadius: '9999px',
                border: '1px solid rgba(0,102,204,0.15)',
              }}>
                {selectedProduct.category}
              </span>
            </div>

            {/* Product Details Content */}
            <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{
                  fontFamily: '"SF Pro Display", system-ui, sans-serif',
                  fontSize: '22px', fontWeight: 700, color: '#1d1d1f',
                  letterSpacing: '-0.5px', marginBottom: '6px', lineHeight: 1.25
                }}>
                  {selectedProduct.name}
                </h2>
                
                <p style={{
                  fontFamily: '"SF Pro Display", system-ui, sans-serif',
                  fontSize: '24px', fontWeight: 700, color: '#0066cc',
                  letterSpacing: '-0.5px'
                }}>
                  {formatPrice(selectedProduct.price)}
                </p>
              </div>

              {selectedProduct.description && (
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#7a7a7a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                    Descripción
                  </h4>
                  <p style={{
                    fontSize: '14px', color: '#424245', lineHeight: 1.55,
                    letterSpacing: '-0.16px'
                  }}>
                    {selectedProduct.description}
                  </p>
                </div>
              )}

              {/* Sync with Cart inside the modal */}
              <div style={{ 
                borderTop: '1px solid #e5e5e7', paddingTop: '16px', 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: '8px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>
                  Cantidad en carrito:
                </span>
                
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: '#f5f5f7', borderRadius: '9999px',
                  border: (cart[selectedProduct._id] || 0) > 0 ? '1.5px solid #0066cc' : '1.5px solid transparent',
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => updateQuantity(selectedProduct._id, -1)}
                    disabled={!(cart[selectedProduct._id] || 0)}
                    style={{
                      width: '36px', height: '36px', border: 'none',
                      background: 'transparent', cursor: (cart[selectedProduct._id] || 0) ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: (cart[selectedProduct._id] || 0) ? '#1d1d1f' : '#c0c0c0',
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  
                  <span style={{
                    minWidth: '28px', textAlign: 'center',
                    fontSize: '14px', fontWeight: 700,
                    color: (cart[selectedProduct._id] || 0) > 0 ? '#0066cc' : '#1d1d1f',
                  }}>
                    {cart[selectedProduct._id] || 0}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(selectedProduct._id, 1)}
                    style={{
                      width: '36px', height: '36px', border: 'none',
                      background: (cart[selectedProduct._id] || 0) > 0 ? '#0066cc' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: (cart[selectedProduct._id] || 0) > 0 ? '#fff' : '#1d1d1f',
                      borderRadius: '0 9999px 9999px 0',
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { formatPrice } from "@/lib/utils"
import { currentProducts, db } from "@/lib/db/mockDb"
import type { Product } from "@/types"

const INPUT_STYLE = {
  padding: '10px 14px',
  borderRadius: '11px',
  border: '1px solid #e0e0e0',
  background: '#fff',
  fontSize: '14px',
  fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
  letterSpacing: '-0.224px',
  outline: 'none',
  width: '100%',
  color: '#1d1d1f',
} as const

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>(currentProducts)
  const [showForm, setShowForm] = useState(false)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  async function generateAI(productId: string) {
    setAiLoading(productId)
    await new Promise(r => setTimeout(r, 2000))
    const updated = db.products.addAIGenerated(productId, {
      name: "Nombre mejorado por IA ✨",
      description: "Descripción optimizada para aumentar tus ventas y conectar con tus clientes.",
      copy: "¡El producto que todos quieren! No te pierdas esta oportunidad. 🔥",
      hashtags: ["#ProductoTop", "#Artesanal", "#Calidad", "#Colombia", "#Emprendimiento"],
    })
    if (updated) setProducts(prev => prev.map(p => p.id === productId ? updated : p))
    setAiLoading(null)
  }

  function toggleActive(productId: string) {
    const updated = db.products.toggleActive(productId)
    if (updated) setProducts(prev => prev.map(p => p.id === productId ? updated : p))
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
            Mis Productos
          </h2>
          <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
            {products.length} productos · {products.filter(p => p.isActive).length} activos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ fontSize: '14px', padding: '10px 20px' }}
        >
          + Nuevo producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '20px' }}>
        {[
          { label: "Total productos", value: products.length },
          { label: "Activos", value: products.filter(p => p.isActive).length },
          { label: "Valor inventario", value: formatPrice(products.reduce((acc, p) => acc + p.price * p.stock, 0)) },
        ].map((s, i) => (
          <div key={i} className="card-apple">
            <p style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#0066cc', lineHeight: 1, marginBottom: '4px' }}>
              {s.value}
            </p>
            <p style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Product list */}
      <div className="card-apple" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Search bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>Catálogo</h3>
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            style={{ ...INPUT_STYLE, width: '200px', padding: '8px 14px', borderRadius: '9999px', fontSize: '13px' }}
          />
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '64px', textAlign: 'center', color: '#7a7a7a' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '17px', color: '#1d1d1f', marginBottom: '4px' }}>Sin resultados</p>
            <p style={{ fontSize: '14px', color: '#7a7a7a' }}>No se encontraron productos para "{search}"</p>
          </div>
        )}

        {filtered.map((product, idx) => (
          <div key={product.id} style={{
            padding: '20px 24px',
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            borderTop: idx > 0 ? '1px solid #e0e0e0' : 'none',
            transition: 'background 120ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Thumbnail */}
            <div style={{ width: '56px', height: '56px', borderRadius: '11px', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, border: '1px solid #e0e0e0' }}>
              {product.images[0]}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.224px' }}>{product.name}</h4>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px',
                      background: product.isActive ? '#d1fae5' : '#f3f4f6',
                      color: product.isActive ? '#065f46' : '#6b7280',
                      letterSpacing: '0.02em',
                    }}>
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#7a7a7a', marginBottom: '8px', letterSpacing: '-0.224px' }}>{product.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#0066cc', letterSpacing: '-0.224px' }}>{formatPrice(product.price)}</span>
                    <span style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>Stock: {product.stock}</span>
                    <span style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{product.category}</span>
                  </div>

                  {/* AI generated */}
                  {product.aiGenerated?.copy && (
                    <div style={{ marginTop: '12px', padding: '12px 14px', background: '#e8f1fb', borderRadius: '11px', border: '1px solid #c5d9f0' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#0058b3', marginBottom: '4px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>✨ Copy por IA</p>
                      <p style={{ fontSize: '13px', color: '#1d1d1f', letterSpacing: '-0.224px', lineHeight: 1.4 }}>{product.aiGenerated.copy}</p>
                      {product.aiGenerated.hashtags && (
                        <p style={{ fontSize: '12px', color: '#0066cc', marginTop: '4px', letterSpacing: '-0.12px' }}>
                          {product.aiGenerated.hashtags.join(" ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => generateAI(product.id)}
                    disabled={aiLoading === product.id}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    {aiLoading === product.id ? (
                      <><span style={{ width: '12px', height: '12px', border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Generando...</>
                    ) : "Mejorar con IA"}
                  </button>
                  <button
                    onClick={() => toggleActive(product.id)}
                    style={{ fontSize: '12px', color: '#7a7a7a', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px', padding: '4px 8px' }}
                  >
                    {product.isActive ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(8px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowForm(false)}
        >
          <div
            className="fade-in"
            style={{ background: '#fff', width: '100%', maxWidth: '480px', borderRadius: '18px', padding: '32px', boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '21px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>
                Nuevo producto
              </h3>
              <button onClick={() => setShowForm(false)} style={{ fontSize: '18px', color: '#7a7a7a', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Nombre del producto</label>
                <input placeholder="Ej: Brownies de chocolate" style={INPUT_STYLE} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Descripción</label>
                <textarea placeholder="Describe brevemente tu producto..." rows={3} style={{ ...INPUT_STYLE, resize: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Precio</label>
                  <input type="number" placeholder="15000" style={INPUT_STYLE} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Stock</label>
                  <input type="number" placeholder="10" style={INPUT_STYLE} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                >
                  Cancelar
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                >
                  ✨ Crear con IA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

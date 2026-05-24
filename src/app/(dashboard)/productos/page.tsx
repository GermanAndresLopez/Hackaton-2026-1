"use client"

import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import { Package, Search, X } from "lucide-react"

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

const PREDEFINED_CATEGORIES = [
  "Comida", "Postres", "Ropa", "Electrodomésticos", 
  "Tecnología", "Belleza", "Servicios", "Artesanías", "Otro"
]

export default function ProductosPage() {
  const currentBusiness = useBusinessStore((state) => state.currentBusiness)
  const businessId = currentBusiness?._id

  // Consulta reactiva de Convex
  const products = useQuery(api.products.list, { businessId: businessId }) ?? []
  
  // Mutaciones de Convex
  const createProductMutation = useMutation(api.products.create)
  const toggleActiveMutation = useMutation(api.products.toggleActive)
  const deleteProductMutation = useMutation(api.products.deleteProduct)

  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todas")

  // Estados para el formulario de nuevo producto
  // Lock body scroll when modal is open (prevents layout shift / blank space from scrollbar disappearing)
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showForm])

  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [categorySelection, setCategorySelection] = useState(PREDEFINED_CATEGORIES[0])
  const [customCategory, setCustomCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Obtener categorías únicas de los productos para el filtro
  const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean)

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "Todas" || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  async function handleCreateProduct() {
    if (!businessId) return
    if (!newName.trim() || !newPrice) return

    const finalCategory = categorySelection === "Otro" ? (customCategory || "General") : categorySelection

    setIsSubmitting(true)
    try {
      await createProductMutation({
        businessId,
        name: newName,
        description: newDesc,
        price: Number(newPrice),
        images: [],
        category: finalCategory,
        isActive: true,
      })

      // Resetear formulario
      setNewName("")
      setNewDesc("")
      setNewPrice("")
      setCategorySelection(PREDEFINED_CATEGORIES[0])
      setCustomCategory("")
      setShowForm(false)
    } catch (err) {
      console.error("Error al crear producto en Convex:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleActive(productId: any) {
    try {
      await toggleActiveMutation({ id: productId })
    } catch (err) {
      console.error("Error al cambiar estado del producto:", err)
    }
  }

  async function handleDeleteProduct(productId: any) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto de tu catálogo?")) {
      try {
        await deleteProductMutation({ id: productId })
      } catch (err) {
        console.error("Error al eliminar producto:", err)
      }
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1 }}>
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
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4" style={{ marginBottom: '20px' }}>
        {[
          { label: "Total productos", value: products.length },
          { label: "Activos", value: products.filter(p => p.isActive).length },
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
        {/* Search and Filters */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>Catálogo</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ ...INPUT_STYLE, width: 'auto', padding: '8px 14px', borderRadius: '9999px', fontSize: '13px', cursor: 'pointer' }}
            >
              <option value="Todas">Todas las categorías</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              style={{ ...INPUT_STYLE, width: '200px', padding: '8px 14px', borderRadius: '9999px', fontSize: '13px' }}
            />
          </div>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '64px', textAlign: 'center', color: '#7a7a7a' }}>
            <Search size={40} style={{ color: '#c0c0c0', marginBottom: '12px', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '17px', color: '#1d1d1f', marginBottom: '4px' }}>Sin resultados</p>
            <p style={{ fontSize: '14px', color: '#7a7a7a' }}>No se encontraron productos para los filtros actuales</p>
          </div>
        )}

        {filtered.map((product, idx) => (
          <div key={product._id} style={{
            padding: '20px 24px',
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            borderTop: idx > 0 ? '1px solid #e0e0e0' : 'none',
            transition: 'background 120ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            {/* Thumbnail */}
            <div style={{ width: '56px', height: '56px', borderRadius: '11px', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #e0e0e0' }}>
              <Package size={26} style={{ color: '#7a7a7a' }} />
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
                    <span style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.12px', background: '#f0f0f5', padding: '2px 8px', borderRadius: '6px' }}>{product.category}</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleActive(product._id)}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    {product.isActive ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px', padding: '4px 8px' }}
                  >
                    Eliminar
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
            style={{ background: '#fff', width: '100%', maxWidth: '480px', borderRadius: '18px', padding: '32px', boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontWeight: 600, fontSize: '21px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>
                Nuevo producto
              </h3>
              <button onClick={() => setShowForm(false)} style={{ color: '#7a7a7a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Nombre del producto</label>
                <input 
                  placeholder="Ej: Brownies de chocolate" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                  style={INPUT_STYLE} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Descripción</label>
                <textarea 
                  placeholder="Describe brevemente tu producto..." 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)} 
                  rows={3} 
                  style={{ ...INPUT_STYLE, resize: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Precio ($ COP)</label>
                <input 
                  type="number" 
                  placeholder="15000" 
                  value={newPrice} 
                  onChange={e => setNewPrice(e.target.value)} 
                  style={INPUT_STYLE} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Categoría</label>
                <select 
                  value={categorySelection} 
                  onChange={e => setCategorySelection(e.target.value)} 
                  style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                >
                  {PREDEFINED_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {categorySelection === "Otro" && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>Especifica la categoría</label>
                  <input 
                    placeholder="Ej: Accesorios" 
                    value={customCategory} 
                    onChange={e => setCustomCategory(e.target.value)} 
                    style={INPUT_STYLE} 
                  />
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateProduct}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
                  disabled={isSubmitting || !newName.trim() || !newPrice || (categorySelection === "Otro" && !customCategory.trim())}
                >
                  {isSubmitting ? "Creando..." : "Crear producto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useAction, useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { useBusinessStore } from "@/store/useBusinessStore"
import { formatPrice } from "@/lib/utils"
import { enhanceImage, STYLE_PARAMS } from "@/lib/imageEnhancer"
import { Image as ImageIcon, Map, Bookmark, Copy, Save, Trash2, Loader2, Sparkles, AlertCircle, Download } from "lucide-react"

type Goal = "lanzamiento" | "promocion" | "urgencia" | "fidelizacion"

const GOALS: { value: Goal; label: string; description: string }[] = [
  { value: "lanzamiento", label: "Lanzamiento", description: "Dar a conocer un nuevo producto" },
  { value: "promocion", label: "Promoción", description: "Descuento o precio especial" },
  { value: "urgencia", label: "Urgencia", description: "Stock limitado o fecha límite" },
  { value: "fidelizacion", label: "Fidelización", description: "Premiar clientes frecuentes" },
]

export default function MarketingPage() {
  const currentBusiness = useBusinessStore((s) => s.currentBusiness)
  const businessId = currentBusiness?._id

  // Tabs state
  const [activeTab, setActiveTab] = useState<"post" | "roadmap" | "saved">("post")

  // Form states
  const [goal, setGoal] = useState<Goal>("lanzamiento")
  const [selectedProductId, setSelectedProductId] = useState<string>("")

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // Results state
  const [postResult, setPostResult] = useState<any | null>(null)
  const [roadmapResult, setRoadmapResult] = useState<any | null>(null)
  
  // Convex Hooks
  const generatePost = useAction(api.marketing.generatePost)
  const generateRoadmap = useAction(api.marketing.generateRoadmap)
  const savePost = useMutation(api.marketing.savePost)
  const saveRoadmap = useMutation(api.marketing.saveRoadmap)
  const deleteContent = useMutation(api.marketing.deletePost)

  // Queries for saved content
  const products = useQuery(api.products.list, businessId ? { businessId } : "skip")
  const savedPosts = useQuery(api.marketing.listPosts, businessId ? { businessId } : "skip")
  const savedRoadmaps = useQuery(api.marketing.listRoadmaps, businessId ? { businessId } : "skip")

  // Handlers
  async function handleGeneratePost() {
    if (!selectedProductId || !businessId) return
    setIsLoading(true)
    setError("")
    setSuccessMsg("")
    setPostResult(null)
    
    try {
      const data = await generatePost({ productId: selectedProductId as Id<"products">, goal })
      
      // Si el backend devolvió una imagen (la foto original del producto)
      // aplicamos la mejora automática (brillo, contraste, colores) localmente
      if (data.imageUrl) {
        try {
          const enhancedUrl = await enhanceImage(data.imageUrl, STYLE_PARAMS.auto_enhance)
          data.imageUrl = enhancedUrl
        } catch (err) {
          console.warn("No se pudo aplicar la mejora de imagen automática", err)
          // Si falla, se queda con la original
        }
      }
      
      setPostResult(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Hubo un error al generar el post.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGenerateRoadmap() {
    if (!selectedProductId || !businessId) return
    setIsLoading(true)
    setError("")
    setSuccessMsg("")
    setRoadmapResult(null)
    
    try {
      const data = await generateRoadmap({ productId: selectedProductId as Id<"products">, goal })
      setRoadmapResult(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Hubo un error al generar el roadmap.")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSavePost() {
    if (!postResult || !businessId) return
    try {
      await savePost({
        businessId,
        contentType: "Post Instagram",
        goal,
        texto: postResult.texto,
        cta: postResult.cta,
        hashtags: postResult.hashtags,
        imageUrl: postResult.imageUrl,
      })
      setSuccessMsg("¡Post guardado exitosamente!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err: any) {
      setError(err.message || "Error al guardar el post")
    }
  }

  async function handleSaveRoadmap() {
    if (!roadmapResult || !businessId) return
    try {
      await saveRoadmap({
        businessId,
        goal,
        titulo: roadmapResult.titulo,
        dias: roadmapResult.dias,
        consejosGenerales: roadmapResult.consejosGenerales,
      })
      setSuccessMsg("¡Roadmap guardado exitosamente!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err: any) {
      setError(err.message || "Error al guardar el roadmap")
    }
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text)
    setSuccessMsg("¡Copiado al portapapeles!")
    setTimeout(() => setSuccessMsg(""), 2000)
  }

  async function handleDelete(id: any) {
    if (confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      await deleteContent({ id })
    }
  }

  function downloadImage(imageUrl: string, filename: string = "imagen-marketing.jpg") {
    const a = document.createElement("a")
    a.href = imageUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Render components
  const renderGoalSelector = () => (
    <div className="card-apple mb-4">
      <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.374px' }}>
        ¿Cuál es tu objetivo?
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {GOALS.map((g) => (
          <button
            key={g.value}
            onClick={() => setGoal(g.value)}
            style={{
              textAlign: 'left', padding: '10px 12px',
              borderRadius: '11px', border: `1.5px solid ${goal === g.value ? '#0066cc' : '#e0e0e0'}`,
              background: goal === g.value ? '#e8f1fb' : '#fff',
              cursor: 'pointer', transition: 'all 120ms ease-out',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: 600, color: goal === g.value ? '#0058b3' : '#1d1d1f', marginBottom: '2px', letterSpacing: '-0.224px' }}>
              {g.label}
            </p>
            <p style={{ fontSize: '11px', color: goal === g.value ? '#0066cc' : '#7a7a7a', letterSpacing: '-0.12px' }}>
              {g.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )

  const renderContextInput = () => (
    <div className="card-apple">
      <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.374px' }}>
        ¿Qué producto deseas promocionar?
      </h3>
      {products === undefined ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7a7a7a', fontSize: '13px' }}>
          <Loader2 size={14} className="animate-spin" /> Cargando productos...
        </div>
      ) : products.length === 0 ? (
        <p style={{ fontSize: '13px', color: '#ef4444' }}>No tienes productos creados. Ve a la pestaña de Productos para crear uno primero.</p>
      ) : (
        <select
          value={selectedProductId}
          onChange={e => setSelectedProductId(e.target.value)}
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '11px',
            border: '1px solid #e0e0e0', background: '#fff',
            fontSize: '14px', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
            letterSpacing: '-0.224px', color: '#1d1d1f',
            outline: 'none', cursor: 'pointer'
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.12)' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <option value="" disabled>Selecciona un producto de tu catálogo</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>{p.name} - {formatPrice(p.price)}</option>
          ))}
        </select>
      )}
    </div>
  )

  const renderMessages = () => (
    <>
      {error && (
        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '14px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {successMsg && (
        <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '12px', borderRadius: '8px', fontSize: '14px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} /> {successMsg}
        </div>
      )}
    </>
  )

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Marketing con IA
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Crea publicaciones e imágenes profesionales, planifica tu estrategia y guarda tus favoritos.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab("post")}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            borderRadius: '999px', fontSize: '14px', fontWeight: 600,
            background: activeTab === "post" ? '#1d1d1f' : '#f5f5f7',
            color: activeTab === "post" ? '#fff' : '#7a7a7a',
            border: 'none', cursor: 'pointer', transition: 'all 200ms',
          }}
        >
          <ImageIcon size={18} /> Crear Post
        </button>
        <button
          onClick={() => setActiveTab("roadmap")}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            borderRadius: '999px', fontSize: '14px', fontWeight: 600,
            background: activeTab === "roadmap" ? '#1d1d1f' : '#f5f5f7',
            color: activeTab === "roadmap" ? '#fff' : '#7a7a7a',
            border: 'none', cursor: 'pointer', transition: 'all 200ms',
          }}
        >
          <Map size={18} /> Crear Roadmap
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            borderRadius: '999px', fontSize: '14px', fontWeight: 600,
            background: activeTab === "saved" ? '#1d1d1f' : '#f5f5f7',
            color: activeTab === "saved" ? '#fff' : '#7a7a7a',
            border: 'none', cursor: 'pointer', transition: 'all 200ms',
          }}
        >
          <Bookmark size={18} /> Guardados
        </button>
      </div>

      {/* --- TAB: POST --- */}
      {activeTab === "post" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 fade-in">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {renderGoalSelector()}
            {renderContextInput()}
            {renderMessages()}
            <button
              onClick={handleGeneratePost}
              disabled={!selectedProductId || isLoading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '16px' }}
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Generando Post e Imagen...</> : "Generar Post"}
            </button>
          </div>

          <div className="card-apple" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
              <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f' }}>Resultado del Post</h3>
              {postResult && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => copyText(`${postResult.texto}\n\n${postResult.cta}\n\n${postResult.hashtags?.join(" ")}`)} className="btn-dark" style={{ padding: '6px 12px', fontSize: '13px' }}>
                    <Copy size={14} /> Copiar
                  </button>
                  <button onClick={handleSavePost} className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                    <Save size={14} /> Guardar
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Loader2 size={32} className="animate-spin text-blue-500 mb-4" />
                  <p style={{ color: '#7a7a7a', fontSize: '14px' }}>Generando texto e imagen con IA...</p>
                </div>
              ) : postResult ? (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {postResult.imageUrl && (
                    <div style={{ borderRadius: '11px', overflow: 'hidden', border: '1px solid #e0e0e0', background: '#f5f5f7', position: 'relative' }}>
                      <img src={postResult.imageUrl} alt="AI Generated" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                      <button 
                        onClick={() => downloadImage(postResult.imageUrl)}
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#1d1d1f', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      >
                        <Download size={14} /> Descargar
                      </button>
                    </div>
                  )}
                  <div style={{ background: '#f5f5f7', borderRadius: '11px', padding: '20px', border: '1px solid #e0e0e0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0066cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>P</div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f' }}>Post de Instagram</p>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: 1.6, color: '#1d1d1f' }}>{postResult.texto}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Call to action</p>
                    <div style={{ background: '#e8f1fb', borderRadius: '11px', padding: '14px', border: '1px solid #c5d9f0' }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#0058b3' }}>{postResult.cta}</p>
                    </div>
                  </div>
                  {postResult.hashtags?.length > 0 && (
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Hashtags</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {postResult.hashtags.map((tag: string) => (
                          <span key={tag} style={{ background: '#e8f1fb', color: '#0066cc', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '9999px', border: '1px solid #c5d9f0' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <ImageIcon size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                  <p style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '17px', marginBottom: '4px' }}>Aún no hay post</p>
                  <p style={{ fontSize: '14px', color: '#7a7a7a' }}>Completa el formulario y genera tu post e imagen.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: ROADMAP --- */}
      {activeTab === "roadmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 fade-in">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {renderGoalSelector()}
            {renderContextInput()}
            {renderMessages()}
            <button
              onClick={handleGenerateRoadmap}
              disabled={!selectedProductId || isLoading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '16px', background: '#8b5cf6', borderColor: '#8b5cf6' }}
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Generando Roadmap...</> : "Generar Roadmap Estratégico"}
            </button>
          </div>

          <div className="card-apple" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
              <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f' }}>Roadmap de 7 días</h3>
              {roadmapResult && (
                <button onClick={handleSaveRoadmap} className="btn-primary" style={{ padding: '6px 12px', fontSize: '13px', background: '#8b5cf6', borderColor: '#8b5cf6' }}>
                  <Save size={14} /> Guardar Plan
                </button>
              )}
            </div>
            
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto', maxHeight: '70vh' }}>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Loader2 size={32} className="animate-spin text-purple-500 mb-4" />
                  <p style={{ color: '#7a7a7a', fontSize: '14px' }}>Planificando tu estrategia de contenido...</p>
                </div>
              ) : roadmapResult ? (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f' }}>{roadmapResult.titulo}</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {roadmapResult.dias?.map((dia: any) => (
                      <div key={dia.dia} style={{ background: '#f5f5f7', borderRadius: '11px', padding: '16px', border: '1px solid #e0e0e0', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '16px', background: '#8b5cf6', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
                          Día {dia.dia}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f' }}>{dia.tipo}</span>
                          <span style={{ fontSize: '12px', color: '#7a7a7a', background: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>{dia.hora}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', textTransform: 'uppercase', marginBottom: '4px' }}>Qué mostrar (Visual)</p>
                            <p style={{ fontSize: '13px', color: '#1d1d1f', lineHeight: 1.5 }}>{dia.descripcionVisual}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', textTransform: 'uppercase', marginBottom: '4px' }}>Texto sugerido (Caption)</p>
                            <p style={{ fontSize: '13px', color: '#1d1d1f', lineHeight: 1.5, background: '#fff', padding: '10px', borderRadius: '8px', border: '1px dashed #e0e0e0' }}>{dia.caption}</p>
                          </div>
                          <div style={{ background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '10px', borderRadius: '8px' }}>
                            <p style={{ fontSize: '12px', color: '#86198f', fontWeight: 500 }}>💡 Tip: {dia.tip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {roadmapResult.consejosGenerales && (
                    <div style={{ background: '#e0e7ff', borderRadius: '11px', padding: '16px', border: '1px solid #c7d2fe', marginTop: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#3730a3', textTransform: 'uppercase', marginBottom: '8px' }}>Consejos Generales de la Campaña</p>
                      <p style={{ fontSize: '14px', color: '#312e81', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{roadmapResult.consejosGenerales}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <Map size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                  <p style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '17px', marginBottom: '4px' }}>Crea tu plan de acción</p>
                  <p style={{ fontSize: '14px', color: '#7a7a7a' }}>Te daremos el paso a paso de qué subir y cuándo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: SAVED CONTENT --- */}
      {activeTab === "saved" && (
        <div className="fade-in">
          <div className="card-apple mb-8">
            <h3 style={{ fontWeight: 600, fontSize: '18px', color: '#1d1d1f', marginBottom: '20px' }}>Posts de Instagram Guardados</h3>
            
            {savedPosts === undefined ? (
               <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 size={24} className="animate-spin text-gray-400" /></div>
            ) : savedPosts.length === 0 ? (
              <p style={{ color: '#7a7a7a', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No hay posts guardados.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedPosts.map((post) => (
                  <div key={post._id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '16px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#0066cc', background: '#e8f1fb', padding: '4px 8px', borderRadius: '4px' }}>Post</span>
                      <button onClick={() => handleDelete(post._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    {post.imageUrl && (
                      <div style={{ width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', background: '#f5f5f7', position: 'relative' }}>
                        <img src={post.imageUrl} alt="Saved" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          onClick={() => downloadImage(post.imageUrl)}
                          style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#1d1d1f', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                          title="Descargar imagen"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    )}
                    <p style={{ fontSize: '13px', color: '#1d1d1f', lineClamp: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '12px', flex: 1 }}>{post.texto}</p>
                    <button onClick={() => copyText(`${post.texto}\n\n${post.cta}\n\n${post.hashtags?.join(" ")}`)} className="btn-dark" style={{ width: '100%', fontSize: '12px', padding: '8px' }}>
                      Copiar Contenido
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '18px', color: '#1d1d1f', marginBottom: '20px' }}>Roadmaps Guardados</h3>
            
            {savedRoadmaps === undefined ? (
               <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 size={24} className="animate-spin text-gray-400" /></div>
            ) : savedRoadmaps.length === 0 ? (
              <p style={{ color: '#7a7a7a', fontSize: '14px', textAlign: 'center', padding: '20px' }}>No hay roadmaps guardados.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {savedRoadmaps.map((roadmap) => (
                  <div key={roadmap._id} style={{ border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', background: '#fff' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#8b5cf6', background: '#f3e8ff', padding: '4px 8px', borderRadius: '4px' }}>Roadmap</span>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1d1d1f', margin: 0 }}>{roadmap.titulo}</h4>
                      </div>
                      <button onClick={() => handleDelete(roadmap._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {roadmap.dias?.map((dia: any) => (
                        <div key={dia.dia} style={{ minWidth: '200px', background: '#f5f5f7', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '12px' }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: '#8b5cf6', marginBottom: '4px' }}>Día {dia.dia}</p>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '4px' }}>{dia.tipo}</p>
                          <p style={{ fontSize: '11px', color: '#7a7a7a', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dia.descripcionVisual}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

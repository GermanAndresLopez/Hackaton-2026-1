"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"

type ContentType = "instagram" | "facebook" | "slogan" | "campaign" | "copy"
type Goal = "lanzamiento" | "promocion" | "urgencia" | "fidelizacion"

const CONTENT_TYPES = [
  { value: "instagram" as ContentType, label: "Post Instagram" },
  { value: "facebook" as ContentType, label: "Post Facebook" },
  { value: "slogan" as ContentType, label: "Slogan de marca" },
  { value: "campaign" as ContentType, label: "Campaña completa" },
  { value: "copy" as ContentType, label: "Copy de venta" },
]

const GOALS: { value: Goal; label: string; description: string }[] = [
  { value: "lanzamiento", label: "Lanzamiento", description: "Dar a conocer un nuevo producto" },
  { value: "promocion", label: "Promoción", description: "Descuento o precio especial" },
  { value: "urgencia", label: "Urgencia", description: "Stock limitado o fecha límite" },
  { value: "fidelizacion", label: "Fidelización", description: "Premiar clientes frecuentes" },
]

const EXAMPLE_RESULT = {
  texto: "🍫 Brownies recién horneados con el equilibrio perfecto entre suavidad y chocolate intenso.\n\n🔥 Promoción de lanzamiento:\nCompra 2 y recibe envío gratis este fin de semana.\n\n¡Pide el tuyo ahora! 👇",
  cta: "¡Escríbenos ya y recibe tu pedido hoy!",
  hashtags: ["#Brownies", "#Chocolate", "#Artesanal", "#Repostería", "#AntojosDulces"],
}

export default function MarketingPage() {
  const [contentType, setContentType] = useState<ContentType>("instagram")
  const [goal, setGoal] = useState<Goal>("lanzamiento")
  const [product, setProduct] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<typeof EXAMPLE_RESULT | null>(null)
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!product.trim()) return
    setIsLoading(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 2500))
    setResult(EXAMPLE_RESULT)
    setIsLoading(false)
  }

  async function copyAll() {
    if (!result) return
    const text = `${result.texto}\n\n${result.cta}\n\n${result.hashtags.join(" ")}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Marketing con IA
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Crea publicidad profesional para tus redes en segundos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Content type */}
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.374px' }}>
              ¿Qué quieres generar?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setContentType(type.value)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 14px',
                    borderRadius: '11px', border: `1.5px solid ${contentType === type.value ? '#0066cc' : '#e0e0e0'}`,
                    background: contentType === type.value ? '#e8f1fb' : '#fff',
                    color: contentType === type.value ? '#0058b3' : '#1d1d1f',
                    fontSize: '14px', fontWeight: contentType === type.value ? 600 : 400,
                    cursor: 'pointer', transition: 'all 120ms ease-out', letterSpacing: '-0.224px',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div className="card-apple">
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

          {/* Product input */}
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.374px' }}>
              ¿Qué estás vendiendo?
            </h3>
            <textarea
              value={product}
              onChange={e => setProduct(e.target.value)}
              placeholder="Ej: Vendo brownies artesanales de chocolate. Son recién horneados cada día y los entrego el mismo día..."
              rows={4}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '11px',
                border: '1px solid #e0e0e0', background: '#fff',
                fontSize: '14px', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.224px', color: '#1d1d1f',
                resize: 'none', outline: 'none', lineHeight: 1.5,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.12)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <button
              onClick={generate}
              disabled={!product.trim() || isLoading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '12px' }}
            >
              {isLoading ? (
                <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Generando con IA...</>
              ) : (
                "Generar marketing"
              )}
            </button>
          </div>
        </div>

        {/* Right panel — result */}
        <div className="card-apple" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>Resultado</h3>
            {result && (
              <button
                onClick={copyAll}
                className="btn-dark"
              >
                {copied ? "✓ Copiado" : "Copiar todo"}
              </button>
            )}
          </div>

          <div style={{ padding: '24px', flex: 1 }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[3/4, 1, 5/6, 2/3, 1/2, 3/4].map((w, i) => (
                  <div key={i} className="skeleton" style={{ height: '16px', width: `${w*100}%` }} />
                ))}
              </div>
            ) : result ? (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Post preview */}
                <div style={{ background: '#f5f5f7', borderRadius: '11px', padding: '20px', border: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0066cc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>B</div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>Brownies de María</p>
                      <p style={{ fontSize: '11px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>Publicación patrocinada</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: 1.6, color: '#1d1d1f', letterSpacing: '-0.224px' }}>{result.texto}</p>
                </div>

                {/* CTA */}
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Call to action</p>
                  <div style={{ background: '#e8f1fb', borderRadius: '11px', padding: '14px 16px', border: '1px solid #c5d9f0' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0058b3', letterSpacing: '-0.224px' }}>{result.cta}</p>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Hashtags</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {result.hashtags.map((tag) => (
                      <span key={tag} style={{ background: '#e8f1fb', color: '#0066cc', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '9999px', border: '1px solid #c5d9f0', letterSpacing: '-0.12px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                  <button onClick={generate} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '14px' }}>
                    Regenerar
                  </button>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '14px' }}>
                    Crear banner
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ height: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Sparkles size={48} style={{ color: '#0066cc', marginBottom: '16px' }} />
                <p style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '17px', marginBottom: '4px', letterSpacing: '-0.374px' }}>Tu contenido aparecerá aquí</p>
                <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>Completa el formulario y presiona generar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent history */}
      <div className="card-apple" style={{ marginTop: '20px' }}>
        <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '16px', letterSpacing: '-0.374px' }}>
          Generado recientemente
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { type: "Post Instagram", product: "Brownies de chocolate", date: "Hace 2 horas" },
            { type: "Slogan", product: "Café artesanal premium", date: "Hace 1 día" },
            { type: "Campaña completa", product: "Cupcakes personalizados", date: "Hace 2 días" },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: '11px', transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>{item.type}</span>
                <span style={{ color: '#e0e0e0' }}>·</span>
                <span style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>{item.product}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{item.date}</span>
                <button style={{ fontSize: '12px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px' }}>Ver →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

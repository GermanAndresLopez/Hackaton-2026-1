"use client"

import { useState, useRef } from "react"

type ImageStyle = "ubereats" | "instagram" | "banner" | "fondo_blanco"

const STYLES: { value: ImageStyle; label: string; description: string }[] = [
  { value: "ubereats", label: "Food delivery", description: "Estilo UberEats / Rappi" },
  { value: "instagram", label: "Instagram post", description: "Cuadrado con texto" },
  { value: "banner", label: "Banner promo", description: "Horizontal con marca" },
  { value: "fondo_blanco", label: "Fondo blanco", description: "Producto limpio" },
]

export default function ImagenesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [style, setStyle] = useState<ImageStyle>("ubereats")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  async function enhance() {
    if (!selectedFile) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 3000))
    const prompt = `professional food photography, ${description || "delicious product"}, style: ${style}, white background, studio lighting, commercial photography`
    setResult(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`)
    setIsLoading(false)
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Mejorador de Imágenes IA
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Convierte fotos caseras en publicidad profesional
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Upload */}
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.374px' }}>
              Sube tu foto
            </h3>
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #e0e0e0', borderRadius: '11px', padding: '32px',
                textAlign: 'center', cursor: 'pointer', transition: 'all 120ms ease-out',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0066cc'; (e.currentTarget as HTMLElement).style.background = '#e8f1fb' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e0e0e0'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '8px' }} />
              ) : (
                <>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', marginBottom: '4px', letterSpacing: '-0.224px' }}>
                    Arrastra tu foto aquí
                  </p>
                  <p style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>o haz clic para seleccionar</p>
                  <p style={{ fontSize: '11px', color: '#7a7a7a', marginTop: '8px', letterSpacing: '-0.12px' }}>JPG, PNG, WEBP · Máx 10MB</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            {preview && (
              <button
                onClick={() => { setPreview(null); setSelectedFile(null); setResult(null) }}
                style={{ marginTop: '10px', fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'center', letterSpacing: '-0.12px' }}
              >
                Eliminar foto
              </button>
            )}
          </div>

          {/* Style selector */}
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.374px' }}>
              Elige el estilo
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  style={{
                    textAlign: 'left', padding: '12px 14px', borderRadius: '11px',
                    border: `1.5px solid ${style === s.value ? '#0066cc' : '#e0e0e0'}`,
                    background: style === s.value ? '#e8f1fb' : '#fff',
                    cursor: 'pointer', transition: 'all 120ms ease-out',
                  }}
                >
                  <p style={{ fontSize: '13px', fontWeight: 600, color: style === s.value ? '#0058b3' : '#1d1d1f', marginBottom: '2px', letterSpacing: '-0.224px' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '11px', color: style === s.value ? '#0066cc' : '#7a7a7a', letterSpacing: '-0.12px' }}>
                    {s.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Description + CTA */}
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '4px', letterSpacing: '-0.374px' }}>
              Describe tu producto <span style={{ color: '#7a7a7a', fontWeight: 400 }}>(opcional)</span>
            </h3>
            <p style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '12px', letterSpacing: '-0.12px' }}>
              Ayuda a la IA a generar una imagen más precisa
            </p>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ej: Brownie de chocolate belga con nueces, recién horneado..."
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '11px',
                border: '1px solid #e0e0e0', background: '#fff',
                fontSize: '14px', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.224px', color: '#1d1d1f',
                resize: 'none', outline: 'none', lineHeight: 1.5,
              }}
            />
            <button
              onClick={enhance}
              disabled={!selectedFile || isLoading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '12px' }}
            >
              {isLoading ? (
                <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Mejorando imagen...</>
              ) : (
                "Mejorar imagen con IA"
              )}
            </button>
          </div>
        </div>

        {/* Right — result */}
        <div className="card-apple" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>Imagen mejorada</h3>
            {result && (
              <a href={result} download="imagen-mejorada.jpg" target="_blank"
                className="btn-dark">
                Descargar
              </a>
            )}
          </div>
          <div style={{ padding: '24px', flex: 1 }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '280px', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid #e0e0e0', borderTopColor: '#0066cc', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '15px', letterSpacing: '-0.374px' }}>Mejorando tu imagen...</p>
                  <p style={{ fontSize: '13px', color: '#7a7a7a', marginTop: '4px', letterSpacing: '-0.224px' }}>La IA está trabajando · ~10 segundos</p>
                </div>
              </div>
            ) : result ? (
              <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="Imagen mejorada por IA" style={{ width: '100%', borderRadius: '11px', border: '1px solid #e0e0e0' }} loading="lazy" />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={enhance} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '14px' }}>
                    Regenerar
                  </button>
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '14px' }}>
                    Generar marketing
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ height: '280px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>▣</div>
                <p style={{ fontWeight: 600, color: '#1d1d1f', fontSize: '17px', marginBottom: '4px', letterSpacing: '-0.374px' }}>
                  La imagen mejorada aparecerá aquí
                </p>
                <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>Sube una foto y selecciona el estilo</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"

const INPUT_STYLE = {
  width: '100%', padding: '10px 14px', borderRadius: '11px',
  border: '1px solid #e0e0e0', background: '#fff',
  fontSize: '14px', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
  letterSpacing: '-0.224px', color: '#1d1d1f', outline: 'none',
} as const

export default function BotPage() {
  const [botToken, setBotToken] = useState("")
  const [tone, setTone] = useState("amigable")
  const [faqs, setFaqs] = useState([
    { question: "¿Cuáles son los horarios de atención?", answer: "Atendemos de lunes a sábado de 8am a 6pm." },
    { question: "¿Hacen domicilios?", answer: "Sí, hacemos domicilios en toda la ciudad con un costo adicional de $5.000." },
  ])
  const [newQ, setNewQ] = useState("")
  const [newA, setNewA] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function addFaq() {
    if (!newQ.trim() || !newA.trim()) return
    setFaqs(prev => [...prev, { question: newQ, answer: newA }])
    setNewQ("")
    setNewA("")
  }

  async function connect() {
    if (!botToken.trim()) return
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    setIsConnected(true)
    setIsSaving(false)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Bot de Atención · Telegram
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Tu asistente automático que responde clientes 24/7
        </p>
      </div>

      {/* Status */}
      <div style={{
        borderRadius: '18px', padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: '16px',
        background: isConnected ? '#d1fae5' : '#f5f5f7',
        border: `1px solid ${isConnected ? '#6ee7b7' : '#e0e0e0'}`,
        marginBottom: '20px',
      }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', background: isConnected ? '#a7f3d0' : '#e0e0e0', flexShrink: 0 }}>
          🤖
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>
            {isConnected ? "Bot activo y respondiendo" : "Bot no conectado"}
          </p>
          <p style={{ fontSize: '13px', color: '#7a7a7a', marginTop: '2px', letterSpacing: '-0.224px' }}>
            {isConnected ? "Tu bot está respondiendo clientes en Telegram" : "Conecta tu bot para automatizar la atención"}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#22c55e' : '#9ca3af', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: isConnected ? '#065f46' : '#7a7a7a', letterSpacing: '-0.224px' }}>
            {isConnected ? "En línea" : "Desconectado"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left — config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Telegram token */}
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '4px', letterSpacing: '-0.374px' }}>
              Conectar con Telegram
            </h3>
            <p style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '14px', letterSpacing: '-0.12px' }}>
              Crea un bot con @BotFather y pega el token aquí
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                value={botToken}
                onChange={e => setBotToken(e.target.value)}
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                style={{ ...INPUT_STYLE, fontFamily: 'monospace', fontSize: '13px' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none' }}
              />
              <button
                onClick={connect}
                disabled={!botToken.trim() || isSaving}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}
              >
                {isSaving ? (
                  <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Conectando...</>
                ) : "Conectar bot"}
              </button>
            </div>
            <a href="https://t.me/botfather" target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', marginTop: '10px', fontSize: '12px', color: '#0066cc', letterSpacing: '-0.12px', textDecoration: 'none' }}>
              ¿No tienes un bot? Crea uno gratis con @BotFather →
            </a>
          </div>

          {/* Tone */}
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '14px', letterSpacing: '-0.374px' }}>
              Tono del bot
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { value: "amigable", label: "Amigable y cercano", description: "Cálido, como un amigo" },
                { value: "profesional", label: "Profesional", description: "Formal y confiable" },
                { value: "divertido", label: "Divertido", description: "Energético con emojis" },
              ].map(t => (
                <label key={t.value} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '11px', border: `1.5px solid ${tone === t.value ? '#0066cc' : '#e0e0e0'}`, background: tone === t.value ? '#e8f1fb' : '#fff', transition: 'all 120ms ease-out' }}>
                  <input type="radio" name="tone" value={t.value} checked={tone === t.value} onChange={() => setTone(t.value)} style={{ position: 'absolute', opacity: 0 }} />
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${tone === t.value ? '#0066cc' : '#e0e0e0'}`, background: tone === t.value ? '#0066cc' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {tone === t.value && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: tone === t.value ? 600 : 400, color: tone === t.value ? '#0058b3' : '#1d1d1f', letterSpacing: '-0.224px' }}>{t.label}</p>
                    <p style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>{t.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right — FAQs */}
        <div className="card-apple" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>Preguntas frecuentes</h3>
            <p style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '4px', letterSpacing: '-0.12px' }}>El bot responderá estas preguntas automáticamente</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#f5f5f7', borderRadius: '11px', padding: '12px 14px', position: 'relative' }}
                className="group"
              >
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d1d1f', marginBottom: '4px', letterSpacing: '-0.224px' }}>
                  {faq.question}
                </p>
                <p style={{ fontSize: '13px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>{faq.answer}</p>
                <button
                  onClick={() => setFaqs(f => f.filter((_, idx) => idx !== i))}
                  style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', opacity: 0, transition: 'opacity 120ms' }}
                  className="group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Agregar pregunta
            </p>
            <input
              value={newQ}
              onChange={e => setNewQ(e.target.value)}
              placeholder="Ej: ¿Hacen descuentos por cantidad?"
              style={INPUT_STYLE}
              onFocus={e => { e.currentTarget.style.borderColor = '#0066cc' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0' }}
            />
            <textarea
              value={newA}
              onChange={e => setNewA(e.target.value)}
              placeholder="Respuesta del bot..."
              rows={2}
              style={{ ...INPUT_STYLE, resize: 'none' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0066cc' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0' }}
            />
            <button
              onClick={addFaq}
              disabled={!newQ.trim() || !newA.trim()}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '14px' }}
            >
              + Agregar FAQ
            </button>
          </div>
        </div>
      </div>

      {/* Bot preview */}
      <div className="card-apple" style={{ marginTop: '20px' }}>
        <h3 style={{ fontWeight: 600, fontSize: '17px', color: '#1d1d1f', marginBottom: '16px', letterSpacing: '-0.374px' }}>
          Vista previa del bot
        </h3>
        <div style={{ background: '#1c2733', borderRadius: '11px', padding: '16px', maxWidth: '340px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🤖</div>
            <div>
              <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.224px' }}>Asistente IA</p>
              <p style={{ color: '#667781', fontSize: '12px', letterSpacing: '-0.12px' }}>Bot activo</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: '#202c33', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', maxWidth: '85%' }}>
              <p style={{ color: '#fff', fontSize: '13px', lineHeight: 1.5, letterSpacing: '-0.224px' }}>¡Hola! 👋 Soy el asistente de tu negocio. ¿En qué te puedo ayudar?</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ background: '#005c4b', borderRadius: '12px 12px 4px 12px', padding: '10px 14px', maxWidth: '85%' }}>
                <p style={{ color: '#fff', fontSize: '13px', letterSpacing: '-0.224px' }}>¿Hacen domicilios?</p>
              </div>
            </div>
            <div style={{ background: '#202c33', borderRadius: '12px 12px 12px 4px', padding: '10px 14px', maxWidth: '85%' }}>
              <p style={{ color: '#fff', fontSize: '13px', lineHeight: 1.5, letterSpacing: '-0.224px' }}>Sí, hacemos domicilios en toda la ciudad con un costo adicional de $5.000. 🛵</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

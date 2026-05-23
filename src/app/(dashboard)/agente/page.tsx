"use client"

import { useState, useRef, useEffect } from "react"

type Message = { role: "user" | "assistant"; content: string; timestamp: Date }

const QUICK_PROMPTS = [
  "¿Cómo consigo mis primeros 10 clientes?",
  "Ideas para vender más los fines de semana",
  "¿Qué precio debo poner a mis brownies?",
  "Crea un nombre para mi negocio de ropa",
  "¿Cómo hago publicidad sin gastar mucho?",
  "Estrategia para Instagram",
]

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Hola 👋 Soy tu Agente de Negocios IA.\n\nEstoy aquí para ayudarte a hacer crecer tu negocio. Puedo darte ideas, estrategias, consejos de ventas, branding y mucho más.\n\n¿En qué te puedo ayudar hoy?",
  timestamp: new Date(),
}

export default function AgentePage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return

    const userMsg: Message = { role: "user", content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 1500))

    const aiMsg: Message = {
      role: "assistant",
      content: "¡Excelente pregunta! Para conseguir tus primeros 10 clientes, te recomiendo:\n\n**1. Tu círculo cercano primero** 👥\nComienza con familia y amigos. Pídeles que prueben tu producto y te den feedback honesto.\n\n**2. Grupos de WhatsApp y Telegram** 📱\nPublica en grupos locales de tu ciudad o barrio.\n\n**3. Ofrece tu primer lote a precio especial** 🏷️\nDa un descuento de lanzamiento del 20-30% para los primeros compradores.\n\n**4. Instagram con stories** 📸\nComparte el proceso de elaboración. La gente ama ver cómo se hace lo que compra.\n\n¿Quieres que profundice en alguno de estos puntos?",
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMsg])
    setIsLoading(false)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Agente IA de Negocios
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Tu asesor comercial inteligente disponible 24/7
        </p>
      </div>

      <div className="card-apple" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: '520px' }}>
        {/* Chat header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            💡
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f', letterSpacing: '-0.224px' }}>Agente de Negocios</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e' }} />
              <p style={{ fontSize: '11px', color: '#7a7a7a', letterSpacing: '-0.12px' }}>En línea · Powered by Groq</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: msg.role === "assistant" ? '#0066cc' : '#f5f5f7',
                border: msg.role === "user" ? '1px solid #e0e0e0' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
              }}>
                {msg.role === "assistant" ? "💡" : "👤"}
              </div>
              <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  padding: '12px 16px', borderRadius: msg.role === "user" ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                  background: msg.role === "user" ? '#0066cc' : '#f5f5f7',
                  border: msg.role === "user" ? 'none' : '1px solid #e0e0e0',
                  color: msg.role === "user" ? '#fff' : '#1d1d1f',
                  fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-line',
                  letterSpacing: '-0.224px',
                }}>
                  {msg.content}
                </div>
                <p style={{ fontSize: '11px', color: '#7a7a7a', padding: '0 4px', letterSpacing: '-0.12px' }}>
                  {msg.timestamp.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0066cc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                💡
              </div>
              <div style={{ background: '#f5f5f7', border: '1px solid #e0e0e0', padding: '12px 16px', borderRadius: '4px 18px 18px 18px' }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '16px' }}>
                  {[0, 150, 300].map((delay) => (
                    <div key={delay} style={{ width: '7px', height: '7px', background: '#7a7a7a', borderRadius: '50%', animation: 'bounce 1.2s infinite', animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div style={{ padding: '12px 24px', borderTop: '1px solid #e0e0e0' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#7a7a7a', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Preguntas rápidas
            </p>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    flexShrink: 0, fontSize: '12px', fontWeight: 400,
                    color: '#0066cc', background: '#e8f1fb',
                    border: '1px solid #c5d9f0', padding: '6px 14px',
                    borderRadius: '9999px', cursor: 'pointer', letterSpacing: '-0.12px',
                    transition: 'background 120ms',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e0e0e0' }}>
          <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} style={{ display: 'flex', gap: '10px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Escríbele a tu agente de negocios..."
              disabled={isLoading}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '9999px',
                border: '1px solid #e0e0e0', background: '#fff',
                fontSize: '14px', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.224px', color: '#1d1d1f', outline: 'none',
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0066cc' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-primary"
              style={{ padding: '12px 20px', fontSize: '16px' }}
            >
              →
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

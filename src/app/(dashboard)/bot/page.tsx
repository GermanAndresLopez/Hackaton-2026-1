"use client"

import { useState, useEffect } from "react"
import { Bot, X } from "lucide-react"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

const INPUT_STYLE = {
  width: '100%', padding: '10px 14px', borderRadius: '11px',
  border: '1px solid #e0e0e0', background: '#fff',
  fontSize: '14px', fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
  letterSpacing: '-0.224px', color: '#1d1d1f', outline: 'none',
} as const

export default function BotPage() {
  const currentBusiness = useBusinessStore((state) => state.currentBusiness)
  const businessId = currentBusiness?._id

  // Fetch updated business data directly to keep it in sync
  const businessData = useQuery(api.businesses.getById, businessId ? { id: businessId } : "skip")
  const updateBusiness = useMutation(api.businesses.updateBusiness)

  const [botToken, setBotToken] = useState("")
  const [botContext, setBotContext] = useState("")
  const [tone, setTone] = useState("amigable")
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form
  useEffect(() => {
    if (businessData) {
      setBotToken(businessData.botToken || "")
      setBotContext(businessData.botContext || "")
      setTone(businessData.tone || "amigable")
      setIsConnected(!!businessData.botToken)
    }
  }, [businessData])

  async function saveConfig() {
    if (!businessId) return
    setIsSaving(true)
    
    try {
      await updateBusiness({
        id: businessId,
        updates: {
          botToken: botToken.trim() || undefined,
          botContext: botContext.trim() || undefined,
        }
      })
      
      // Aquí se podría también llamar un action para registrar el webhook con Telegram
      
      setIsConnected(!!botToken.trim())
    } catch (err) {
      console.error("Error al guardar config del bot:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Bot de Atención · Telegram con IA
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Configura a tu agente inteligente con el contexto de tu negocio.
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
        <div style={{ width: '48px', height: '48px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isConnected ? '#a7f3d0' : '#e0e0e0', flexShrink: 0 }}>
          <Bot size={24} style={{ color: isConnected ? '#065f46' : '#7a7a7a' }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', letterSpacing: '-0.374px' }}>
            {isConnected ? "Agente IA activo" : "Agente IA no conectado"}
          </p>
          <p style={{ fontSize: '13px', color: '#7a7a7a', marginTop: '2px', letterSpacing: '-0.224px' }}>
            {isConnected ? "Tu IA está respondiendo clientes en Telegram" : "Conecta tu bot para automatizar la atención"}
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
              Token de Telegram
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

        {/* Right — Context & Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-apple">
            <h3 style={{ fontWeight: 600, fontSize: '15px', color: '#1d1d1f', marginBottom: '4px', letterSpacing: '-0.374px' }}>
              Contexto e Instrucciones para la IA
            </h3>
            <p style={{ fontSize: '12px', color: '#7a7a7a', marginBottom: '14px', letterSpacing: '-0.12px' }}>
              Explícale al Agente de qué trata tu negocio, los horarios, precios, políticas y cómo debe responder.
            </p>
            <textarea
              value={botContext}
              onChange={e => setBotContext(e.target.value)}
              placeholder="Ej: Somos una pizzería artesanal. Atendemos de 5pm a 10pm. Los domicilios cuestan $3000..."
              rows={8}
              style={{ ...INPUT_STYLE, resize: 'vertical' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.12)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          <button
            onClick={saveConfig}
            disabled={isSaving}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
          >
            {isSaving ? (
              <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Guardando configuración...</>
            ) : "Guardar Configuración y Activar"}
          </button>
        </div>
      </div>
    </div>
  )
}

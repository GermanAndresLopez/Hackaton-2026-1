"use client"

import { useState, useEffect } from "react"
import { Bot, X, MessageSquare, Send, CheckCircle, AlertCircle, ExternalLink, ShieldAlert } from "lucide-react"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useMutation, useQuery, useAction } from "convex/react"
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
  const registerWebhook = useAction(api.telegram.registerTelegramWebhook)
  const sendManualMessage = useAction(api.telegram.sendManualMessage)
  const setResolvedStatus = useMutation(api.conversations.setResolvedStatus)
  
  // Real-time conversations list
  const conversations = useQuery(api.conversations.listByBusiness, businessId ? { businessId } : "skip")

  const [botToken, setBotToken] = useState("")
  const [botContext, setBotContext] = useState("")
  const [tone, setTone] = useState("amigable")
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Webhook registration status banner
  const [webhookStatus, setWebhookStatus] = useState<{ success: boolean; msg: string } | null>(null)
  
  // Selected conversation for manual reply modal
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [isSendingReply, setIsSendingReply] = useState(false)

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
    setWebhookStatus(null)
    
    try {
      // 1. Guardar configuración en Convex, incluyendo 'tone'
      await updateBusiness({
        id: businessId,
        updates: {
          botToken: botToken.trim() || undefined,
          botContext: botContext.trim() || undefined,
          tone: tone,
        }
      })
      
      // 2. Registrar el webhook en Telegram si hay un token
      if (botToken.trim()) {
        try {
          const res = await registerWebhook({ businessId })
          if (res.success) {
            setWebhookStatus({
              success: true,
              msg: "¡Bot conectado y Webhook activado exitosamente en Telegram!",
            })
          }
        } catch (err: any) {
          console.error("Error al registrar el webhook:", err)
          setWebhookStatus({
            success: false,
            msg: `Configuración guardada, pero falló la activación: ${err.message || "Token inválido"}`,
          })
        }
      }
      
      setIsConnected(!!botToken.trim())
    } catch (err) {
      console.error("Error al guardar config del bot:", err)
    } finally {
      setIsSaving(false)
    }
  }

  // Enviar mensaje manual a Telegram desde el dashboard
  async function handleSendReply() {
    if (!businessId || !selectedChat || !replyMessage.trim()) return
    setIsSendingReply(true)
    try {
      await sendManualMessage({
        businessId,
        conversationId: selectedChat._id,
        chatId: selectedChat.customerContact,
        message: replyMessage.trim(),
      })
      setReplyMessage("")
    } catch (err: any) {
      console.error("Error al enviar mensaje manual:", err)
      alert("Error al enviar el mensaje por Telegram: " + (err.message || "Intenta más tarde"))
    } finally {
      setIsSendingReply(false)
    }
  }

  // Encontrar la versión más reciente del chat activo en tiempo real
  const activeChatDetails = conversations?.find((c: any) => c._id === selectedChat?._id) || selectedChat

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '28px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.28px', marginBottom: '4px' }}>
          Bot de Atención · Telegram con IA
        </h2>
        <p style={{ fontSize: '14px', color: '#7a7a7a', letterSpacing: '-0.224px' }}>
          Configura a tu agente inteligente con el catálogo y las instrucciones de tu negocio.
        </p>
      </div>

      {/* Webhook Status Banner */}
      {webhookStatus && (
        <div style={{
          borderRadius: '14px', padding: '12px 18px',
          display: 'flex', alignItems: 'center', gap: '10px',
          background: webhookStatus.success ? '#e8f5e9' : '#ffebee',
          border: `1px solid ${webhookStatus.success ? '#c8e6c9' : '#ffcdd2'}`,
          marginBottom: '20px',
          fontSize: '13px',
          fontWeight: 500,
          color: webhookStatus.success ? '#2e7d32' : '#c62828',
        }}>
          {webhookStatus.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{webhookStatus.msg}</span>
        </div>
      )}

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
            {isConnected ? "Tu IA está respondiendo clientes en Telegram y ofreciendo tus productos" : "Conecta tu bot para automatizar la atención al cliente"}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#22c55e' : '#9ca3af', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: isConnected ? '#065f46' : '#7a7a7a', letterSpacing: '-0.224px' }}>
            {isConnected ? "En línea" : "Desconectado"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ marginBottom: '30px' }}>
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

      {/* ── REAL-TIME CHATS VIEW (Apple Premium Design) ── */}
      <div className="card-apple" style={{ width: '100%', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '16px', width: '100%' }}>
          <div>
            <h3 style={{ fontWeight: 600, fontSize: '18px', color: '#1d1d1f', letterSpacing: '-0.4px' }}>
              Chats Recientes de Telegram
            </h3>
            <p style={{ fontSize: '13px', color: '#7a7a7a', marginTop: '2px' }}>
              Historial de clientes en tiempo real. Los clientes que desean pagar se marcarán con alerta para atención humana.
            </p>
          </div>
        </div>

        {conversations === undefined ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <span style={{ width: '28px', height: '28px', border: '3px solid rgba(0,102,204,0.15)', borderTopColor: '#0066cc', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', border: '1px dashed #e0e0e0', borderRadius: '14px' }}>
            <MessageSquare size={36} style={{ color: '#c0c0c0', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#1d1d1f' }}>Sin conversaciones activas</p>
            <p style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '4px', maxWidth: '320px', margin: '4px auto 0' }}>
              Los chats con tus clientes de Telegram se listarán aquí en tiempo real apenas le escriban a tu bot.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {conversations.map((chat: any) => {
              const lastMsg = chat.messages?.[chat.messages.length - 1]
              const hasAlert = !chat.isResolved

              return (
                <div
                  key={chat._id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: hasAlert ? '#fff9f0' : '#f5f5f7',
                    border: `1px solid ${hasAlert ? '#ffe4cc' : '#ebebeb'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'transform 100ms ease',
                    boxShadow: hasAlert ? '0 4px 12px rgba(255,153,0,0.06)' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#1d1d1f' }}>
                        {chat.customerName || "Cliente"}
                      </span>
                      <span style={{ fontSize: '11px', background: 'rgba(0,102,204,0.08)', color: '#0066cc', padding: '2px 8px', borderRadius: '99px', fontWeight: 500 }}>
                        @{chat.customerContact}
                      </span>
                      
                      {/* State Badge */}
                      {hasAlert ? (
                        <span style={{
                          fontSize: '11px', background: '#ffe8d6', color: '#e65c00',
                          padding: '2px 10px', borderRadius: '99px', fontWeight: 700,
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          border: '1px solid #ffccb3',
                          animation: 'pulse 1.8s infinite',
                        }}>
                          <ShieldAlert size={11} /> Espera Pago 💳
                        </span>
                      ) : (
                        <span style={{
                          fontSize: '11px', background: '#e1f5fe', color: '#0288d1',
                          padding: '2px 8px', borderRadius: '99px', fontWeight: 500,
                          border: '1px solid #b3e5fc',
                        }}>
                          IA Activa 🤖
                        </span>
                      )}
                    </div>
                    
                    <p style={{ fontSize: '13px', color: '#515154', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lastMsg ? lastMsg.content : "Inició conversación"}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => setSelectedChat(chat)}
                      style={{
                        padding: '8px 14px', borderRadius: '9px', background: '#0066cc', color: '#fff',
                        fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <MessageSquare size={13} />
                      {hasAlert ? "Atender cliente" : "Ver chat"}
                    </button>

                    {hasAlert && (
                      <button
                        onClick={async () => {
                          await setResolvedStatus({ id: chat._id, isResolved: true })
                        }}
                        style={{
                          padding: '8px 12px', borderRadius: '9px', background: '#fff', color: '#2e7d32',
                          fontSize: '13px', fontWeight: 600, border: '1px solid #a5d6a7', cursor: 'pointer',
                        }}
                      >
                        Resolver
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── CHAT HISTORY & REPLY DIALOG (iOS Blur Style Modal) ── */}
      {selectedChat && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(20px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
          onClick={() => setSelectedChat(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              height: '80vh',
              maxHeight: '700px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #ebebeb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '16px', color: '#1d1d1f' }}>
                  {activeChatDetails.customerName || "Cliente"}
                </h4>
                <p style={{ fontSize: '12px', color: '#7a7a7a', marginTop: '2px' }}>
                  Chat ID Telegram: @{activeChatDetails.customerContact}
                </p>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: '#f5f5f7',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  color: '#7a7a7a', fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Message Log */}
            <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', background: '#f5f5f7', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeChatDetails.messages?.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#7a7a7a', fontSize: '13px', marginTop: '40px' }}>
                  No hay mensajes registrados en este chat.
                </div>
              ) : (
                activeChatDetails.messages?.map((msg: any, idx: number) => {
                  const isUser = msg.role === "user"
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-start' : 'flex-end',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '10px 14px',
                          borderRadius: isUser ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                          background: isUser ? '#fff' : '#0066cc',
                          color: isUser ? '#1d1d1f' : '#fff',
                          fontSize: '13.5px',
                          lineHeight: 1.45,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          border: isUser ? '1px solid #e2e2e2' : 'none',
                        }}
                      >
                        <p>{msg.content}</p>
                        <span style={{ fontSize: '10px', color: isUser ? '#8e8e93' : 'rgba(255,255,255,0.7)', display: 'block', marginTop: '4px', textAlign: 'right' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Input Reply Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #ebebeb', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Escribe tu respuesta y envíala directamente por Telegram..."
                style={INPUT_STYLE}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendReply()
                }}
                disabled={isSendingReply}
              />
              <button
                onClick={handleSendReply}
                disabled={isSendingReply || !replyMessage.trim()}
                style={{
                  padding: '12px', borderRadius: '11px', background: '#0066cc', color: '#fff',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: replyMessage.trim() ? 1 : 0.6,
                }}
              >
                {isSendingReply ? (
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

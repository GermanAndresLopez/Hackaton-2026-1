"use client"

import { useState, useRef, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import { toast } from "sonner"
import { Send, Bot, User, Phone, CheckCircle2, MessageCircle, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ChatsPage() {
  const currentBusiness = useBusinessStore((s) => s.currentBusiness)
  const conversations = useQuery(api.conversations.listByBusiness, 
    currentBusiness ? { businessId: currentBusiness._id } : "skip"
  )
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const toggleBotStatus = useMutation(api.conversations.toggleBotStatus)
  const sendManualMessage = useMutation(api.telegram.sendManualMessage)

  const selectedChat = conversations?.find((c) => c._id === selectedChatId)

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChat?.messages])

  if (!currentBusiness) return null

  if (conversations === undefined) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const handleToggleBot = async (checked: boolean) => {
    if (!selectedChat) return
    try {
      await toggleBotStatus({ id: selectedChat._id, botEnabled: checked })
      toast.success(`Bot ${checked ? 'encendido' : 'apagado'} para este chat`)
    } catch (error) {
      toast.error("Error al cambiar el estado del bot")
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedChat || !currentBusiness._id) return

    setSending(true)
    try {
      await sendManualMessage({
        businessId: currentBusiness._id,
        conversationId: selectedChat._id,
        chatId: selectedChat.customerContact,
        message: messageInput.trim(),
      })
      setMessageInput("")
      // No necesitamos actualizar el estado del chat porque Convex es reactivo
    } catch (error: any) {
      toast.error(error.message || "Error al enviar mensaje")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl border shadow-sm overflow-hidden fade-in">
      {/* Lado izquierdo: Lista de chats */}
      <div className="w-1/3 border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Bandeja de Entrada
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No tienes conversaciones aún.
            </div>
          ) : (
            <div className="flex flex-col">
              {conversations.map((chat) => {
                const lastMessage = chat.messages[chat.messages.length - 1]
                const isSelected = chat._id === selectedChatId
                
                return (
                  <button
                    key={chat._id}
                    onClick={() => setSelectedChatId(chat._id)}
                    className={`p-4 border-b text-left transition-colors flex flex-col gap-1
                      ${isSelected ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'hover:bg-gray-100 border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {chat.customerName || "Cliente"}
                      </span>
                      {chat.platform === "telegram" && (
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          TG
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {lastMessage ? lastMessage.content : "Sin mensajes"}
                    </div>
                    {!chat.isResolved && (
                      <div className="mt-2 text-xs font-medium text-orange-600 flex items-center gap-1 bg-orange-50 w-fit px-2 py-0.5 rounded">
                        <User className="w-3 h-3" />
                        Requiere atención humana
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lado derecho: Área de chat */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Header del chat */}
            <div className="p-4 border-b flex justify-between items-center bg-white z-10 shadow-sm">
              <div>
                <h3 className="font-semibold text-lg">{selectedChat.customerName || "Cliente"}</h3>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {selectedChat.customerContact}
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
                <div className="flex flex-col items-end mr-1">
                  <span className="text-sm font-medium">Bot IA</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                    {selectedChat.botEnabled !== false ? "Respondiendo" : "Apagado"}
                  </span>
                </div>
                <Switch
                  checked={selectedChat.botEnabled !== false}
                  onCheckedChange={handleToggleBot}
                />
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/30">
              {selectedChat.messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm mt-10">
                  No hay mensajes en esta conversación.
                </div>
              ) : (
                selectedChat.messages.map((msg, idx) => {
                  const isAssistant = msg.role === "assistant"
                  return (
                    <div key={idx} className={`flex ${isAssistant ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[75%] ${isAssistant ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-auto
                          ${isAssistant ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-[15px] leading-relaxed
                          ${isAssistant 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm border'}`}>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                          <div className={`text-[10px] mt-1 text-right ${isAssistant ? 'text-blue-200' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input para mensaje manual */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={
                    selectedChat.botEnabled !== false 
                      ? "Escribe un mensaje (esto apagará el bot)..." 
                      : "Escribe un mensaje al cliente..."
                  }
                  className="flex-1 rounded-full bg-gray-50"
                  disabled={sending}
                />
                <Button 
                  type="submit" 
                  disabled={!messageInput.trim() || sending}
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center shrink-0"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle className="w-16 h-16 text-gray-200 mb-4" />
            <p>Selecciona una conversación para empezar</p>
          </div>
        )}
      </div>
    </div>
  )
}

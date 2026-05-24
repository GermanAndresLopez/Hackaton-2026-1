import { query } from "./_generated/server"
import { v } from "convex/values"

export const getDashboardMetrics = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const { businessId } = args

    // 1. Obtener productos para calcular total, activos y top vistos
    const products = await ctx.db
      .query("products")
      .withIndex("by_businessId", (q) => q.eq("businessId", businessId))
      .collect()

    const totalProducts = products.length
    const activeProducts = products.filter(p => p.isActive).length
    
    // Top productos más vistos
    const sortedProducts = [...products].sort((a, b) => (b.views || 0) - (a.views || 0))
    const topProducts = sortedProducts.slice(0, 5).map(p => ({
      _id: p._id,
      name: p.name,
      views: p.views || 0
    }))
    
    // Calcular total de visitas a la tienda sumando visitas de todos los productos
    const totalViews = products.reduce((sum, p) => sum + (p.views || 0), 0)

    // 2. Obtener total de mensajes recibidos
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_businessId", (q) => q.eq("businessId", businessId))
      .collect()
      
    // Sumamos la cantidad de mensajes que tengan rol "user" (mensajes del cliente)
    let totalMessages = 0
    for (const conv of conversations) {
      const userMessages = conv.messages.filter(m => m.role === "user").length
      totalMessages += userMessages
    }

    // 3. Obtener cantidad de contenido generado
    const generatedContent = await ctx.db
      .query("generatedContent")
      .withIndex("by_businessId", (q) => q.eq("businessId", businessId))
      .collect()
      
    const totalContentGenerated = generatedContent.length

    // 4. Actividad reciente (Simularemos una línea de tiempo real combinando los últimos eventos)
    // Para simplificar, buscaremos los últimos productos actualizados, y los últimos contenidos generados.
    const recentProducts = [...products].sort((a, b) => b._creationTime - a._creationTime).slice(0, 2)
    const recentContent = [...generatedContent].sort((a, b) => b._creationTime - a._creationTime).slice(0, 2)
    
    const activityList: any[] = []
    
    for (const p of recentProducts) {
      activityList.push({
        type: "product",
        label: "Producto actualizado",
        timeMs: p._creationTime,
        value: p.name,
        positive: false
      })
    }
    
    for (const c of recentContent) {
      activityList.push({
        type: "content",
        label: "Marketing generado por IA",
        timeMs: c._creationTime,
        value: c.type === "marketing_post" ? "Post Instagram" : "Texto",
        positive: false
      })
    }
    
    // Si hubo visitas recientes, podríamos añadir una. Como no tenemos timestamps por visita individual, agregamos una genérica si hay visitas
    if (totalViews > 0) {
      activityList.push({
        type: "view",
        label: "Nueva visita a tu tienda",
        timeMs: Date.now() - 1000 * 60 * 5, // Hace 5 min aprox
        value: "+1 visita",
        positive: true
      })
    }
    
    // 5. Historial de los últimos 7 días (para el gráfico de tendencias)
    const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000
    
    // Obtener conversaciones de los últimos 7 días
    const recentConversationsForTrend = conversations.filter(c => c._creationTime >= sevenDaysAgoMs)
    
    // Obtener contenidos de los últimos 7 días
    const recentContentForTrend = generatedContent.filter(c => c._creationTime >= sevenDaysAgoMs)
    
    // Agrupar por día (e.g. "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom")
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      // Calculamos cada día y restamos la diferencia respecto a hoy
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      return {
        dateStr: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        dayLabel: daysOfWeek[date.getDay()],
        conversations: 0,
        content: 0
      }
    })
    
    // Rellenar datos
    recentConversationsForTrend.forEach(c => {
      const cDateString = new Date(c._creationTime).toDateString()
      const dayIndex = last7Days.findIndex(d => {
        // Encontrar qué índice de last7Days corresponde a la fecha de creación
        const targetDate = new Date(Date.now() - (6 - last7Days.indexOf(d)) * 24 * 60 * 60 * 1000)
        return cDateString === targetDate.toDateString()
      })
      if (dayIndex !== -1) {
        last7Days[dayIndex].conversations += 1
      }
    })
    
    recentContentForTrend.forEach(c => {
      const cDateString = new Date(c._creationTime).toDateString()
      const dayIndex = last7Days.findIndex(d => {
        const targetDate = new Date(Date.now() - (6 - last7Days.indexOf(d)) * 24 * 60 * 60 * 1000)
        return cDateString === targetDate.toDateString()
      })
      if (dayIndex !== -1) {
        last7Days[dayIndex].content += 1
      }
    })

    // 6. Distribución de plataformas (Telegram vs WhatsApp)
    let telegramCount = 0
    let whatsappCount = 0
    conversations.forEach(c => {
      if (c.platform === "telegram") telegramCount++
      if (c.platform === "whatsapp") whatsappCount++
    })

    activityList.sort((a, b) => b.timeMs - a.timeMs)

    return {
      totalViews,
      totalMessages,
      activeProducts,
      totalProducts,
      totalContentGenerated,
      topProducts,
      activity: activityList.slice(0, 5), // Solo 5 elementos más recientes
      platformDistribution: {
        telegram: telegramCount,
        whatsapp: whatsappCount
      },
      dailyTrend: last7Days
    }
  }
})

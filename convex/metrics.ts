import { query } from "./_generated/server"
import { v } from "convex/values"

export const getDashboardMetrics = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const { businessId } = args

    // ── 1. Productos ──────────────────────────────────────────────────────────
    const products = await ctx.db
      .query("products")
      .withIndex("by_businessId", (q) => q.eq("businessId", businessId))
      .collect()

    const totalProducts  = products.length
    const activeProducts = products.filter(p => p.isActive).length
    const totalViews     = products.reduce((sum, p) => sum + (p.views || 0), 0)

    // Top 5 productos más vistos
    const topProducts = [...products]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5)
      .map(p => ({ _id: p._id, name: p.name, views: p.views || 0, isActive: p.isActive }))

    // Productos por categoría
    const categoryCount: Record<string, number> = {}
    products.forEach(p => {
      const cat = (p as any).category || "otro"
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })
    const productsByCategory = Object.entries(categoryCount)
      .map(([cat, count]) => ({ cat, count }))
      .sort((a, b) => b.count - a.count)

    // ── 2. Conversaciones ─────────────────────────────────────────────────────
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_businessId", (q) => q.eq("businessId", businessId))
      .collect()

    const totalConversations = conversations.length

    // Total de mensajes de usuario (cliente)
    let totalMessages = 0
    conversations.forEach(conv => {
      totalMessages += conv.messages.filter((m: any) => m.role === "user").length
    })

    const avgMessagesPerConv = totalConversations > 0
      ? Math.round((totalMessages / totalConversations) * 10) / 10
      : 0

    // Distribución de plataformas
    let telegramCount = 0
    let whatsappCount = 0
    conversations.forEach(c => {
      if (c.platform === "telegram") telegramCount++
      else if (c.platform === "whatsapp") whatsappCount++
    })

    // Tasa de conversión: (conversaciones / visitas) * 100
    const conversionRate = totalViews > 0
      ? Math.round((totalConversations / totalViews) * 1000) / 10  // 1 decimal
      : 0

    // ── 3. Contenido generado ─────────────────────────────────────────────────
    const generatedContent = await ctx.db
      .query("generatedContent")
      .withIndex("by_businessId", (q) => q.eq("businessId", businessId))
      .collect()

    const totalContentGenerated = generatedContent.length

    // Breakdown por tipo de contenido
    const contentTypeCount: Record<string, number> = {}
    generatedContent.forEach(c => {
      const t = (c as any).type || "otro"
      contentTypeCount[t] = (contentTypeCount[t] || 0) + 1
    })
    const contentByType = Object.entries(contentTypeCount)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // ── 4. Tendencia últimos 7 días ───────────────────────────────────────────
    const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
      return {
        dateStr:   date.toLocaleDateString("es-CO", { day: "numeric", month: "short" }),
        dayLabel:  daysOfWeek[date.getDay()],
        dayOfWeek: date.getDay(),
        conversations: 0,
        content: 0,
        views: 0,
      }
    })

    conversations
      .filter(c => c._creationTime >= sevenDaysAgoMs)
      .forEach(c => {
        const cDs = new Date(c._creationTime).toDateString()
        const idx = last7Days.findIndex((d, i) => {
          const t = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
          return cDs === t.toDateString()
        })
        if (idx !== -1) last7Days[idx].conversations += 1
      })

    generatedContent
      .filter(c => c._creationTime >= sevenDaysAgoMs)
      .forEach(c => {
        const cDs = new Date(c._creationTime).toDateString()
        const idx = last7Days.findIndex((d, i) => {
          const t = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
          return cDs === t.toDateString()
        })
        if (idx !== -1) last7Days[idx].content += 1
      })

    // Día con más actividad total en los últimos 7 días
    const bestDay = last7Days.reduce(
      (best, d) => (d.conversations + d.content > best.conversations + best.content ? d : best),
      last7Days[0]
    )

    // Vistas por día de la semana (desde tabla metrics con fecha)
    const allMetrics = await ctx.db
      .query("metrics")
      .withIndex("by_businessId", (q) => q.eq("businessId", businessId))
      .collect()

    const viewsByDow   = [0, 0, 0, 0, 0, 0, 0] // Dom→Sáb
    allMetrics.forEach(m => {
      if (!m.date) return
      const dow = new Date(m.date + "T12:00:00").getDay()
      viewsByDow[dow] += (m.productViews as number) || 0
    })

    // Clicks de WhatsApp por día de la semana (conversations platform=whatsapp)
    const waClicksByDow = [0, 0, 0, 0, 0, 0, 0]
    conversations.forEach(c => {
      if (c.platform === "whatsapp") {
        const dow = new Date(c._creationTime).getDay()
        waClicksByDow[dow] += 1
      }
    })

    const weekdayActivity = daysOfWeek.map((label, i) => ({
      label,
      views:     viewsByDow[i],
      waClicks:  waClicksByDow[i],
    }))

    // ── 5. Actividad reciente ─────────────────────────────────────────────────
    const recentProducts = [...products]
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 2)
    const recentContent = [...generatedContent]
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 2)
    const recentConvs = [...conversations]
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 2)

    const activityList: any[] = []

    recentProducts.forEach(p => activityList.push({
      type: "product", label: "Producto agregado al catálogo",
      timeMs: p._creationTime, value: p.name, positive: false,
    }))
    recentContent.forEach(c => activityList.push({
      type: "content", label: "Contenido generado por IA",
      timeMs: c._creationTime,
      value: (c as any).type === "marketing_post" ? "Post" : "Texto",
      positive: false,
    }))
    recentConvs.forEach(c => activityList.push({
      type: "chat", label: "Nueva conversación",
      timeMs: c._creationTime,
      value: c.platform === "telegram" ? "Telegram" : "WhatsApp",
      positive: true,
    }))
    if (totalViews > 0) {
      activityList.push({
        type: "view", label: "Visita a tu tienda",
        timeMs: Date.now() - 1000 * 60 * 3,
        value: "+1 visita", positive: true,
      })
    }
    activityList.sort((a, b) => b.timeMs - a.timeMs)

    return {
      // KPIs
      totalViews,
      totalMessages,
      totalConversations,
      totalContentGenerated,
      activeProducts,
      totalProducts,
      avgMessagesPerConv,
      conversionRate,
      // Charts
      topProducts,
      productsByCategory,
      contentByType,
      platformDistribution: { telegram: telegramCount, whatsapp: whatsappCount },
      dailyTrend: last7Days,
      weekdayActivity,
      bestDay,
      // Feed
      activity: activityList.slice(0, 6),
    }
  },
})

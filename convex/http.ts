import { httpRouter } from "convex/server"
import { telegramWebhook } from "./telegram"

const http = httpRouter()

http.route({
  path: "/telegram",
  method: "POST",
  handler: telegramWebhook,
})

export default http

"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ROUTES } from "@/lib/constants"
import { useConvex } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})
type LoginForm = z.infer<typeof loginSchema>

const INPUT_BASE: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1.5px solid #e0e0e0",
  background: "#fafafa",
  fontSize: "15px",
  fontFamily: '"SF Pro Text", system-ui, -apple-system, sans-serif',
  letterSpacing: "-0.224px",
  color: "#1d1d1f",
  outline: "none",
  transition: "border-color 150ms, box-shadow 150ms, background 150ms",
  boxSizing: "border-box",
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  const convex = useConvex()
  const setUser = useBusinessStore((s) => s.setUser)
  const setBusiness = useBusinessStore((s) => s.setBusiness)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await convex.query(api.users.login, { email: data.email, password: data.password })
      setUser(res.user)
      setBusiness(res.business)
      router.push(ROUTES.dashboard)
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas. Revisa tu correo y contraseña.")
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        {/* Logo visible solo en desktop (complementa el del layout izquierdo) */}
        

        <h1 style={{
          fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
          fontSize: "32px", fontWeight: 700, lineHeight: 1.1,
          letterSpacing: "-0.5px", color: "#1d1d1f", marginBottom: "8px",
        }}>
          Bienvenido de vuelta
        </h1>
        <p style={{ fontSize: "16px", color: "#7a7a7a", letterSpacing: "-0.224px", lineHeight: 1.4 }}>
          Inicia sesión para gestionar tu negocio con IA
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Email */}
        <div>
          <label htmlFor="email" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1d1d1f", marginBottom: "7px", letterSpacing: "-0.224px" }}>
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="tu@correo.com"
            autoComplete="email"
            style={{ ...INPUT_BASE, borderColor: errors.email ? "#ef4444" : "#e0e0e0" }}
            onFocus={e => { e.currentTarget.style.borderColor = "#0066cc"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.10)"; e.currentTarget.style.background = "#fff" }}
            onBlur={e => { e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#fafafa" }}
          />
          {errors.email && (
            <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", letterSpacing: "-0.12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <AlertCircle size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "7px" }}>
            <label htmlFor="password" style={{ fontSize: "13px", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.224px" }}>
              Contraseña
            </label>
            <button type="button" style={{ fontSize: "12px", color: "#0066cc", background: "none", border: "none", cursor: "pointer", letterSpacing: "-0.12px", padding: 0 }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPass ? "text" : "password"}
              {...register("password")}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              style={{ ...INPUT_BASE, paddingRight: "48px", borderColor: errors.password ? "#ef4444" : "#e0e0e0" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#0066cc"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.10)"; e.currentTarget.style.background = "#fff" }}
              onBlur={e => { e.currentTarget.style.borderColor = errors.password ? "#ef4444" : "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#fafafa" }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7a7a7a", display: "flex", alignItems: "center", padding: "4px" }}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", letterSpacing: "-0.12px", display: "flex", alignItems: "center", gap: "4px" }}>
              <AlertCircle size={12} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: "#fff0f0", border: "1.5px solid #fecdd3", borderRadius: "12px",
            padding: "13px 16px", display: "flex", alignItems: "flex-start", gap: "10px",
          }}>
            <AlertCircle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ fontSize: "13px", color: "#b91c1c", letterSpacing: "-0.224px", lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        {/* CTA */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "15px 22px", borderRadius: "9999px",
            background: isLoading ? "#4da6ff" : "#0066cc",
            color: "#fff", fontSize: "16px", fontWeight: 600,
            border: "none", cursor: isLoading ? "not-allowed" : "pointer",
            letterSpacing: "-0.224px", transition: "background 150ms, transform 100ms",
            boxShadow: "0 2px 12px rgba(0,102,204,0.30)",
          }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#0055b3" }}
          onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = "#0066cc" }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.985)" }}
          onMouseUp={e => { e.currentTarget.style.transform = "scale(1)" }}
        >
          {isLoading
            ? <><Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} /> Iniciando sesión...</>
            : "Iniciar sesión"}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "28px 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
        <span style={{ fontSize: "12px", color: "#b0b0b0", letterSpacing: "-0.12px" }}>o continúa con</span>
        <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
      </div>

      {/* Social proof pill */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        background: "#f5f5f7", borderRadius: "12px", padding: "12px 16px",
        border: "1px solid #e0e0e0",
      }}>
        <div style={{ display: "flex" }}>
          {["#0066cc","#22c55e","#f59e0b","#ef4444"].map((c, i) => (
            <div key={c} style={{ width: "24px", height: "24px", borderRadius: "50%", background: c, border: "2px solid #fff", marginLeft: i === 0 ? 0 : "-6px", zIndex: 4 - i, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "9px", color: "#fff", fontWeight: 700 }}>{["M","J","C","A"][i]}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "12px", color: "#7a7a7a", letterSpacing: "-0.12px" }}>
          <strong style={{ color: "#1d1d1f" }}>+2.400 negocios</strong> ya están creciendo con IA
        </p>
      </div>

      {/* Footer link */}
      <p style={{ textAlign: "center", fontSize: "14px", color: "#7a7a7a", marginTop: "28px", letterSpacing: "-0.224px" }}>
        ¿No tienes cuenta?{" "}
        <Link href={ROUTES.register} style={{ fontWeight: 700, color: "#0066cc", textDecoration: "none" }}>
          Regístrate gratis →
        </Link>
      </p>
    </div>
  )

}

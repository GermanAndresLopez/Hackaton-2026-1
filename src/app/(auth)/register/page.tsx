"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ROUTES, BUSINESS_CATEGORIES } from "@/lib/constants"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useBusinessStore } from "@/store/useBusinessStore"
import {
  Eye, EyeOff, AlertCircle, Loader2, ChevronLeft,
  UtensilsCrossed, Shirt, Laptop, Sparkles, Wrench, Palette, Package,
  type LucideIcon,
} from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  businessName: z.string().min(2, "El nombre del negocio es requerido"),
  category: z.string().min(1, "Selecciona una categoría"),
})
type RegisterForm = z.infer<typeof registerSchema>

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

// Category icons — Lucide icons keyed by BUSINESS_CATEGORIES value
const CAT_ICONS: Record<string, LucideIcon> = {
  comida:      UtensilsCrossed,  // fork & knife crossed
  ropa:        Shirt,            // clothing
  tecnologia:  Laptop,           // tech / devices
  belleza:     Sparkles,         // beauty & personal care
  servicios:   Wrench,           // repair / professional services
  artesanias:  Palette,          // crafts & handmade
  otro:        Package,          // catch-all
}

/** Strip leading emoji from labels like "🍕 Comida y Bebidas" → "Comida y Bebidas" */
function stripEmoji(label: string) {
  return label.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+\s*/u, "")
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")

  const setUser = useBusinessStore((s) => s.setUser)
  const setBusiness = useBusinessStore((s) => s.setBusiness)
  const registerMutation = useMutation(api.users.register)

  const { register, handleSubmit, trigger, setValue, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  async function handleStep1() {
    const valid = await trigger(["name", "email", "password"])
    if (!valid) return
    setEmailError(null)
    setStep(2)
  }

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true)
    setEmailError(null)
    try {
      const res = await registerMutation({
        name: data.name,
        email: data.email,
        password: data.password,
        businessName: data.businessName,
        category: data.category as any,
      })
      setUser(res.user)
      setBusiness(res.business)
      router.push(ROUTES.dashboard)
    } catch (err: any) {
      setEmailError(err.message || "Ocurrió un error al crear la cuenta. Por favor intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div>

     

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "32px" }}>
        {[1, 2].map((s, idx) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: idx < 1 ? "none" : 1 }}>
            {/* Step circle */}
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: step >= s ? "#0066cc" : "#f0f0f5",
              border: `2px solid ${step >= s ? "#0066cc" : "#e0e0e0"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 300ms ease-out",
            }}>
              {step > s ? (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span style={{ fontSize: "12px", fontWeight: 700, color: step >= s ? "#fff" : "#b0b0b0" }}>{s}</span>
              )}
            </div>
            {/* Label under circle — hidden on small screen */}
            {idx === 0 && (
              <>
                {/* Connector line */}
                <div style={{ flex: 1, height: "2px", background: step > 1 ? "#0066cc" : "#e0e0e0", margin: "0 8px", transition: "background 300ms" }} />
              </>
            )}
          </div>
        ))}
        <span style={{ fontSize: "12px", color: "#7a7a7a", letterSpacing: "-0.12px", marginLeft: "12px", whiteSpace: "nowrap" }}>
          Paso {step} de 2
        </span>
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div>
          <h1 style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontSize: "32px", fontWeight: 700, lineHeight: 1.1,
            letterSpacing: "-0.5px", color: "#1d1d1f", marginBottom: "8px",
          }}>
            Crea tu cuenta
          </h1>
          <p style={{ fontSize: "16px", color: "#7a7a7a", marginBottom: "28px", letterSpacing: "-0.224px" }}>
            Empieza a digitalizar tu negocio hoy, gratis
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Name */}
            <div>
              <label htmlFor="name" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1d1d1f", marginBottom: "7px", letterSpacing: "-0.224px" }}>
                Tu nombre completo
              </label>
              <input
                id="name"
                {...register("name")}
                placeholder="Ej: María González"
                style={{ ...INPUT_BASE, borderColor: errors.name ? "#ef4444" : "#e0e0e0" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#0066cc"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.10)"; e.currentTarget.style.background = "#fff" }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.name ? "#ef4444" : "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#fafafa" }}
              />
              {errors.name && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.name.message}</p>}
            </div>

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
              {errors.email && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.email.message}</p>}
              {emailError && (
                <div style={{ marginTop: "8px", background: "#fff0f0", border: "1.5px solid #fecdd3", borderRadius: "12px", padding: "11px 14px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <AlertCircle size={14} style={{ color: "#ef4444", flexShrink: 0, marginTop: "1px" }} />
                  <p style={{ fontSize: "13px", color: "#b91c1c", letterSpacing: "-0.12px" }}>
                    {emailError}{" "}
                    <Link href={ROUTES.login} style={{ fontWeight: 700, color: "#0066cc", textDecoration: "none" }}>Inicia sesión →</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1d1d1f", marginBottom: "7px", letterSpacing: "-0.224px" }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  {...register("password")}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
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
              {errors.password && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.password.message}</p>}
            </div>

            <button
              type="button"
              onClick={handleStep1}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                padding: "15px 22px", borderRadius: "9999px",
                background: "#0066cc", color: "#fff",
                fontSize: "16px", fontWeight: 600, border: "none", cursor: "pointer",
                letterSpacing: "-0.224px", marginTop: "4px",
                boxShadow: "0 2px 12px rgba(0,102,204,0.30)",
                transition: "background 150ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#0055b3" }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0066cc" }}
            >
              Continuar →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#7a7a7a", background: "none", border: "none", cursor: "pointer", marginBottom: "20px", letterSpacing: "-0.224px", padding: 0 }}
          >
            <ChevronLeft size={14} /> Volver
          </button>

          <h1 style={{
            fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif',
            fontSize: "32px", fontWeight: 700, lineHeight: 1.1,
            letterSpacing: "-0.5px", color: "#1d1d1f", marginBottom: "8px",
          }}>
            Tu negocio
          </h1>
          <p style={{ fontSize: "16px", color: "#7a7a7a", marginBottom: "28px", letterSpacing: "-0.224px" }}>
            Cuéntanos qué vendes para personalizar tu experiencia
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

            {/* Business name */}
            <div>
              <label htmlFor="businessName" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1d1d1f", marginBottom: "7px", letterSpacing: "-0.224px" }}>
                Nombre de tu negocio
              </label>
              <input
                id="businessName"
                {...register("businessName")}
                placeholder="Ej: Brownies de María"
                style={{ ...INPUT_BASE, borderColor: errors.businessName ? "#ef4444" : "#e0e0e0" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#0066cc"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.10)"; e.currentTarget.style.background = "#fff" }}
                onBlur={e => { e.currentTarget.style.borderColor = errors.businessName ? "#ef4444" : "#e0e0e0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "#fafafa" }}
              />
              {errors.businessName && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "5px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.businessName.message}</p>}
            </div>

            {/* Category grid */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1d1d1f", marginBottom: "10px", letterSpacing: "-0.224px" }}>
                ¿Qué vendes?
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {BUSINESS_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.value
                  const CatIcon = CAT_ICONS[cat.value] ?? Package
                  return (
                    <label key={cat.value} style={{ cursor: "pointer" }}>
                      <input
                        type="radio"
                        {...register("category")}
                        value={cat.value}
                        style={{ position: "absolute", opacity: 0, width: 0 }}
                        onChange={() => {
                          setSelectedCategory(cat.value)
                          setValue("category", cat.value)
                        }}
                      />
                      <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "11px 13px", borderRadius: "12px",
                        border: `1.5px solid ${isSelected ? "#0066cc" : "#e0e0e0"}`,
                        background: isSelected ? "#e8f1fb" : "#fafafa",
                        transition: "all 150ms ease-out",
                      }}>
                        {/* Lucide icon inside a coloured chip */}
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                          background: isSelected ? "#0066cc" : "#f0f0f5",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "background 150ms",
                        }}>
                          <CatIcon size={16} style={{ color: isSelected ? "#fff" : "#7a7a7a" }} />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#0058b3" : "#1d1d1f", letterSpacing: "-0.224px", flex: 1 }}>
                          {stripEmoji(cat.label)}
                        </span>
                        {isSelected && (
                          <div style={{ marginLeft: "auto", width: "16px", height: "16px", borderRadius: "50%", background: "#0066cc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
              {errors.category && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}><AlertCircle size={12} /> {errors.category.message}</p>}
            </div>

            {/* Error banner */}
            {emailError && (
              <div style={{ background: "#fff0f0", border: "1.5px solid #fecdd3", borderRadius: "12px", padding: "13px 16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <AlertCircle size={16} style={{ color: "#ef4444", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ fontSize: "13px", color: "#b91c1c", letterSpacing: "-0.224px", lineHeight: 1.5 }}>{emailError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "15px 22px", borderRadius: "9999px",
                background: isLoading ? "#4da6ff" : "#0066cc",
                color: "#fff", fontSize: "16px", fontWeight: 600,
                border: "none", cursor: isLoading ? "not-allowed" : "pointer",
                letterSpacing: "-0.224px",
                boxShadow: "0 2px 12px rgba(0,102,204,0.30)",
                transition: "background 150ms",
              }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#0055b3" }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = isLoading ? "#4da6ff" : "#0066cc" }}
            >
              {isLoading
                ? <><Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} /> Creando tu cuenta...</>
                : "Crear mi negocio gratis "}
            </button>

            <p style={{ fontSize: "11px", color: "#b0b0b0", textAlign: "center", letterSpacing: "-0.12px", lineHeight: 1.5 }}>
              Al registrarte aceptas nuestros{" "}
              <span style={{ color: "#0066cc", cursor: "pointer" }}>Términos de uso</span>{" "}
              y{" "}
              <span style={{ color: "#0066cc", cursor: "pointer" }}>Política de privacidad</span>
            </p>
          </form>
        </div>
      )}

      {/* Footer link */}
      <p style={{ textAlign: "center", fontSize: "14px", color: "#7a7a7a", marginTop: "28px", letterSpacing: "-0.224px" }}>
        ¿Ya tienes cuenta?{" "}
        <Link href={ROUTES.login} style={{ fontWeight: 700, color: "#0066cc", textDecoration: "none" }}>
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}

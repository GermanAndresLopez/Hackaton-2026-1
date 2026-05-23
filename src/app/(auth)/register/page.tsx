"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ROUTES, BUSINESS_CATEGORIES } from "@/lib/constants"
import { db } from "@/lib/db/mockDb"

const registerSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  businessName: z.string().min(2, "El nombre del negocio es requerido"),
  category: z.string().min(1, "Selecciona una categoría"),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  async function handleStep1() {
    const valid = await trigger(["name", "email", "password"])
    if (!valid) return

    const email = getValues("email")
    const exists = db.users.findByEmail(email)
    if (exists) {
      setEmailError("Este correo ya tiene una cuenta. ¿Quieres iniciar sesión?")
      return
    }
    setEmailError(null)
    setStep(2)
  }

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1000))

    const newUser = db.users.create({
      name: data.name,
      email: data.email,
      role: "owner",
    })

    db.businesses.create({
      userId: newUser.id,
      name: data.businessName,
      description: "",
      category: data.category as Parameters<typeof db.businesses.create>[0]["category"],
      theme: "moderno",
      tone: "amigable",
      isPublic: false,
    })

    router.push(ROUTES.dashboard)
  }

  return (
    <div className="fade-in">
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <div style={{ flex: 1, height: '3px', borderRadius: '2px', background: '#e0e0e0', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            background: '#0066cc',
            borderRadius: '2px',
            width: step === 1 ? '50%' : '100%',
            transition: 'width 400ms ease-out'
          }} />
        </div>
        <span style={{ fontSize: '12px', color: '#7a7a7a', letterSpacing: '-0.12px', whiteSpace: 'nowrap' }}>{step} de 2</span>
      </div>

      {step === 1 ? (
        <>
          <h1 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.374px', color: '#1d1d1f', marginBottom: '8px' }}>
            Crea tu cuenta
          </h1>
          <p style={{ fontSize: '17px', color: '#7a7a7a', marginBottom: '32px', letterSpacing: '-0.374px' }}>
            Empieza a digitalizar tu negocio hoy
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                Tu nombre completo
              </label>
              <input
                id="name"
                {...register("name")}
                placeholder="Ej: María González"
                className="input-rect"
              />
              {errors.name && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', letterSpacing: '-0.12px' }}>{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="tu@correo.com"
                className="input-rect"
              />
              {errors.email && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', letterSpacing: '-0.12px' }}>{errors.email.message}</p>}
              {emailError && (
                <div style={{ marginTop: '8px', background: '#fff0f0', border: '1px solid #fecdd3', borderRadius: '11px', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '13px' }}>⚠️</span>
                  <p style={{ fontSize: '13px', color: '#b91c1c', letterSpacing: '-0.12px' }}>
                    {emailError}{" "}
                    <Link href={ROUTES.login} style={{ fontWeight: 700, color: '#0066cc' }}>Inicia sesión →</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Mínimo 8 caracteres"
                className="input-rect"
              />
              {errors.password && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', letterSpacing: '-0.12px' }}>{errors.password.message}</p>}
            </div>

            <button
              type="button"
              onClick={handleStep1}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px 22px', fontSize: '17px', marginTop: '8px' }}
            >
              Continuar →
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setStep(1)}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#7a7a7a', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', letterSpacing: '-0.224px' }}
          >
            ← Volver
          </button>

          <h1 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.374px', color: '#1d1d1f', marginBottom: '8px' }}>
            Tu negocio
          </h1>
          <p style={{ fontSize: '17px', color: '#7a7a7a', marginBottom: '32px', letterSpacing: '-0.374px' }}>
            Cuéntanos sobre lo que vendes
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Business name */}
            <div>
              <label htmlFor="businessName" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>
                Nombre de tu negocio
              </label>
              <input
                id="businessName"
                {...register("businessName")}
                placeholder="Ej: Brownies de María"
                className="input-rect"
              />
              {errors.businessName && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', letterSpacing: '-0.12px' }}>{errors.businessName.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '10px', letterSpacing: '-0.224px' }}>
                ¿Qué vendes?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUSINESS_CATEGORIES.map((cat) => (
                  <label key={cat.value} style={{ cursor: 'pointer' }}>
                    <input type="radio" {...register("category")} value={cat.value} style={{ position: 'absolute', opacity: 0, width: 0 }} className="peer" />
                    <div className="peer-checked:border-[#0066cc] peer-checked:bg-[#e8f1fb]"
                         style={{
                           border: '1px solid #e0e0e0',
                           borderRadius: '11px',
                           padding: '10px 12px',
                           fontSize: '14px',
                           fontWeight: 400,
                           textAlign: 'center',
                           color: '#1d1d1f',
                           transition: 'all 120ms ease-out',
                           letterSpacing: '-0.224px',
                           background: '#fff',
                         }}>
                      {cat.label}
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', letterSpacing: '-0.12px' }}>{errors.category.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px 22px', fontSize: '17px', marginTop: '4px' }}
            >
              {isLoading ? (
                <>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Creando tu cuenta...
                </>
              ) : (
                "Crear mi negocio gratis"
              )}
            </button>
          </form>
        </>
      )}

      <p style={{ textAlign: 'center', fontSize: '14px', color: '#7a7a7a', marginTop: '32px', letterSpacing: '-0.224px' }}>
        ¿Ya tienes cuenta?{" "}
        <Link href={ROUTES.login} className="link-blue" style={{ fontWeight: 600 }}>
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}

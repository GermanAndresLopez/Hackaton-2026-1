"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ROUTES } from "@/lib/constants"
import { db } from "@/lib/db/mockDb"

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    setIsLoading(true)
    setError(null)

    await new Promise(r => setTimeout(r, 800))
    const user = db.users.findByEmail(data.email)

    if (!user) {
      setError("No encontramos una cuenta con ese correo. ¿Ya te registraste?")
      setIsLoading(false)
      return
    }

    router.push(ROUTES.dashboard)
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: '"SF Pro Display", system-ui, -apple-system, sans-serif', fontSize: '34px', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.374px', color: '#1d1d1f', marginBottom: '8px' }}>
        Bienvenido de nuevo
      </h1>
      <p style={{ fontSize: '17px', color: '#7a7a7a', marginBottom: '32px', letterSpacing: '-0.374px' }}>
        Inicia sesión para gestionar tu negocio
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#1d1d1f', marginBottom: '6px', letterSpacing: '-0.224px' }}>
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="tu@correo.com"
            autoComplete="email"
            className="input-rect"
          />
          {errors.email && (
            <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', letterSpacing: '-0.12px' }}>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label htmlFor="password" style={{ fontSize: '14px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '-0.224px' }}>
              Contraseña
            </label>
            <button type="button" style={{ fontSize: '12px', color: '#0066cc', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '-0.12px' }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            className="input-rect"
          />
          {errors.password && (
            <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', letterSpacing: '-0.12px' }}>{errors.password.message}</p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fff0f0', border: '1px solid #fecdd3', borderRadius: '11px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>⚠️</span>
            <p style={{ fontSize: '14px', color: '#b91c1c', letterSpacing: '-0.224px', lineHeight: 1.4 }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '14px 22px', fontSize: '17px' }}
        >
          {isLoading ? (
            <>
              <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '14px', color: '#7a7a7a', marginTop: '32px', letterSpacing: '-0.224px' }}>
        ¿No tienes cuenta?{" "}
        <Link href={ROUTES.register} className="link-blue" style={{ fontWeight: 600 }}>
          Regístrate gratis
        </Link>
      </p>
    </div>
  )
}

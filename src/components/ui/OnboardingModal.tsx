"use client"

import { useState } from "react"
import { useAction } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { toast } from "sonner"
import { Sparkles, Loader2, MapPin, Target, ChevronRight } from "lucide-react"

interface OnboardingModalProps {
  businessId: string
  onComplete: () => void
}

export function OnboardingModal({ businessId, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [cityInput, setCityInput] = useState("")
  const [profileInput, setProfileInput] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const analyzeProfile = useAction(api.growth.analyzeProfile)
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!profileInput || !cityInput) {
      toast.error("Por favor completa la información.")
      return
    }
    
    setIsAnalyzing(true)
    try {
      const data = await analyzeProfile({
        businessId: businessId as any,
        profileDescription: profileInput,
        city: cityInput
      })
      setResult(data)
      setStep(3)
      toast.success("¡Perfil analizado con éxito!")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Hubo un error al analizar el perfil.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFinish = () => {
    onComplete()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="fade-in" style={{
        background: '#ffffff',
        width: '100%', maxWidth: '520px',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        padding: '32px'
      }}>
        
        {step === 1 && (
          <div className="fade-in">
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e8f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <MapPin size={24} style={{ color: '#0066cc' }} />
            </div>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '26px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              ¿Dónde te encuentras?
            </h2>
            <p style={{ fontSize: '15px', color: '#7a7a7a', marginBottom: '24px', lineHeight: 1.5, letterSpacing: '-0.224px' }}>
              Para recomendarte las mejores oportunidades de crecimiento, necesitamos saber en qué ciudad operas.
            </p>
            
            <select
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: '1.5px solid #e0e0e0', fontSize: '15px', marginBottom: '24px',
                outline: 'none', background: '#fafafa', appearance: 'none',
                fontFamily: 'inherit', color: '#1d1d1f'
              }}
            >
              <option value="">Selecciona tu ciudad...</option>
              <option value="Barranquilla">Barranquilla</option>
              <option value="Cartagena">Cartagena</option>
              <option value="Valledupar">Valledupar</option>
              <option value="Santa Marta">Santa Marta</option>
              <option value="Bogotá">Bogotá</option>
              <option value="Medellín">Medellín</option>
              <option value="Cali">Cali</option>
              <option value="Nacional">Otra (Nacional)</option>
            </select>

            <button
              onClick={() => setStep(2)}
              disabled={!cityInput}
              style={{
                width: '100%', padding: '14px', borderRadius: '9999px',
                background: cityInput ? '#0066cc' : '#e0e0e0',
                color: cityInput ? '#fff' : '#a0a0a0',
                fontSize: '16px', fontWeight: 600, border: 'none',
                cursor: cityInput ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'background 0.2s'
              }}
            >
              Siguiente <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f0e6fa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Target size={24} style={{ color: '#8a2be2' }} />
            </div>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '26px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Descubramos tu perfil
            </h2>
            <p style={{ fontSize: '15px', color: '#7a7a7a', marginBottom: '24px', lineHeight: 1.5, letterSpacing: '-0.224px' }}>
              Cuéntanos sobre ti. Ya sea que tengas un negocio, estés empezando, o no sepas por dónde arrancar.
            </p>

            <textarea
              value={profileInput}
              onChange={(e) => setProfileInput(e.target.value)}
              placeholder="Ej: No estoy trabajando ni estudiando, me gustaría aprender repostería para vender postres... / Soy una mujer cabeza de hogar que hace postres desde casa para eventos y necesito formalizar mi negocio..."
              rows={4}
              style={{
                width: '100%', padding: '14px', borderRadius: '12px',
                border: '1.5px solid #e0e0e0', fontSize: '15px', marginBottom: '24px',
                resize: 'none', outline: 'none', background: '#fafafa',
                fontFamily: 'inherit', color: '#1d1d1f'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#0066cc'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,102,204,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = 'none' }}
            />

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                disabled={isAnalyzing}
                style={{
                  padding: '14px 20px', borderRadius: '9999px',
                  background: '#f5f5f7', color: '#1d1d1f',
                  fontSize: '15px', fontWeight: 600, border: 'none',
                  cursor: 'pointer'
                }}
              >
                Volver
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !profileInput}
                style={{
                  flex: 1, padding: '14px', borderRadius: '9999px',
                  background: (profileInput && !isAnalyzing) ? '#0066cc' : '#e0e0e0',
                  color: (profileInput && !isAnalyzing) ? '#fff' : '#a0a0a0',
                  fontSize: '16px', fontWeight: 600, border: 'none',
                  cursor: (profileInput && !isAnalyzing) ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 0.2s'
                }}
              >
                {isAnalyzing ? (
                  <><Loader2 size={18} className="animate-spin" /> Analizando tu perfil...</>
                ) : (
                  <><Sparkles size={18} /> Descubrir mi ruta</>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#e8f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Sparkles size={32} style={{ color: '#0066cc' }} />
            </div>
            <h2 style={{ fontFamily: '"SF Pro Display", system-ui, sans-serif', fontSize: '26px', fontWeight: 700, color: '#1d1d1f', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              ¡Perfil Generado!
            </h2>
            <div style={{ display: 'inline-block', background: '#f0f7ff', color: '#0066cc', padding: '6px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: '16px' }}>
              {result.identityName}
            </div>
            <p style={{ fontSize: '15px', color: '#1d1d1f', marginBottom: '32px', lineHeight: 1.6, letterSpacing: '-0.224px', background: '#fafafa', padding: '16px', borderRadius: '12px', textAlign: 'left' }}>
              {result.customAdvice}
            </p>
            
            <button
              onClick={handleFinish}
              style={{
                width: '100%', padding: '16px', borderRadius: '9999px',
                background: '#0066cc', color: '#fff',
                fontSize: '16px', fontWeight: 600, border: 'none',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,102,204,0.3)',
                transition: 'transform 0.1s'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Entrar al panel de control
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

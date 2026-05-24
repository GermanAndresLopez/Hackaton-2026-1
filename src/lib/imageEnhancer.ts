export interface EnhancementParams {
  brightness: number
  contrast: number
  saturation: number
  warmth: number
  sharpen: number
  vignette: number
  cleanBackground: boolean
  bgBlur: number
}

export const STYLE_PARAMS: Record<string, EnhancementParams> = {
  ubereats: { brightness: 1.12, contrast: 1.18, saturation: 1.25, warmth: 8, sharpen: 0.4, vignette: 0.15, cleanBackground: false, bgBlur: 0 },
  instagram: { brightness: 1.08, contrast: 1.15, saturation: 1.3, warmth: 12, sharpen: 0.35, vignette: 0.25, cleanBackground: false, bgBlur: 0 },
  banner: { brightness: 1.1, contrast: 1.2, saturation: 1.2, warmth: 5, sharpen: 0.5, vignette: 0.1, cleanBackground: false, bgBlur: 0 },
  fondo_blanco: { brightness: 1.15, contrast: 1.22, saturation: 1.15, warmth: 3, sharpen: 0.45, vignette: 0, cleanBackground: true, bgBlur: 0 },
  auto_enhance: { brightness: 1.1, contrast: 1.15, saturation: 1.2, warmth: 5, sharpen: 0.3, vignette: 0.1, cleanBackground: false, bgBlur: 0 }
}

function applyBrightnessContrast(data: Uint8ClampedArray, brightness: number, contrast: number) {
  const factor = (259 * (contrast * 128 + 255)) / (255 * (259 - contrast * 128))
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      let val = data[i + c] * brightness
      val = factor * (val - 128) + 128
      data[i + c] = Math.max(0, Math.min(255, val))
    }
  }
}

function applySaturation(data: Uint8ClampedArray, saturation: number) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
    data[i]     = Math.max(0, Math.min(255, gray + saturation * (r - gray)))
    data[i + 1] = Math.max(0, Math.min(255, gray + saturation * (g - gray)))
    data[i + 2] = Math.max(0, Math.min(255, gray + saturation * (b - gray)))
  }
}

function applyWarmth(data: Uint8ClampedArray, warmth: number) {
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.max(0, Math.min(255, data[i] + warmth))
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] - warmth * 0.5))
  }
}

function applySharpen(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  if (amount <= 0) return
  const imageData = ctx.getImageData(0, 0, width, height)
  const src = new Uint8ClampedArray(imageData.data)
  const dst = imageData.data
  const w = width
  const mix = amount * 0.6
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4
      for (let c = 0; c < 3; c++) {
        const center = src[idx + c]
        const blur =
          (src[((y - 1) * w + x - 1) * 4 + c] +
           src[((y - 1) * w + x) * 4 + c] * 2 +
           src[((y - 1) * w + x + 1) * 4 + c] +
           src[(y * w + x - 1) * 4 + c] * 2 +
           center * 4 +
           src[(y * w + x + 1) * 4 + c] * 2 +
           src[((y + 1) * w + x - 1) * 4 + c] +
           src[((y + 1) * w + x) * 4 + c] * 2 +
           src[((y + 1) * w + x + 1) * 4 + c]) / 16
        const sharp = center + (center - blur) * mix * 3
        dst[idx + c] = Math.max(0, Math.min(255, sharp))
      }
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  if (intensity <= 0) return
  const cx = width / 2, cy = height / 2
  const radius = Math.sqrt(cx * cx + cy * cy)
  const gradient = ctx.createRadialGradient(cx, cy, radius * 0.45, cx, cy, radius)
  gradient.addColorStop(0, `rgba(0,0,0,0)`)
  gradient.addColorStop(1, `rgba(0,0,0,${intensity})`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function applyLevelsAutocorrect(data: Uint8ClampedArray) {
  const mins = [255, 255, 255], maxs = [0, 0, 0]
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      if (data[i + c] < mins[c]) mins[c] = data[i + c]
      if (data[i + c] > maxs[c]) maxs[c] = data[i + c]
    }
  }
  for (let c = 0; c < 3; c++) {
    const range = maxs[c] - mins[c]
    mins[c] = Math.max(0, mins[c] + range * 0.02)
    maxs[c] = Math.min(255, maxs[c] - range * 0.02)
  }
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const range = maxs[c] - mins[c]
      if (range > 10) {
        data[i + c] = Math.max(0, Math.min(255, ((data[i + c] - mins[c]) / range) * 255))
      }
    }
  }
}

export async function enhanceImage(sourceUrl: string, params: EnhancementParams): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      
      const maxDim = 2048
      let w = img.naturalWidth
      let h = img.naturalHeight
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h)
        w = Math.round(w * scale)
        h = Math.round(h * scale)
      }
      canvas.width = w
      canvas.height = h

      ctx.drawImage(img, 0, 0, w, h)

      let imageData = ctx.getImageData(0, 0, w, h)
      applyLevelsAutocorrect(imageData.data)
      ctx.putImageData(imageData, 0, 0)

      imageData = ctx.getImageData(0, 0, w, h)
      applyBrightnessContrast(imageData.data, params.brightness, params.contrast - 1)
      ctx.putImageData(imageData, 0, 0)

      imageData = ctx.getImageData(0, 0, w, h)
      applySaturation(imageData.data, params.saturation)
      ctx.putImageData(imageData, 0, 0)

      if (params.warmth !== 0) {
        imageData = ctx.getImageData(0, 0, w, h)
        applyWarmth(imageData.data, params.warmth)
        ctx.putImageData(imageData, 0, 0)
      }

      applySharpen(ctx, w, h, params.sharpen)
      applyVignette(ctx, w, h, params.vignette)

      resolve(canvas.toDataURL("image/jpeg", 0.95))
    }
    img.onerror = () => reject(new Error("Error al cargar la imagen"))
    img.src = sourceUrl
  })
}

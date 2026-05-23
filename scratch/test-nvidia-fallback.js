/**
 * Script de prueba rápida para validar el AI Gateway con NVIDIA NIM
 * y el fallback automático y silencioso hacia Groq/Pollinations.
 */

const { AIGateway } = require("../src/lib/ai/gateway");

// Simulamos las variables de entorno
process.env.NVIDIA_API_KEY_1 = ""; // Sin keys de NVIDIA para probar fallback directo
process.env.GROQ_API_KEY_1 = "gsk_dummy_key_just_for_fallback_routing"; 

console.log("--- INICIANDO VERIFICACIÓN DE AI GATEWAY FALLBACKS ---");

const gateway = new AIGateway();

async function runTest() {
  console.log("\nProbar generación de Texto (Connectivity):");
  try {
    // Esto debería fallar en la llamada a Groq si la key es inválida,
    // pero valida que la cadena de fallbacks (NVIDIA -> Groq) se ejecute en el orden correcto.
    const response = await gateway.generate({
      task: "connectivity",
      prompt: "Prueba rápida del módulo de conectividad progresiva"
    });
    console.log("Respuesta recibida exitosamente:", response);
  } catch (err) {
    console.log("Capturado error final esperado (ambas keys fallaron):", err.message);
  }

  console.log("\nProbar generación de Imagen (Fallback a Pollinations):");
  try {
    // Pollinations es gratuito y no requiere API keys,
    // por lo tanto, incluso si NVIDIA falla, la imagen debería generarse exitosamente.
    const response = await gateway.generate({
      task: "image",
      prompt: "brownie de chocolate artesanal"
    });
    console.log("Respuesta de imagen exitosa (Pollinations URL):", response.content);
    console.log("Proveedor utilizado:", response.provider);
    console.log("¿Viene de caché?:", response.cached);
  } catch (err) {
    console.error("Fallo inesperado en la generación de imágenes:", err);
  }

  console.log("\n--- VERIFICACIÓN TERMINADA ---");
}

runTest();

console.log("Testeando generador de frases semilla...");

import crypto from "crypto";

// Lista de palabras BIP39 simplificada para generar frases semilla
const WORDLIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique"
];

function generateUniqueSeedPhrase(walletAddress) {
  if (!walletAddress) {
    throw new Error("Se requiere una dirección de wallet válida");
  }
  
  // Normalizar la dirección (minúsculas, sin 0x)
  const normalizedAddress = walletAddress.toLowerCase().replace("0x", "");
  
  // Calcular un hash único basado en la dirección
  const addressHash = crypto.createHash("sha256").update(normalizedAddress).digest("hex");
  
  // Generar 12 palabras usando partes del hash como semilla
  const seedPhrase = [];
  for (let i = 0; i < 12; i++) {
    // Usar 4 caracteres del hash para cada palabra
    const segment = addressHash.substring(i * 4, (i * 4) + 4);
    
    // Convertir el segmento hexadecimal a un número
    const segmentValue = parseInt(segment, 16);
    
    // Usar el número como índice en el wordlist (con módulo para asegurar que está en rango)
    const wordIndex = segmentValue % WORDLIST.length;
    seedPhrase.push(WORDLIST[wordIndex]);
  }
  
  return seedPhrase.join(" ");
}

// Probar tres direcciones diferentes
const addresses = [
  "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F",
  "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", 
  "0xf89d356809814b13C53643307b4411dA950f9012"
];

// Generar frases semilla para cada dirección
addresses.forEach(address => {
  const seedPhrase = generateUniqueSeedPhrase(address);
  console.log(`Dirección: ${address}`);
  console.log(`Frase semilla: ${seedPhrase}`);
  console.log("-------------------------");
});

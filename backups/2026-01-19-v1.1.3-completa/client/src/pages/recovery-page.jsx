import React, { useState } from 'react';
import { useLocation } from 'wouter';

/**
 * Página independiente de recuperación de wallet mediante frase semilla
 * Esta implementación está completamente aislada del resto de la aplicación
 * para evitar cualquier conflicto o problema de integración
 */
export default function RecoveryPage() {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [_, navigate] = useLocation();

  // Lista de palabras BIP39 en español (reducida por brevedad)
  const spanishBIP39Words = [
    'ábaco', 'abdomen', 'abeja', 'abierto', 'abogado', 'abono', 'aborto', 'abrazo', 'abrir', 'abuelo', 'abuso', 'acabar', 
    'academia', 'acceso', 'acción', 'aceite', 'acelga', 'acento', 'aceptar', 'ácido', 'aclarar', 'acné', 'acoger', 'acoso',
    'activo', 'acto', 'actriz', 'actuar', 'acudir', 'acuerdo', 'acusar', 'adicto', 'admitir', 'adoptar', 'adorno', 'aduana',
    'adulto', 'aéreo', 'afectar', 'afición', 'afinar', 'afirmar', 'ágil', 'agitar', 'agonía', 'agosto', 'agotar', 'agregar',
    'agrio', 'agua', 'agudo', 'águila', 'aguja', 'ahogo', 'ahorro', 'aire', 'aislar', 'ajedrez', 'ajeno', 'ajuste', 'alarma',
    'alba', 'álbum', 'alcalde', 'aldea', 'alegre', 'alejar', 'alerta', 'aleta', 'alfiler', 'alga', 'algodón', 'aliado',
    'aliento', 'alivio', 'alma', 'almeja', 'almíbar', 'altar', 'alteza', 'altivo', 'alto', 'altura', 'alumno', 'alzar', 'amable',
    'amante', 'amapola', 'amargo', 'amasar', 'ámbar', 'ámbito', 'ameno', 'amigo', 'amistad', 'amor', 'amparo', 'amplio',
    'ancho', 'anciano', 'ancla', 'andar'
  ];

  // Función para generar la frase semilla para un wallet (la misma que se usa en el servidor)
  function generateSeedPhraseForWallet(walletAddress) {
    let seed = 0;
    for (let i = 2; i < walletAddress.length; i++) {
      seed = ((seed << 5) - seed + walletAddress.charCodeAt(i)) | 0;
    }
    
    const words = [];
    const totalWords = spanishBIP39Words.length;
    
    for (let i = 0; i < 12; i++) {
      const rotatedSeed = ((seed << i) | (seed >>> (32 - i))) >>> 0;
      const index = Math.abs(rotatedSeed) % totalWords;
      words.push(spanishBIP39Words[index]);
    }
    
    return words.join(' ');
  }

  // Función para manejar la recuperación de wallet
  const handleRecovery = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setResult(null);
      setIsLoading(true);
      
      // Validación de datos
      if (!seedPhrase || seedPhrase.trim().split(/\s+/).length < 12) {
        setError('Por favor, ingresa una frase semilla válida de 12 palabras.');
        setIsLoading(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        setIsLoading(false);
        return;
      }
      
      console.log("Iniciando recuperación con frase semilla:", seedPhrase.substring(0, 10) + '...');
      
      // Usar el endpoint simplificado para recuperación de wallet
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seedPhrase,
          newPassword
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error en la recuperación:', result);
        throw new Error(result.error || 'Error en la recuperación del wallet');
      }
      
      if (!result.success) {
        setError(result.error || 'No se pudo recuperar el wallet. Verifica tu frase semilla.');
        setIsLoading(false);
        return;
      }
      
      // Si llegamos aquí, la recuperación fue exitosa
      
      // Guardar la dirección del wallet en localStorage para mantener la sesión
      localStorage.setItem('walletAddress', result.walletAddress);
      
      // Mostrar resultado exitoso
      setResult({
        walletAddress: result.walletAddress,
        password: newPassword || result.generatedPassword,
        message: 'Wallet recuperado exitosamente. ¡Ya puedes acceder!'
      });
      
    } catch (error) {
      console.error('Error en el proceso de recuperación:', error);
      setError('Ocurrió un error durante el proceso de recuperación. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redirigir al dashboard después de la recuperación exitosa
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-900 p-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Recuperación de Wallet</h1>
          <p className="mt-2 text-sm text-slate-400">
            Ingresa tu frase semilla de 12 palabras para recuperar acceso a tu wallet
          </p>
        </div>

        {result ? (
          <div className="space-y-6">
            <div className="rounded-lg bg-green-900/20 border border-green-800 p-4">
              <h3 className="text-lg font-medium text-green-400">¡Recuperación Exitosa!</h3>
              <p className="mt-2 text-sm text-slate-300">Tu wallet ha sido recuperado correctamente.</p>
              
              <div className="mt-4 space-y-2">
                <div>
                  <h4 className="text-xs font-medium text-slate-400">Dirección del Wallet:</h4>
                  <p className="text-sm font-mono text-white break-all">{result.walletAddress}</p>
                </div>
                
                {result.password && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-400">Contraseña:</h4>
                    <p className="text-sm font-mono text-white">{result.password}</p>
                    <p className="mt-1 text-xs text-amber-400">
                      ¡Guarda esta contraseña en un lugar seguro! No la podrás recuperar después.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={goToDashboard}
              className="w-full rounded-lg bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 transition"
            >
              Ir al Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleRecovery} className="space-y-6">
            <div>
              <label htmlFor="seedPhrase" className="block text-sm font-medium text-slate-300">
                Frase Semilla
              </label>
              <textarea
                id="seedPhrase"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                placeholder="Ingresa las 12 palabras separadas por espacios"
                className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 text-slate-100 p-2 text-sm"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">
                Nueva Contraseña <span className="text-slate-500 text-xs">(opcional)</span>
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Dejar en blanco para generar automáticamente"
                className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 text-slate-100 p-2 text-sm"
              />
            </div>
            
            {newPassword && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 text-slate-100 p-2 text-sm"
                />
              </div>
            )}
            
            {error && (
              <div className="rounded-md bg-red-900/20 border border-red-800 p-3 text-sm text-red-200">
                {error}
              </div>
            )}
            
            <div className="flex justify-between">
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="rounded-md border border-slate-700 bg-transparent py-2 px-4 text-sm text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-blue-600 py-2 px-4 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Recuperando...' : 'Recuperar Wallet'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
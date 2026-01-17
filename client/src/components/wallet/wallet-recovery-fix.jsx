import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Info, Shield, AlertCircle, Check } from 'lucide-react';

/**
 * Function to get the unique seed phrase from the server
 * @param {string} walletAddress The user's wallet address
 * @returns {Promise<string>} A promise that resolves to the unique seed phrase
 */
async function getSeedPhraseFromServer(walletAddress) {
  if (!walletAddress) {
    throw new Error('A valid wallet address is required');
  }
  
  try {
    const response = await fetch(`/api/wallet/seed-phrase-public?address=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Could not get the seed phrase');
    }
    
    const data = await response.json();
    return data.seedPhrase;
  } catch (error) {
    console.error('Error getting seed phrase from server:', error);
    throw error;
  }
}

/**
 * Dialog component for wallet recovery using unique seed phrase
 */
export function WalletRecoveryDialog({ isOpen, onClose, userWalletAddress }) {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNext = async () => {
    if (seedPhrase.trim() === '') {
      setError('Seed phrase is required');
      return;
    }

    setValidating(true);
    setError('');

    try {
      // Verify the seed phrase with the server
      const response = await fetch('/api/wallet/verify-seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seedPhrase: seedPhrase.trim(),
          walletAddress: userWalletAddress
        })
      });

      const data = await response.json();

      if (response.ok && data.isValid) {
        // If the phrase is valid (whether using the new method or legacy), we proceed
        setError('');
        
        // If legacy fallback compatibility was used, we log an informational message
        if (data.usedLegacyFallback) {
          console.log('Using legacy phrase for compatibility');
        }
        
        setStep(2);
      } else {
        setError('Incorrect seed phrase. Please verify and try again.');
      }
    } catch (err) {
      console.error('Error verifying seed phrase:', err);
      setError('Connection error. Please try again.');
    } finally {
      setValidating(false);
    }
  };

  const handleRecover = async () => {
    if (password === '') {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call the correct API to recover the wallet
      const response = await fetch('/api/wallet/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seedPhrase: seedPhrase.trim(),
          newPassword: password
        }),
        credentials: 'include' // Include session cookies
      });
      
      if (response.ok) {
        // Successful recovery
        setSuccess(true);
        setError('');
        
        // Redirect after a short delay
        setTimeout(() => {
          onClose();
          window.location.href = '/dashboard';
        }, 3000);
      } else {
        // Recovery error
        const data = await response.json();
        setError(data.error || 'Error recovering the wallet');
      }
    } catch (err) {
      console.error('Error during wallet recovery:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSeedPhrase('');
    setPassword('');
    setConfirmPassword('');
    setStep(1);
    setError('');
    setSuccess(false);
    onClose();
  };

  // Si la recuperación fue exitosa
  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleCancel} className="max-w-md mx-auto">
        <div className="bg-background p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-center mb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold">¡Recuperación Exitosa!</h2>
            <p className="text-sm text-gray-500 mt-1">
              Tu wallet ha sido recuperado correctamente
            </p>
          </div>
          
          <div className="mt-6">
            <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
              Ir al Dashboard
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel} className="max-w-md mx-auto">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Recuperación de Wallet</h2>
        
        {step === 1 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Utiliza la frase semilla de 12 palabras que guardaste durante el proceso de backup para
              recuperar el acceso a tu cartera WayBank.
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-700">Importante</p>
                <p className="text-xs text-blue-600">
                  Las frases semilla de WayBank son únicas para cada wallet y diferentes a las de otras carteras externas.
                  Solo funciona para carteras creadas en la plataforma WayBank.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Frase Semilla (12 palabras)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-sm min-h-[80px]"
                placeholder="Ingresa las 12 palabras separadas por espacios"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
              />
            </div>

            <div className="flex items-center mb-4 text-xs text-blue-600">
              <Shield className="h-4 w-4 mr-1" />
              <span>Tu frase semilla nunca se almacena en nuestros servidores</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Crea una nueva contraseña para acceder a tu wallet recuperada.
            </p>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nueva Contraseña</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Contraseña</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Error</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          
          {step === 1 ? (
            <Button onClick={handleNext}>
              Continuar
            </Button>
          ) : (
            <Button onClick={handleRecover} disabled={loading}>
              {loading ? 'Procesando...' : 'Recuperar Wallet'}
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
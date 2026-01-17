import React from 'react';
import { LayoutBasic } from '@/components/layout/layout-basic';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WagmiRootProvider } from '@/lib/WagmiRootProvider';
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton';

const styles = {
  app: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#f0f2f5',
    minHeight: 'calc(100vh - 100px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  header: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  },
  title: {
    color: '#333',
    fontSize: '28px',
    marginBottom: '30px',
  },
  description: {
    color: '#666',
    fontSize: '16px',
    marginBottom: '20px',
    maxWidth: '80%',
    margin: '0 auto 30px auto',
  },
  infoSection: {
    marginTop: '30px',
    fontSize: '14px',
    color: '#666',
    textAlign: 'left',
    backgroundColor: '#f8fafc',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  }
};

export default function WalletConnectionDemo() {
  return (
    <LayoutBasic>
      <Helmet>
        <title>Demostración de Conexión Web3 | WayBank</title>
        <meta name="description" content="Página de demostración con la integración completa de carteras Web3 usando wagmi y viem" />
      </Helmet>

      <WagmiRootProvider>
        <div style={styles.app}>
          <Card style={styles.header} className="w-full max-w-2xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Demostración de Conexión Web3</CardTitle>
              <CardDescription>
                Conecta tu wallet Ethereum usando diferentes proveedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectWalletButton />
              
              <div style={styles.infoSection}>
                <h3 className="text-base font-medium mb-2">Características de esta integración:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Soporte para múltiples carteras (MetaMask, WalletConnect, Coinbase)</li>
                  <li>Cambio de redes (Ethereum, Polygon, Arbitrum, etc.)</li>
                  <li>Detección de nombres ENS</li>
                  <li>Manejo de errores y estados de carga</li>
                  <li>Completamente compatible con móviles</li>
                  <li>Escaneo de código QR para WalletConnect</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </WagmiRootProvider>
    </LayoutBasic>
  );
}
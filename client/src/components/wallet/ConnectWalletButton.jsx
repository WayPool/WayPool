import React, { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsName,
  useChainId,
  useSwitchChain,
} from 'wagmi';

// Estilos para el componente
const styles = {
  button: {
    backgroundColor: '#6366f1', // Indigo-500
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    fontWeight: '500',
    marginTop: '10px',
    display: 'inline-block',
  },
  buttonPlaceholder: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '10px',
    display: 'inline-block',
  },
  walletInfoContainer: {
    backgroundColor: '#eef2ff', // Indigo-50
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #c7d2fe', // Indigo-200
    marginTop: '20px',
    textAlign: 'left',
    width: '100%',
  },
  walletInfo: {
    marginBottom: '15px',
  },
  infoText: {
    color: '#4338ca', // Indigo-700
    fontSize: '15px',
    margin: '6px 0',
    wordBreak: 'break-all',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '15px',
  },
  errorTextSmall: {
    color: '#dc3545',
    fontSize: '12px',
    marginTop: '5px',
  },
  connectContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    minWidth: '300px',
    maxWidth: '90%',
  },
  modalTitle: {
    color: '#333',
    fontSize: '22px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  connectorButton: {
    backgroundColor: '#f8f9fa',
    color: '#333',
    border: '1px solid #dee2e6',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%',
    '&:hover': {
      backgroundColor: '#e9ecef',
    },
  },
  closeButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '10px',
    alignSelf: 'center',
  },
  chainSwitcher: {
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #c7d2fe', // Indigo-200
  },
  label: {
    fontSize: '14px',
    color: '#4338ca', // Indigo-700
    marginRight: '8px',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #818cf8', // Indigo-400
    fontSize: '14px',
    minWidth: '150px',
  },
  smallStatus: {
    fontSize: '12px',
    color: '#4f46e5', // Indigo-600
    marginTop: '5px',
  }
};

export function ConnectWalletButton() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const chainId = useChainId();
  const { data: ensName } = useEnsName({ address });
  const { connect, connectors, error: connectError, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, chains: availableChains, error: switchChainError, status: switchChainStatus } = useSwitchChain();

  const [showConnectors, setShowConnectors] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Este efecto asegura que el código que depende del `window` solo se ejecute en el cliente
    setIsClient(true);
  }, []);

  const getShortAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleConnect = (connector) => {
    connect({ connector });
    setShowConnectors(false);
  };

  if (!isClient) {
    return <div style={styles.buttonPlaceholder}>Cargando...</div>;
  }

  if (isConnected && address) {
    return (
      <div style={styles.walletInfoContainer}>
        <div style={styles.walletInfo}>
          <p style={styles.infoText}>
            Conectado con: {activeConnector?.name || 'Billetera Desconocida'}
          </p>
          <p style={styles.infoText}>
            Dirección: {ensName ? `${ensName} (${getShortAddress(address)})` : getShortAddress(address)}
          </p>
          <p style={styles.infoText}>
            Red: {availableChains.find(c => c.id === chainId)?.name || `ID: ${chainId}`}
          </p>
          {availableChains.length > 1 && (
            <div style={styles.chainSwitcher}>
              <label htmlFor="chain-select" style={styles.label}>Cambiar Red: </label>
              <select
                id="chain-select"
                value={chainId}
                onChange={(e) => switchChain?.({ chainId: Number(e.target.value) })}
                disabled={switchChainStatus === 'pending'}
                style={styles.select}
              >
                {availableChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
              {switchChainStatus === 'pending' && <p style={styles.smallStatus}>Cambiando red...</p>}
              {switchChainError && <p style={styles.errorTextSmall}>Error al cambiar: {switchChainError.shortMessage || switchChainError.message}</p>}
            </div>
          )}
        </div>
        <button onClick={() => disconnect()} style={styles.button} type="button">
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <div style={styles.connectContainer}>
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        style={styles.button}
        type="button"
        disabled={connectStatus === 'pending'}
      >
        {connectStatus === 'pending' ? 'Conectando...' : 'Conectar Billetera'}
      </button>

      {showConnectors && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Selecciona una Billetera</h3>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                style={styles.connectorButton}
                disabled={connectStatus === 'pending' && connector.id === (connectors.find(c => c.id === activeConnector?.id)?.id)}
                type="button"
              >
                {connector.name}
                {connectStatus === 'pending' && connector.id === (connectors.find(c => c.id === activeConnector?.id)?.id) && ' (Intentando...)'}
              </button>
            ))}
            <button onClick={() => setShowConnectors(false)} style={styles.closeButton} type="button">Cerrar</button>
          </div>
        </div>
      )}
      {connectError && <p style={styles.errorText}>Error al conectar: {connectError.shortMessage || connectError.message}</p>}
    </div>
  );
}
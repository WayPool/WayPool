// Utilidades para la interacción con Ethereum

import { ethers } from "ethers";

// Address del wallet de depósito predeterminado
export const DEPOSIT_WALLET_ADDRESS = "0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F";


/**
 * Formatea un número para visualización de moneda
 * @param {number} value - El valor a formatear
 * @param {number} decimals - Número de decimales (default: 2)
 * @returns {string} - Valor formateado
 */
export const formatCurrency = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formatea un número con separadores de miles
 * @param {number} value - El valor a formatear
 * @returns {string} - Valor formateado
 */
export const formatNumber = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return value.toLocaleString('en-US');
};

/**
 * Formatea un porcentaje
 * @param {number} value - El valor a formatear
 * @param {number} decimals - Número de decimales (default: 2)
 * @returns {string} - Valor formateado
 */
export const formatPercentage = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00%';
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
};

/**
 * Formatea una dirección para mostrarla de forma abreviada (0x1234...5678)
 * @param {string} address - La dirección a formatear
 * @returns {string} - Dirección formateada
 */
export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Cambia la red en MetaMask a Ethereum Mainnet
 * @returns {Promise<boolean>} - True si se cambió correctamente, false en caso contrario
 */
export const switchToEthereumMainnet = async () => {
  if (!window.ethereum) {
    console.error("MetaMask no está instalado");
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // 0x1 es el chainId de Ethereum Mainnet
    });
    console.log("Red cambiada a Ethereum Mainnet (chainId: 0x1)");
    return true;
  } catch (error) {
    console.error("Error al cambiar a Ethereum Mainnet:", error);
    return false;
  }
};

/**
 * Envía una transacción ETH usando un valor mínimo seguro
 * @param {string} fromAddress - Dirección emisora
 * @param {string} toAddress - Dirección receptora
 * @param {number} amount - Cantidad en ETH a enviar
 * @returns {Promise<string>} - Hash de la transacción
 */
export const sendEthTransaction = async (fromAddress, toAddress, amount) => {
  if (!window.ethereum) {
    throw new Error("MetaMask no está instalado");
  }

  // Asegurarse de estar en Ethereum Mainnet
  await switchToEthereumMainnet();
  
  try {
    // Asegurarse de que la cantidad sea al menos 0.01 ETH para evitar errores
    const minAmount = Math.max(amount, 0.01);
    console.log(`Cantidad ajustada para transacción: ${minAmount} ETH (mínimo 0.01 ETH)`);
    
    // Usar ethers para manejar la conversión con precisión
    // Creamos un proveedor y conectamos con el signer actual
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Utilizamos ethers.parseEther para una conversión precisa a wei
    const amountInWei = ethers.parseEther(minAmount.toString());
    console.log("Monto en Wei:", amountInWei.toString());
    
    // Realizar la transacción directamente con ethers.js
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: amountInWei,
      // No especificamos gas para dejar que ethers.js lo calcule automáticamente
    });
    
    console.log(`Transacción enviada: ${tx.hash}`);
    
    // Esperar a que la transacción se confirme
    const receipt = await tx.wait();
    console.log(`Transacción confirmada en el bloque: ${receipt.blockNumber}`);
    
    return tx.hash;
  } catch (error) {
    console.error("Error al enviar la transacción:", error);
    
    // Proporcionar mensajes de error más descriptivos
    if (error.code === "ACTION_REJECTED") {
      throw new Error("La transacción fue rechazada por el usuario");
    } else if (error.code === "INSUFFICIENT_FUNDS") {
      throw new Error("Fondos insuficientes para completar la transacción");
    } else if (error.message && error.message.includes("gas")) {
      throw new Error("Error al estimar el gas necesario para la transacción");
    } else {
      throw new Error(`Error al enviar la transacción: ${error.message || "Error desconocido"}`);
    }
  }
};

/**
 * Transfiere tokens ERC20 a una dirección
 * @param {string} tokenAddress - Dirección del contrato del token
 * @param {string} recipientAddress - Dirección del destinatario
 * @param {string} amount - Cantidad de tokens a enviar
 * @param {object} signer - Objeto signer de ethers
 * @param {number} decimals - Decimales del token (default: 6 para USDC)
 * @returns {Promise<object>} - Objeto con éxito y hash de transacción
 */
export const transferERC20Token = async (
  tokenAddress,
  recipientAddress,
  amount,
  signer,
  decimals = 6
) => {
  try {
    // Interfaz ERC20 para tokens
    const erc20Interface = new ethers.Interface([
      "function transfer(address to, uint amount) returns (bool)",
      "function decimals() view returns (uint8)",
    ]);
    
    // Crear una instancia del contrato con el signer
    const tokenContract = new ethers.Contract(tokenAddress, erc20Interface, signer);
    
    // Convertir el monto a la unidad correcta (con los decimales correspondientes)
    const amountInWei = ethers.parseUnits(amount, decimals);
    
    console.log(`Transferring ${amount} tokens to ${recipientAddress}`);
    
    // Ejecutar la transacción
    const tx = await tokenContract.transfer(recipientAddress, amountInWei);
    
    // Esperar a que la transacción se confirme
    const receipt = await tx.wait();
    
    console.log(`Transfer successful with hash: ${receipt.hash}`);
    
    return {
      success: true,
      txHash: receipt.hash
    };
  } catch (error) {
    console.error("Error transferring tokens:", error);
    return {
      success: false,
      txHash: null,
      error
    };
  }
};
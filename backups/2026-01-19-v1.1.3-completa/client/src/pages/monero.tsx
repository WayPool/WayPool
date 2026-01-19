import React from 'react';

export default function Monero() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Demo de Monero</h1>
      <p className="text-center text-lg mb-8">Simulación simple de integración con Monero</p>
      
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">
          Esta es una página de demostración simple para mostrar una integración básica con Monero.
        </p>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
          <p className="text-sm">
            Nota: Esta es una simulación con fines educativos. No hay conexión real a ninguna red de Monero.
          </p>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Simular Conexión
        </button>
      </div>
    </div>
  );
}
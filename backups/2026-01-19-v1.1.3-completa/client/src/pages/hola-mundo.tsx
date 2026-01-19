import React from 'react';

export default function HolaMundo() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6">¡Hola Mundo!</h1>
      <p className="text-center text-xl mb-8">Esta es una página de prueba básica.</p>
      
      <div className="bg-blue-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Página de demostración</h2>
        <p className="mb-4">
          Esta página es una prueba simple para verificar que el enrutamiento funciona correctamente.
        </p>
        <div className="flex justify-center">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Botón de Prueba
          </button>
        </div>
      </div>
    </div>
  );
}
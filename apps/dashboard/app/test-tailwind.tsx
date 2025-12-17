"use client";

import React from 'react';

const TestTailwind: React.FC = () => {
  return (
    <div className="p-8 bg-blue-500 text-white rounded-lg shadow-lg m-4">
      <h1 className="text-2xl font-bold mb-4">Test Tailwind CSS</h1>
      <p className="text-lg">Si ves esto con fondo azul y texto blanco, Tailwind está funcionando.</p>
      <div className="mt-4 space-y-2">
        <div className="bg-red-500 p-2 rounded">Fondo rojo</div>
        <div className="bg-green-500 p-2 rounded">Fondo verde</div>
        <div className="bg-yellow-500 p-2 rounded">Fondo amarillo</div>
      </div>
    </div>
  );
};

export default TestTailwind; 

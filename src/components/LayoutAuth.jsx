// src/components/LayoutAuth.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const LayoutAuth = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a2540] px-4">
      <div className="bg-white/10 backdrop-blur p-8 rounded-xl shadow-md w-full max-w-md border border-white/20">
        {children}

        <div className="mt-6 text-sm text-white/90 flex items-center justify-between">
          <Link to="/" className="underline">
            ← Retour à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LayoutAuth;

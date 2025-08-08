import React from 'react';

const LayoutAuth = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Colonne gauche avec image */}
      <div
        className="md:w-1/2 bg-cover bg-center hidden md:block"
        style={{
          backgroundImage: "url('/images/olympique.jpg')",
        }}
      ></div>

      {/* Colonne droite avec le formulaire et marge en bas */}
      <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-between p-8">
        <div className="w-full max-w-md mx-auto mt-10 mb-20">{children}</div>
      </div>
    </div>
  );
};

export default LayoutAuth;

import React from 'react';

const Admin = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#fff4f4] flex flex-col items-center justify-center text-center">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          🛠️ Espace Administrateur
        </h2>
        <p className="text-gray-700 text-lg">
          Bienvenue dans votre tableau de bord administrateur.
        </p>
        <p className="text-gray-600 mt-2">
          Ici, vous pouvez gérer les utilisateurs, les événements et les
          réservations.
        </p>

        <div className="mt-6">
          <img
            src="/images/admin-panel.png"
            alt="Admin Illustration"
            className="w-40 mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;

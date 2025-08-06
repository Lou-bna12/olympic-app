import React from 'react';

const Admin = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-fond">
      <h2 className="text-2xl font-bold text-red-600 text-center">
        Espace Administrateur
      </h2>
      <div className="mt-6 text-center text-gray-700">
        <p>Gérez les utilisateurs, les événements et les réservations.</p>
      </div>
    </div>
  );
};

export default Admin;

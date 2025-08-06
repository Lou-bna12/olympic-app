import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-fond">
      <h2 className="text-2xl font-bold text-blue-600 text-center">
        Tableau de bord
      </h2>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">Vos réservations</div>
        <div className="bg-white p-4 rounded shadow">
          Informations personnelles
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

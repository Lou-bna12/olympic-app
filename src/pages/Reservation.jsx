import React from 'react';

const Reservation = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-fond">
      <h2 className="text-2xl font-semibold text-blue-600 text-center">
        Réservation de Billets
      </h2>
      <div className="mt-6 flex flex-col items-center">
        <p className="text-gray-700">
          Choisissez vos places et validez votre réservation.
        </p>
        {/* Formulaire ou composants de réservation à insérer ici */}
      </div>
    </div>
  );
};

export default Reservation;

import React from 'react';

const Confirmation = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-fond">
      <h2 className="text-2xl font-bold text-green-600">
        Réservation confirmée ✅
      </h2>
      <p className="mt-4 text-gray-700 text-center">
        Votre billet a été envoyé par email.
      </p>
    </div>
  );
};

export default Confirmation;

import React from 'react';

const Confirmation = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-[#f0f9f7] flex flex-col items-center justify-center text-center">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Réservation confirmée
        </h2>
        <p className="text-gray-700 text-lg">Merci pour votre réservation !</p>
        <p className="text-gray-600 mt-2">
          Votre billet a été envoyé à votre adresse email 📩
        </p>

        <div className="mt-6">
          <img
            src="/images/ticket-success.png"
            alt="Billet confirmé"
            className="w-32 mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

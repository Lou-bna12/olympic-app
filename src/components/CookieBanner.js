// CookieBanner.js
import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-6">
          <h3 className="font-bold text-lg mb-2">Gestion des cookies</h3>
          <p className="text-sm">
            Nous utilisons des cookies pour améliorer votre expérience sur notre
            site. En cliquant sur "Accepter", vous consentez à l'utilisation de
            tous les cookies.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Accepter
          </button>
          <button
            onClick={handleReject}
            className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Refuser
          </button>
          <button
            onClick={() => {
              /* Ajouter la logique pour les préférences */
            }}
            className="bg-transparent text-gray-300 px-5 py-2 rounded-lg hover:text-white transition duration-200 border border-gray-600"
          >
            Préférences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

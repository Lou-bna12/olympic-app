// Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleOfferRedirect = (offerType) => {
    // Convertir en format avec première lettre en majuscule
    const formattedOffer =
      offerType.charAt(0).toUpperCase() + offerType.slice(1);

    if (token) {
      navigate(`/reservation?offre=${formattedOffer}`);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <section
        className="relative bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/jo_accueil.jpg')", // Chemin relatif vers l'image locale
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20 text-center text-white"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Bienvenue sur la billetterie officielle des Jeux Olympiques Paris
            2024 !
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-xl max-w-3xl mx-auto">
            Vivez l'expérience unique des Jeux Olympiques 2024 à Paris. Réservez
            vos places, découvrez les événements et soyez au cœur de l'action !
          </p>

          {/* SUPPRESSION: Bouton "Acheter mes billets" */}
        </motion.div>
      </section>

      {/* Offres améliorées */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-8">
          Nos Formules Exclusives
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Offre Solo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="cursor-pointer bg-white/70 backdrop-blur rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-blue-100"
          >
            <div className="text-center mb-4">
              <FaStar className="w-8 h-8 text-blue-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              Formule Solo
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              Parfait pour vivre l'expérience en solo
            </p>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-blue-600">25€</span>
              <p className="text-sm text-gray-500">par personne</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => handleOfferRedirect('solo')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Choisir cette offre
              </button>
            </div>
          </motion.div>

          {/* Offre Duo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="cursor-pointer bg-white/70 backdrop-blur rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-green-100"
          >
            <div className="text-center mb-4">
              <FaStar className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              Formule Duo
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              Partagez l'expérience à deux
            </p>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-green-600">50€</span>
              <p className="text-sm text-gray-500">pour deux personnes</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => handleOfferRedirect('duo')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Choisir cette offre
              </button>
            </div>
          </motion.div>

          {/* Offre Familiale */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="cursor-pointer bg-white/70 backdrop-blur rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-purple-100"
          >
            <div className="text-center mb-4">
              <FaStar className="w-8 h-8 text-purple-600 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              Formule Famille
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              Idéal pour une expérience familiale
            </p>
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-purple-600">150€</span>
              <p className="text-sm text-gray-500">pour toute la famille</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => handleOfferRedirect('familiale')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
              >
                Choisir cette offre
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

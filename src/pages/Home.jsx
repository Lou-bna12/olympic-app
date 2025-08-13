import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero avec image en arrière-plan */}
      <section
        className="relative bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'url(http://localhost:3000/images/jo_accueil.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        {/* Contenu + légère anim d’apparition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20 text-center text-white"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Bienvenue sur la billetterie officielle des Jeux Olympiques Paris
            2024&nbsp;!
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-xl max-w-3xl mx-auto">
            Réservez vos billets, accédez à votre espace personnel ou gérez les
            réservations en tant qu&apos;administrateur. Vivez les Jeux au plus
            près de l&apos;action&nbsp;!
          </p>
        </motion.div>
      </section>

      {/* Offres */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-8">
          Nos Offres
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Solo - entre depuis la droite */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="cursor-pointer bg-white/70 backdrop-blur rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900">Offre Solo</h3>
            <p className="mt-2 text-gray-600">
              Réservez votre billet solo pour un événement incroyable !
            </p>
            <Link
              to="/reservation"
              className="mt-4 inline-block text-blue-700 hover:underline"
            >
              Réserver
            </Link>
          </motion.div>

          {/* Duo - entre depuis la gauche */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="cursor-pointer bg-white/70 backdrop-blur rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900">Offre Duo</h3>
            <p className="mt-2 text-gray-600">
              Profitez de l’offre duo et vivez l’expérience à deux !
            </p>
            <Link
              to="/reservation"
              className="mt-4 inline-block text-blue-700 hover:underline"
            >
              Réserver
            </Link>
          </motion.div>

          {/* Familiale - entre depuis le bas */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            whileHover={{ y: -4 }}
            className="cursor-pointer bg-white/70 backdrop-blur rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Offre Familiale
            </h3>
            <p className="mt-2 text-gray-600">
              Réservez pour toute la famille avec des réductions spéciales !
            </p>
            <Link
              to="/reservation"
              className="mt-4 inline-block text-blue-700 hover:underline"
            >
              Réserver
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;

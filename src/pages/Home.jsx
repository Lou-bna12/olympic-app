import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { motion } from 'framer-motion'; // Animations

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Logo JO" className="h-10 w-auto" />
          <span className="text-xl font-bold text-gray-800">JO</span>
        </Link>

        {/* Menu mobile */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-800">
          <Link to="/" className="hover:text-blue-700">
            Accueil
          </Link>
          <Link to="/login" className="hover:text-blue-700">
            Connexion
          </Link>
          <Link to="/register" className="hover:text-blue-700">
            Inscription
          </Link>
          <Link to="/reservation" className="hover:text-blue-700">
            Réservation
          </Link>
        </nav>
      </div>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
          <Link to="/" className="block hover:text-blue-700">
            Accueil
          </Link>
          <Link to="/login" className="block hover:text-blue-700">
            Connexion
          </Link>
          <Link to="/register" className="block hover:text-blue-700">
            Inscription
          </Link>
          <Link to="/reservation" className="block hover:text-blue-700">
            Réservation
          </Link>
        </div>
      )}
    </header>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section d'accueil avec image en arrière-plan */}
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: 'url(http://localhost:3000/images/jo_accueil.jpg)',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            Bienvenue sur la billetterie officielle des Jeux Olympiques Paris
            2024 !
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-xl max-w-3xl mx-auto">
            Réservez vos billets, accédez à votre espace personnel ou gérez les
            réservations en tant qu'administrateur. Vivez les Jeux au plus près
            de l'action !
          </p>
        </div>
      </section>

      {/* Offres */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-8">
          Nos Offres
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Solo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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

          {/* Duo */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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

          {/* Familiale */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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

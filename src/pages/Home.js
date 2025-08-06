import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-[#FDF8F2] min-h-screen">
      {/* Bannière principale */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Bienvenue aux Jeux Olympiques 2024
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Réservez vos billets pour vivre l’événement sportif mondial le plus
          attendu à Paris !
        </p>
        <div className="mt-6">
          <Link
            to="/reservation"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Réserver mes billets
          </Link>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Un événement unique
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Les JO 2024 réunissent les meilleurs athlètes du monde dans une
          ambiance de fraternité, de compétition et de passion. Suivez les
          disciplines phares, vibrez au rythme des épreuves, et soutenez vos
          champions !
        </p>
      </section>

      {/* Accès rapide */}
      <section className="py-10 px-6 bg-white">
        <h3 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Accès rapide
        </h3>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <Link
            to="/register"
            className="bg-gray-100 px-6 py-3 rounded shadow hover:bg-gray-200 transition"
          >
            S'inscrire
          </Link>
          <Link
            to="/login"
            className="bg-gray-100 px-6 py-3 rounded shadow hover:bg-gray-200 transition"
          >
            Se connecter
          </Link>
          <Link
            to="/dashboard"
            className="bg-gray-100 px-6 py-3 rounded shadow hover:bg-gray-200 transition"
          >
            Tableau de bord
          </Link>
        </div>
      </section>

      {/* Appel à l’action */}
      <section className="py-16 px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Prêt à vivre une expérience inoubliable ?
        </h3>
        <Link
          to="/reservation"
          className="bg-blue-600 text-white px-8 py-4 text-lg rounded-lg hover:bg-blue-700 transition"
        >
          Réserver mes billets
        </Link>
      </section>
    </div>
  );
};

export default Home;

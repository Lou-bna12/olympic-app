// src/pages/Home.js
import React from 'react';

const Home = () => {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-4 py-12 md:py-20">
      <section className="max-w-6xl w-full text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
          Bienvenue sur la billetterie officielle des Jeux Olympiques Paris 2024
          !
        </h1>

        <p className="text-base md:text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
          Réservez vos billets, accédez à votre espace personnel ou gérez les
          réservations en tant qu'administrateur. Vivez les Jeux au plus près de
          l'action !
        </p>

        <div className="w-full flex justify-center">
          <img
            src="/images/jo_accueil.jpg"
            alt="Jeux Olympiques Paris 2024"
            className="w-full max-w-2xl rounded-lg shadow-lg object-cover"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;

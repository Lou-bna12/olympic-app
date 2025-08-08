import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Import du contexte utilisateur
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { utilisateur } = useContext(UserContext); // Accès à l'utilisateur du contexte

  if (!utilisateur) {
    return null; // Si l'utilisateur n'est pas connecté, rien n'est rendu
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-[#f7f9fc] flex flex-col items-center">
      <motion.h2
        className="text-3xl font-bold text-center text-[#0051BA] mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Espace personnel
      </motion.h2>

      <motion.p
        className="text-gray-700 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        Bienvenue, <span className="font-semibold">{utilisateur.email}</span>
      </motion.p>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloc Réservations */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Vos réservations
          </h3>
          <p className="text-gray-500 text-sm">
            Aucune réservation pour l’instant.
          </p>
        </motion.div>

        {/* Bloc Infos Perso */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Informations personnelles
          </h3>
          <p className="text-gray-500 text-sm">Email : {utilisateur.email}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

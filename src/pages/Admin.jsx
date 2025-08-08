import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Import du contexte utilisateur
import { motion } from 'framer-motion';

const AdminPage = () => {
  const { utilisateur } = useContext(UserContext); // Récupération de l'utilisateur actuel

  // Si l'utilisateur n'est pas un admin, on lui montre un message d'accès refusé
  if (utilisateur?.role !== 'admin') {
    return <div>Accès refusé</div>;
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-[#f7f9fc]">
      <motion.h2
        className="text-3xl font-bold text-center text-[#0051BA] mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Espace Administrateur
      </motion.h2>

      {/* Tableau de gestion des utilisateurs */}
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Gestion des utilisateurs
        </h3>

        {/* Tableau des utilisateurs */}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Nom
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Email
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Rôle
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Exemple d'un utilisateur */}
            <tr>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2">john@example.com</td>
              <td className="px-4 py-2">Utilisateur</td>
              <td className="px-4 py-2">
                <button className="text-blue-600 hover:underline">
                  Modifier
                </button>
                <button className="text-red-600 hover:underline ml-4">
                  Supprimer
                </button>
              </td>
            </tr>

            {/* Ajouter d'autres utilisateurs ici */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;

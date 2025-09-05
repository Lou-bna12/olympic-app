import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaList } from 'react-icons/fa';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    total_reservations: 0,
    next_reservation_date: null,
    next_reservation_offre: null,
    active_reservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      console.log('🔄 Redirecting admin to /admin');
      navigate('/admin');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          'http://127.0.0.1:8000/reservations/stats',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des statistiques:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, navigate]);

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Redirection vers l'interface administrateur...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Bouton de retour */}
        <Link
          to="/mes-reservations"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Retour à mes réservations
        </Link>

        {/* Message de Bienvenue */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenue{user?.username ? `, ${user.username}` : ''} ! 👋
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations pour les Jeux Olympiques 2024
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Mes Réservations
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {stats.total_reservations}
            </p>
            <p className="text-gray-600">réservations au total</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Prochaine Réservation
            </h2>
            <p className="text-2xl font-bold text-green-600">
              {stats.next_reservation_date
                ? new Date(stats.next_reservation_date).toLocaleDateString(
                    'fr-FR'
                  )
                : 'Aucune'}
            </p>
            <p className="text-gray-600">
              {stats.next_reservation_offre
                ? `Offre: ${stats.next_reservation_offre}`
                : ''}
            </p>
          </div>
        </div>

        {/* Carte réservations actives */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Réservations Actives
          </h2>
          <p className="text-3xl font-bold text-orange-600">
            {stats.active_reservations}
          </p>
          <p className="text-gray-600">réservations à venir</p>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/reservation')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition duration-200"
            >
              <FaPlus className="w-4 h-4" />
              Nouvelle réservation
            </button>
            <button
              onClick={() => navigate('/mes-reservations')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 transition duration-200"
            >
              <FaList className="w-4 h-4" />
              Voir mes réservations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

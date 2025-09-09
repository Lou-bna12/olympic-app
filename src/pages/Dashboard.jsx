import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaTicketAlt,
  FaCreditCard,
  FaListAlt,
  FaPlusCircle,
} from 'react-icons/fa';
import { getMyReservations, getMyTickets } from '../services/api';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    reservations: 0,
    tickets: 0,
    pendingPayment: 0,
    totalSpent: 0,
    total_reservations: 0,
    next_reservation_date: null,
    next_reservation_offre: null,
    active_reservations: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
      return;
    }

    const loadStats = async () => {
      try {
        const [reservations, tickets] = await Promise.all([
          getMyReservations(),
          getMyTickets(),
        ]);

        const pendingPayment = (tickets || []).filter((t) => !t.is_paid).length;
        const totalSpent = (tickets || [])
          .filter((t) => t.is_paid)
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        let additional = {};
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://127.0.0.1:8000/reservations/stats', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (res.ok) additional = await res.json();
        } catch (e) {
          console.error('Erreur stats supplémentaires:', e);
        }

        setStats({
          reservations: reservations?.length || 0,
          tickets: tickets?.length || 0,
          pendingPayment,
          totalSpent,
          ...additional,
        });
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [isAdmin, navigate]);

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          Redirection vers l'interface administrateur…
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenue{user?.username ? `, ${user.username}` : ''} !
          </h1>
          <p className="text-gray-600">
            Gérez vos réservations et tickets pour les Jeux Olympiques 2024
          </p>
        </div>

        <div className="mb-8">
          <Link
            to="/reservation"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <FaPlusCircle className="mr-2" />
            Réserver un nouveau billet
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Link
            to="/mes-reservations"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <FaListAlt className="text-blue-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Mes Réservations</h2>
            </div>
            <p className="text-gray-600">
              Consultez et gérez toutes vos réservations
            </p>
          </Link>

          <Link
            to="/mes-tickets"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <FaTicketAlt className="text-green-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Mes Tickets</h2>
            </div>
            <p className="text-gray-600">Accédez à vos tickets et QR codes</p>
          </Link>

          <Link
            to="/mes-tickets"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center mb-4">
              <FaCreditCard className="text-purple-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Paiement</h2>
            </div>
            <p className="text-gray-600">Payez vos tickets en attente</p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Mes Statistiques
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {stats.total_reservations || stats.reservations}
              </p>
              <p className="text-gray-600">Réservations</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {stats.tickets}
              </p>
              <p className="text-gray-600">Tickets</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {stats.pendingPayment}
              </p>
              <p className="text-gray-600">À payer</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {stats.totalSpent}€
              </p>
              <p className="text-gray-600">Dépensés</p>
            </div>
          </div>
        </div>

        {(stats.next_reservation_date || stats.active_reservations > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {stats.next_reservation_date && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Prochaine Réservation
                </h2>
                <p className="text-2xl font-bold text-green-600">
                  {new Date(stats.next_reservation_date).toLocaleDateString(
                    'fr-FR'
                  )}
                </p>
                <p className="text-gray-600">
                  {stats.next_reservation_offre
                    ? `Offre: ${stats.next_reservation_offre}`
                    : ''}
                </p>
              </div>
            )}

            {stats.active_reservations > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Réservations Actives
                </h2>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.active_reservations}
                </p>
                <p className="text-gray-600">réservations à venir</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

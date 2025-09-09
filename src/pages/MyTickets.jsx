import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyTickets } from '../services/api';
import TicketCard from '../components/TicketCard';
import { FaArrowLeft } from 'react-icons/fa';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      setTickets(data);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* NOUVEAU : Bouton de retour */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Retour au tableau de bord
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Mes Tickets</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Vous n'avez aucun ticket pour le moment.
          </p>
          <Link
            to="/reservation"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Réserver un billet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onUpdate={loadTickets}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;

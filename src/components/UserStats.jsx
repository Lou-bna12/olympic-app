import React, { useState, useEffect } from 'react';
import { getMyReservations, getMyTickets } from '../services/api';

const UserStats = () => {
  const [stats, setStats] = useState({
    reservations: 0,
    tickets: 0,
    pendingPayment: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [reservations, tickets] = await Promise.all([
          getMyReservations(),
          getMyTickets(),
        ]);

        const pendingPayment = tickets.filter(
          (ticket) => !ticket.is_paid
        ).length;
        const totalSpent = tickets
          .filter((ticket) => ticket.is_paid)
          .reduce((sum, ticket) => sum + ticket.amount, 0);

        setStats({
          reservations: reservations.length,
          tickets: tickets.length,
          pendingPayment,
          totalSpent,
        });
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-blue-50 rounded">
        <p className="text-2xl font-bold text-blue-600">{stats.reservations}</p>
        <p className="text-gray-600">Réservations</p>
      </div>
      <div className="text-center p-4 bg-green-50 rounded">
        <p className="text-2xl font-bold text-green-600">{stats.tickets}</p>
        <p className="text-gray-600">Tickets</p>
      </div>
      <div className="text-center p-4 bg-purple-50 rounded">
        <p className="text-2xl font-bold text-purple-600">
          {stats.pendingPayment}
        </p>
        <p className="text-gray-600">À payer</p>
      </div>
      <div className="text-center p-4 bg-orange-50 rounded">
        <p className="text-2xl font-bold text-orange-600">
          {stats.totalSpent}€
        </p>
        <p className="text-gray-600">Dépensés</p>
      </div>
    </div>
  );
};

export default UserStats;

import React, { useEffect, useState } from 'react';
import { API_URL } from '../services/api';

const Admin = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/reservations/admin/reservations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReservations(data);
        }
      } catch (e) {
        console.error('Erreur fetch admin reservations:', e);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Réservations - Admin</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Offre</th>
            <th className="border p-2">Quantité</th>
            <th className="border p-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.id}</td>
              <td className="border p-2">{r.username}</td>
              <td className="border p-2">{r.email}</td>
              <td className="border p-2">{r.offer}</td>
              <td className="border p-2">{r.quantity}</td>
              <td className="border p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;

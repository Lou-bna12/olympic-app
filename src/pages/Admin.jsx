import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Admin() {
  const [reservations, setReservations] = useState([]);
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState([]);
  const [newOffer, setNewOffer] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    is_active: true,
  });

  // Charger données
  useEffect(() => {
    fetchReservations();
    fetchOffers();
    fetchStats();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/admin/reservations/all');
      setReservations(res.data);
    } catch (err) {
      console.error('Erreur reservations:', err);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await api.get('/admin/offers');
      setOffers(res.data);
    } catch (err) {
      console.error('Erreur offers:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/offers/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Erreur stats:', err);
    }
  };

  // Supprimer réservation
  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Supprimer cette réservation ?')) return;
    try {
      await api.delete(`/admin/reservations/${id}`);
      fetchReservations();
      fetchStats();
    } catch (err) {
      console.error('Erreur suppression reservation:', err);
    }
  };

  // Ajouter une offre
  const handleAddOffer = async () => {
    try {
      await api.post('/admin/offers', newOffer);
      setNewOffer({
        name: '',
        description: '',
        price: '',
        capacity: '',
        is_active: true,
      });
      fetchOffers();
      fetchStats();
    } catch (err) {
      console.error('Erreur ajout offre:', err);
    }
  };

  // Supprimer offre
  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Supprimer cette offre ?')) return;
    try {
      await api.delete(`/admin/offers/${id}`);
      fetchOffers();
      fetchStats();
    } catch (err) {
      console.error('Erreur suppression offre:', err);
    }
  };

  // Modifier offre
  const handleUpdateOffer = async (id) => {
    const newName = prompt("Nouveau nom de l'offre :");
    if (!newName) return;
    try {
      await api.put(`/admin/offers/${id}`, { name: newName });
      fetchOffers();
      fetchStats();
    } catch (err) {
      console.error('Erreur modification offre:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard Administrateur</h2>

      <h3 className="text-xl font-semibold mb-2">Toutes les réservations</h3>
      <table className="min-w-full bg-white border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Utilisateur</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Offre</th>
            <th className="border px-4 py-2">Quantité</th>
            <th className="border px-4 py-2">Statut</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td className="border px-4 py-2">{r.id}</td>
              <td className="border px-4 py-2">{r.username}</td>
              <td className="border px-4 py-2">{r.email}</td>
              <td className="border px-4 py-2">{r.offre}</td>
              <td className="border px-4 py-2">{r.quantity}</td>
              <td className="border px-4 py-2">{r.status}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDeleteReservation(r.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mb-2">Gestion des Offres</h3>
      <table className="min-w-full bg-white border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Prix (€)</th>
            <th className="border px-4 py-2">Capacité</th>
            <th className="border px-4 py-2">Active</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((o) => (
            <tr key={o.id}>
              <td className="border px-4 py-2">{o.id}</td>
              <td className="border px-4 py-2">{o.name}</td>
              <td className="border px-4 py-2">{o.description}</td>
              <td className="border px-4 py-2">{o.price}</td>
              <td className="border px-4 py-2">{o.capacity}</td>
              <td className="border px-4 py-2">
                {o.is_active ? 'Oui' : 'Non'}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleUpdateOffer(o.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteOffer(o.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mb-6">
        <h4 className="font-semibold mb-2">Ajouter une offre</h4>
        <input
          type="text"
          placeholder="Nom"
          className="border px-2 py-1 mr-2"
          value={newOffer.name}
          onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          className="border px-2 py-1 mr-2"
          value={newOffer.description}
          onChange={(e) =>
            setNewOffer({ ...newOffer, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Prix"
          className="border px-2 py-1 mr-2"
          value={newOffer.price}
          onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Capacité"
          className="border px-2 py-1 mr-2"
          value={newOffer.capacity}
          onChange={(e) =>
            setNewOffer({ ...newOffer, capacity: e.target.value })
          }
        />
        <button
          onClick={handleAddOffer}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Ajouter l’offre
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Statistiques par Offre</h3>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Offre</th>
            <th className="border px-4 py-2">Nombre de Réservations</th>
            <th className="border px-4 py-2">Tickets</th>
            <th className="border px-4 py-2">Revenu Total (€)</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{s.offer}</td>
              <td className="border px-4 py-2">{s.reservations}</td>
              <td className="border px-4 py-2">{s.tickets}</td>
              <td className="border px-4 py-2">{s.revenu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

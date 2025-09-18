import React, { useState, useEffect } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiX,
  FiCheck,
  FiArrowLeft,
  FiDollarSign,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const navigate = useNavigate();

  const calculatePrice = (offre, quantity) => {
    const offerName = offre || 'Solo';
    const normalized = offerName.toLowerCase().trim();
    const prices = {
      solo: 25,
      duo: 50,
      familiale: 150,
      'offre solo': 25,
      'offre duo': 50,
      'offre familiale': 150,
    };
    return (prices[normalized] || 25) * (quantity || 1);
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const corrected = data.map((r) => ({
          ...r,
          offre: r.offre || 'Solo',
        }));
        setReservations(corrected);
      }
    } catch (e) {
      console.error('Erreur fetch reservations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (reservations.length > 0) {
      setStats({
        total_reservations: reservations.length,
        active_reservations: reservations.filter((r) =>
          ['confirmed', 'approved', 'paid'].includes(r.status)
        ).length,
        pending_payments: reservations.filter(
          (r) => r.status === 'pending_payment'
        ).length,
        total_amount: reservations.reduce(
          (total, r) => total + calculatePrice(r.offre, r.quantity),
          0
        ),
      });
    } else {
      setStats({
        total_reservations: 0,
        active_reservations: 0,
        pending_payments: 0,
        total_amount: 0,
      });
    }
  }, [reservations]);

  const deleteReservation = async (id) => {
    if (!window.confirm('Supprimer cette réservation ?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error('Erreur suppression:', e);
    }
  };

  const startEditing = (reservation) => {
    setEditingId(reservation.id);
    setEditForm({
      date: reservation.date ? reservation.date.slice(0, 10) : '',
      offre: reservation.offre || 'Solo',
      quantity: reservation.quantity || 1,
    });
  };

  const saveEdit = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      setEditingId(null);
      fetchReservations();
    } catch (e) {
      console.error('Erreur update:', e);
    }
  };

  const processPayment = async () => {
    if (!selectedReservation) return;
    const token = localStorage.getItem('token');
    const amount = calculatePrice(
      selectedReservation.offre,
      selectedReservation.quantity
    );
    try {
      const res = await fetch(`${API_URL}/payment/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_id: selectedReservation.id,
          amount,
        }),
      });
      if (res.ok) {
        alert('Paiement réussi 🎉');
        setShowPaymentModal(false);
        setSelectedReservation(null);
        fetchReservations();
      }
    } catch (e) {
      console.error('Erreur paiement:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement des réservations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600"
        >
          <FiArrowLeft className="mr-2" /> Retour
        </button>

        <h1 className="text-3xl font-bold mb-6">Mes Réservations</h1>

        {/* Statistiques */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{stats.total_reservations}</p>
              <p>Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active_reservations}</p>
              <p>Actives</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending_payments}</p>
              <p>À payer</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total_amount}€</p>
              <p>Total €</p>
            </div>
          </div>
        </div>

        {/* Liste réservations */}
        {reservations.length === 0 ? (
          <p>Aucune réservation trouvée.</p>
        ) : (
          reservations.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-lg shadow p-6 mb-4 flex justify-between items-center"
            >
              {editingId === r.id ? (
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                  />
                  <select
                    value={editForm.offre}
                    onChange={(e) =>
                      setEditForm({ ...editForm, offre: e.target.value })
                    }
                  >
                    <option value="Solo">Solo (25€)</option>
                    <option value="Duo">Duo (50€)</option>
                    <option value="Familiale">Familiale (150€)</option>
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={editForm.quantity}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        quantity: parseInt(e.target.value, 10),
                      })
                    }
                  />
                  <button onClick={() => saveEdit(r.id)}>
                    <FiCheck />
                  </button>
                  <button onClick={() => setEditingId(null)}>
                    <FiX />
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold">
                      #{r.id} - {r.offre}
                    </p>
                    <p>
                      {r.date
                        ? new Date(r.date).toLocaleDateString('fr-FR')
                        : '-'}
                    </p>
                    <p>Quantité : {r.quantity}</p>
                    <p>Prix : {calculatePrice(r.offre, r.quantity)} €</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditing(r)}>
                      <FiEdit />
                    </button>
                    <button onClick={() => deleteReservation(r.id)}>
                      <FiTrash2 />
                    </button>
                    {r.status === 'pending_payment' && (
                      <button
                        onClick={() => {
                          setSelectedReservation(r);
                          setShowPaymentModal(true);
                        }}
                      >
                        <FiDollarSign />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}

        {/* Modal paiement */}
        {showPaymentModal && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-lg font-bold mb-4">
                Paiement réservation #{selectedReservation.id}
              </h2>
              <p>
                Montant :{' '}
                {calculatePrice(
                  selectedReservation.offre,
                  selectedReservation.quantity
                )}{' '}
                €
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={processPayment}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesReservations;

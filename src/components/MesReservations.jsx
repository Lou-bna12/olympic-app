import React, { useState, useEffect } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiDownload,
  FiX,
  FiCheck,
  FiArrowLeft,
  FiCreditCard,
  FiDollarSign,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const navigate = useNavigate();
  const API = 'http://127.0.0.1:8000';
  const getOfferName = (obj) => obj?.offer ?? obj?.offre ?? '';

  // Map "nom d'offre" -> id d'offre (adapte si besoin)
  const offerIdFromName = (name) => {
    const map = { Solo: 1, Duo: 2, Familiale: 3 };
    return map[name] ?? null;
  };

  const calculatePrice = (offre, quantity) => {
    const prices = { Solo: 25, Duo: 50, Familiale: 150 };
    return (prices[offre] || 0) * (quantity || 0);
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          (total, r) => total + calculatePrice(getOfferName(r), r.quantity),
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
    setLoading(false);
  }, [reservations]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      } else {
        console.error('Erreur chargement réservations:', await res.text());
      }
    } catch (e) {
      console.error('Erreur:', e);
    } finally {
      setLoading(false);
    }
  };

  // --- FIX: lire le PNG en blob (pas en json) et l'ouvrir proprement
  const generateQRCode = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/reservations/${reservationId}/qrcode`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error('Erreur QR:', await res.text());
        return;
      }
      const blob = await res.blob(); // <--- clé
      const url = URL.createObjectURL(blob);

      const w = window.open('', '_blank');
      if (!w) return;

      w.document.write(`
        <html>
          <head><title>QR Code Réservation #${reservationId}</title></head>
          <body style="display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f8fafc;">
            <div style="background:#fff;padding:24px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.1);text-align:center;">
              <img src="${url}" alt="QR Code Réservation ${reservationId}" style="max-width:280px;max-height:280px;" />
              <p style="margin-top:20px;font-family:Inter,ui-sans-serif;color:#374151;font-size:16px;">
                Réservation #${reservationId}<br/>Jeux Olympiques Paris 2024
              </p>
            </div>
          </body>
        </html>
      `);
      w.document.close();

      // On libère l'URL quand l'onglet se ferme
      const revoke = () => URL.revokeObjectURL(url);
      w.addEventListener('beforeunload', revoke);
      // Sécurité : au cas où
      setTimeout(revoke, 60_000);
    } catch (e) {
      console.error('Erreur QR code:', e);
    }
  };

  const deleteReservation = async (reservationId) => {
    if (
      !window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')
    )
      return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      } else {
        console.error('Erreur suppression:', await res.text());
      }
    } catch (e) {
      console.error('Erreur suppression:', e);
    }
  };

  const startEditing = (reservation) => {
    setEditingId(reservation.id);
    setEditForm({
      date: reservation.date ? reservation.date.slice(0, 10) : '',
      offre: reservation.offre,
      quantity: reservation.quantity,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        await fetchReservations();
        setEditingId(null);
      } else {
        console.error('Erreur modification:', await res.text());
      }
    } catch (e) {
      console.error('Erreur modification:', e);
    }
  };

  const openPaymentModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowPaymentModal(true);
  };

  // ========= Paiement =========
  const processPayment = async () => {
    if (!selectedReservation) return;

    const token = localStorage.getItem('token');

    const payWithReservationId = async () => {
      const pRes = await fetch(`${API}/payment/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservation_id: selectedReservation.id }),
      });
      return pRes;
    };

    try {
      const offerId = offerIdFromName(selectedReservation.offre);
      let ticketId = null;

      if (offerId) {
        const tRes = await fetch(`${API}/tickets/?offer_id=${offerId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (tRes.ok) {
          const tData = await tRes.json();
          ticketId = tData?.id ?? tData?.ticket_id ?? tData?.ticket?.id ?? null;
        } else if (tRes.status !== 404) {
          const txt = await tRes.text();
          console.error('Erreur création ticket:', txt);
          alert('Impossible de créer le ticket (vérifie l’offre / session).');
          return;
        }
      }

      let pRes;
      if (ticketId) {
        pRes = await fetch(`${API}/payment/simulate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ticket_id: ticketId }),
        });
      } else {
        pRes = await payWithReservationId();
      }

      if (!pRes.ok) {
        const txt = await pRes.text();
        console.error('Erreur paiement:', txt);
        alert('Paiement refusé / impossible.');
        return;
      }

      setShowPaymentModal(false);
      setSelectedReservation(null);
      setPaymentForm({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
      });
      await fetchReservations();
    } catch (e) {
      console.error('Erreur paiement:', e);
      alert('Erreur réseau pendant le paiement.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Mes Réservations
        </h1>

        {/* Statistiques */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Mes Statistiques
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold text-blue-700">
                {stats.total_reservations || 0}
              </div>
              <div className="text-sm text-blue-600 mt-1">Réservations</div>
            </div>
            <div className="text-center p-6 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="text-2xl font-bold text-indigo-700">
                {stats.active_reservations || 0}
              </div>
              <div className="text-sm text-indigo-600 mt-1">Actives</div>
            </div>
            <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-2xl font-bold text-amber-700">
                {stats.pending_payments || 0}
              </div>
              <div className="text-sm text-amber-600 mt-1">À payer</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-gray-700">
                {stats.total_amount || 0}€
              </div>
              <div className="text-sm text-gray-600 mt-1">Total</div>
            </div>
          </div>
        </div>

        {/* Réservations */}
        {reservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <FiCreditCard className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 text-lg">Aucune réservation trouvée.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Mes Réservations
            </h2>
            {reservations.map((reservation) => {
              const isPaid = ['approved', 'confirmed', 'paid'].includes(
                reservation.status
              );
              return (
                <div
                  key={reservation.id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  {editingId === reservation.id ? (
                    // Mode édition
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={editForm.date || ''}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offre
                          </label>
                          <select
                            value={editForm.offre || 'Solo'}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                offre: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Solo">Solo</option>
                            <option value="Duo">Duo</option>
                            <option value="Familiale">Familiale</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantité
                          </label>
                          <input
                            type="number"
                            value={editForm.quantity ?? 1}
                            min="1"
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                quantity: parseInt(e.target.value || '1', 10),
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => saveEdit(reservation.id)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
                        >
                          <FiCheck className="w-4 h-4" /> Enregistrer
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors duration-200"
                        >
                          <FiX className="w-4 h-4" /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Réservation #{reservation.id}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <p className="text-gray-900 font-medium">
                              {reservation.date
                                ? new Date(reservation.date).toLocaleDateString(
                                    'fr-FR'
                                  )
                                : '-'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Offre:</span>
                            <p className="text-gray-900 font-medium">
                              {reservation.offre}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantité:</span>
                            <p className="text-gray-900 font-medium">
                              {reservation.quantity}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Prix:</span>
                            <p className="text-gray-900 font-medium">
                              {calculatePrice(
                                reservation.offre,
                                reservation.quantity
                              )}{' '}
                              €
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Statut:</span>
                            <p className="text-gray-900 font-medium">
                              {reservation.status}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {/* QR seulement si payé/confirmé */}
                        {isPaid && (
                          <button
                            onClick={() => generateQRCode(reservation.id)}
                            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Afficher le QR Code"
                          >
                            <FiDownload className="w-5 h-5" />
                          </button>
                        )}

                        {reservation.status === 'pending_payment' && (
                          <button
                            onClick={() => openPaymentModal(reservation)}
                            className="p-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="Payer"
                          >
                            <FiDollarSign className="w-5 h-5" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => startEditing(reservation)}
                          className="p-3 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                          title="Modifier"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal de paiement */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 border border-gray-200 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPaymentModal(false)}
                aria-label="Fermer"
              >
                <FiX className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Paiement
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        cardNumber: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      value={paymentForm.expiryDate}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, cvv: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titulaire de la carte
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cardholderName}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        cardholderName: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom et prénom"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={processPayment}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FiDollarSign className="w-4 h-4" />
                  Payer maintenant
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

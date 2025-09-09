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
  const [pendingPayments, setPendingPayments] = useState([]);
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

  // Fonction pour calculer le prix selon l'offre
  const calculatePrice = (offre, quantity) => {
    const prices = {
      Solo: 25,
      Duo: 50,
      Familiale: 150,
    };
    return (prices[offre] || 0) * quantity;
  };

  useEffect(() => {
    fetchReservations();
    fetchPendingReservations();
    fetchStats();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/reservations/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchPendingReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://127.0.0.1:8000/reservations/me/pending',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingPayments(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/reservations/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://127.0.0.1:8000/reservations/${reservationId}/qrcode`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.qr_code) {
          const newWindow = window.open();
          newWindow.document.write(`
            <html>
              <head><title>QR Code Réservation #${reservationId}</title></head>
              <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; flex-direction: column; background-color: #f5f5f5;">
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <img src="${data.qr_code}" alt="QR Code Réservation ${reservationId}" style="max-width: 300px; max-height: 300px;">
                  <p style="text-align: center; margin-top: 20px; font-family: Arial, sans-serif; color: #333;">
                    Réservation #${reservationId}<br>
                    Jeux Olympiques Paris 2024
                  </p>
                </div>
              </body>
            </html>
          `);
        } else {
          alert('Données QR code non disponibles');
        }
      } else {
        alert('Erreur lors de la génération du QR code');
      }
    } catch (error) {
      console.error('Erreur QR code:', error);
      alert('Erreur lors de la génération du QR code');
    }
  };

  const deleteReservation = async (reservationId) => {
    if (
      !window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')
    ) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://127.0.0.1:8000/reservations/${reservationId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setReservations(reservations.filter((r) => r.id !== reservationId));
        fetchPendingReservations();
        fetchStats();
        alert('Réservation supprimée avec succès');
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const startEditing = (reservation) => {
    setEditingId(reservation.id);
    setEditForm({
      date: reservation.date,
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
      const response = await fetch(
        `http://127.0.0.1:8000/reservations/${reservationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        const updatedReservation = await response.json();
        setReservations(
          reservations.map((r) =>
            r.id === reservationId ? updatedReservation : r
          )
        );
        setEditingId(null);
        alert('Réservation modifiée avec succès');
      }
    } catch (error) {
      console.error('Erreur modification:', error);
      alert('Erreur lors de la modification');
    }
  };

  const openPaymentModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        'http://127.0.0.1:8000/reservations/payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reservation_id: selectedReservation.id,
            ...paymentForm,
          }),
        }
      );

      if (response.ok) {
        alert('Paiement effectué avec succès!');
        setShowPaymentModal(false);
        // Recharger les données
        fetchReservations();
        fetchPendingReservations();
        fetchStats();
      } else {
        alert('Erreur lors du paiement');
      }
    } catch (error) {
      console.error('Erreur paiement:', error);
      alert('Erreur lors du paiement');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <FiArrowLeft className="mr-2" />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mes Réservations
        </h1>

        {/* Section Statistiques */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Mes Statistiques
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.total_reservations || 0}
              </div>
              <div className="text-sm text-gray-600">Réservations</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.active_reservations || 0}
              </div>
              <div className="text-sm text-gray-600">Tickets</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending_payments || 0}
              </div>
              <div className="text-sm text-gray-600">À payer</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.total_spent || 0}€
              </div>
              <div className="text-sm text-gray-600">Dépensés</div>
            </div>
          </div>

          {stats.next_reservation_date && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800">
                Prochaine Réservation
              </h3>
              <p className="text-gray-600">
                {new Date(stats.next_reservation_date).toLocaleDateString(
                  'fr-FR'
                )}
              </p>
              <p className="text-gray-600">
                Offre: {stats.next_reservation_offre}
              </p>
            </div>
          )}
        </div>

        {/* Section Paiements en attente */}
        {pendingPayments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Paiements en attente
            </h2>
            <div className="grid gap-6">
              {pendingPayments.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Réservation #{reservation.id} - En attente de paiement
                      </h3>
                      <p className="text-gray-600">
                        Date:{' '}
                        {new Date(reservation.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-600">
                        Offre: {reservation.offre}
                      </p>
                      <p className="text-gray-600">
                        Quantité: {reservation.quantity}
                      </p>
                      <p className="text-gray-600">
                        Prix:{' '}
                        {calculatePrice(
                          reservation.offre,
                          reservation.quantity
                        )}{' '}
                        €
                      </p>
                    </div>
                    <button
                      onClick={() => openPaymentModal(reservation)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <FiDollarSign className="w-4 h-4" /> Payer maintenant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Réservations confirmées */}
        {reservations.filter((r) => r.status === 'confirmed').length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aucune réservation trouvée.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Mes Réservations Confirmées
            </h2>
            {reservations
              .filter((r) => r.status === 'confirmed')
              .map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  {editingId === reservation.id ? (
                    // Mode édition
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              setEditForm({ ...editForm, date: e.target.value })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Offre
                          </label>
                          <select
                            value={editForm.offre}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                offre: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          >
                            <option value="Solo">Solo</option>
                            <option value="Duo">Duo</option>
                            <option value="Familiale">Familiale</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Quantité
                          </label>
                          <input
                            type="number"
                            value={editForm.quantity}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                quantity: parseInt(e.target.value),
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                            min="1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(reservation.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                          <FiCheck className="w-4 h-4" /> Enregistrer
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                        >
                          <FiX className="w-4 h-4" /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Réservation #{reservation.id}
                        </h3>
                        <p className="text-gray-600">
                          Date:{' '}
                          {new Date(reservation.date).toLocaleDateString(
                            'fr-FR'
                          )}
                        </p>
                        <p className="text-gray-600">
                          Offre: {reservation.offre}
                        </p>
                        <p className="text-gray-600">
                          Quantité: {reservation.quantity}
                        </p>
                        <p className="text-gray-600">
                          Prix:{' '}
                          {calculatePrice(
                            reservation.offre,
                            reservation.quantity
                          )}{' '}
                          €
                        </p>
                        <p className="text-gray-600">
                          Statut: {reservation.status || 'confirmée'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => generateQRCode(reservation.id)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center gap-2"
                          title="Télécharger QR Code"
                        >
                          <FiDownload className="w-4 h-4" /> QR
                        </button>

                        <button
                          onClick={() => startEditing(reservation)}
                          className="bg-yellow-600 text-white px-3 py-2 rounded-md flex items-center gap-2"
                          title="Modifier"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-md flex items-center gap-2"
                          title="Supprimer"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Modal de paiement */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Paiement</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
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
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentForm.cvv}
                      onChange={(e) =>
                        setPaymentForm({ ...paymentForm, cvv: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={processPayment}
                    className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <FiCreditCard className="w-4 h-4" /> Payer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesReservations;

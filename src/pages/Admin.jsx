import React, { useState, useEffect } from 'react';
import {
  getAdminStats,
  getAllReservations,
  approveReservation as apiApproveReservation,
  rejectReservation as apiRejectReservation,
  deleteReservation as apiDeleteReservation,
  updateReservation as apiUpdateReservation,
} from '../services/api';

const Admin = () => {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [loading, setLoading] = useState({
    reservations: true,
    stats: true,
    approval: false,
    delete: false,
    update: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const calculatePrice = (offre, quantity) => {
    const prices = { Solo: 25, Duo: 50, Familiale: 150 };
    return (prices[offre] || 70) * quantity;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading((prev) => ({ ...prev, reservations: true, stats: true }));
        setError('');

        const [statsData, reservationsData] = await Promise.all([
          getAdminStats(),
          getAllReservations(),
        ]);

        setStats(statsData);
        setReservations(reservationsData);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur lors du chargement des données administrateur');

        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?error=admin_required';
        }
      } finally {
        setLoading((prev) => ({ ...prev, reservations: false, stats: false }));
      }
    };

    loadData();
  }, []);

  const approveReservation = async (reservationId) => {
    setLoading((prev) => ({ ...prev, approval: true }));
    setError('');
    setSuccessMessage('');

    try {
      await apiApproveReservation(reservationId);
      setSuccessMessage('Réservation approuvée avec succès!');
      refreshData();
    } catch (error) {
      console.error('Erreur:', error);
      setError("Erreur lors de l'approbation de la réservation");
    } finally {
      setLoading((prev) => ({ ...prev, approval: false }));
    }
  };

  const rejectReservation = async (reservationId) => {
    setLoading((prev) => ({ ...prev, approval: true }));
    setError('');
    setSuccessMessage('');

    try {
      await apiRejectReservation(reservationId);
      setSuccessMessage('Réservation rejetée avec succès!');
      refreshData();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du rejet de la réservation');
    } finally {
      setLoading((prev) => ({ ...prev, approval: false }));
    }
  };

  const deleteReservation = async (reservationId) => {
    if (
      !window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')
    ) {
      return;
    }

    setLoading((prev) => ({ ...prev, delete: true }));
    setError('');
    setSuccessMessage('');

    try {
      await apiDeleteReservation(reservationId);
      setSuccessMessage('Réservation supprimée avec succès!');
      refreshData();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la suppression de la réservation');
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const updateReservation = async (reservationId, updatedData) => {
    setLoading((prev) => ({ ...prev, update: true }));
    setError('');
    setSuccessMessage('');

    try {
      await apiUpdateReservation(reservationId, updatedData);
      setSuccessMessage('Réservation modifiée avec succès!');
      setEditingReservation(null);
      refreshData();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la modification de la réservation');
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const refreshData = async () => {
    try {
      setLoading((prev) => ({ ...prev, reservations: true, stats: true }));
      const [statsData, reservationsData] = await Promise.all([
        getAdminStats(),
        getAllReservations(),
      ]);
      setStats(statsData);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du rafraîchissement des données');
    } finally {
      setLoading((prev) => ({ ...prev, reservations: false, stats: false }));
    }
  };

  const EditReservationForm = ({ reservation, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      username: reservation.username,
      email: reservation.email,
      date: reservation.date.split('T')[0],
      offre: reservation.offre,
      quantity: reservation.quantity,
      status: reservation.status,
    });

    const [price, setPrice] = useState(
      calculatePrice(reservation.offre, reservation.quantity)
    );

    useEffect(() => {
      setPrice(calculatePrice(formData.offre, formData.quantity));
    }, [formData.offre, formData.quantity]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(reservation.id, formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Modifier la réservation #{reservation.id}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Offre
                  </label>
                  <select
                    value={formData.offre}
                    onChange={(e) =>
                      setFormData({ ...formData, offre: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="Solo">Solo (25€)</option>
                    <option value="Duo">Duo (50€)</option>
                    <option value="Familiale">Familiale (150€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantité
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prix total
                  </label>
                  <div className="mt-1 p-2 bg-gray-100 rounded-md">
                    <strong>{price} €</strong>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="pending_payment">
                      En attente de paiement
                    </option>
                    <option value="confirmed">Confirmée</option>
                    <option value="approved">Approuvée</option>
                    <option value="rejected">Rejetée</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  disabled={loading.update}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading.update ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading.stats || loading.reservations) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Chargement des données administrateur...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Espace Administrateur</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Total des réservations
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.total_reservations}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Réservations en attente
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pending_reservations}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Utilisateurs inscrits
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.total_users}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-600">
              Revenus totaux
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.revenue} €
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Toutes les réservations</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => {
                const price = calculatePrice(
                  reservation.offre,
                  reservation.quantity
                );
                const displayStatus = reservation.status || 'pending_payment';
                const isPending = displayStatus === 'pending_payment';

                return (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{reservation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {reservation.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.offre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {price} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          displayStatus === 'approved' ||
                          displayStatus === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : displayStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {displayStatus === 'approved'
                          ? 'Approuvée'
                          : displayStatus === 'confirmed'
                          ? 'Confirmée'
                          : displayStatus === 'rejected'
                          ? 'Rejetée'
                          : 'En attente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {isPending && (
                        <>
                          <button
                            onClick={() => approveReservation(reservation.id)}
                            disabled={loading.approval}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approuver"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => rejectReservation(reservation.id)}
                            disabled={loading.approval}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Rejeter"
                          >
                            ✗
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setEditingReservation(reservation)}
                        disabled={loading.update}
                        className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Modifier"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => deleteReservation(reservation.id)}
                        disabled={loading.delete}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {reservations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucune réservation trouvée
          </div>
        )}
      </div>

      {editingReservation && (
        <EditReservationForm
          reservation={editingReservation}
          onSave={updateReservation}
          onCancel={() => setEditingReservation(null)}
        />
      )}
    </div>
  );
};

export default Admin;

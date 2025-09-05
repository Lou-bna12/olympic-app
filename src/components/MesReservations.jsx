import React, { useState, useEffect } from 'react';
import {
  FiEdit,
  FiTrash2,
  FiDownload,
  FiX,
  FiCheck,
  FiArrowLeft,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
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

        // CORRECTION: Utiliser data.qr_code au lieu de data.qrcode
        // et ouvrir l'image directement
        if (data.qr_code) {
          // Ouvrir le QR code dans une nouvelle fenêtre
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
        {/* AJOUT: Bouton de retour */}
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

        {reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Aucune réservation trouvée.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation) => (
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
                            setEditForm({ ...editForm, offre: e.target.value })
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
                        {new Date(reservation.date).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-gray-600">
                        Offre: {reservation.offre}
                      </p>
                      <p className="text-gray-600">
                        Quantité: {reservation.quantity}
                      </p>
                      {/* AJOUT: Affichage du prix */}
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
      </div>
    </div>
  );
};

export default MesReservations;

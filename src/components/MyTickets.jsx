import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { getMyTickets } from '../services/api';

const API = 'http://127.0.0.1:8000';

// Carte de ticket (affichage + QR + bouton supprimer)
function TicketItem({ ticket, onDelete }) {
  const [qrSrc, setQrSrc] = useState('');

  useEffect(() => {
    let revokeUrl = null;

    async function loadQr() {
      try {
        if (ticket?.is_paid && ticket?.reservation_id) {
          const token = localStorage.getItem('token');
          const res = await fetch(
            `${API}/reservations/${ticket.reservation_id}/qrcode`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) {
            setQrSrc('');
            return;
          }
          const url = URL.createObjectURL(await res.blob());
          setQrSrc(url);
          revokeUrl = url;
        } else {
          setQrSrc('');
        }
      } catch (e) {
        console.error('Erreur QR code:', e);
        setQrSrc('');
      }
    }

    loadQr();
    return () => {
      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
    };
  }, [ticket?.id, ticket?.is_paid, ticket?.reservation_id]);

  const handleDeleteClick = () => {
    const paidNote = ticket.is_paid ? ' (ce ticket est payé)' : '';
    if (window.confirm(`Supprimer le ticket #${ticket.id}${paidNote} ?`)) {
      onDelete(ticket.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Ticket #{ticket.id}
            </h3>
            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
              title="Supprimer le ticket"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Offre: <span className="font-medium">{ticket.offer_id}</span>
          </div>
          <div className="text-sm text-gray-600">
            Réservation:{' '}
            <span className="font-medium">{ticket.reservation_id ?? '—'}</span>
          </div>
          <div className="text-sm text-gray-600">
            Statut:{' '}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
              ${
                ticket.is_paid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {ticket.is_paid ? 'Payé' : ticket.payment_status}
            </span>
          </div>
        </div>

        {ticket.is_paid ? (
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 mb-2">
              QR Code
            </div>
            <img
              src={qrSrc}
              alt={`QR du ticket #${ticket.id}`}
              style={{ width: 160, height: 160, objectFit: 'contain' }}
            />
            <p className="mt-2 text-xs text-gray-500">
              Scannez ce QR code à l’entrée
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyTickets();
      setTickets(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des tickets:', err);
      setError('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const deleteTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error('Erreur suppression ticket:', txt);
        alert(txt || 'Suppression impossible.');
        return;
      }
      // Retirer localement
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (e) {
      console.error('Erreur réseau suppression ticket:', e);
      alert('Erreur réseau pendant la suppression.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3">Chargement des tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={fetchTickets}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Tickets</h1>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Aucun ticket pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((t) => (
            <TicketItem key={t.id} ticket={t} onDelete={deleteTicket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;

import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { getMyTickets, API_URL } from '../services/api';

function TicketItem({ ticket, onDelete }) {
  const [qrSrc, setQrSrc] = useState('');

  useEffect(() => {
    let revokeUrl = null;
    async function loadQr() {
      try {
        if (ticket?.is_paid && ticket?.reservation_id) {
          const token = localStorage.getItem('token');
          const res = await fetch(
            `${API_URL}/reservations/${ticket.reservation_id}/qrcode`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) return;
          const url = URL.createObjectURL(await res.blob());
          setQrSrc(url);
          revokeUrl = url;
        }
      } catch (e) {
        console.error('Erreur QR code:', e);
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
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ticket #{ticket.id}</h3>
          <p>Offre: {ticket.offer_id}</p>
          <p>Réservation: {ticket.reservation_id ?? '—'}</p>
          <p>Statut: {ticket.is_paid ? 'Payé' : ticket.payment_status}</p>
        </div>
        {ticket.is_paid && qrSrc && (
          <div>
            <p className="text-sm mb-2">QR Code</p>
            <img src={qrSrc} alt={`QR Ticket ${ticket.id}`} width="160" />
          </div>
        )}
        <button onClick={handleDeleteClick} className="text-red-600">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data || []);
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
      const res = await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      }
    } catch (e) {
      console.error('Erreur suppression ticket:', e);
    }
  };

  if (loading) return <p>Chargement…</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Tickets</h1>
      {tickets.length === 0 ? (
        <p>Aucun ticket.</p>
      ) : (
        tickets.map((t) => (
          <TicketItem key={t.id} ticket={t} onDelete={deleteTicket} />
        ))
      )}
    </div>
  );
};

export default MyTickets;

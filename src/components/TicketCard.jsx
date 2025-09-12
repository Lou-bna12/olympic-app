import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

const API = 'http://127.0.0.1:8000';

export default function TicketCard({ ticket, onUpdate }) {
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
    return () => revokeUrl && URL.revokeObjectURL(revokeUrl);
  }, [ticket?.id, ticket?.is_paid, ticket?.reservation_id]);

  const handleDelete = async () => {
    if (ticket.is_paid) {
      alert('Ce ticket a déjà été payé : suppression désactivée.');
      return;
    }
    if (!window.confirm(`Supprimer le ticket #${ticket.id} ?`)) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/tickets/${ticket.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const txt = await res.text();
        alert(txt || 'Suppression impossible.');
        return;
      }

      onUpdate && onUpdate();
    } catch (e) {
      console.error('Erreur suppression ticket:', e);
      alert('Erreur réseau pendant la suppression.');
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
              onClick={handleDelete}
              className={`p-2 rounded-lg border transition ${
                ticket.is_paid
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-red-200 text-red-600 hover:bg-red-50'
              }`}
              title={
                ticket.is_paid
                  ? 'Ticket payé (suppression impossible)'
                  : 'Supprimer le ticket'
              }
              disabled={ticket.is_paid}
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
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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

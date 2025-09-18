import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api'; // ✅ import

export default function Payment({ ticketId, onPaid }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/payment/simulate`, {
        // ✅ corrigé
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticket_id: ticketId }),
      });

      if (!res.ok) {
        setError('Erreur lors du paiement');
        return;
      }

      const data = await res.json();
      if (data.paid) {
        onPaid && onPaid();
        navigate('/mes-tickets');
      } else {
        setError('Paiement refusé');
      }
    } catch {
      setError('Erreur réseau lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {error && <p className="text-red-600">{error}</p>}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Paiement en cours...' : 'Payer maintenant'}
      </button>
    </div>
  );
}

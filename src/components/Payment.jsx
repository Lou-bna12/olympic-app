import React, { useState } from 'react';
import { simulatePayment } from '../services/api';

const Payment = ({ ticket, onPaymentSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await simulatePayment({ ticket_id: ticket.id });
      onPaymentSuccess(result);
    } catch (error) {
      console.error('Erreur de paiement:', error);
      setError('Erreur lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Paiement</h2>

        <div className="mb-4">
          <h3 className="font-semibold">Détails du ticket</h3>
          <p>Offre: {ticket.offer_name}</p>
          <p>Prix: {ticket.amount} €</p>
        </div>

        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h4 className="font-semibold mb-2">Mode de paiement (simulation)</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                defaultChecked
                className="mr-2"
              />
              💳 Carte bancaire
            </label>
            <label className="flex items-center">
              <input type="radio" name="payment" className="mr-2" />
              📱 PayPal
            </label>
            <label className="flex items-center">
              <input type="radio" name="payment" className="mr-2" />
              🏦 Virement bancaire
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Traitement...' : 'Payer maintenant'}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;

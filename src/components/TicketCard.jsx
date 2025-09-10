import React, { useState, useEffect } from 'react';
import Payment from './Payment';

const TicketCard = ({ ticket, onUpdate }) => {
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    console.log(`Ticket ${ticket.id} - showPayment:`, showPayment);
  }, [showPayment, ticket.id]);

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    onUpdate();
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h3 className="text-lg font-semibold mb-2">Ticket #{ticket.id}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Prix</p>
            <p className="font-medium">{ticket.amount} €</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Statut</p>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                ticket.is_paid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {ticket.is_paid ? 'Payé' : 'En attente'}
            </span>
          </div>
        </div>

        {ticket.is_paid && ticket.qr_code && (
          <div className="mb-4 text-center">
            <img
              src={ticket.qr_code}
              alt="QR Code"
              className="w-32 h-32 mx-auto border rounded"
            />
            <p className="text-xs text-gray-500 mt-2">
              Scannez ce QR code à l'entrée
            </p>
          </div>
        )}

        {!ticket.is_paid && (
          <button
            onClick={() => setShowPayment(true)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Payer maintenant
          </button>
        )}

        {ticket.is_paid && ticket.payment_date && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            Payé le {new Date(ticket.payment_date).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>

      {showPayment && (
        <Payment
          ticket={ticket}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </>
  );
};

export default TicketCard;

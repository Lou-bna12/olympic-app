import React from 'react';

const QRCodeModal = ({ qrCodeData, onClose }) => {
  if (!qrCodeData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            QR Code - Réservation #{qrCodeData.reservation_id}
          </h2>
          <div className="flex justify-center mb-4">
            <img
              src={qrCodeData.qrcode}
              alt={`QR Code pour la réservation ${qrCodeData.reservation_id}`}
              className="w-64 h-64 border rounded-lg"
            />
          </div>
          <p className="text-center text-gray-600 mb-6">
            Scannez ce code QR pour valider l'entrée à l'événement
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;

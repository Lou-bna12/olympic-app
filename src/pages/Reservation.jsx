import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const Reservation = () => {
  const { utilisateur } = useContext(UserContext);
  const [offre, setOffre] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const offres = {
    solo: { label: 'Offre Solo', prix: 25 },
    duo: { label: 'Offre Duo', prix: 50 },
    familiale: { label: 'Offre Familiale', prix: 150 },
  };

  const prixTotal = offre ? offres[offre].prix * quantite : 0;

  const handleSubmit = async () => {
    if (!utilisateur?.email) {
      setError('Vous devez être connecté pour réserver.');
      return;
    }
    if (!offre || quantite < 1) {
      setError('Sélectionnez une offre et une quantité valide.');
      return;
    }
    setError('');
    setMsg('');
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/reservations/', {
        offre,
        quantite,
        prix_total: prixTotal,
        email: utilisateur.email,
      });
      setMsg(`Réservation #${res.data.id} confirmée. Total: ${prixTotal} €`);
    } catch (e) {
      setError('Erreur lors de la réservation. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0051BA] mb-8 uppercase tracking-wide">
          Réservation de billets
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {msg && <p className="text-green-600 text-center mb-4">{msg}</p>}

        {/* ➜ Boutons demandés, affichés dès qu'il y a un message de confirmation */}
        {msg && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2 mb-6">
            <button
              onClick={() => (window.location.href = '/dashboard')}
              className="px-4 py-2 bg-[#0051BA] text-white rounded-lg hover:bg-[#003f8a]"
            >
              Aller à mon espace
            </button>
            <button
              onClick={() => {
                setOffre('');
                setQuantite(1);
                setMsg('');
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Nouvelle réservation
            </button>
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold">
            Choisissez une offre :
          </label>
          <select
            value={offre}
            onChange={(e) => setOffre(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0051BA]"
          >
            <option value="">-- Sélectionner une offre --</option>
            {Object.entries(offres).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label} - {val.prix} €
              </option>
            ))}
          </select>
        </div>

        {offre && (
          <>
            <div className="mb-6">
              <label className="block mb-2 text-gray-700 font-semibold">
                Nombre de billets :
              </label>
              <input
                type="number"
                min="1"
                value={quantite}
                onChange={(e) =>
                  setQuantite(parseInt(e.target.value || '1', 10))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0051BA]"
              />
            </div>

            <div className="mb-6 text-lg text-center font-bold text-green-600">
              Total à payer : {prixTotal} €
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#0051BA] hover:bg-[#003f8a] disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-lg transition duration-300"
            >
              {loading ? 'Traitement…' : 'Payer maintenant'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Reservation;

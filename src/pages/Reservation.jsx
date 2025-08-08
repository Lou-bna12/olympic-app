import React, { useState } from 'react';

const Reservation = () => {
  const [offre, setOffre] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [error, setError] = useState('');

  const offres = {
    solo: { label: 'Offre Solo', prix: 25 },
    duo: { label: 'Offre Duo', prix: 50 },
    familiale: { label: 'Offre Familiale', prix: 150 },
  };

  const handleOffreChange = (e) => {
    setOffre(e.target.value);
    setError(''); // Réinitialiser l'erreur lorsque l'utilisateur change l'offre
  };

  const handleQuantiteChange = (e) => {
    setQuantite(parseInt(e.target.value));
  };

  const prixTotal = offre ? offres[offre].prix * quantite : 0;

  const handleSubmit = () => {
    // Validation de la réservation
    if (!offre || quantite < 1) {
      setError(
        'Veuillez sélectionner une offre et un nombre de billets valide.'
      );
      return;
    }

    // Simulation de réservation (peut être remplacée par une logique de backend)
    alert(
      `Réservation effectuée pour ${quantite} billet(s) - Total : ${prixTotal} €`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0051BA] mb-8 uppercase tracking-wide">
          Réservation de billets
        </h2>

        {/* Affichage d'erreur si l'utilisateur n'a pas rempli correctement les champs */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Sélection de l’offre */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold">
            Choisissez une offre :
          </label>
          <select
            value={offre}
            onChange={handleOffreChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0051BA]"
          >
            <option value="">-- Sélectionner une offre --</option>
            {Object.entries(offres).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label} - {value.prix} €
              </option>
            ))}
          </select>
        </div>

        {/* Sélection du nombre de billets */}
        {offre && (
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-semibold">
              Nombre de billets :
            </label>
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={handleQuantiteChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0051BA]"
            />
          </div>
        )}

        {/* Total à payer */}
        {offre && (
          <div className="mb-6 text-lg text-center font-bold text-green-600">
            Total à payer : {prixTotal} €
          </div>
        )}

        {/* Bouton de paiement */}
        {offre && (
          <button
            onClick={handleSubmit}
            className="w-full bg-[#0051BA] hover:bg-[#003f8a] text-white font-bold py-3 rounded-xl shadow-lg transition duration-300"
          >
            Payer maintenant
          </button>
        )}
      </div>
    </div>
  );
};

export default Reservation;

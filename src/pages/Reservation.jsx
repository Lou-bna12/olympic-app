// src/pages/Reservation.jsx
import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Reservations from '../services/reservations';

// Offres billetterie JO
const OFFERS = {
  solo: { label: 'Offre Solo', price: 25, persons: 1 },
  duo: { label: 'Offre Duo', price: 50, persons: 2 },
  familiale: { label: 'Offre Familiale', price: 150, persons: 4 },
};

function Price({ offerKey, qty }) {
  const total = useMemo(() => {
    const offer = OFFERS[offerKey];
    return offer ? offer.price * Math.max(1, qty || 1) : 0;
  }, [offerKey, qty]);

  return (
    <div className="text-right">
      <div className="text-sm text-gray-500">Total</div>
      <div className="text-2xl font-bold">{total} €</div>
    </div>
  );
}

export default function Reservation() {
  const { isAuthenticated, user, token } = useAuth() ?? {};
  const navigate = useNavigate();
  const location = useLocation();

  // Champs du formulaire
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00');
  const [offer, setOffer] = useState('solo');
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  // Si non connecté → écran d’accès
  if (!isAuthenticated) {
    // On mémorise la page pour y revenir après login
    const next = encodeURIComponent(location.pathname + location.search);
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="max-w-md w-full border rounded-2xl p-6 bg-white shadow-sm">
          <h1 className="text-xl font-bold mb-2">Réservation</h1>
          <p className="text-gray-600">
            Vous devez être connecté(e) pour réserver vos billets.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to={`/login?next=${next}`}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Se connecter
            </Link>
            <Link
              to={`/register?next=${next}`}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 border font-semibold"
            >
              S’inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calcul d’infos dérivées
  const offerInfo = OFFERS[offer];
  const guests = (offerInfo?.persons || 1) * Math.max(1, qty || 1);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!offerInfo) return;

    setSubmitting(true);
    setErr('');
    setOk('');

    try {
      // payload attendu par ton service
      const payload = {
        date,
        time,
        guests,
        offer,
        qty,
        note: note.trim() || null,
        email: user?.email || '',
      };

      await Reservations.create(payload, token);
      setOk('Réservation créée avec succès.');
      // on peut rediriger : dashboard ou confirmation
      setTimeout(() => navigate('/dashboard', { replace: true }), 600);
    } catch (e2) {
      setErr(
        e2?.message ||
          'Impossible de créer la réservation. Réessayez plus tard.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Réserver des billets</h1>
      <p className="text-gray-600 mb-6">
        Choisissez la date, l’horaire et l’offre qui vous convient.
      </p>

      {/* messages */}
      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {err}
        </div>
      )}
      {ok && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
          {ok}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border bg-white p-5 shadow-sm space-y-5"
      >
        {/* Date + Heure */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              required
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Heure</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              {[
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
              ].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Offres JO (solo/duo/familiale) + quantité */}
        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Offre</label>
            <select
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              {Object.entries(OFFERS).map(([key, o]) => (
                <option key={key} value={key}>
                  {o.label} — {o.price} €
                </option>
              ))}
            </select>
            <div className="mt-1 text-xs text-gray-500">
              {offerInfo?.persons} personne{offerInfo?.persons > 1 ? 's' : ''}{' '}
              par offre
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantité</label>
            <input
              type="number"
              min={1}
              max={10}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-24 rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* Note optionnelle */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Commentaire (optionnel)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="Infos utiles pour l’organisation…"
          />
        </div>

        {/* Récap prix + CTA */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {guests} personne{guests > 1 ? 's' : ''} au total
          </div>
          <Price offerKey={offer} qty={qty} />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Validation…' : 'Confirmer la réservation'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-sm text-gray-500">
        Besoin d’aide ?{' '}
        <Link to="/dashboard" className="underline">
          consultez vos réservations
        </Link>
        .
      </div>
    </div>
  );
}

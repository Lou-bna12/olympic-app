// src/pages/Reservation.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Reservations from '../services/reservations';

const PACKS = {
  solo: { label: 'Solo', guests: 1 },
  duo: { label: 'Duo', guests: 2 },
  famille: { label: 'Familiale', guests: 4 },
};

const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

export default function Reservation() {
  // 🔹 Hooks TOUJOURS en haut (jamais derrière un return conditionnel)
  const { isAuthenticated, user, token } = useAuth() ?? {};
  const navigate = useNavigate();
  const location = useLocation();

  // Pré-sélection via ?pack=duo|solo|famille
  const initialPack = useMemo(() => {
    const q = new URLSearchParams(location.search);
    const p = q.get('pack');
    return PACKS[p] ? p : 'solo';
  }, [location.search]);

  // State du formulaire
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [pack, setPack] = useState(initialPack);
  const [guests, setGuests] = useState(PACKS[initialPack].guests);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  // Quand le pack change, on ajuste automatiquement le nombre de personnes
  useEffect(() => {
    setGuests(PACKS[pack].guests);
  }, [pack]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErr('');
      setOk('');
      if (!isAuthenticated) {
        navigate(`/login?next=${encodeURIComponent('/reservation')}`);
        return;
      }
      try {
        setSubmitting(true);
        await Reservations.create(
          {
            date,
            time,
            guests,
            pack,
            note: note.trim(),
            email: user?.email || '',
          },
          token
        );
        setOk('Votre réservation a bien été enregistrée.');
        // Redirige vers le dashboard après un petit délai
        setTimeout(() => navigate('/dashboard', { replace: true }), 600);
      } catch (e2) {
        setErr(e2?.message || "Impossible d'enregistrer la réservation.");
      } finally {
        setSubmitting(false);
      }
    },
    [isAuthenticated, date, time, guests, pack, note, user, token, navigate]
  );

  // 🔒 Garde pour utilisateur non connecté (aucun hook après ce return)
  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Réserver des billets</h1>
        <div className="rounded-xl border p-5 bg-white">
          <p className="text-gray-700">
            Vous devez être connecté(e) pour effectuer une réservation.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to={`/login?next=${encodeURIComponent('/reservation')}`}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Se connecter
            </Link>
            <Link
              to={`/register?next=${encodeURIComponent('/reservation')}`}
              className="px-4 py-2 rounded border"
            >
              S’inscrire
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Formulaire (sans “allergies”, packs Solo/Duo/Familiale)
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Réserver des billets</h1>

      {err && <div className="mb-4 text-red-600">{err}</div>}
      {ok && <div className="mb-4 text-green-700">{ok}</div>}

      <form
        onSubmit={onSubmit}
        className="rounded-xl border bg-white p-5 space-y-5"
      >
        {/* Date & Heure */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm text-gray-600">Heure</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded border px-3 py-2"
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Packs billets */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Formule</label>
          <div className="grid sm:grid-cols-3 gap-3">
            {Object.entries(PACKS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPack(key)}
                className={`rounded-xl border px-3 py-2 text-left
                  ${
                    pack === key ? 'border-blue-600 ring-2 ring-blue-100' : ''
                  }`}
              >
                <div className="font-semibold">{p.label}</div>
                <div className="text-xs text-gray-600">
                  {p.guests} {p.guests > 1 ? 'personnes' : 'personne'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Nombre de personnes (contrôlé par le pack) */}
        <div className="space-y-1">
          <label className="block text-sm text-gray-600">
            Nombre de personnes
          </label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value) || 1)}
            className="w-full rounded border px-3 py-2"
          />
          <div className="text-xs text-gray-500">
            Astuce : changer de formule mettra à jour ce nombre automatiquement.
          </div>
        </div>

        {/* Note libre (facultatif) */}
        <div className="space-y-1">
          <label className="block text-sm text-gray-600">
            Note (facultatif)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded border px-3 py-2"
            placeholder="Informations utiles pour l’équipe (optionnel)"
          />
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
          >
            {submitting ? 'Envoi…' : 'Valider ma réservation'}
          </button>
          <Link to="/dashboard" className="rounded border px-4 py-2">
            Voir mes réservations
          </Link>
        </div>
      </form>
    </div>
  );
}

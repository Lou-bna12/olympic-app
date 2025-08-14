// src/pages/Reservation.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OFFERS = {
  solo: { label: 'Solo — 1 place', persons: 1 },
  duo: { label: 'Duo — 2 places', persons: 2 },
  famille: { label: 'Famille — 4 places', persons: 4 },
};

export default function Reservation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth() ?? {};

  // Champs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [offer, setOffer] = useState('solo'); // solo | duo | famille
  const persons = useMemo(() => OFFERS[offer].persons, [offer]);
  const [note, setNote] = useState(''); // remarque optionnelle

  // Pré-remplissage utilisateur
  useEffect(() => {
    if (user?.full_name || user?.nom || user?.name) {
      setFullName(user.full_name || user.nom || user.name);
    }
    if (user?.email) setEmail(user.email);
  }, [user]);

  // Lecture ?offer=solo|duo|famille
  useEffect(() => {
    const o = (searchParams.get('offer') || '').toLowerCase();
    if (o && OFFERS[o]) setOffer(o);
  }, [searchParams]);

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      date,
      offer,
      persons, // dérivé de l’offre
      note: note.trim() || null,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    // Stockage local (en attendant le backend)
    try {
      const raw = localStorage.getItem('my_reservations') || '[]';
      const list = JSON.parse(raw);
      const nextId =
        (list.length ? Math.max(...list.map((r) => r.id || 0)) : 1000) + 1;
      const saved = [{ id: nextId, ...payload }, ...list];
      localStorage.setItem('my_reservations', JSON.stringify(saved));
    } catch {
      /* ignore */
    }

    // Redirection confirmation (frontend-only)
    navigate('/confirmation', {
      replace: true,
      state: { reservation: payload },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Réserver des billets</h1>
        <p className="text-gray-600 mt-1">
          Choisis ton offre (Solo, Duo, Famille) et une date. Aucune zone
          “Allergies” — c’est de la billetterie JO.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border bg-white p-6 shadow-sm space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm text-gray-700">Nom complet</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Ex : Alex Dupont"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm text-gray-700">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="exemple@mail.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm text-gray-700">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm text-gray-700">Offre</label>
              <select
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 bg-white"
              >
                {Object.entries(OFFERS).map(([key, o]) => (
                  <option key={key} value={key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* nombre de places, dérivé de l’offre */}
          <div className="space-y-1">
            <label className="block text-sm text-gray-700">Places</label>
            <input
              type="number"
              value={persons}
              readOnly
              className="w-full sm:max-w-xs rounded-lg border px-3 py-2 bg-gray-50"
            />
            <div className="text-xs text-gray-500">
              Solo = 1 • Duo = 2 • Famille = 4
            </div>
          </div>

          {/* Remarque optionnelle (on a supprimé “Allergies”) */}
          <div className="space-y-1">
            <label className="block text-sm text-gray-700">
              Remarque (optionnel)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Ex : préférence de créneau, accessibilité, etc."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Valider la réservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';

const OFFERS = {
  solo: { label: 'Solo — 1 place', persons: 1 },
  duo: { label: 'Duo — 2 places', persons: 2 },
  famille: { label: 'Famille — 4 places', persons: 4 },
};

export default function Confirmation() {
  const location = useLocation();
  let reservation = location.state?.reservation || null;

  if (!reservation) {
    try {
      const raw = localStorage.getItem('my_reservations') || '[]';
      const list = JSON.parse(raw);
      reservation = list?.[0] || null;
    } catch {}
  }

  const details = useMemo(() => {
    if (!reservation) return null;
    const offerKey = reservation.offer || 'solo';
    const offer = OFFERS[offerKey] || OFFERS.solo;

    return {
      id: reservation.id ?? '—',
      fullName: reservation.fullName ?? '—',
      email: reservation.email ?? '—',
      date: reservation.date ?? '—',
      offerLabel: offer.label,
      persons: reservation.persons ?? offer.persons,
      note: reservation.note || null,
      status: reservation.status || 'pending',
    };
  }, [reservation]);

  if (!details) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Aucune réservation trouvée</h1>
          <p className="mt-2 text-gray-600">
            Tu peux effectuer une nouvelle réservation.
          </p>
          <Link
            to="/reservation"
            className="mt-6 inline-block rounded-lg bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700"
          >
            Réserver maintenant
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Confirmation de réservation</h1>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                details.status === 'approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : details.status === 'rejected'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {details.status === 'approved'
                ? 'Validée'
                : details.status === 'rejected'
                ? 'Refusée'
                : 'En attente'}
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">N° de réservation</span>
              <span className="font-medium">#{details.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Nom</span>
              <span className="font-medium">{details.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">E-mail</span>
              <span className="font-medium">{details.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{details.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Offre</span>
              <span className="font-medium">{details.offerLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Places</span>
              <span className="font-medium">{details.persons}</span>
            </div>

            {details.note && (
              <div className="pt-3 border-t">
                <div className="text-gray-500">Remarque</div>
                <div className="mt-1">{details.note}</div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              Voir mon tableau de bord
            </Link>
            <Link
              to="/reservation"
              className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
            >
              Faire une nouvelle réservation
            </Link>
            <Link to="/" className="rounded-lg px-4 py-2 hover:bg-gray-50">
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

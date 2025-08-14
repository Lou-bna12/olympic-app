// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Reservations from '../services/reservations';

function StatusBadge({ status = 'pending' }) {
  const styles =
    {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      refused: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800';

  const label =
    {
      pending: 'En attente',
      approved: 'Approuvée',
      refused: 'Refusée',
    }[status] || status;

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}

export default function Dashboard() {
  const { user, token } = useAuth() ?? {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const displayName = useMemo(() => {
    return (
      user?.full_name ||
      [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
      user?.nom ||
      user?.name ||
      (user?.email ? user.email.split('@')[0] : '')
    );
  }, [user]);

  const load = useCallback(async () => {
    setErr('');
    setLoading(true);
    try {
      const list = await Reservations.listMine(user?.email || '', token);
      setRows(list);
    } catch (e) {
      setErr(e.message || 'Impossible de charger vos réservations');
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (!user?.email) {
      setRows([]);
      setLoading(false);
      return;
    }
    load();
  }, [user, load]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Espace personnel</h1>
      <p className="text-gray-600 mb-6">
        Bonjour, {displayName || 'cher·e utilisateur·trice'} 👋
      </p>

      {/* En-tête liste + CTA réservation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Mes réservations</h2>
        <Link
          to="/reservation"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
        >
          Faire une réservation
        </Link>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={load}
          className="px-3 py-2 rounded border font-medium hover:bg-gray-50"
        >
          Rafraîchir
        </button>
      </div>

      {err && <div className="mb-4 text-red-600">{err}</div>}
      {loading && <div>Chargement…</div>}

      {!loading && rows.length === 0 && (
        <div className="text-gray-600">
          Aucune réservation pour l’instant.
          <div className="mt-3"></div>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Heure</th>
                <th className="text-left p-3">Personnes</th>
                <th className="text-left p-3">Note</th>
                <th className="text-left p-3">Statut</th>
                <th className="text-left p-3">Créée le</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.time}</td>
                  <td className="p-3">{r.guests}</td>
                  <td className="p-3">{r.note || '—'}</td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

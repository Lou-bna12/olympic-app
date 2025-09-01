import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiUsers, FiCalendar, FiSearch, FiCheck } from 'react-icons/fi';

export default function Admin() {
  const { isAdmin, user } = useAuth() ?? {};
  const [section, setSection] = useState('overview');
  const [stats, setStats] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [statsResponse, reservationsResponse] = await Promise.all([
        fetch('http://127.0.0.1:8000/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://127.0.0.1:8000/admin/reservations/all', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsResponse.ok && reservationsResponse.ok) {
        const statsData = await statsResponse.json();
        const reservationsData = await reservationsResponse.json();
        setStats(statsData);
        setReservations(reservationsData);
      }
    } catch (error) {
      console.error('Erreur admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://127.0.0.1:8000/admin/reservations/${reservationId}/qrcode`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        window.open(data.qrcode, '_blank');
      }
    } catch (error) {
      console.error('Erreur QR code:', error);
    }
  };

  const approveReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://127.0.0.1:8000/admin/reservations/${reservationId}/approve`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Erreur approbation:', error);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      search === '' ||
      reservation.username.toLowerCase().includes(search.toLowerCase()) ||
      reservation.email.toLowerCase().includes(search.toLowerCase()) ||
      reservation.id.toString().includes(search);

    return matchesSearch;
  });

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-800">
            <div className="w-8 h-8 rounded-xl bg-gray-900 text-white grid place-items-center">
              A
            </div>
            <div className="font-semibold">Tableau de bord — Admin</div>
          </div>
          <div className="ml-auto text-sm text-gray-600">
            Connecté en tant que{' '}
            <span className="font-semibold">{user?.username || 'Admin'}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="md:sticky md:top-16 h-max">
          <div className="rounded-2xl border bg-white p-3 space-y-2">
            <button
              onClick={() => setSection('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                section === 'overview'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiHome className="text-base" />
              <span>Aperçu</span>
            </button>
            <button
              onClick={() => setSection('reservations')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                section === 'reservations'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiCalendar className="text-base" />
              <span>Réservations</span>
            </button>
            <button
              onClick={() => setSection('users')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                section === 'users'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiUsers className="text-base" />
              <span>Utilisateurs</span>
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          {section === 'overview' && stats && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">
                  Réservations totales
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {stats.total_reservations}
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">En attente</div>
                <div className="mt-1 text-2xl font-bold">
                  {stats.pending_reservations}
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Utilisateurs</div>
                <div className="mt-1 text-2xl font-bold">
                  {stats.total_users}
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm text-gray-500">Revenu</div>
                <div className="mt-1 text-2xl font-bold">{stats.revenue}€</div>
              </div>
            </div>
          )}

          {section === 'reservations' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative max-w-md w-full">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher par nom, email ou #id…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-white"
                  />
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Client</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-left">Offre</th>
                        <th className="px-3 py-2 text-left">Quantité</th>
                        <th className="px-3 py-2 text-left">Statut</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.id} className="border-t">
                          <td className="px-3 py-2 font-mono text-xs">
                            #{reservation.id}
                          </td>
                          <td className="px-3 py-2">{reservation.username}</td>
                          <td className="px-3 py-2">{reservation.email}</td>
                          <td className="px-3 py-2">{reservation.date}</td>
                          <td className="px-3 py-2">{reservation.offre}</td>
                          <td className="px-3 py-2">{reservation.quantity}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                reservation.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : reservation.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {reservation.status === 'approved'
                                ? 'Validée'
                                : reservation.status === 'pending'
                                ? 'En attente'
                                : 'Refusée'}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  approveReservation(reservation.id)
                                }
                                className="inline-flex items-center gap-1 text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded"
                              >
                                <FiCheck /> Valider
                              </button>
                              <button
                                onClick={() => generateQRCode(reservation.id)}
                                className="bg-blue-600 text-white px-3 py-1 rounded"
                              >
                                Générer QR
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredReservations.length === 0 && (
                        <tr>
                          <td
                            colSpan="8"
                            className="py-10 text-center text-gray-500"
                          >
                            Aucune réservation trouvée.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {section === 'users' && (
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="font-semibold mb-4">Gestion des utilisateurs</h3>
              <p className="text-gray-600">Fonctionnalité à venir...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

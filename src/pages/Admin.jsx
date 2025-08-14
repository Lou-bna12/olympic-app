// src/pages/Admin.jsx
import React, { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiSettings,
  FiRefreshCcw,
  FiDownload,
  FiPlus,
  FiSearch,
  FiCheck,
  FiX,
  FiAlertCircle,
} from 'react-icons/fi';

/** ---------- Données mock ---------- **/

const initialReservations = [
  {
    id: 101,
    date: '2025-08-20',
    name: 'Alice Martin',
    email: 'alice@mail.com',
    persons: 2,
    status: 'pending',
    price: 140,
  },
  {
    id: 102,
    date: '2025-08-21',
    name: 'Hugo Leroy',
    email: 'hugo@mail.com',
    persons: 4,
    status: 'pending',
    price: 260,
  },
  {
    id: 103,
    date: '2025-08-22',
    name: 'Leïla Ben',
    email: 'leila@mail.com',
    persons: 1,
    status: 'approved',
    price: 70,
  },
  {
    id: 104,
    date: '2025-08-22',
    name: 'Tom Dubois',
    email: 'tom@mail.com',
    persons: 3,
    status: 'rejected',
    price: 210,
  },
];

const initialUsers = [
  {
    id: 1,
    name: 'Admin Demo',
    email: 'admin@demo.com',
    role: 'admin',
    created: '2025-07-01',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@mail.com',
    role: 'user',
    created: '2025-07-12',
  },
  {
    id: 3,
    name: 'Jane Roe',
    email: 'jane@mail.com',
    role: 'user',
    created: '2025-07-19',
  },
];

/** ---------- Utils ---------- **/

function formatMoney(eur) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(eur);
}

function exportCSV(filename, rows) {
  if (!rows.length) return;
  const header = Object.keys(rows[0]).join(',');
  const body = rows
    .map((r) =>
      Object.values(r)
        .map((v) =>
          typeof v === 'string' && v.includes(',')
            ? `"${v.replace(/"/g, '""')}"`
            : v
        )
        .join(',')
    )
    .join('\n');
  const csv = [header, body].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** ---------- Petits composants ---------- **/

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
      ${active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
  >
    <Icon className="text-base" />
    <span>{label}</span>
  </button>
);

const KpiCard = ({ title, value, note, trend = [] }) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-1 text-2xl font-bold">{value}</div>
    {note && <div className="text-xs text-gray-500 mt-1">{note}</div>}
    {trend.length > 1 && (
      <svg viewBox="0 0 100 30" className="mt-3 w-full h-10">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={trend
            .map((y, i) => `${(i / (trend.length - 1)) * 100},${30 - y * 0.28}`)
            .join(' ')}
        />
      </svg>
    )}
  </div>
);

const StatusPill = ({ status }) => {
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-rose-100 text-rose-800',
  };
  const label =
    { pending: 'En attente', approved: 'Validée', rejected: 'Refusée' }[
      status
    ] || status;
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        map[status] ?? 'bg-gray-100 text-gray-700'
      }`}
    >
      {label}
    </span>
  );
};

/** ---------- Page ---------- **/

export default function Admin() {
  const { isAdmin, user } = useAuth() ?? {};

  // 🔹 TOUS les hooks au niveau supérieur (pas dans des if/ternaires)
  const [section, setSection] = useState('overview'); // overview | reservations | users | settings
  const [reservations, setReservations] = useState(initialReservations);
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all | today | week | month

  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    user?.name ||
    user?.nom ||
    'Administrateur';

  // KPIs calculés une seule fois par changement de 'reservations'
  const kpis = useMemo(() => {
    const total = reservations.length;
    const approved = reservations.filter((r) => r.status === 'approved');
    const pending = reservations.filter((r) => r.status === 'pending');
    const revenue = approved.reduce((s, r) => s + (r.price || 0), 0);
    const occupancy = Math.min(
      100,
      Math.round((approved.length / Math.max(1, total)) * 100)
    );
    return { total, pending: pending.length, revenue, occupancy };
  }, [reservations]);

  // Liste filtrée (utilisée dans plusieurs sections)
  const filteredReservations = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = reservations;

    if (q) {
      list = list.filter(
        (r) =>
          String(r.name).toLowerCase().includes(q) ||
          String(r.email).toLowerCase().includes(q) ||
          String(r.id).includes(q)
      );
    }
    if (dateFilter !== 'all') {
      const now = new Date();
      list = list.filter((r) => {
        const d = new Date(r.date + 'T00:00:00');
        if (dateFilter === 'today') {
          return d.toDateString() === now.toDateString();
        }
        if (dateFilter === 'week') {
          const diff = Math.abs((d - now) / (1000 * 3600 * 24));
          return diff <= 7;
        }
        if (dateFilter === 'month') {
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });
    }
    return list;
  }, [reservations, search, dateFilter]);

  // Actions
  const approve = (id) =>
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
  const reject = (id) =>
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
    );
  const remove = (id) =>
    setReservations((prev) => prev.filter((r) => r.id !== id));
  const addReservation = () => {
    const nextId =
      (reservations.length ? Math.max(...reservations.map((r) => r.id)) : 100) +
      1;
    setReservations((prev) => [
      {
        id: nextId,
        date: new Date().toISOString().slice(0, 10),
        name: 'Nouveau client',
        email: 'new@demo.com',
        persons: 2,
        status: 'pending',
        price: 120,
      },
      ...prev,
    ]);
  };

  // Redirection (OK car tous les hooks sont déclarés AVANT ce return conditionnel)
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  /** ---------- Layout ---------- **/
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
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
            <span className="font-semibold">{displayName}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="md:sticky md:top-16 h-max">
          <div className="rounded-2xl border bg-white p-3 space-y-2">
            <SidebarLink
              icon={FiHome}
              label="Aperçu"
              active={section === 'overview'}
              onClick={() => setSection('overview')}
            />
            <SidebarLink
              icon={FiCalendar}
              label="Réservations"
              active={section === 'reservations'}
              onClick={() => setSection('reservations')}
            />
            <SidebarLink
              icon={FiUsers}
              label="Utilisateurs"
              active={section === 'users'}
              onClick={() => setSection('users')}
            />
            <SidebarLink
              icon={FiSettings}
              label="Réglages"
              active={section === 'settings'}
              onClick={() => setSection('settings')}
            />
          </div>

          <div className="mt-4 rounded-2xl border bg-gradient-to-br from-gray-900 to-gray-700 text-white p-4">
            <div className="text-sm text-white/80">Astuce</div>
            <div className="mt-1 font-semibold">Exportez vos données</div>
            <p className="mt-1 text-sm text-white/80">
              Un clic pour exporter les réservations en CSV et faire vos stats.
            </p>
            <button
              onClick={() => exportCSV('reservations.csv', reservations)}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            >
              <FiDownload /> Export CSV
            </button>
          </div>
        </aside>

        {/* Contenu */}
        <main className="space-y-6">
          {/* Aperçu */}
          {section === 'overview' && (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <KpiCard
                  title="Réservations (total)"
                  value={kpis.total}
                  note={`${kpis.pending} en attente`}
                  trend={[8, 9, 10, 12, 9, 14, 13]}
                />
                <KpiCard
                  title="Taux d’occupation"
                  value={`${kpis.occupancy}%`}
                  note="Capacité estimée"
                  trend={[20, 35, 40, 55, 60, 70, 65]}
                />
                <KpiCard
                  title="Revenu estimé"
                  value={formatMoney(kpis.revenue)}
                  note="Confirmées uniquement"
                  trend={[2, 4, 5, 6, 7, 8, 9]}
                />
                <KpiCard
                  title="Utilisateurs"
                  value={users.length}
                  note="Comptes actifs"
                  trend={[1, 2, 3, 3, 4, 4, 5]}
                />
              </div>

              <div className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">Activité récente</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDateFilter('today')}
                      className={`text-sm px-3 py-1.5 rounded-lg border ${
                        dateFilter === 'today'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white'
                      }`}
                    >
                      Aujourd’hui
                    </button>
                    <button
                      onClick={() => setDateFilter('week')}
                      className={`text-sm px-3 py-1.5 rounded-lg border ${
                        dateFilter === 'week'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white'
                      }`}
                    >
                      7 jours
                    </button>
                    <button
                      onClick={() => setDateFilter('month')}
                      className={`text-sm px-3 py-1.5 rounded-lg border ${
                        dateFilter === 'month'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white'
                      }`}
                    >
                      Mois
                    </button>
                    <button
                      onClick={() => setDateFilter('all')}
                      className={`text-sm px-3 py-1.5 rounded-lg border ${
                        dateFilter === 'all'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white'
                      }`}
                    >
                      Tout
                    </button>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                      <tr>
                        <th className="py-2 pr-3">#</th>
                        <th className="py-2 pr-3">Client</th>
                        <th className="py-2 pr-3">Date</th>
                        <th className="py-2 pr-3">Pers.</th>
                        <th className="py-2 pr-3">Montant</th>
                        <th className="py-2 pr-3">Statut</th>
                        <th className="py-2 pr-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.slice(0, 6).map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="py-2 pr-3 font-mono text-xs">
                            #{r.id}
                          </td>
                          <td className="py-2 pr-3">
                            {r.name}
                            <div className="text-xs text-gray-500">
                              {r.email}
                            </div>
                          </td>
                          <td className="py-2 pr-3">{r.date}</td>
                          <td className="py-2 pr-3">{r.persons}</td>
                          <td className="py-2 pr-3">
                            {formatMoney(r.price || 0)}
                          </td>
                          <td className="py-2 pr-3">
                            <StatusPill status={r.status} />
                          </td>
                          <td className="py-2 pr-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => approve(r.id)}
                                className="inline-flex items-center gap-1 text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded"
                              >
                                <FiCheck /> Valider
                              </button>
                              <button
                                onClick={() => reject(r.id)}
                                className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 px-2 py-1 rounded"
                              >
                                <FiX /> Refuser
                              </button>
                              <button
                                onClick={() => remove(r.id)}
                                className="inline-flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredReservations.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-8 text-center text-gray-500"
                          >
                            Aucune réservation pour ce filtre.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Réservations */}
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
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={addReservation}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-3 py-2"
                  >
                    <FiPlus /> Ajouter
                  </button>
                  <button
                    onClick={() => setReservations([...initialReservations])}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
                  >
                    <FiRefreshCcw /> Reset
                  </button>
                  <button
                    onClick={() => exportCSV('reservations.csv', reservations)}
                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
                  >
                    <FiDownload /> Export
                  </button>
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
                        <th className="px-3 py-2 text-left">Pers.</th>
                        <th className="px-3 py-2 text-left">Montant</th>
                        <th className="px-3 py-2 text-left">Statut</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((r) => (
                        <tr key={r.id} className="border-t">
                          <td className="px-3 py-2 font-mono text-xs">
                            #{r.id}
                          </td>
                          <td className="px-3 py-2">{r.name}</td>
                          <td className="px-3 py-2">{r.email}</td>
                          <td className="px-3 py-2">{r.date}</td>
                          <td className="px-3 py-2">{r.persons}</td>
                          <td className="px-3 py-2">
                            {formatMoney(r.price || 0)}
                          </td>
                          <td className="px-3 py-2">
                            <StatusPill status={r.status} />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => approve(r.id)}
                                className="inline-flex items-center gap-1 text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded"
                              >
                                <FiCheck /> Valider
                              </button>
                              <button
                                onClick={() => reject(r.id)}
                                className="inline-flex items-center gap-1 text-rose-700 hover:bg-rose-50 px-2 py-1 rounded"
                              >
                                <FiX /> Refuser
                              </button>
                              <button
                                onClick={() => remove(r.id)}
                                className="inline-flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-2 py-1 rounded"
                              >
                                Supprimer
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

          {/* Utilisateurs */}
          {section === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Utilisateurs</h3>
                <button
                  onClick={() => exportCSV('users.csv', users)}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2"
                >
                  <FiDownload /> Export
                </button>
              </div>

              <div className="rounded-2xl border bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Nom</th>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Rôle</th>
                        <th className="px-3 py-2 text-left">Créé le</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-t">
                          <td className="px-3 py-2">{u.id}</td>
                          <td className="px-3 py-2">{u.name}</td>
                          <td className="px-3 py-2">{u.email}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full
                              ${
                                u.role === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="px-3 py-2">{u.created}</td>
                          <td className="px-3 py-2">
                            <button
                              onClick={() =>
                                setUsers((prev) =>
                                  prev.map((x) =>
                                    x.id === u.id
                                      ? {
                                          ...x,
                                          role:
                                            x.role === 'admin'
                                              ? 'user'
                                              : 'admin',
                                        }
                                      : x
                                  )
                                )
                              }
                              className="text-gray-700 hover:bg-gray-100 px-2 py-1 rounded"
                            >
                              Basculer rôle
                            </button>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-10 text-center text-gray-500"
                          >
                            Aucun utilisateur.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Réglages */}
          {section === 'settings' && (
            <div className="rounded-2xl border bg-white p-5 space-y-5">
              <h3 className="font-semibold">Réglages</h3>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <FiAlertCircle className="text-amber-500 mt-0.5" />
                <div className="text-sm text-amber-900">
                  Maquette front uniquement. On branchera ces contrôles à ton
                  backend (validation, suppression, export serveur, etc.).
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Nom de l’établissement
                  </label>
                  <input
                    defaultValue="JO Paris 2024 — Admin"
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Email contact</label>
                  <input
                    defaultValue="support@demo.com"
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Capacité journalière
                  </label>
                  <input
                    type="number"
                    defaultValue={120}
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">
                    Tarif par personne (€)
                  </label>
                  <input
                    type="number"
                    defaultValue={70}
                    className="w-full rounded-xl border px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-xl bg-gray-900 text-white px-4 py-2">
                  Enregistrer
                </button>
                <button className="rounded-xl border px-4 py-2">Annuler</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

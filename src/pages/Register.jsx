// src/pages/Register.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, isAuthenticated, authReady } = useAuth() ?? {};
  const navigate = useNavigate();
  const location = useLocation();

  // Calcule la destination après inscription (priorité à state.from, sinon ?next=, sinon /dashboard)
  const nextPath = useMemo(() => {
    const stateNext =
      location.state?.from?.pathname || location.state?.from || null;
    const q = new URLSearchParams(location.search);
    return stateNext || q.get('next') || '/dashboard';
  }, [location]);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  // Si déjà connecté (et hydratation OK), envoie direct vers nextPath
  useEffect(() => {
    if (authReady && isAuthenticated) {
      navigate(nextPath, { replace: true });
    }
  }, [authReady, isAuthenticated, navigate, nextPath]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      // Ton AuthContext connecte déjà l’utilisateur après register (maquette locale)
      await register(fullName.trim(), email.trim(), password);
      // La redirection est gérée par l’effet ci-dessus
    } catch (err) {
      setError(
        err?.message || 'Inscription impossible pour le moment. Réessaye.'
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a2540] px-4">
      <div className="bg-white/10 backdrop-blur p-8 rounded-xl shadow-md w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-extrabold mb-6 text-white uppercase tracking-wide">
          Inscription
        </h2>

        {/* Message si on vient d’une page protégée */}
        {location.state?.from && (
          <p className="text-white/80 text-sm mb-3">
            Crée un compte pour accéder à la page demandée.
          </p>
        )}

        {error && <p className="text-red-200 text-sm mb-3">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4 w-full">
          <input
            type="text"
            required
            placeholder="Nom complet"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            required
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            required
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300 shadow-md"
          >
            Créer mon compte
          </button>
        </form>

        <div className="mt-4 text-sm text-white/90">
          Déjà un compte ?{' '}
          <Link
            to={`/login?next=${encodeURIComponent(nextPath)}`}
            className="underline"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

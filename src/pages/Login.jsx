// src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated, authReady } = useAuth() ?? {};
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const nextFromQuery = searchParams.get('next');
  const nextFromState = location.state?.from;
  const nextPath = nextFromQuery || nextFromState || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authReady && isAuthenticated) {
      navigate(nextPath, { replace: true });
    }
  }, [authReady, isAuthenticated, nextPath, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // la redirection se fait via l’effet ci-dessus
    } catch {
      setError('Identifiants invalides.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a2540] px-4">
      <div className="bg-white/10 backdrop-blur p-8 rounded-xl shadow-md w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-extrabold mb-6 text-white uppercase tracking-wide">
          Connexion
        </h2>

        {error && <p className="text-red-200 text-sm mb-3">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4 w-full">
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

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300 shadow-md"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-4 text-sm text-white/90">
          <Link to="/forgot-password" className="underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="mt-2 text-sm text-white/90">
          Pas de compte ?{' '}
          <Link
            to={{
              pathname: '/register',
              search: nextFromQuery
                ? `?next=${encodeURIComponent(nextFromQuery)}`
                : '',
            }}
            state={nextFromState ? { from: nextFromState } : undefined}
            className="underline"
          >
            S’inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}

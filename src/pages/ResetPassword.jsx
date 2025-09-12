import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setDone(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a2540] px-4">
      <div className="bg-white/10 backdrop-blur p-8 rounded-xl shadow-md w-full max-w-md border border-white/20">
        <h2 className="text-2xl font-extrabold mb-6 text-white uppercase tracking-wide">
          Réinitialiser le mot de passe
        </h2>

        {error && <p className="text-red-200 text-sm mb-3">{error}</p>}

        {!done ? (
          <form onSubmit={onSubmit} className="space-y-4 w-full">
            <input
              type="password"
              required
              placeholder="Nouveau mot de passe"
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
              Valider
            </button>
          </form>
        ) : (
          <div className="text-white/90 space-y-4">
            <p className="text-green-200">
              Mot de passe mis à jour (démo). Vous pouvez maintenant vous
              connecter avec votre nouveau mot de passe.
            </p>
            <Link
              to="/login"
              className="inline-block underline hover:text-blue-200"
            >
              Retour à la connexion
            </Link>
          </div>
        )}

        <div className="mt-6 text-sm text-white/90">
          <Link to="/forgot-password" className="underline">
            Vous avez oublié votre mot de passe ?
          </Link>
        </div>
      </div>
    </div>
  );
}

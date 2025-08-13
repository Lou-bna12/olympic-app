import React, { useState, useContext } from 'react';
import LayoutAuth from '../components/LayoutAuth';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUtilisateur } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // 1) Lire la liste des comptes inscrits
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // 2) Trouver un utilisateur qui match email + password
    const found = users.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (!found) {
      setError('Email ou mot de passe incorrect');
      return;
    }

    // 3) Ouvrir la session (sans stocker le mot de passe)
    const sessionUser = {
      email: found.email,
      nom: found.nom,
      role: found.role || 'user',
    };
    localStorage.setItem('utilisateur', JSON.stringify(sessionUser));
    setUtilisateur(sessionUser);

    navigate('/dashboard');
  };

  return (
    <LayoutAuth>
      <div className="pb-20">
        <h2 className="text-2xl font-extrabold mb-6 text-white uppercase tracking-wide">
          Avec les réseaux sociaux
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 w-full">
          <button className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-black py-2 px-4 rounded transition duration-300">
            <FaFacebookF className="text-blue-600" />
            Facebook
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-black py-2 px-4 rounded transition duration-300">
            <FaGoogle className="text-red-500" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-black py-2 px-4 rounded transition duration-300">
            <FaApple className="text-gray-800" />
            Apple
          </button>
        </div>

        <h3 className="text-white text-lg font-semibold mb-4">
          OU CONTINUER AVEC UNE ADRESSE E-MAIL
        </h3>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <input
            type="email"
            required
            placeholder="E-mail*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            required
            placeholder="Mot de passe*"
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

        <p
          className="mt-6 underline text-sm text-white hover:text-yellow-400 cursor-pointer transition duration-300"
          onClick={() => navigate('/forgot-password')}
        >
          Mot de passe oublié ?
        </p>
      </div>
    </LayoutAuth>
  );
};

export default Login;

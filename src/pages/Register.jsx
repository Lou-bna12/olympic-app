import React, { useState } from 'react';
import LayoutAuth from '../components/LayoutAuth';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    const emailTrim = email.trim().toLowerCase();

    // Validations
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // 1) Lire la liste des comptes
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // 2) Empêcher l'email en double
    if (users.some((u) => u.email.toLowerCase() === emailTrim)) {
      setError('Cet e-mail est déjà utilisé');
      return;
    }

    // 3) Ajouter l'utilisateur (DEMO: mot de passe en clair)
    const newUser = {
      nom: nom.trim(),
      email: emailTrim,
      password,
      role: 'user',
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Ne pas ouvrir de session ici (on ne touche pas à 'utilisateur')
    // Redirection vers la page de connexion
    navigate('/login', { replace: true });
  };

  return (
    <LayoutAuth>
      <div className="pb-20">
        <h2 className="text-2xl font-extrabold mb-6 text-white uppercase tracking-wide">
          Créez votre compte olympique gratuit
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
          OU CONTINUER AVEC VOTRE E-MAIL
        </h3>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4 w-full">
          <input
            type="text"
            required
            placeholder="Nom complet*"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
          <input
            type="password"
            required
            placeholder="Confirmer le mot de passe*"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300 shadow-md"
          >
            S'inscrire
          </button>
        </form>

        <p
          className="mt-6 underline text-sm text-white hover:text-yellow-400 cursor-pointer transition duration-300"
          onClick={() => navigate('/login')}
        >
          J’ai déjà un compte ?
        </p>
      </div>
    </LayoutAuth>
  );
};

export default Register;

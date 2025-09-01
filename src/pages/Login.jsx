import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // pour écupérer la fonction login du contexte

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Effacer les erreurs quand l'utilisateur tape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      //  Utiliser la fonction login du contexte AuthContext
      const success = await login(form.email, form.password);

      if (success) {
        console.log('✅ Connexion réussie via AuthContext');
        navigate('/dashboard'); // Redirection après connexion réussie
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('⚠️ Erreur serveur:', error);
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Connexion</h2>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block font-semibold">E-mail *</label>
          <input
            type="email"
            name="email"
            placeholder="ex: monemail@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block font-semibold">Mot de passe *</label>
          <div className="flex">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Votre mot de passe"
              value={form.password}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded-l"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="bg-gray-200 px-3 rounded-r"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError('❌ Les mots de passe ne correspondent pas !');
      return;
    }

    // Utilisez la fonction register du contexte
    const success = await register(form.username, form.email, form.password);

    if (success) {
      console.log('✅ Inscription réussie');
      navigate('/login');
    } else {
      setError("❌ Erreur lors de l'inscription");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Inscription</h2>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block font-semibold">Nom d'utilisateur *</label>
          <input
            type="text"
            name="username"
            placeholder="Votre nom d'utilisateur"
            value={form.username}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

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
              className="bg-gray-200 px-3 rounded-r hover:bg-gray-300 transition-colors"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Confirmer mot de passe */}
        <div>
          <label className="block font-semibold">
            Confirmer le mot de passe *
          </label>
          <div className="flex">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Répétez le mot de passe"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="border p-2 w-full rounded-l"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="bg-gray-200 px-3 rounded-r hover:bg-gray-300 transition-colors"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition-colors"
        >
          S'inscrire
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Déjà inscrit ?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;

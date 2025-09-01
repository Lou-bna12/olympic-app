import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('❌ Les mots de passe ne correspondent pas !');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur d’inscription:', errorData);
        return;
      }

      const data = await response.json();
      console.log(' Inscription réussie:', data);

      // 👉 Redirection vers Login
      navigate('/login');
    } catch (error) {
      console.error('⚠️ Erreur serveur:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block font-semibold">Nom d’utilisateur *</label>
          <input
            type="text"
            name="username"
            placeholder="Votre nom d’utilisateur"
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
              className="bg-gray-200 px-3 rounded-r"
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
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Répétez le mot de passe"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
        >
          S’inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;

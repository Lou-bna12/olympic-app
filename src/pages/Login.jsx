import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur de connexion:', errorData);
        return;
      }

      const data = await response.json();
      console.log('✅ Connexion réussie:', data);
      localStorage.setItem('token', data.access_token);

      // 👉 Redirection vers Dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('⚠️ Erreur serveur:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">🔑 Connexion</h2>
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'un lien de réinitialisation envoyé
    setMessage('Un lien de réinitialisation a été envoyé à votre email.');

    // Simuler la redirection après 3 secondes
    setTimeout(() => navigate('/login'), 3000); // Rediriger vers la page login
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f7f9fc]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-extrabold mb-6 text-center">
          Mot de passe oublié
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Entrez votre email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 text-center">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

import React from 'react';

const Register = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-fond">
      <h2 className="text-2xl font-semibold text-blue-600">Inscription</h2>
      <form className="mt-6 w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Nom complet"
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border p-2 rounded"
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;

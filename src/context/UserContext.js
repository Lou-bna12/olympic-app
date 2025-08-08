import { createContext, useState, useEffect } from 'react';

// Créer un contexte utilisateur
export const UserContext = createContext();

// Fournisseur du contexte utilisateur
export const UserProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const user = JSON.parse(localStorage.getItem('utilisateur'));
    if (user) {
      setUtilisateur(user); // Mettre à jour le contexte avec l'utilisateur
    }
  }, []);

  return (
    <UserContext.Provider value={{ utilisateur, setUtilisateur }}>
      {children}
    </UserContext.Provider>
  );
};

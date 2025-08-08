import { createContext, useState, useEffect } from 'react';

// Créer le contexte utilisateur
export const UserContext = createContext();

// Fournisseur du contexte utilisateur
export const UserProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    // On peut récupérer l'utilisateur du localStorage ou d'une API ici
    const user = JSON.parse(localStorage.getItem('utilisateur')); // Exemple avec localStorage
    if (user) {
      setUtilisateur(user);
    }
  }, []);

  return (
    <UserContext.Provider value={{ utilisateur, setUtilisateur }}>
      {children}
    </UserContext.Provider>
  );
};

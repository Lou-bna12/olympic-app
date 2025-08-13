import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({
  utilisateur: null,
  setUtilisateur: () => {},
});

export const UserProvider = ({ children }) => {
  // localStorage au premier rendu (évite le "flash" déconnecté)
  const [utilisateur, setUtilisateur] = useState(() => {
    try {
      const raw = localStorage.getItem('utilisateur');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Sync localStorage à chaque changement
  useEffect(() => {
    if (utilisateur) {
      localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    } else {
      localStorage.removeItem('utilisateur');
    }
  }, [utilisateur]);

  //  sync entre onglets
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'utilisateur') {
        setUtilisateur(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <UserContext.Provider value={{ utilisateur, setUtilisateur }}>
      {children}
    </UserContext.Provider>
  );
};

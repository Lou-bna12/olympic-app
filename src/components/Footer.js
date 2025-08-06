import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center text-sm text-gray-600 py-4 mt-10">
      © {new Date().getFullYear()} Jeux Olympiques Paris 2024 par Loubna Sellam
      – Tous droits réservés.
    </footer>
  );
};

export default Footer;

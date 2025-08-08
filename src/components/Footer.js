import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaApple,
  FaGooglePlay,
  FaMapMarkerAlt,
  FaHome,
  FaTicketAlt,
  FaUserCircle,
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white px-6 py-10 text-sm">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation avec icônes */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Navigation</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <FaHome className="text-purple-500" />
              <Link to="/" className="hover:text-white transition">
                Accueil
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaTicketAlt className="text-purple-500" />
              <Link to="/reservation" className="hover:text-white transition">
                Réserver
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <FaUserCircle className="text-purple-500" />
              <Link to="/dashboard" className="hover:text-white transition">
                Espace personnel
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <MdEmail className="text-purple-500" />
              <a
                href="mailto:contact@jo-paris2024.com"
                className="hover:text-white transition"
              >
                contact@jo-paris2024.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-500" />
              Paris, France
            </li>
          </ul>
        </div>

        {/* App mobile */}
        <div>
          <h3 className="font-semibold mb-3 text-lg">Téléchargement</h3>
          <div className="flex gap-4 mt-3">
            <a
              href="https://apps.apple.com/fr/app/olympic-app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="App Store"
              className="hover:text-white"
            >
              <FaApple size={28} />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=org.olympic.app"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Play"
              className="hover:text-white"
            >
              <FaGooglePlay size={28} />
            </a>
          </div>
        </div>
      </div>

      {/* Mention légale */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Jeux Olympiques Paris 2024 par{' '}
        <strong>Loubna Sellam</strong> – Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;

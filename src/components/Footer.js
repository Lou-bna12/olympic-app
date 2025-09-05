import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaApple,
  FaGooglePlay,
  FaMapMarkerAlt,
  FaHome,
  FaTicketAlt,
  FaUserCircle,
  FaPhone,
  FaClock,
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo et description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
            <span className="font-bold text-xl text-white">JO Paris 2024</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Billetterie officielle des Jeux Olympiques 2024. Vivez l'expérience
            unique des Jeux à Paris.
          </p>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              className="text-gray-400 hover:text-white transition"
            >
              <FaFacebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              className="text-gray-400 hover:text-white transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              className="text-gray-400 hover:text-white transition"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-white">Navigation</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-3">
              <FaHome className="text-blue-400" />
              <Link to="/" className="hover:text-white transition">
                Accueil
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <FaTicketAlt className="text-blue-400" />
              <Link to="/reservation" className="hover:text-white transition">
                Billetterie
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <FaUserCircle className="text-blue-400" />
              <Link to="/dashboard" className="hover:text-white transition">
                Mon espace
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-white">Contact</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-3">
              <MdEmail className="text-blue-400" />
              <a
                href="mailto:contact@jo-paris2024.com"
                className="hover:text-white transition"
              >
                contact@jo-paris2024.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-blue-400" />
              <span>+33 1 23 45 67 89</span>
            </li>
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-400" />
              <span>Paris, France</span>
            </li>
            <li className="flex items-center gap-3">
              <FaClock className="text-blue-400" />
              <span>9h-18h, Lun-Ven</span>
            </li>
          </ul>
        </div>

        {/* App mobile */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-white">Notre App</h3>
          <p className="text-gray-400 text-sm mb-4">
            Téléchargez notre application mobile pour une expérience optimale.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="https://apps.apple.com/fr/app/olympic-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <FaApple size={20} />
              <span>App Store</span>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=org.olympic.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              <FaGooglePlay size={20} />
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mention légale */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center">
        <div className="text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} Jeux Olympiques Paris 2024 par{' '}
            <strong>Loubna Sellam</strong>
          </p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:text-white transition mx-2">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="hover:text-white transition mx-2">
              Conditions d'utilisation
            </Link>
            <Link to="/cookies" className="hover:text-white transition mx-2">
              Cookies
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

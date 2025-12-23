import React from "react";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0A1F33] text-white relative overflow-hidden">
      <div className="relative py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Contenu principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* Colonne 1 - Logo + Réseaux sociaux */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#E8902C' }}>
                Plateforme Communautaire
              </h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">
                Recensement et valorisation des compétences locales pour le développement de notre communauté.
              </p>
              
              {/* Réseaux sociaux */}
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E8902C] transition-all duration-300 group-hover:scale-110">
                    <FaFacebook className="text-lg group-hover:text-white" />
                  </div>
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E8902C] transition-all duration-300 group-hover:scale-110">
                    <FaLinkedin className="text-lg group-hover:text-white" />
                  </div>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E8902C] transition-all duration-300 group-hover:scale-110">
                    <FaInstagram className="text-lg group-hover:text-white" />
                  </div>
                </a>
              </div>
            </div>

            {/* Colonne 2 - Liens rapides */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#E8902C' }}>
                Liens rapides
              </h3>
              <div className="space-y-3">
                {[
                  { text: "Annuaire des profils", href: "/annuaire" },
                  { text: "S'inscrire", href: "/register" },
                  { text: "À propos", href: "/about" },
                  { text: "Connexion", href: "/login" },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-white/80 hover:text-[#E8902C] hover:translate-x-2 transition-all duration-300 text-sm"
                  >
                    → {link.text}
                  </a>
                ))}
              </div>
            </div>

            {/* Colonne 3 - Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#E8902C' }}>
                Contact
              </h3>
              <div className="space-y-3 text-sm text-white/80">
                <p>contact@plateforme-communautaire.com</p>
                <p>+229 01 00 00 00 00</p>
                <p>Abomey-Calavi, Bénin</p>
              </div>
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-white/20 pt-8 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
              <p>© 2025 Plateforme de Gestion Communautaire. Tous droits réservés.</p>
              <div className="flex gap-6">
                <a
                  href="#confidentialite"
                  className="hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </a>
                <a
                  href="#mentions"
                  className="hover:text-white transition-colors"
                >
                  Mentions légales
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

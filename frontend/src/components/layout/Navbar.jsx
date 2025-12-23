import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="pt-4">
      <div className="mx-auto px-4 w-fit">
        
        {/* Conteneur navbar arrondi */}
        <div 
          className="bg-white rounded-full px-6 py-3 flex items-center gap-8"
          style={{ 
            border: '1px solid #0A1F33',
            boxShadow: '0 4px 12px rgba(10, 31, 51, 0.15)'
          }}
        >
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logoipsum-331.svg" 
              alt="Logo" 
              className="h-8 w-auto" 
             
            />
          </Link>

          {/* Navigation Desktop - tous les liens avec espacement uniforme */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            <Link
              to="/annuaire"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Annuaire
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              À propos
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Inscription
            </Link>
            <Link
              to="/login"
              className="text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
              style={{ backgroundColor: '#E8902C' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d17e25'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#E8902C'}
            >
              Connexion
            </Link>
          </nav>

          {/* Burger Menu Button - visible sur mobile/tablette */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

        </div>

        {/* Menu Mobile/Tablette */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-3xl shadow-lg overflow-hidden">
            <nav className="flex flex-col">
              <Link
                to="/annuaire"
                className="text-gray-700 hover:bg-gray-100 px-6 py-4 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Annuaire
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:bg-gray-100 px-6 py-4 text-sm font-medium transition-colors border-t border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:bg-gray-100 px-6 py-4 text-sm font-medium transition-colors border-t border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
              <Link
                to="/login"
                className="text-white px-6 py-4 text-sm font-medium transition-colors border-t border-gray-200"
                style={{ backgroundColor: '#E8902C' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
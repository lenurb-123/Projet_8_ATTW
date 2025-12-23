import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleAnnuaire = () => {
    navigate('/annuaire');
  };

  return (
    <section
      className="relative bg-cream flex flex-col md:flex-row items-center justify-between p-6 md:p-16 overflow-hidden rounded-b-[70px]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      {/* Texte animé */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full md:w-3/5 z-10 text-left"
      >

        <p className="text-lg text-black mb-8 font-inter text-left">
          Bienvenue sur votre
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-800 leading-tight mb-6 font-poppins text-left">
          Plateforme de Gestion <br className="hidden md:block" />
          Communautaire
        </h1>
        <p className="text-lg text-black mb-8 font-inter text-left">
          Recensement et valorisation des compétences locales pour <br />
          favoriser le développement économique de notre <br />communauté.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-start">
          <button 
            onClick={handleAnnuaire}
            className="bg-sand text-white px-8 py-4 rounded-full font-inter font-text-medium transition shadow-card text-center"
            style={{ backgroundColor: '#0A1F33' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0D2B45'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0A1F33'}
          >
            Consulter l'annuaire
          </button>
          <button 
            onClick={handleRegister}
            className="text-white px-8 py-4 rounded-full font-inter font-text-medium transition shadow-card text-center"
            style={{ backgroundColor: '#E8902C' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d17e25'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#E8902C'}
          >
            S'inscrire gratuitement
          </button>
        </div>

        {/* Statistiques rapides */}
        <div className="flex flex-wrap gap-8 mt-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.2, 0.3, 0.5, 0.6]
            }}
          >
            <div className="text-3xl md:text-4xl font-poppins font-title-bold" style={{ color: '#E8902C' }}>
              350+
            </div>
            <div className="text-sm text-white font-inter mt-1">Profils actifs</div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.2, 0.3, 0.5, 0.6],
              delay: 0.3 
            }}
          >
            <div className="text-3xl md:text-4xl font-poppins font-title-bold" style={{ color: '#E8902C' }}>
              25+
            </div>
            <div className="text-sm text-white font-inter mt-1">Secteurs</div>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.2, 0.3, 0.5, 0.6],
              delay: 0.6 
            }}
          >
            <div className="text-3xl md:text-4xl font-poppins font-title-bold" style={{ color: '#E8902C' }}>
              100%
            </div>
            <div className="text-sm text-white font-inter mt-1">Gratuit</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Image avec animation de floating et cadre décoratif */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ 
          x: 0, 
          opacity: 1,
          y: [0, -20, 0]
        }}
        transition={{ 
          x: { duration: 1 },
          opacity: { duration: 1 },
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative w-full md:w-1/3 mt-8 md:mt-0 z-10"
      >
        {/* Cadre décoratif orange en arrière-plan */}
        <div 
          className="absolute -inset-6 border-4 rounded-[60px] z-0"
          style={{ 
            borderColor: '#E8902C',
            top: '-30px',
            left: '-30px',
            right: '-30px',
            bottom: '-30px'
          }}
        />
        
        {/* Image */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-xl shadow-xl z-10">
          <img
            src="/hero_img2.jpg"
            alt="Communauté et professionnels"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
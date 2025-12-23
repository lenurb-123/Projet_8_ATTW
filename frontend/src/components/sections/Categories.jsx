import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Title from '../common/Title';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'cadres-administratifs', name: 'Cadres administratifs', color: '#E8902C' },
    { id: 'cadres-techniques', name: 'Cadres techniques', color: '#1B3B6F' },
    { id: 'chefs-entreprise', name: "Chefs d'entreprise", color: '#D4A574' },
    { id: 'artisans', name: 'Artisans', color: '#E6F2FF' },
    { id: 'commercants', name: 'Commerçants', color: '#E67E22' },
    { id: 'jeunes-entrepreneurs', name: 'Jeunes entrepreneurs', color: '#E6F2FF' },
    { id: 'investisseurs', name: 'Investisseurs', color: '#E8902C' },
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/annuaire?categorie=${categoryId}`);
  };

  return (
    <section className="py-16 px-6" style={{ backgroundColor: '#F2E7D5' }}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-12 text-center">
          <Title color="#E8902C" className="justify-center mb-3">
            Catégories professionnelles
          </Title>
          <p className="text-lg font-inter text-gray-700">
            Découvrez les secteurs d'activité disponibles
          </p>
        </div>

        {/* Grille des catégories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 2,
                transition: { duration: 0.3 }
              }}
              onClick={() => handleCategoryClick(category.id)}
              className="p-8 rounded-2xl text-white font-semibold text-center shadow-lg cursor-pointer hover:shadow-2xl transition-all"
              style={{ backgroundColor: category.color }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleCategoryClick(category.id);
              }}
            >
              <h3 className="text-lg md:text-xl font-poppins leading-tight">
                {category.name}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Lien stylé vers l'annuaire complet */}
        <div className="mt-12 text-center">
          <motion.button
            onClick={() => navigate('/annuaire')}
            className="group inline-flex items-center gap-3 font-inter font-medium text-lg relative"
            style={{ color: '#0A1F33' }}
            whileHover={{ x: 10 }}
            transition={{ duration: 0.3 }}
          >
            <span className="relative">
              Voir l'annuaire complet
              <motion.span
                className="absolute bottom-0 left-0 h-0.5 bg-current"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </span>
            
            {/* Flèche animée */}
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
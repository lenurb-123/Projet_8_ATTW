import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({
  photo,
  nom,
  categorie,
  secteur,
  niveauEtude,
  ville,
  biographie,
  userId,
  initialIsFavorite = false,
  onActionClick,
  actionLabel = "Voir le profil",
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [animateHeart, setAnimateHeart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev); // MAJ instantanée
    setAnimateHeart(true); // Lance l'animation
    onToggleFavorite?.(userId); // Appelle la fonction parent
  };

  // Fin de l'animation après 300ms
  useEffect(() => {
    if (animateHeart) {
      const timeout = setTimeout(() => setAnimateHeart(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [animateHeart]);

  const handleViewProfile = () => {
    console.log("userId :", userId);
    navigate(`/profil/${userId}`);
  };

  return (
    <div
      style={{ fontFamily: 'Inter, sans-serif' }}
      className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      {/* Bouton cœur favori */}
      <button
        onClick={handleToggle}
        className={`absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md transition-transform duration-300 ${
          animateHeart ? 'scale-125' : 'hover:scale-110'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transition-all duration-300 ease-in-out`}
          fill={isFavorite ? "#E8902C" : "none"}
          stroke={isFavorite ? "#E8902C" : "currentColor"}
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78z"
          />
        </svg>
      </button>

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={photo || '/default-avatar.jpg'}
          alt={nom}
          className="w-full h-56 object-cover rounded-t-xl transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>

      {/* Contenu */}
      <div className="p-6 text-gray-800 text-[0.9rem] space-y-3">
        <h3 className="text-lg font-bold font-poppins" style={{ color: '#0A1F33' }}>
          {nom}
        </h3>
        
        <div className="space-y-2">
          <p className="text-sm">
            <strong style={{ color: '#0A1F33' }}>Catégorie :</strong> {categorie}
          </p>
          
          <p className="text-sm">
            <strong style={{ color: '#0A1F33' }}>Secteur :</strong> {secteur}
          </p>
          
          <p className="text-sm">
            <strong style={{ color: '#0A1F33' }}>Niveau d'étude :</strong> {niveauEtude}
          </p>
          
          <p className="text-sm">
            <strong style={{ color: '#0A1F33' }}>Localisation :</strong> {ville}
          </p>
        </div>
        
        {biographie && (
          <p className="text-gray-600 text-sm line-clamp-3 pt-2 border-t border-gray-100">
            {biographie}
          </p>
        )}
        
        <div className="pt-4">
          <button
            onClick={onActionClick ? () => onActionClick() : handleViewProfile}
            className="text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 w-full text-sm hover:scale-105"
            style={{ backgroundColor: '#0A1F33' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0D2B45'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0A1F33'}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

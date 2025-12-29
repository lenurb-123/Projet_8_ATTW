import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { publicService } from '../../services/allServices';

const Annuaire = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [filters, setFilters] = useState({
    category: '',
    sector: '',
    education_level: '',
    city: ''
  });

  useEffect(() => {
    fetchProfiles();
  }, [searchTerm, filters, currentPage]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        category_id: filters.category,
        sector_id: filters.sector,
        education_level: filters.education_level,
        city: filters.city,
        page: currentPage,
        per_page: 12
      };

      const response = await publicService.getAllProfiles(params);
      
      setProfils(response.profiles.data || []);
      setTotalPages(response.profiles.last_page || 1);
      setTotalItems(response.profiles.total || 0);
    } catch (error) {
      console.error("Erreur:", error);
      setProfils([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ category: '', sector: '', education_level: '', city: '' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-[#0A1F33] mb-6">
            Annuaire des Profils
          </h1>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un profil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-[#0A1F33] text-white rounded-lg hover:bg-[#0A1F33]/90 transition flex items-center gap-2"
            >
              <FiFilter size={18} />
              <span className="hidden sm:inline">Filtres</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-[#0A1F33]">Filtres</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A1F33] focus:border-transparent text-sm"
                  >
                    <option value="">Toutes</option>
                    <option value="cadre-administratif">Cadre Administratif</option>
                    <option value="cadre-technique">Cadre Technique</option>
                    <option value="chef-entreprise">Chef d'Entreprise</option>
                    <option value="artisan">Artisan</option>
                    <option value="commercant">Commerçant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secteur</label>
                  <select
                    value={filters.sector}
                    onChange={(e) => handleFilterChange('sector', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A1F33] focus:border-transparent text-sm"
                  >
                    <option value="">Tous</option>
                    <option value="informatique">Informatique</option>
                    <option value="commerce">Commerce</option>
                    <option value="sante">Santé</option>
                    <option value="education">Éducation</option>
                    <option value="agriculture">Agriculture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'étude</label>
                  <select
                    value={filters.education_level}
                    onChange={(e) => handleFilterChange('education_level', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A1F33] focus:border-transparent text-sm"
                  >
                    <option value="">Tous</option>
                    <option value="bac">Bac</option>
                    <option value="licence">Licence</option>
                    <option value="master">Master</option>
                    <option value="doctorat">Doctorat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A1F33] focus:border-transparent text-sm"
                  >
                    <option value="">Toutes</option>
                    <option value="Cotonou">Cotonou</option>
                    <option value="Porto-Novo">Porto-Novo</option>
                    <option value="Parakou">Parakou</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-sm bg-[#E8902C] text-white rounded-lg hover:bg-[#d17d1f] transition"
                >
                  Appliquer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 mb-6">
          <span className="font-semibold text-[#0A1F33]">{totalItems}</span> profil{totalItems > 1 ? 's' : ''} trouvé{totalItems > 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1F33]"></div>
          </div>
        ) : profils.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profils.map(profil => (
                <div
                  key={profil.id}
                  onClick={() => navigate(`/annuaire/${profil.id}`)}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                      {profil.profile_photo_url ? (
                        <img 
                          src={profil.profile_photo_url} 
                          alt={profil.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                          {profil.full_name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[#0A1F33] truncate group-hover:text-[#E8902C] transition">
                        {profil.full_name}
                      </h3>
                      <p className="text-sm text-[#E8902C] font-medium">
                        {profil.category || 'Non renseigné'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    {profil.sector && (
                      <p><span className="font-medium">Secteur:</span> {profil.sector}</p>
                    )}
                    {profil.education_level && (
                      <p><span className="font-medium">Niveau:</span> {profil.education_level}</p>
                    )}
                    {profil.city && (
                      <p><span className="font-medium">Ville:</span> {profil.city}</p>
                    )}
                  </div>

                  {profil.summary && (
                    <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                      {profil.summary}
                    </p>
                  )}

                  <div className="mt-4 text-sm font-medium text-[#0A1F33] group-hover:text-[#E8902C] transition">
                    Voir le profil →
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Précédent
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg transition ${
                        currentPage === pageNum
                          ? 'bg-[#0A1F33] text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && <span className="text-gray-400">...</span>}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-[#0A1F33] mb-2">
              Aucun profil trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-[#E8902C] text-white rounded-lg hover:bg-[#d17d1f] transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Annuaire;
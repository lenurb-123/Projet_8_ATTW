import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaTh, FaList, FaFilter, FaTimes } from 'react-icons/fa';

import { publicService, adminService } from '../../services/allServices';
import Loader from '../../components/common/Loader';

const Annuaire = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [profils, setProfils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    categorie: searchParams.get('categorie') || '',
    secteur: '',
    niveau: '',
    localisation: '',
    experience: '',
    langues: [],
  });

  const [sortBy, setSortBy] = useState('pertinence');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminService.getCategories();
        setCategories(data.user_categories || []);
      } catch (err) {
        console.error("Erreur catégories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchTerm,
          category_id: filters.categorie,
          sector_id: filters.secteur,
          education_level: filters.niveau,
          city: filters.localisation,
          min_experience: filters.experience,
          sort_by: sortBy === 'nom' ? 'name' : (sortBy === 'recent' ? 'newest' : 'relevance'),
          page: currentPage,
          per_page: itemsPerPage
        };

        const response = await publicService.getAllProfiles(params);

        const mappedProfils = response.profiles.data.map(user => ({
          id: user.id,
          photo: user.profile_photo_url,
          nom: user.full_name,
          categorie: user.category,
          secteur: user.sector,
          niveau: user.education_level,
          ville: user.city,
          bio: user.summary,
          experience: user.years_experience
        }));

        setProfils(mappedProfils);
        setTotalPages(response.profiles.last_page);
        setTotalItems(response.profiles.total);
      } catch (error) {
        console.error("Erreur lors de la récupération des profils:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filters.categorie, filters.secteur, sortBy, currentPage]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
    if(value) searchParams.set(name, value); else searchParams.delete(name);
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setFilters({
      categorie: '',
      secteur: '',
      niveau: '',
      localisation: '',
      experience: '',
      langues: [],
    });
    setSearchTerm('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const currentProfils = profils;
  const filteredCount = totalItems;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
      <div className="min-h-screen" style={{ backgroundColor: '#F2E7D5' }}>
        {/* En-tête de recherche - Structure INTACTE */}
        <div className="bg-white shadow-sm py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold font-poppins mb-4" style={{ color: '#1B3B6F' }}>
              Annuaire des Profils
            </h1>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher par nom, compétence, secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                />
              </div>

              <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
              >
                <option value="pertinence">Trier par : Pertinence</option>
                <option value="nom">Nom (A-Z)</option>
                <option value="recent">Plus récent</option>
              </select>

              <div className="hidden md:flex gap-2">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-[#E8902C] text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <FaTh />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-[#E8902C] text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <FaList />
                </button>
              </div>

              <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-3 rounded-lg text-white"
                  style={{ backgroundColor: '#1B3B6F' }}
              >
                <FaFilter /> Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal - Structure INTACTE */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white rounded-xl p-6 shadow-sm h-fit`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg" style={{ color: '#1B3B6F' }}>Filtres</h3>
                <button onClick={() => setShowFilters(false)} className="md:hidden text-gray-500">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select
                      value={filters.categorie}
                      onChange={(e) => handleFilterChange('categorie', e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                  >
                    <option value="">Toutes</option>
                    {/* Utilisation des catégories de la BD */}
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                  <select
                      value={filters.secteur}
                      onChange={(e) => handleFilterChange('secteur', e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                  >
                    <option value="">Tous</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Santé">Santé</option>
                    <option value="Éducation">Éducation</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'étude</label>
                  <select
                      value={filters.niveau}
                      onChange={(e) => handleFilterChange('niveau', e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                  >
                    <option value="">Tous</option>
                    <option value="Bac">Bac</option>
                    <option value="Licence">Licence</option>
                    <option value="Master">Master</option>
                    <option value="Doctorat">Doctorat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <select
                      value={filters.localisation}
                      onChange={(e) => handleFilterChange('localisation', e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                  >
                    <option value="">Toutes</option>
                    <option value="Cotonou">Cotonou</option>
                    <option value="Porto-Novo">Porto-Novo</option>
                    <option value="Parakou">Parakou</option>
                    <option value="Abomey-Calavi">Abomey-Calavi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expérience (années)</label>
                  <input
                      type="number"
                      min="0"
                      value={filters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                      placeholder="Min. années"
                      className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <button onClick={resetFilters} className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition">
                    Réinitialiser
                  </button>
                  <button onClick={() => setShowFilters(false)} className="w-full py-2 px-4 rounded-lg text-white transition" style={{ backgroundColor: '#E8902C' }}>
                    Appliquer
                  </button>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-700">
                  <span className="font-semibold">{filteredCount}</span> profil{filteredCount > 1 ? 's' : ''} trouvé{filteredCount > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-500">
                  Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCount)} sur {filteredCount}
                </p>
              </div>

              {loading ? (
                  <div className="flex justify-center py-12"><Loader /></div>
              ) : currentProfils.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {currentProfils.map(profil => (
                        <div
                            key={profil.id}
                            className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer ${viewMode === 'list' ? 'flex gap-4 p-4' : 'p-6'}`}
                            onClick={() => navigate(`/annuaire/${profil.id}`)}
                        >
                          <div className={viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48 mb-4'}>
                            <img
                                src={profil.photo || 'https://via.placeholder.com/200x200?text=Photo'}
                                alt={profil.nom}
                                className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-xl font-bold font-poppins mb-1" style={{ color: '#1B3B6F' }}>{profil.nom}</h3>
                            <p className="text-sm font-medium mb-2" style={{ color: '#E8902C' }}>{profil.categorie}</p>
                            <p className="text-sm text-gray-600 mb-2"><strong>Secteur:</strong> {profil.secteur}</p>
                            <p className="text-sm text-gray-600 mb-2"><strong>Niveau:</strong> {profil.niveau}</p>
                            <p className="text-sm text-gray-600 mb-3">📍 {profil.ville}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">{profil.bio}</p>
                            <button className="mt-4 text-sm font-medium underline" style={{ color: '#1B3B6F' }}>
                              Voir le profil →
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold mb-2" style={{ color: '#1B3B6F' }}>Aucun profil trouvé</h3>
                    <button onClick={resetFilters} className="px-6 py-3 rounded-lg text-white" style={{ backgroundColor: '#E8902C' }}>
                      Réinitialiser les filtres
                    </button>
                  </div>
              )}

              {/* Pagination INTACTE branchée sur l'API */}
              {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-lg ${currentPage === i + 1 ? 'text-white' : 'border border-gray-300'}`}
                            style={currentPage === i + 1 ? { backgroundColor: '#E8902C' } : {}}
                        >
                          {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
              )}
            </main>
          </div>
        </div>
      </div>
  );
};

export default Annuaire;
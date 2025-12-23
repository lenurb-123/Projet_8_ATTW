import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaSearch, FaTh, FaList, FaFilter, FaTimes } from 'react-icons/fa';

const Annuaire = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showFilters, setShowFilters] = useState(false); // Pour mobile
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filtres
  const [filters, setFilters] = useState({
    categorie: searchParams.get('categorie') || '',
    secteur: '',
    niveau: '',
    localisation: '',
    experience: '',
    langues: [],
  });

  const [sortBy, setSortBy] = useState('pertinence');

  // Données mockées (à remplacer par API)
  const mockProfils = [
    {
      id: 1,
      photo: '/profil1.jpg',
      nom: 'Koffi Mensah',
      categorie: 'Cadres techniques',
      secteur: 'Informatique',
      niveau: 'Master',
      ville: 'Cotonou',
      bio: 'Ingénieur logiciel avec 10 ans d\'expérience en développement web et mobile...',
      experience: 10,
      langues: ['Français', 'Anglais'],
    },
    {
      id: 2,
      photo: '/profil2.jpg',
      nom: 'Aïcha Touré',
      categorie: 'Chefs d\'entreprise',
      secteur: 'Commerce',
      niveau: 'Licence',
      ville: 'Porto-Novo',
      bio: 'Entrepreneure passionnée, fondatrice d\'une entreprise de distribution...',
      experience: 5,
      langues: ['Français'],
    },
    // Ajoutez plus de profils mockés...
  ];

  // Filtrer et trier les profils
  const filteredProfils = mockProfils.filter(profil => {
    const matchSearch = profil.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       profil.secteur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = !filters.categorie || profil.categorie === filters.categorie;
    const matchSecteur = !filters.secteur || profil.secteur === filters.secteur;
    const matchNiveau = !filters.niveau || profil.niveau === filters.niveau;
    const matchVille = !filters.localisation || profil.ville === filters.localisation;
    
    return matchSearch && matchCategorie && matchSecteur && matchNiveau && matchVille;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProfils.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProfils = filteredProfils.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2E7D5' }}>
      {/* En-tête de recherche */}
      <div className="bg-white shadow-sm py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold font-poppins mb-4" style={{ color: '#1B3B6F' }}>
            Annuaire des Profils
          </h1>
          
          {/* Barre de recherche et options */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
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

            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
            >
              <option value="pertinence">Trier par : Pertinence</option>
              <option value="nom">Nom (A-Z)</option>
              <option value="recent">Plus récent</option>
            </select>

            {/* Toggle vue (desktop) */}
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

            {/* Bouton filtres (mobile) */}
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

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filtres */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white rounded-xl p-6 shadow-sm h-fit`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: '#1B3B6F' }}>Filtres</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="md:hidden text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={filters.categorie}
                  onChange={(e) => handleFilterChange('categorie', e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                >
                  <option value="">Toutes</option>
                  <option value="Cadres administratifs">Cadres administratifs</option>
                  <option value="Cadres techniques">Cadres techniques</option>
                  <option value="Chefs d'entreprise">Chefs d'entreprise</option>
                  <option value="Artisans">Artisans</option>
                  <option value="Commerçants">Commerçants</option>
                  <option value="Jeunes entrepreneurs">Jeunes entrepreneurs</option>
                  <option value="Investisseurs">Investisseurs</option>
                </select>
              </div>

              {/* Secteur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité
                </label>
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

              {/* Niveau d'étude */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'étude
                </label>
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

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
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

              {/* Expérience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience (années)
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  placeholder="Min. années"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E8902C]"
                />
              </div>

              {/* Boutons */}
              <div className="space-y-2 pt-4">
                <button
                  onClick={resetFilters}
                  className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2 px-4 rounded-lg text-white transition"
                  style={{ backgroundColor: '#E8902C' }}
                >
                  Appliquer
                </button>
              </div>
            </div>
          </aside>

          {/* Liste des profils */}
          <main className="flex-1">
            {/* Compteur */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-700">
                <span className="font-semibold">{filteredProfils.length}</span> profil{filteredProfils.length > 1 ? 's' : ''} trouvé{filteredProfils.length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-500">
                Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProfils.length)} sur {filteredProfils.length}
              </p>
            </div>

            {/* Grille/Liste */}
            {currentProfils.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {currentProfils.map(profil => (
                  <div
                    key={profil.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer ${
                      viewMode === 'list' ? 'flex gap-4 p-4' : 'p-6'
                    }`}
                    onClick={() => navigate(`/annuaire/${profil.id}`)}
                  >
                    {/* Photo */}
                    <div className={viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48 mb-4'}>
                      <img
                        src={profil.photo}
                        alt={profil.nom}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Photo';
                        }}
                      />
                    </div>

                    {/* Infos */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-poppins mb-1" style={{ color: '#1B3B6F' }}>
                        {profil.nom}
                      </h3>
                      <p className="text-sm font-medium mb-2" style={{ color: '#E8902C' }}>
                        {profil.categorie}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Secteur:</strong> {profil.secteur}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Niveau:</strong> {profil.niveau}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        📍 {profil.ville}
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {profil.bio}
                      </p>
                      <button
                        className="mt-4 text-sm font-medium underline"
                        style={{ color: '#1B3B6F' }}
                      >
                        Voir le profil →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // État vide
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#1B3B6F' }}>
                  Aucun profil trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche ou de réinitialiser les filtres
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 rounded-lg text-white"
                  style={{ backgroundColor: '#E8902C' }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}

            {/* Pagination */}
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
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === i + 1
                        ? 'text-white'
                        : 'border border-gray-300'
                    }`}
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
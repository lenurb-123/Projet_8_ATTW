export const CATEGORIES = [
  {
    id: 'cadre_administratif',
    backendId: 1,
    label: 'Cadre Administratif',
    description: 'Cadres de l\'administration publique et privée',
  },
  {
    id: 'cadre_technique',
    backendId: 2,
    label: 'Cadre Technique',
    description: 'Ingénieurs, techniciens et experts techniques',
  },
  {
    id: 'chef_entreprise',
    backendId: 3,
    label: 'Chef d\'Entreprise',
    description: 'Dirigeants et chefs d\'entreprise',
  },
  {
    id: 'artisan',
    backendId: 4,
    label: 'Artisan',
    description: 'Artisans et métiers manuels',
  },
  {
    id: 'commercant',
    backendId: 5,
    label: 'Commerçant',
    description: 'Commerçants et acteurs du commerce',
  },
  {
    id: 'jeune_entrepreneur',
    backendId: 6,
    label: 'Jeune Entrepreneur',
    description: 'Jeunes entrepreneurs et startups',
  },
  {
    id: 'investisseur',
    backendId: 7,
    label: 'Investisseur',
    description: 'Investisseurs et financiers',
  },
];

// Mapping des IDs frontend vers IDs backend
export const getCategoryBackendId = (frontendId) => {
  const category = CATEGORIES.find(cat => cat.id === frontendId);
  return category?.backendId || null;
};

export const PROFILE_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  MODIFICATION_REQUESTED: 'modification_requested',
};

export const PROFILE_STATUS_LABELS = {
  pending: 'En attente de validation',
  active: 'Actif',
  suspended: 'Suspendu',
  modification_requested: 'Modification demandée',
  approved: 'Validé',
  rejected: 'Rejeté',
  incomplete: 'Incomplet',
};

export const EDUCATION_LEVELS = [
  { value: 'bac', label: 'Baccalauréat' },
  { value: 'licence', label: 'Licence' },
  { value: 'master', label: 'Master' },
  { value: 'doctorat', label: 'Doctorat' },
  { value: 'ingenieur', label: 'Diplôme d\'Ingénieur' },
  { value: 'autre', label: 'Autre' },
];

export const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'Anglais' },
  { value: 'ar', label: 'Arabe' },
  { value: 'es', label: 'Espagnol' },
  { value: 'de', label: 'Allemand' },
  { value: 'it', label: 'Italien' },
  { value: 'pt', label: 'Portugais' },
  { value: 'zh', label: 'Chinois' },
];

export const FILE_TYPES = {
  PHOTO: 'photo',
  CV: 'cv',
  DOCUMENT: 'document',
};

export const FILE_SIZE_LIMITS = {
  photo: 5 * 1024 * 1024, // 5 MB
  cv: 10 * 1024 * 1024, // 10 MB
  document: 10 * 1024 * 1024, // 10 MB
};

export const ALLOWED_FILE_TYPES = {
  photo: ['image/jpeg', 'image/png'],
  cv: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  document: ['application/pdf'],
};

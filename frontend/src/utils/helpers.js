/**
 * Formater une date
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formater une date avec l'heure
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Tronquer un texte
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Valider un fichier
 */
export const validateFile = (file, type, maxSize, allowedTypes) => {
  const errors = [];

  if (!file) {
    errors.push('Aucun fichier sélectionné');
    return errors;
  }

  if (file.size > maxSize) {
    errors.push(`Le fichier ne doit pas dépasser ${maxSize / 1024 / 1024} MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`);
  }

  return errors;
};

/**
 * Télécharger un fichier
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Obtenir les initiales d'un nom
 */
export const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Générer une couleur aléatoire pour les avatars
 */
export const getRandomColor = (str) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Construire les paramètres de requête
 */
export const buildQueryParams = (params) => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  return filtered;
};

export const SECTORS = [
  { id: 1, name: 'Agriculture', slug: 'agriculture' },
  { id: 2, name: 'Industrie', slug: 'industrie' },
  { id: 3, name: 'Services', slug: 'services' },
  { id: 4, name: 'Commerce', slug: 'commerce' },
  { id: 5, name: 'Construction', slug: 'construction' },
  { id: 6, name: 'Tourisme', slug: 'tourisme' },
  { id: 7, name: 'Santé', slug: 'sante' },
  { id: 8, name: 'Éducation', slug: 'education' },
  { id: 9, name: 'Technologie', slug: 'technologie' },
  { id: 10, name: 'Finance', slug: 'finance' },
];

// Trouver un secteur par nom (recherche flexible)
export const getSectorIdByName = (name) => {
  if (!name) return null;
  
  const normalizedName = name.toLowerCase().trim();
  const sector = SECTORS.find(s => 
    s.name.toLowerCase() === normalizedName || 
    s.slug === normalizedName ||
    s.name.toLowerCase().includes(normalizedName)
  );
  
  return sector?.id || null;
};

# 🎨 Charte Graphique Appliquée

## ✅ Configuration de base
- ✅ Tailwind config avec toutes les couleurs de la charte
- ✅ Polices Poppins (titres) et Inter (texte) configurées
- ✅ CSS de base avec les styles globaux

## ✅ Composants mis à jour
- ✅ Navbar - Couleurs navy/sand/orange
- ✅ Footer - Fond navy avec texte sand
- ✅ Alert - Fond cream avec bordures colorées
- ✅ Loader - Couleurs orange/sand

## ✅ Pages mises à jour
- ✅ Home - Hero navy, sections alternées sand/cream

## 🎨 Palette complète

### Couleurs principales
```
navy: #0A1F33 (titres, nav, boutons secondaires)
sand: #0A1F33 (fond principal)
orange: #E8902C (CTA, accents)
text: #2E2E2E (texte principal)
gray-warm: #B5AFA6 (sous-titres)
cream: #FAF7F2 (fonds légers)
```

### Classes Tailwind disponibles
```
bg-navy, text-navy, border-navy
bg-sand, text-sand
bg-orange, hover:bg-orange-dark, hover:bg-orange-light
bg-cream, text-text
text-gray-warm
font-poppins, font-inter
font-title (600), font-title-bold (700)
font-text (400), font-text-medium (500)
rounded-card (12px)
shadow-card
```

## 📝 Patrons de boutons

### Primary (Bouton principal)
```jsx
className="bg-orange text-navy px-4 py-2 rounded-card font-inter font-text-medium hover:bg-orange-dark transition shadow-card"
```

### Secondary (Bouton secondaire)
```jsx
className="bg-navy text-sand px-4 py-2 rounded-card font-inter font-text-medium hover:bg-navy-dark transition"
```

### Soft (Bouton doux)
```jsx
className="bg-sand text-navy px-4 py-2 rounded-card border border-gray-warm font-inter font-text-medium hover:bg-orange-light transition"
```

## 📋 Pages restantes à mettre à jour

Utilisez les classes ci-dessus pour modifier:
- Annuaire
- ProfilPublic
- Login/Register
- Pages usager (Dashboard, EditProfil, Statut)
- Pages admin (Dashboard, ProfilsList, ProfilValidation)

### Modèle de remplacement:
- `bg-gray-50` → `bg-cream`
- `bg-white` → `bg-sand` ou `bg-cream`
- `text-gray-900` → `text-navy`
- `text-gray-600/700` → `text-text`
- `text-blue-600` → `text-orange`
- `bg-blue-600` → `bg-orange` (CTA) ou `bg-navy` (secondaire)
- `rounded-lg` → `rounded-card`
- `shadow-md/lg` → `shadow-card`
- `font-bold` → `font-poppins font-title-bold`
- `font-medium` → `font-inter font-text-medium`

## 🚀 Lancer le projet
```bash
cd frontend
npm run dev
```

Le design est maintenant cohérent avec la charte graphique !

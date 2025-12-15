# Plateforme de Gestion Communautaire

Système web de recensement et de valorisation des compétences locales d'une commune.

Le projet est composé de deux parties :

* **Backend** : Laravel (API)
* **Frontend** : React avec **Vite**

---

## Prérequis généraux

* Node.js **18+** 
* NPM **9+**
* PHP **8.2.29+**
* Composer
* MySQL **8.0+**

---

## Installation du projet

### 1️ Cloner le repository

```bash
git clone <url-du-repo>
cd plateforme-communautaire
```

---

##  Backend (Laravel)

### 2️⃣ Installer les dépendances PHP

```bash
composer install
```

### 3️⃣ Copier le fichier d'environnement

```bash
copy .env.example .env
```

### 4️⃣ Générer la clé d'application

```bash
php artisan key:generate
```

### 5️⃣ Configurer la base de données

Modifier les variables suivantes dans le fichier `.env` :

```env
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
```

### 6️⃣ Lancer les migrations

```bash
php artisan migrate
```

### 7️⃣ Lancer le serveur backend

```bash
php artisan serve
```

Par défaut, l’API sera accessible sur :

```
http://127.0.0.1:8000
```

---

## 🎨 Frontend (React + Vite)

Le frontend a été initialisé avec **Vite**.

### 📁 Accéder au dossier frontend

```bash
cd frontend
```

### 📦 Dépendances frontend

Toutes les dépendances (y compris **Vite** et les librairies nécessaires) sont déjà définies dans le fichier `package.json`.

👉 **Après avoir cloné le projet**, chaque développeur frontend doit simplement exécuter :

```bash
npm install
```

### ▶️ Lancer le serveur de développement

```bash
npm run dev
```

Le frontend sera accessible sur :

```
http://localhost:5173
```

⚠️ **Important** :

* Il n’est **pas nécessaire de réinstaller Vite**
* Il n’est **pas nécessaire de recréer le projet**
* Un simple `npm install` puis `npm run dev` suffit

---



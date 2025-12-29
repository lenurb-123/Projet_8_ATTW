const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6" style={{ color: '#0A1F33' }}>
          À propos
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <p className="text-gray-700 mb-4">
            Bienvenue sur la Plateforme de Gestion Communautaire.
          </p>
          <p className="text-gray-700">
            Cette plateforme permet de recenser et valoriser les compétences locales de notre commune.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
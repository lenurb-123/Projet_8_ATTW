import { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profession: "",
    secteur: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue.");
      }

      setMessage("Inscription réussie !");
      setMessageType("success");
      localStorage.setItem('userEmail', formData.email);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        profession: "",
        secteur: "",
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ color: '#0A1F33' }}
          aria-label="Retour à l'accueil"
        >
          <FaArrowLeft size={20} />
        </button>

        {/* Section gauche - Image */}
        <div className="hidden md:flex md:w-1/2">
          <img
            src="/register.png"
            alt="Inscription illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section droite - Formulaire */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto max-h-[90vh]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold font-poppins mb-2" style={{ color: '#0A1F33' }}>
              Créer un compte
            </h2>

            {message && (
              <div 
                className={`mb-4 p-3 rounded-lg text-sm ${
                  messageType === "success" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-medium text-sm text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  required
                  className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block font-medium text-sm text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                  className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block font-medium text-sm text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="exemple@mail.com"
                required
                className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium text-sm text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01 XX XX XX XX"
                required
                className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium text-sm text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block font-medium text-sm text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="profession" className="block font-medium text-sm text-gray-700 mb-2">
                Profession
              </label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Votre profession"
                required
                className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
              />
            </div>

            <div>
              <label htmlFor="secteur" className="block font-medium text-sm text-gray-700 mb-2">
                Secteur d'activité
              </label>
              <select
                id="secteur"
                name="secteur"
                value={formData.secteur}
                onChange={handleChange}
                required
                className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
              >
                <option value="">-- Choisissez un secteur --</option>
                <option value="cadres-administratifs">Cadres administratifs</option>
                <option value="cadres-techniques">Cadres techniques</option>
                <option value="chefs-entreprise">Chefs d'entreprise</option>
                <option value="artisans">Artisans</option>
                <option value="commercants">Commerçants</option>
                <option value="jeunes-entrepreneurs">Jeunes entrepreneurs</option>
                <option value="investisseurs">Investisseurs</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full text-white font-bold py-3 rounded-xl transition-colors mt-2 hover:opacity-90"
              style={{ backgroundColor: '#0A1F33' }}
            >
              S'inscrire
            </button>

            <div className="text-center text-sm text-gray-600">
              <p>
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="font-semibold underline"
                  style={{ color: '#0A1F33' }}
                >
                  Connectez-vous
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
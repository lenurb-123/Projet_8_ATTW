import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }

      setMessage("Connexion réussie !");
      setMessageType("success");
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', formData.email);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

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
        <div 
          className="hidden md:flex md:w-1/2 items-center justify-center p-6"
          style={{ backgroundColor: '#FFFFFF' }} 
        >
          <img
            src="/login-illustration.jpg"
            alt="Connexion illustration"
            className="w-full max-w-xs rounded-xl"
          />
        </div>

        {/* Section droite - Formulaire */}
        <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto max-h-[90vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold font-poppins mb-6" style={{ color: '#0A1F33' }}>
              Connexion
            </h2>

            {/* ✅ Affichage des messages */}
            {message && (
              <div 
                className={`p-4 rounded-lg mb-4 text-sm ${
                  messageType === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {message}
              </div>
            )}

            <div>
              <label htmlFor="email" className="font-medium text-sm text-gray-700">
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
                className="mb-4 mt-1 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
              />
            </div>

            <div>
              <label htmlFor="password" className="font-medium text-sm text-gray-700">
                Mot de passe
              </label>
              <div className="relative mb-4 mt-1">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: '#E8902C' }}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-inter">
                  Se souvenir de moi
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-sm font-medium underline"
                style={{ color: '#0A1F33' }}
              >
                Mot de passe oublié?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full text-white font-bold py-3 rounded-xl transition-colors hover:opacity-90"
              style={{ backgroundColor: '#0A1F33' }}
            >
              Se connecter
            </button>

            <div className="text-center text-sm text-gray-600">
              <p>
                Pas encore de compte ?{" "}
                <Link
                  to="/register"
                  className="font-semibold underline"
                  style={{ color: '#0A1F33' }}
                >
                  Inscrivez-vous
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import {authService} from "../../services/allServices.js";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Dans Login.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember
      });

      const user = await authService.getCurrentUser();

      setMessage("Connexion réussie !");
      setMessageType("success");

      setTimeout(() => {
        if (user?.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/usager/dashboard');
        }
      }, 1500);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Identifiants invalides");
    } finally {
      setLoading(false);
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

              {/* Affichage des messages */}
              {message && (
                  <div
                      className={`p-4 rounded-lg mb-4 text-sm ${
                          messageType === 'success'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
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
                    disabled={loading}
                    className="mb-4 mt-1 p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33] disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                      disabled={loading}
                      className="p-3 pr-10 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33] disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
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
                      disabled={loading}
                      className="h-4 w-4 rounded border-gray-300 disabled:opacity-50"
                      style={{ accentColor: '#E8902C' }}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 font-inter">
                    Se souvenir de moi
                  </label>
                </div>
                <Link
                    to="/forgot-password"
                    className="text-sm font-medium underline disabled:opacity-50"
                    style={{ color: '#0A1F33' }}
                >
                  Mot de passe oublié?
                </Link>
              </div>

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-bold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ backgroundColor: '#0A1F33' }}
              >
                {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </>
                ) : 'Se connecter'}
              </button>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Pas encore de compte ?{" "}
                  <Link
                      to="/register"
                      className="font-semibold underline hover:text-[#0A1F33] transition-colors"
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
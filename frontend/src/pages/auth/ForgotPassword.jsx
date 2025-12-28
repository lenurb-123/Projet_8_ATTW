// ForgotPassword.jsx
import { useState } from 'react';
import { FaEye, FaEyeSlash, FaTimes, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';


export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const { token } = useParams(); // Récupère le token dans l'URL
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email'); // Récupère l'email s'il est présent
  
  const [providedEmail, setProvidedEmail] = useState("");
  const [formResetData, setFormResetData] = useState({
    newpassword: "",
    confirmPassword: "",
  });
  
  const [resetProcessRunning, setResetProcessRunning] = useState(true); // pour définir le début et la fin du processus
  const [passwordModified, setPasswordModified] = useState(false); // pour définir l'état du reset du mot de passe
  const [valideConfirmCode, setValideConfirmCode] = useState(false); // pour (après) envoi par email
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hideAdvice, setHideAdvice] = useState(true); // pour des avertissements
  //
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  { /** Not Ok */ }
  const handleEMailSubmit = async (e) => {
    e.preventDefault();

    // Logique de traitement
    
    setLoading(true);
    //
    setTimeout(() => {/*
      if (!providedEmail.includes("@email.com") || !providedEmail.includes("@gmail.com")) {
        setHideAdvice(false);
        setLoading(false);
      } else {*/
        setLoading(false);
        setValideConfirmCode(true);
      //}
    }, 2000);
    //setHideAdvice(true);
  }

  { /** Not Ok */ }
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Logique de traitement

    setLoading(true);
    //
    setTimeout(() => {
      setLoading(false);
      setPasswordModified(true);
      //navigate('/login');
    }, 2000);
    /*
    if (success) {
      setPasswordModified(true);
    } else 
      setPasswordModified(false);
    */
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formResetData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors des modifications");
      }

      setMessage("Modifications effectuées !");
      setMessageType("success");

      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };
  

  return (
    <div className={" w-full absolute z-50 top-0 m-0 min-w-[324_px] min-h-screen flex items-center justify-center bg-[#f6f6f6] "} >
      <div id='toResetForm' className=' relative m-auto mx-6 px-6 py-9 min-w-[321_px] bg-white rounded-2xl shadow-2xl overflow-hidden '>

        { /**Reset Process : BLOCK 1 */ }
        { (resetProcessRunning) && (
        <>
          <h2 className="text-2xl font-bold font-poppins mb-6 text-[#E8902C] " >
            Réinitialisation de votre mot de passe
          </h2>
          {/* Bouton annuler */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-1.5 right-1.5 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            style={{ color: '#0A1F33' }}
            aria-label="Retour à l'accueil"
          >
            <FaTimes size={15} />
          </button>
          
          { /**Email Providing Form */ }
          { (!valideConfirmCode) && (
          <form id="sendEmail"
           onSubmit={handleEMailSubmit}
            className="space-y-6">
            <>
              <p className=' font-semibold '> Entrez votre addresse e-mail </p>
              <div>{/*
                <label htmlFor="eEmail" className="block font-medium text-sm text-gray-700 mb-2">
                  Email
                </label>*/}
                <input type="email"
                  id="providedEmail" name="providedEmail"
                  value={providedEmail}
                  onChange={(e) => setProvidedEmail( e.target.value )}
                  placeholder="exemple@mail.com"
                  required
                  className="p-3 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-[#0A1F33] focus:border-[#0A1F33]"
                />
                <input
                  className=' text-center w-full m-1 p-1 border border-red-600 text-[81%] font-thin '
                  value={"Use the right format abc@email.com or abc@gmail.com"} 
                   hidden={hideAdvice}
                   disabled />
              </div>
              <p className=' mx-2 my-1 font-thin text-gray-500 text-[90%] '> Un lien de réinitialisation vous sera envoyée par mail. </p>
            </>
            { /**BUTTON LINK */ }
            <div className='flex items-end gap-[18%]'>
              <Link to='/login'
                className=' mt-2 mr-auto w-fit text-navy underline font-serif
                          hover:text-[#E8902C] '
               > Retourner à la connexion </Link>
              <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 w-1/5 text-white font-bold px-2 py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ backgroundColor: '#0A1F33' }}
              >
                {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoie en cours ...
                    </>
                ) : 'Envoyer'}
              </button>
            </div>
          </form>
          )}
        
          { /**Password Reset Form */ }
          { (valideConfirmCode) && (
          <form id="resetPassword"
           onSubmit={handlePasswordSubmit}
            className=" space-y-6 ">

            <p className=' font-semibold '> Vous pouver réinitialiser votre mot de passe </p>
            {/* Champ caché pour le token */}
            <input type="hidden" name="token" value={token} />

            { /** Email en lecture seule */ }
            <div className=' relative px-4 py-2 border-x-2 rounded-3xl '>
              <p className=' mb-1 '> Addresse Email </p>
              <input type="email" id="currentEmail"
                value={email || "Email Introuvable"} 
                disabled 
                className=' w-[81%] px-4 py-1 border bg-gray-100 cursor-not-allowed ' />
            </div>
            { /**new Password */ }
            <div>
              <label htmlFor="password" className="block font-medium text-sm text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formResetData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
            { /**new PasswordConfirm */ }
            <div>
              <label htmlFor="confirmPassword" className="block font-medium text-sm text-gray-700 mb-2">
                Confirmation du nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formResetData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required = { formResetData.newpassword !== '' }
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

            { /**BUTTON LINK */ }
            <div className='flex items-end gap-[18%] [@media_(min-width:_321px)]:flex-row [@media_(min-width:_321px)]:text-red '>
              <Link to='/login'
                className=' mt-2 mr-auto w-fit text-navy underline font-serif
                          hover:text-[#E8902C] '
               > Retourner à la connexion </Link>
              <button
                  type="submit"
                  disabled={loading}
                  className=" flex-1 text-white font-bold px-2 py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ backgroundColor: '#0A1F33' }}
              >
                {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Modification en cours ...
                    </>
                ) : 'Modifier'}
              </button>
            </div>
          </form>
          )}
        </>
        )}

        { /** Reset Succes's Message || error : BLOCK 2 */ }
        { !(resetProcessRunning) && (
          <div className=" relative min-w-[221px] max-w-3xl p-3 text-[#E8902C]  font-poppins ">
          { passwordModified ? (
            <>
              <div className="flex_ gap-5 text-center font-bold ">
                <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big w-12 h-12 mx-auto mb-2" aria-hidden="true">
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <h2> Modifications effectuées </h2>
                <p> Votre mot de passe a bien été réinitialisé </p>
              </div>
              <div className=' mb- text-slate-600 font-semibold '>
                <br/>
                <p> Veuillez à ne pas perdre fréquemment votre mot de passe </p>
                <p> À l'avenir, songez à: </p>
                <ol>
                  <li>
                    - le sauvegarder en lieu sûr;
                  </li>
                  <li>
                    - cocher la case 'se rappeler de moi';
                  </li>
                  <li>
                    - vous en rappeler;
                  </li>
                </ol>
              </div>
              <br/><br/>

              { /**BUTTON LINK */ }
              <div className=' w-fit '>
                <Link to='/login'
                  className=' w-fit text-navy underline font-serif 
                    hover:text-[#E8902C] hover:no-underline hover:translate-x-3
                     transition-all '
                 > <FaArrowLeft /> Revenir à la connexion </Link>
              </div>
            </>
          ) : (
            <>
              {/* Bouton annuler */}
              <button
                onClick={() => navigate('/')}
                className="absolute top-0.5 right-0.5 z-10 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                style={{ color: '#0A1F33' }}
                aria-label="Retour à l'accueil (annuler)"
              >
                <FaTimes size={15} />
              </button>

              <h2 className=' text-rose-700 '> ERREUR LORS DE LA RÉINITIALISATION DU MOT DE PASSE </h2>
              <p className=" text-black "> Veuillez Réessayez </p>
              <br/><br/>

              { /**BUTTON LINK */ }
              <div className=' w-fit '>
                <Link to='/login'
                  className=' w-fit text-navy underline font-serif 
                    hover:text-[#E8902C] hover:no-underline hover:translate-x-3
                     transition-all '
                > <FaArrowLeft /> Réessayez </Link>
              </div>
            </>
          )}
          </div>
        )}

        { /** MODIFICATIONS END */ }
      </div>
    </div>
  )
}


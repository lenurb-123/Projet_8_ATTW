import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import './App.css';

function App() {
  const location = useLocation();
  const hideNavAndFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

export default App;

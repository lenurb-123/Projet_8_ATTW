import { Link } from 'react-router-dom';
import Hero from '../../components/sections/Hero';
import Categories from '../../components/sections/Categories';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Catégories Section */}
      <Categories />
    </div>
  );
};

export default Home;

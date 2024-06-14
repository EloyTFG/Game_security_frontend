import React, { useContext } from 'react';
import AuthContext from '../context/authContext';
import { useNavigate } from 'react-router-dom';

import ButtonAppBar from '../components/header';
import ProductHero from '../components/ProductHero';
import VantaComponent from '../components/netComponet';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewChallenges = () => {
    navigate('/challenges');
  };

  const phases = [
    { id: 1, name: 'Inyecciones SQL', path: '/challenges' },
    { id: 2, name: 'Broken Access Protocol', path: '/challengesbroken' },
    { id: 3, name: 'mitigat', path: '/challengemimit' },
    { id: 4, name: 'Inyecciones XSS', path: '/challengeListinyectionxss' },
    { id: 5, name: 'adsadada', path: '/base64-challenge' },
    { id: 6, name: 'adsaasdadaddada', path: '/hash-challenge' }
  ];
  

  return (
    <>
      
      <ButtonAppBar />
      <ProductHero />
      <VantaComponent />
      

      
    </>
  );
};

export default Home;

import React, { useContext } from 'react';
import AuthContext from '../context/authContext';
import { useNavigate } from 'react-router-dom';

import ButtonAppBar from '../components/header';
import ProductHero from '../components/ProductHero';
import VantaComponent from '../components/netComponet';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <> 
      <ButtonAppBar />
      <ProductHero />
      <VantaComponent />
    </>
  );
};

export default Home;

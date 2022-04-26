import React from 'react';
import './Home.css';
import '../Navigation/Navigation.css';
// modified from https://commons.wikimedia.org/wiki/File:Portal_2_Official_Logo.svg
import logo from './Fantasy_Portal_svg.png';
import Navigation from '../Navigation/Navigation';

function Home() {
  return (
    <div>
      <div className="App">
        <Navigation />
        <div className='home-logo'>
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </div>
  );
}

export default Home;


import React from 'react';
import './Home.css';
import '../Navigation/Navigation.css';
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


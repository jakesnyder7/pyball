import { NavLink } from 'react-router-dom';
import React from 'react';
import './Home.css';
import '../Navigation/Navigation.css';
import logo from './Fantasy_Portal_svg.png';

function Home() {
    return (
        <div>
          <nav>
          <div className="App">
            <header>
              {/* <p>
                Fantasy Player Portal
              </p> */}
              <img src={logo} alt="Logo" />
            </header>
            <div className="Prototype">
              <NavLink to="/compare-players" className='inactive' activeClassName='active' >
                  Compare Two Players
              </NavLink>
              <NavLink  to="/manipulate-spreadsheet" className='inactive' activeClassName='active' >
                  Manipulate Spreadsheet
              </NavLink>
              <NavLink to="/edit-team" className='inactive' activeClassName='active' >
                  Edit Team
              </NavLink>
            </div>
          </div>
          </nav>
        </div>
      );
}

export default Home;


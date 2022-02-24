import { NavLink } from 'react-router-dom';
import React from 'react';
import './Home.css';
import '../Navigation/Navigation.css'

function Home() {
    return (
        <div>
          <nav>
          <div className="App">
            <header>
              <p>
                Here is our prototype :)
              </p>
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


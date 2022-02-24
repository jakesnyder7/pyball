import { NavLink } from 'react-router-dom';
import React from 'react';
import './Home.css';

function Home() {
    return (
        <div>
          <nav>
          <div>
            <NavLink to="/">
            <button class="button-16" role="button">
              Home
            </button>
            </NavLink>
          </div>
          <div className="App">
            <header>
              <p>
                Here is our prototype :)
              </p>
            </header>
            <div className="Prototype">
              <NavLink to="/compare-players">
                <button class="button-3" role="button" >
                  Compare Two Players
                </button>
              </NavLink>
              <NavLink class="button-3" role="button" to="/manipulate-spreadsheet">
                <button class="button-3" role="button">
                  Manipulate Spreadsheet
                </button>
              </NavLink>
              <NavLink to="/edit-team">
                <button class="button-3" role="button">
                  Edit Team
                </button>
              </NavLink>
            </div>
          </div>
          </nav>
        </div>
      );
}

export default Home;


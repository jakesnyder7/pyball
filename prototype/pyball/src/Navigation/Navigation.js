import { NavLink } from 'react-router-dom';
import React from 'react';
import './Navigation.css';

function Navigation() {
    return (
        <div className='nav-div'>
          <nav>
            <NavLink to="/" className="inactive" activeClassName='active' >
              Home
            </NavLink>
            <NavLink to="/compare-players" className="inactive" activeClassName='active' >
                Compare Players
            </NavLink>
            <NavLink to="/manipulate-spreadsheet" className="inactive" activeClassName='active' >
                Research
            </NavLink>
            <NavLink to="/edit-team" className="inactive" >
                Team Builder
            </NavLink>
          </nav>
        </div>
      );
}

export default Navigation;
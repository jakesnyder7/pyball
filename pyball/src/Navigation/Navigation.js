import { NavLink } from 'react-router-dom';
import React from 'react';
import './Navigation.css';

function Navigation() {
    return (
        <div>
          <nav>
            <NavLink to="/" className="inactive" activeClassName='active' >
              Home
            </NavLink>
            <NavLink to="/compare-players" className="inactive" activeClassName='active' >
                Compare Two Players
            </NavLink>
            <NavLink to="/manipulate-spreadsheet" className="inactive" activeClassName='active' >
                Manipulate Spreadsheet
            </NavLink>
            <NavLink to="/edit-team" className="inactive" >
                Edit Team
            </NavLink>
          </nav>
        </div>
      );
}

export default Navigation;
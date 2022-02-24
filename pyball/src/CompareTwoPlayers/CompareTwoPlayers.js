import Navigation from '../Navigation/Navigation';
import './CompareTwoPlayers.css';
import { useState } from 'react';
import { Player } from './Player.js';
import { Table } from './Table.js';

/**
 * Hook to display the web app.
 * @author Marion Geary
 * @returns A div containing all app elements.
 */
function App() {

  // Variables to hold the two queried players
  let player1 = {};
  let player2 = {};

  // A sample player - in the real app, the player data will be fetched
  // in the backend
  const PMahomes = {
    name: 'Patrick Mahomes',
    src: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/tlg2oo5yrk6mins3nxxe',
    rating: 91.3,
    td: 3,
    int: 2,
    pcomp: 66.7,
    yds: 275
  };

  // Another sample player
  const JBurrow = {
    name: 'Joe Burrow',
    src: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/fhvbn2cstui3nchv8vil',
    rating: 86.5,
    td: 2,
    int: 1,
    pcomp: 60.5,
    yds: 250
  };

  // State function
  const [input, setInput] = useState({});

  // Update results of search in each textbox
  const handleChange = ({ target }) => {
      const { name, value } = target;
      setInput((prev) => ({
          ...prev,
          [name]: value
        })
      );
  }

  // State functions to show the results of each search
  const [showResult1, setShowResult1] = useState(false);
  const [showResult2, setShowResult2] = useState(false);

  // Update the status of the first search result
  // In this mockup, any input leads to a result. In the real app, a query
  // will have to match a player's name
  const onSubmit1 = (event) => {
    setShowResult1(true);
    event.preventDefault();
  };

  // Update the status of the second search result
  const onSubmit2 = (event) => {
    setShowResult2(true);
    event.preventDefault();
  };

  return (
    <div>
      <Navigation />
      <div className='CompareTwoPlayers'>
      <div className='PlayerDiv' >
        <div className='Playerz' >
          { showResult1 && <Player player={PMahomes} /> }
          <form onSubmit={onSubmit1} >
            <input
                type='text'
                placeholder="Enter player name"
                onChange={handleChange}
            />
          </form>
        </div>
        <div className='Vs' >
          <h1>
              VS.
          </h1>
        </div>
        <div className='Playerz' >
          { showResult2 && <Player player={JBurrow} />}
          <form onSubmit={onSubmit2} >
              <input
                  type='text'
                  placeholder="Enter player name"
                  onChange={handleChange}
              />
          </form>
        </div>
        </div>
          { (showResult2 && showResult1) && <Table player1={PMahomes} player2={JBurrow} /> }
      </div>
    </div>
  );
}

export default App;

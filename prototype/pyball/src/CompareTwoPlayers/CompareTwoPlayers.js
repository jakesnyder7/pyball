import Navigation from '../Navigation/Navigation';
import './CompareTwoPlayers.css';
import { Player } from './Player.js';
import NFLPlayer from './NFLPlayer.js';
import { Table } from './Table.js';
import useFetch from '../api/UseFetch.js';

/**
 * Hook to display the web app.
 * @author Marion Geary
 * @returns A div containing all app elements.
 */
function App() {
  // A sample player - in the real app, the player data will be fetched
  // in the backend
  const PMahomes = {
    full_name: 'Patrick Mahomes',
    headshot_url: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/tlg2oo5yrk6mins3nxxe',
    rating: 91.3,
    td: 3,
    int: 2,
    pcomp: 66.7,
    yds: 275
  };

  // Empty player to use as placeholder before queries entered
  const emptyPlayer = {
    full_name: "",
    headshot_url: 'https://pdtxar.com/wp-content/uploads/2019/04/person-placeholder.jpg',
  }

  // Another sample player
  const JBurrow = {
    full_name: 'Joe Burrow',
    headshot_url: 'https://static.www.nfl.com/image/private/t_headshot_desktop/league/fhvbn2cstui3nchv8vil',
    rating: 86.5,
    td: 2,
    int: 1,
    pcomp: 60.5,
    yds: 250
  };

  const { data, setData } = useFetch();
  //const { data2, setData2 } = useFetch();

  return (
    <div>
      <Navigation />
      <div className='CompareTwoPlayers'>
      <div className='PlayerDiv' >
        <div className='Playerz' >
          { data.results.length > 0 ? <Player player={data.results[0]} /> : <Player player={emptyPlayer} /> }
          <input
              type="text"
              placeholder="Enter player name"
              value={data.query}
              onChange={(e) => setData({ ...data, query: e.target.value })}
          />
        </div>
        <div className='Vs' >
          <h1>
              VS.
          </h1>
        </div>
        <div className='Playerz' >
          { data.results.length > 0 ? <Player player={PMahomes} /> : <Player player={emptyPlayer} /> }
          <form>
              <input
                  type='text'
                  placeholder="Enter player name"
                  value={data.query}
                  onChange={(e) => setData({ ...data, query: e.target.value })}
              />
          </form>
        </div>
        </div>
          { (data.results.length > 0 && data.results.length) && <Table player1={PMahomes} player2={JBurrow} /> }
      </div>
    </div>
  );
}

export default App;

import Navigation from '../Navigation/Navigation';
import './CompareTwoPlayers.css';
import { Player } from './Player.js';
import { Table } from './Table.js';
import useFetch1 from '../api/UseFetch.js';
import useFetch2 from '../api/useFetch2';


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

  const { data1, setData1 } = useFetch1();
  const { data2, setData2 } = useFetch2();

  return (
    <div>
      <Navigation />
      <div className='CompareTwoPlayers'>
      <div className='PlayerDiv' >
        <div className='Playerz' >
          { data1.results.length > 0 ? <Player player={data1.results[0]} /> : <Player player={emptyPlayer} /> }
          <input
              type="text"
              placeholder="Enter player name"
              value={data1.query}
              onChange={(e) => setData1({ ...data1, query: e.target.value })}
          />
        </div>
        <p>{data1.results.message}</p>
        <div className='Vs' >
          <h1>
              VS.
          </h1>
        </div>
        <div className='Playerz' >
          { data2.results.length > 0 ? <Player player={data2.results[0]} /> : <Player player={emptyPlayer} /> }
            <input
                type="text"
                placeholder="Enter player name"
                value={data2.query}
                onChange={(e) => setData2({ ...data2, query: e.target.value })}
            />
        </div>
        </div>
          { (data1.results.length > 0 && data2.results.length > 0) && <Table player1={data1.results[0]} player2={data2.results[0]} /> }
      </div>
    </div>
  );
}

export default App;
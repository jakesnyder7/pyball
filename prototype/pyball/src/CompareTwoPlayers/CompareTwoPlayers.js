import Navigation from '../Navigation/Navigation';
import './CompareTwoPlayers.css';
import React from 'react';
import { Player } from './Player.js';
import { ComparisonTable } from './ComparisonTable.js';
import { PlayerSearchForm } from '../api/PlayerSearchForm.js';
import { fetchData } from '../api/Fetch.js';
import { ComparisonChart } from './ComparisonChart';

/**
 * Hook to display player information along a search bar to retrieve player information.
 * @author Marion Geary and Claire Wagner
 * @param data The player data.
 * @param setData A function to use to update the player data.
 * @param setValidResults A function to use to indicate whether results returned by the search bar are valid.
 * @returns A div containing the player information and the search bar.
 */
function PlayerDiv({data, setData, validResults, setValidResults}) {

  // State to track the player search query
  const [query, setQuery] = React.useState('');

  // Empty player to use as a placeholder
   const emptyPlayer = {
    full_name: [""],
    headshot_url: ['https://pdtxar.com/wp-content/uploads/2019/04/person-placeholder.jpg'],
  }

  // Each time data changes, update validResults accordingly
  React.useEffect(() => {
    setValidResults(data != null && data.full_name != null && data.full_name.length > 0);
  }, [data, setValidResults]);

  return (
    <div className='Playerz' >
      { validResults
        ? <Player player={data} />
        : <Player player={emptyPlayer} /> }
      <PlayerSearchForm
        query={query}
        setQuery={setQuery}
        buttonText='Search'
        onFail={(errorMsg) => {
          alert(errorMsg);
          setValidResults(false);
        }}
        onPass={() => {
          fetchData(`player/${query}/`, setData, () => {setValidResults(false)});
        }}
      />
    </div>
  );
}

/**
 * Hook to display the Compare Two Players page.
 * @author Marion Geary and Claire Wagner
 * @returns A div containing all page elements.
 */
function CompareTwoPlayers() {
  
  // the data obtained from a query for Player 1
  const [data1, setData1] = React.useState(null);

  // the data obtained from a query for Player 2
  const [data2, setData2] = React.useState(null);

  // whether or not the most recent query for Player 1 produced valid results
  const [validResults1, setValidResults1] = React.useState(false);

  // whether or not the most recent query for Player 2 produced valid results
  const [validResults2, setValidResults2] = React.useState(false);

  // stats to display for each position
  const stats_by_position = React.useMemo(
    () => ({
      'QB': ['passing_yards', 'passing_tds', 'rushing_yards', 'interceptions'],
      'RB': ['rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 'receiving_tds'],
      'WR': ['receptions', 'receiving_yards', 'receiving_tds'],
      'TE': ['receptions', 'receiving_yards', 'receiving_tds'],
      'K': ['fg_made', 'fg_missed'],
    }),
    []
  );

  // the labels to display for each stat
  const stat_labels = React.useMemo(
    () => ({
      'passing_yards': 'PASSING YD',
      'passing_tds': 'PASSING TD',
      'interceptions': 'INT',
      'rushing_yards': 'RUSHING YD',
      'rushing_tds': 'RUSHING TD',
      'receptions': 'REC',
      'receiving_yards': 'RECEIVING YD',
      'receiving_tds': 'RECEIVING TD',
      'fg_made': 'FG MADE',
      'fg_missed': 'FG_MISSED',
    }),
    []
  );

  return (
    <div>
      <Navigation />
      <div className='CompareTwoPlayers'>
        <div className='PlayerDiv' >
          <PlayerDiv
            data={data1}
            setData={setData1}
            validResults={validResults1}
            setValidResults={setValidResults1}
          />
          <div className='Vs' >
            <h1>
                VS.
            </h1>
          </div>
          <PlayerDiv
            data={data2}
            setData={setData2}
            validResults={validResults2}
            setValidResults={setValidResults2}
          />
        </div>

        { validResults1 && validResults2
        && <div>
          <ComparisonTable
            player1={data1}
            player2={data2}
            stats_by_position={stats_by_position}
            stat_labels={stat_labels}
          />
          <ComparisonChart player1={data1} player2={data2} />
        </div>}
      </div>
    </div>
  );
}

export default CompareTwoPlayers;
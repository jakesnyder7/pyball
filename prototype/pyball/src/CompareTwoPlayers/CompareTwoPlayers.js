import Navigation from '../Navigation/Navigation';
import './CompareTwoPlayers.css';
import React from 'react';
import { Player } from './Player.js';
import { ComparisonTable } from './ComparisonTable.js';
import { UseFetchInput } from '../api/UseFetchInput.js';
import { ComparisonChart } from './ComparisonChart';

/**
 * Hook to display player information along a search bar to retrieve player information.
 * @authors Marion Geary and Claire Wagner
 * @param data The player data.
 * @param setData A function to use to update the player data.
 * @returns 
 */
function PlayerDiv({data, setData}) {
  // Empty player to use as placeholder before queries entered
   const emptyPlayer = {
    full_name: [""],
    headshot_url: ['https://pdtxar.com/wp-content/uploads/2019/04/person-placeholder.jpg'],
  }

  return (
    <div className='Playerz' >
      { Object.keys(data.results).length > 2 ? <Player player={data.results} /> : <Player player={emptyPlayer} /> }
      <UseFetchInput queryPrefix="player" data={data} setData={setData} placeholderText="Enter player name"/>
    </div>
  );
}


/**
 * Hook to display the Compare Two Players page.
 * @author Marion Geary and Claire Wagner
 * @returns A div containing all page elements.
 */
function App() {
  
  const [data1, setData1] = React.useState({
    query: "",
    results: [],
  });

  const [data2, setData2] = React.useState({
    query: "",
    results: [],
  });

  // stats to display for each position
  const stats_by_position = React.useMemo(
    () => ({
      'QB': ['passing_yards', 'passing_tds', 'rushing_yards', 'interceptions'],
      'RB': ['rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 'receiving_tds'],
      'WR': ['receptions', 'receiving_yards', 'receiving_tds'],
    }),
    []
  );

  // the names to display for each stat
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
    }),
    []
  );

  return (
    <div>
      <Navigation />
      <div className='CompareTwoPlayers'>
        <div className='PlayerDiv' >
          <PlayerDiv data={data1} setData={setData1} />
          <div className='Vs' >
            <h1>
                VS.
            </h1>
          </div>
          <PlayerDiv data={data2} setData={setData2} />
        </div>
          { (Object.keys(data1.results).length > 0 && Object.keys(data2.results).length > 0) 
          && <ComparisonTable player1={data1.results} player2={data2.results} stats_by_position={stats_by_position} stat_labels={stat_labels}/> }
      </div>
    </div>
  );
}

export default App;
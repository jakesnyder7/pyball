import React from 'react';
import { UseFetchInput } from '../api/UseFetchInput.js';
import { Player } from '../CompareTwoPlayers/Player.js';

/**
 * Hook to define a roster entry.
 * @author Claire Wagner
 * @param position The position of the player in the entry.
 * @returns The roster entry as a row.
 */
function RosterRow({position}) {

  // the data obtained from a query
  const [data, setData] = React.useState({
    query: "",
    results: [],
  });

  // whether or not the query produced valid results
  const [validResults, setValidResults] = React.useState(false);

  // player placeholder
  const emptyPlayer = {
    full_name: "",
    headshot_url: 'https://pdtxar.com/wp-content/uploads/2019/04/person-placeholder.jpg',
  }

  return (
    <tr>
      <td>
        {position}
      </td>
      <td>
        {/* search bar */}
        <UseFetchInput queryPrefix="player" data={data} setData={setData} setValidResults={setValidResults} placeholderText="Enter player name"/> 
      </td>
      <td>
        {/* player info */}
        {validResults ? <Player player={data.results}/> : <Player player={emptyPlayer}/>}
      </td>
    </tr>
  );
}

/**
 * Hook to define a roster.
 * @author Claire Wagner
 * @returns The roster as a table.
 * Parameters: comparand, column ID, color, and function defining comparison against the comparand.
 */
export function Roster() {
  const starters = React.useMemo(
    () => [
      'QB', 'RB', 'RB', 'WR', 'TE', 'Flex', 'K', 'D/ST'
    ],
    []
  );
  return (
    <table>
      <thead>
        <th>Position</th>
        <th>Search</th>
        <th>Player</th>
      </thead>
      <tbody>
        {starters.map(starter => <RosterRow position={starter}/>)}
      </tbody>
    </table>
  );
}
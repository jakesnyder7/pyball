import React from 'react';
import { UseFetchInput } from '../api/UseFetchInput.js';

/**
 * Hook to define a button to trigger the removal of an element.
 * @author Claire Wagner
 * @param onClick The event handler to execute when the button is clicked. 
 * @returns The button.
 */
function RemoveButton({onClick}) {
  return (
    <button onClick={onClick} style={{backgroundColor: 'red'}}>
      ×
    </button>
  );
}

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

  // event handler for button to remove player from roster
  function removeButtonOnClick() {
    data.query = '';
    setValidResults(false);
  }

  // helper function to compute the average of an array
  function average(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    return Number.parseFloat(sum / array.length, 2).toFixed(2);
  }

  return (
    <tr>
      <td width={75}>
        { /* display the search bar if no valid player query has been submitted; 
             otherwise, display the player's name */ }
        {validResults && data.results.position == position && <RemoveButton onClick={removeButtonOnClick}/>}
        {' '}
        {position}
      </td>
      { /* if a valid player query has been submitted, display various player stats */ }
      <td>
        {validResults && data.results.position == position ? data.results.full_name
        : <UseFetchInput queryPrefix="player" data={data} setData={setData} setValidResults={setValidResults} placeholderText="Enter player name"/> 
        }
      </td>
      <td>
        {validResults && data.results.position == position && average(data.results.fantasy_points)}
      </td>
      <td>
        {validResults && data.results.position == position && Math.min.apply(null, data.results.fantasy_points)}
      </td>
      <td>
        {validResults && data.results.position == position && Math.max.apply(null, data.results.fantasy_points)}
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
        <th>Player</th>
        <th>Mean</th>
        <th>Min</th>
        <th>Max</th>
      </thead>
      <tbody>
        {starters.map(starter => <RosterRow position={starter}/>)}
      </tbody>
    </table>
  );

}
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
 * Helper function to compute the average of an array.
 * @author Claire Wagner
 * @param array The array.
 * @returns The average.
 */
 function average(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return Number.parseFloat(sum / array.length, 2).toFixed(2);
}

/**
 * Hook to define a roster entry.
 * @author Claire Wagner
 * @param label The label for the roster entry.
 * @param positions A list of valid positions for this roster entry.
 * @param stats A list of stats to display. Each stat must have a property called 'accessor'
 * that will be used as the accessor to select the relevant data from search results, as well
 * as a property called 'function' that will be called on that data to produce the stat that
 * will be displayed (for example, to average the data and/or format it for display).
 * @returns The roster entry as a row.
 */
function RosterRow({label, positions, stats}) {

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

  // helper function to check if the player's position is a valid match for this roster entry
  function validPosition() {
    const pos = String(data.results.position);
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] === pos) {
        return true;
      }
    }
    return false;
  }

  return (
    <tr>
      <td width={75}>
        { /* display the search bar if no valid player query has been submitted; 
             otherwise, display the player's name */ }
        {validResults && validPosition()
        && <RemoveButton onClick={removeButtonOnClick}/>}
        {' '}
        {label}
      </td>
      { /* if a valid player query has been submitted, display the player's name */ }
      <td>
        {validResults && validPosition() 
          ? data.results.full_name
          : <UseFetchInput queryPrefix="player" data={data} setData={setData} setValidResults={setValidResults} placeholderText="Enter player name" /> 
        }
      </td>
      { /* if a valid player query has been submitted, display player stats */ }
      {stats.map((stat) => (
        <td>
          {validResults && validPosition()
          && stat.function(data.results[stat.accessor])}
        </td>
      ))}
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

  // Definition of roster positions
  const rosterPositions = React.useMemo(
    () => ({
      'QB': { number: 1},
      'RB': { number: 2},
      'WR': { number: 2},
      'TE': { number: 1},
      'Flex': { number: 1, positions: ['RB', 'WR', 'TE'] },
      'K': { number: 1},
    }),
    []
  );

  // Define stats to display for each roster entry
  const stats = React.useMemo(
    () => [
      { label: 'Fantasy Pts Avg', accessor: 'fantasy_points', function: average },
      { label: 'Fantasy Pts Min', accessor: 'fantasy_points', function: (data) => Math.min.apply(null, data) },
      { label: 'Fantasy Pts Max', accessor: 'fantasy_points', function: (data) => Math.max.apply(null, data) }
    ],
    []
  );

  // Helper function to build the roster
  function buildRoster(rosterPos) {
    const roster = [];
    Object.keys(rosterPos).forEach((pos) => {
      for (let i = 0; i < rosterPos[pos].number; i++) {
        roster.push(
          <RosterRow label={pos} positions={ rosterPos[pos].positions == null ? [pos] : rosterPos[pos].positions} stats={stats}/>
        );
      }
    });
    return roster;
  }

  // Memoized roster
  const roster = React.useMemo(
    () => (buildRoster(rosterPositions)),
    [rosterPositions]
  );
  
  return (
    <table>
      <thead>
        <th>Position</th>
        <th>Player</th>
        { stats.map((stat) => 
          <th>
            {stat.label}
          </th>
        )}
      </thead>
      <tbody>
        {roster}
      </tbody>
    </table>
  );

}
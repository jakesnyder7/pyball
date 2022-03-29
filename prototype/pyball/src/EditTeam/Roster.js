import React from 'react';
import { UseFetchInput } from '../api/UseFetchInput.js';
import './Roster.css';
import { average } from '../Stats/MathFunctions.js';

/**
 * Hook to define a button to trigger the removal of an element.
 * @author Claire Wagner
 * @param onClick The event handler to execute when the button is clicked. 
 * @returns The button.
 */
function RemoveButton({onClick}) {
  return (
    <button onClick={onClick} className='removeButton'>
      {'–'}
    </button>
  );
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
 * @param query The initial query for which to search (optional).
 * @param setRosterRecord A function to use to update the roster record array with valid query results.
 * @param rosterRecordIndex The index to use when updating the roster record array.
 * @returns The roster entry as a row.
 */
function RosterRow({label, positions, stats, query, setRosterRecord, rosterRecordIndex}) {

  // the data obtained from a query
  const [data, setData] = React.useState({
    query: query == null ? '' : query,
    results: [],
  });

  // whether or not the query produced valid results
  const [validResults, setValidResults] = React.useState(false);

  // event handler for button to remove player from roster
  function removeButtonOnClick() {
    setData({ ...data, results: null, query: '' });
    setValidResults(false);
  }
  
  // helper function to check if the player's position is a valid match for this roster entry
  const validPosition = React.useCallback(() => {
    return validResults && data.results.position != null
      && positions.includes(String(data.results.position));
  },
  [validResults, data.results, positions]);

  // each time a player is added to this roster entry, update the roster record at the corresponding index
  React.useEffect(() => {
    setRosterRecord((oldval) => {
      const tmp = oldval.map((entry) => entry);
      tmp[rosterRecordIndex] = validPosition()
        ? data.results.full_name
        : (validResults ? oldval[rosterRecordIndex] : null);
      return tmp;
    });
  }, [setRosterRecord, rosterRecordIndex, validPosition, data.results, validResults]);

  return (
    <tr>
      <td width={75}>
        { /* display the search bar if no valid player query has been submitted; 
             otherwise, display the player's name */ }
        {validPosition()
          && <RemoveButton onClick={removeButtonOnClick}/>}
        {' '}
        {label}
      </td>
      { /* if a valid player query has been submitted, display the player's name */ }
      <td>
        {validPosition() 
          ? data.results.full_name
          : <UseFetchInput queryPrefix="player" data={data} setData={setData} setValidResults={setValidResults} placeholderText="Enter player name" /> 
        }
      </td>
      { /* if a valid player query has been submitted, display player stats */ }
      {stats.map((stat) => (
        <td>
          {validPosition()
            && (data.results[stat.accessor] == null ? "N/A" : stat.function(data.results[stat.accessor]))}
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
          { label: pos, positions: (rosterPos[pos].positions == null ? [pos] : rosterPos[pos].positions) }
          //<RosterRow label={pos} positions={ rosterPos[pos].positions == null ? [pos] : rosterPos[pos].positions} stats={stats}/>
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

  // Record of roster entries
  const [rosterRecord, setRosterRecord] =  React.useState(new Array(roster.length));
  
  // Each time the roster record is updated, store the new version in local storage
  React.useEffect(() => {
    localStorage.setItem('roster', JSON.stringify(rosterRecord));
  }, [rosterRecord]);

  return (
    <table>
      <thead>
        <th>Position</th>
        <th>Player</th>
        {/* Headers */}
        { stats.map((stat) => 
          <th>
            {stat.label}
          </th>
        )}
      </thead>
      <tbody>
        {/* Roster entries */}
        {roster.map((entry, index) =>
          <RosterRow label={entry.label} positions={ entry.positions } stats={stats} query={localStorage.getItem('roster') != null ? JSON.parse(localStorage.getItem('roster'))[index] : null} setRosterRecord={setRosterRecord} rosterRecordIndex={index}/>
        )}
      </tbody>
    </table>
  );

}
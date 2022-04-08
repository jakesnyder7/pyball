import React from 'react';
import { averageRoundTo2 } from '../Stats/StatFunctions.js';
import { RosterRow } from './RosterRow.js';
import Got from '../api/Got.js'

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
      'BN': { number: 6, positions: ['QB', 'RB', 'WR', 'TE', 'Flex', 'K'] }
    }),
    []
  );

  // Define stats to display for each roster entry
  const stats = React.useMemo(
    () => [
      { label: 'Consistency Grade', accessor: 'consistency_grade', function: (data) => data },
      { label: 'Fantasy Pts Avg', accessor: 'fantasy_points', function: averageRoundTo2 },
      { label: 'Fantasy Pts Min', accessor: 'fantasy_points', function: (data) => Math.min.apply(null, data) },
      { label: 'Fantasy Pts Max', accessor: 'fantasy_points', function: (data) => Math.max.apply(null, data) },
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

  // If pyballRoster does not exist in local storage yet, add it
  if (localStorage.getItem('pyballRoster') == null) {
    localStorage.setItem('pyballRoster', JSON.stringify(new Array(roster.length)));
  }

  // State to keep track of metrics
  const [metrics, setMetrics] = React.useState(null);
  
  // Fetch metrics (should only occur once)
  React.useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await Got.get('/metrics/');
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []); // no dependencies since this should only occur once

  return (
    metrics &&
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
          <RosterRow
            label={entry.label}
            positions={ entry.positions }
            stats={stats}
            rosterIndex={index}
            metrics={metrics}
          />
        )}
      </tbody>
    </table>
  );

}
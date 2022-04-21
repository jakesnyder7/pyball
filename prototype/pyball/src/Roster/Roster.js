import React from 'react';
import { rosterStats } from '../Stats/StatDefinitions.js';
import { RosterRow } from './RosterRow.js';
import { fetchData } from '../api/Fetch.js';

/**
 * Hook to define a roster.
 * @author Claire Wagner
 * @param rosterPositions The roster positions, each of which should have the property 'number'
 * specifying the number of roster entries for that position and (optionally) a definition of the
 * positions that are legal for those roster entries.
 * @returns The roster as a table.
 * Parameters: comparand, column ID, color, and function defining comparison against the comparand.
 */
export function Roster({rosterPositions}) {

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
    fetchData('/metrics/', setMetrics, null);
  }, []); // no dependencies since this should only occur once

  return (
    metrics &&
    <table>
      <thead>
        <th>Position</th>
        <th></th>
        <th>Player</th>
        {/* Headers */}
        { rosterStats.map((stat) => 
          <th title={stat.hovertext}>
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
            stats={rosterStats}
            rosterIndex={index}
            metrics={metrics}
          />
        )}
      </tbody>
    </table>
  );

}
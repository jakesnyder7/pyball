import React from 'react';

  // The maximum number of slots in the roster.
  const MAX_SLOTS = 20;

/**
 * Hook defining a table row that allows the user to define the number of roster slots
 * for the given position.
 * @author Claire Wagner
 * @param position The name of the position.
 * @param rosterSlots An array containing the number of roster slots for each position.
 * @param rosterIndex The index in rosterSlots to which this position corresponds.
 * @param setRosterSlots The function to use to set the number of roster slots for this position.
 * @returns The table row.
 * Invariant: The number of roster slots that the user can choose for this position is in the
 * range [0, positionsLeft] where positionsLeft is equal to MAX_SLOTS minus the sum of the roster
 * slots for all other positions.
 */
function ConfigurePosition({position, rosterSlots, rosterIndex, setRosterSlots}) {

  // State to keep track of the options for the number of roster slots for this position
  const [options, setOptions] = React.useState(Array.from(Array(MAX_SLOTS+1).keys()));

  // Each time rosterSlots changes, update options accordingly
  React.useEffect(() => {
    // calculate how many positions are left by subtracting
    // all other entries in rosterSlots from MAX_SLOTS
    let posLeft = MAX_SLOTS;
    rosterSlots.every((val, index) => posLeft -= (index === rosterIndex) ? 0 : val);
    // update options based on posLeft
    let tmp = new Array(posLeft+1);
    for (let i = 0; i < posLeft+1; i++) {
      tmp[i] = i;
    }
    setOptions(tmp);
  }, [rosterSlots, rosterIndex, setOptions]);

  return (
    <tr>
      <td>
        {position}
      </td>
      <td>
        <select value={rosterSlots[rosterIndex]} onChange={(e) => {
          setRosterSlots((prev) => {
            // update rosterSlots when a new option is selected
            let tmp = [...prev];
            tmp[rosterIndex] = parseInt(e.target.value);
            return tmp;
          });
        }}>
          {options.map((opt) => (
            <option value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

/**
 * Hook that allows the user to configure the number of roster slots for each position.
 * Once confirmed, the configuration will be stored in local storage for use across sessions.
 * @param positions An array of positions for which the number of roster slots can be configured.
 * @param defaultConfig The default configuration option (optional).
 * @param onConfigure The function to call when the configuration is confirmed.
 * @returns A div containing the user interface for configuration.
 */
export function ConfigureRoster({positions, defaultConfig, onConfigure}) {

  // An array containing the number of roster slots for each position.
  const [rosterSlots, setRosterSlots] = React.useState(new Array(positions.length).fill(0));

  /**
   * Helper function to set the roster configuration in local storage.
   * @param rosterConfig An array containing the number of roster slots for each position.
   * Postcondition: The roster configuration has been set in local storage as item 'pyballRosterConfig'
   * and onConfigure has been called.
   */
  function setRosterConfig(rosterConfig) {
    localStorage.setItem('pyballRosterConfig', JSON.stringify(rosterConfig));
    onConfigure();
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Roster Slots</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, index) =>
              <ConfigurePosition
                position={pos}
                rosterSlots={rosterSlots}
                rosterIndex={index}
                setRosterSlots={setRosterSlots}
              />
          )}
        </tbody>
      </table>
      <div className='centered'>
        {/* Button to allow the user to confirm the configuration */}
        <button onClick={() => setRosterConfig(rosterSlots)}>
          Confirm Roster Configuration
        </button>
        {/* Button to allow the user to choose the default configuration */}
        {defaultConfig && <button onClick={() => {
          setRosterConfig(defaultConfig);
        }}>
          Use Default Configuration
        </button>}
      </div>
    </div>
  );
}
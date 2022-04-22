import React from 'react';
import { getStat } from '../Stats/StatFunctions.js';
import { fetchData } from '../api/Fetch.js';
import { PlayerSearchForm } from '../api/PlayerSearchForm.js';
import { YesNoPrompt, AcknowledgePrompt } from '../Prompts/Prompts.js';
import './RosterRow.css';

/**
 * Hook to define a button to trigger the removal of an element.
 * @author Claire Wagner
 * @param onClick The event handler to execute when the button is clicked. 
 * @returns The button.
 */
function RemoveButton({onClick}) {
  return (
    <button onClick={onClick} style={{backgroundColor: '#ff5370'}}>
      {'×'}
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
 * @param rosterIndex The index in the roster to which this row corresponds.
 * @param metrics Additional metrics which can be accessed by each player's gsis_id.
 * @returns The roster entry as a row.
 * Precondition: localStorage.getItem('pyballRoster') != null.
 * Postconditon: If a player has been added to the roster, then that player has also been added
 * to 'pyballRoster' at index rosterIndex in local storage.
 */
export function RosterRow({label, positions, stats, rosterIndex, metrics}) {

  // The query to use when searching for a player
  const [query, setQuery] = React.useState('');

  // The data resulting from a query
  const [data, setData] = React.useState(null);

  // The error message to display on error
  const [errorMsg, setErrorMsg] = React.useState('Unspecified error.');

  // Mode definitions
  const INIT_MODE = 0; // this roster row is initializing its state
  const SEARCH_MODE = 1; // the user can search for a player to add to this row
  const FETCH_MODE = 2; // the row is trying to fetch player data based on the provided query
  const VALID_MODE = 3; // valid player data that meets the row's criteria has been fetched and is being displayed
  const ERROR_MODE = 4; // an error has occurred and the user is being notified

  // The mode that this roster row is in
  const [mode, setMode] = React.useState(INIT_MODE);

  /**
   * Helper function to modify 'pyballRoster' in local storage.
   * Sets the element at rosterIndex in 'pyballRoster' to newVal.
   * @param newVal The new value to set for this row in 'pyballRoster'.
   * Preconditon: localStorage.getItem('pyballRoster') != null.
   */
  const modifyRoster = React.useCallback((newVal) => {
    let roster = JSON.parse(localStorage.getItem('pyballRoster'));
    roster[rosterIndex] = newVal;
    localStorage.setItem('pyballRoster', JSON.stringify(roster));
  }, [rosterIndex]);

  /**
   * Helper function to handle errors.
   * Postcondition: errorMsg has been set to the value of the parameter errorMessage
   * and mode has been set to ERROR_MODE.
   * @param errorMessage The error message to set.
   */
  function onError(errorMessage) {
    setErrorMsg(errorMessage);
    setMode(ERROR_MODE);
  }

  /**
   * Helper function that returns the elements to display based on the current mode.
   * @returns The elements to display based on the current mode.
   */
  function getModalDisplay() {
    if (mode === SEARCH_MODE) {
      return <PlayerSearchForm
        query={query}
        setQuery={setQuery}
        buttonText={'Add'}
        onFail={onError}
        onPass={() => setMode(FETCH_MODE)}
      />;
    } else if (mode === FETCH_MODE) {
      return <header>{'Loading data...'}</header>
    } else if (mode === ERROR_MODE) {
      return <span style={{color: '#ff5370'}}>
        <AcknowledgePrompt
          message={errorMsg}
          onAcknowledge={()=> {
            setQuery('');
            setData(null);
            setMode(SEARCH_MODE);
            setErrorMsg('Unspecified error.');
          }}
        />
      </span>
    } else if (mode === VALID_MODE) {
      const name = String(data.full_name).replaceAll('.','');
      return (
        <div>
          <img class="img-player" src={data.headshot_url} alt={name} height={40} />
          <header>{String(name).replaceAll('.','')}</header>
        </div>
      );
    } else if (mode === 'remove') {
      return <YesNoPrompt
        message={"Remove " + String(data.full_name).replaceAll('.','') + " from roster?"}
        onYes={()=>{
          modifyRoster(null);
          setQuery('');
          setData(null);
          setMode(SEARCH_MODE);
        }}
        onNo={()=>{
          setMode(VALID_MODE);
        }}/>
    } else {
      return null;
    }
  }

  // Handle state changes
  React.useEffect(() => {

    // Helper function to convert position list into a string
    function positionsToString() {
      let toReturn = String(positions[0]);
      for (let i = 1; i < positions.length; i++) {
        toReturn += ', ';
        if (i === positions.length-1) {
          toReturn += 'or ';
        }
        toReturn += String(positions[i]);
      }
      return toReturn;
    }

    /**
     * Helper function to check for errors.
     * @returns True if an error was detected, false otherwise.
     * Postcondition: If an error was detected, onError has been called.
     */
    function checkForError() {
      // check if data contains valid player info
      if (data.full_name == null || data.full_name.length < 1) {
        onError('Error: no match found.');
        return true;
      }
      // check if player position is invalid for this row
      if (!positions.includes(String(data.position))) {
        onError('Error: position must be ' + positionsToString() + '.');
        return true;
      }
      // check if this player has already been added to a different roster row (to prevent duplicates)
      const roster = JSON.parse(localStorage.getItem('pyballRoster'));
      for (let i = 0; i < roster.length; i++) {
        if (String(roster[i]) === String(data.full_name) && i !== rosterIndex) {
          onError('Error: duplicate player.');
          return true;
        }
      }
      return false;
    }

    // Update row state based on current mode, data, and local storage values
    if (mode === FETCH_MODE) {
      // fetch player data and check for errors
      // if no error was detected, add player to roster and set mode to VALID_MODE
      fetchData(`player/${query}/`, setData, onError);
      if (data != null && !checkForError()) {
        // no error detected
        modifyRoster(data.full_name);
        setMode(VALID_MODE);
      }
    } else if (mode === INIT_MODE) {
      // if this row already contains a player in local storage, update state accordingly
      const preexistent = JSON.parse(localStorage.getItem('pyballRoster'))[rosterIndex];
      if (preexistent != null) {
        // this row already contains a player in local storage
        setQuery(String(preexistent));
        setMode(FETCH_MODE);
      } else {
        // this row does not contain a player in local storage
        setMode(SEARCH_MODE);
      }
    }
  }, [data, mode, query, positions, rosterIndex, modifyRoster, setQuery, setMode]);
  
  return (
    <tr>
      <td width='25' style={{textAlign: 'left', padding: '10px'}}>
        {label}
      </td>
      <td width='10' style={{textAlign: 'left'}}>
      {mode === VALID_MODE
          && <RemoveButton onClick={() => {
            setMode('remove');
          }}/>}
      </td>
      <td>
        {getModalDisplay()}
      </td>
      {stats.map((stat) => (
        <td>
          {mode === VALID_MODE 
            ? getStat(
                stat.datasource === 'metrics' ? metrics[data.gsis_id] : data,
                stat.accessor,
                stat.function)
            : null}
        </td>
      ))}
    </tr>
  );
}


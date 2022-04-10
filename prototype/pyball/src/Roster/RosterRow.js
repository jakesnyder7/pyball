import React from 'react';
import { getStat } from '../Stats/StatFunctions.js';
import { fetchData } from '../api/Fetch.js';
import { PlayerSearchForm } from '../api/PlayerSearchForm.js';
import './RosterRow.css';

/**
 * Hook to define a button to trigger the removal of an element.
 * @author Claire Wagner
 * @param onClick The event handler to execute when the button is clicked. 
 * @returns The button.
 */
function RemoveButton({onClick}) {
  return (
    <button onClick={onClick} style={{backgroundColor: 'red'}}>
      {'×'}
    </button>
  );
}

/**
 * Hook to define a component that displays a message and prompts the user to select 'Yes' or 'No' in response.
 * @author Claire Wagner
 * @param message The message to display.
 * @param onYes The function to call if the user selects 'Yes'.
 * @param onNo The function to call if the user selects 'No'.
 * @returns A div containing the component.
 */
function YesNoChoice({message, onYes, onNo}) {
  return (
    <div style={{whiteSpace: 'nowrap', padding: '5px'}}>
      <header>
        {message}
      </header>
      <button onClick={onYes}>
        {'Yes'}
      </button>
      {' '}
      <button onClick={onNo}>
        {'No'}
      </button>
    </div>
  )
}

/**
 * Hook to define a component that displays a message and asks for the user's acknowledgment.
 * @author Claire Wagner
 * @param message The message to display.
 * @param onAcknowledge The function to call when the user acknowledges the message. 
 * @returns A div containing the component.
 */
function AcknowledgeMessage({message, onAcknowledge}) {
  return (
    <div style={{whiteSpace: 'nowrap', padding: '5px'}}>
      <header style={{display: 'inline-block'}}>
        {message}
      </header>
      <span style={{padding: '5px'}}>
        <button style={{display: 'inline-block'}} onClick={onAcknowledge}>
          {'Ok'}
        </button>
      </span>
    </div>
  )
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

  // The mode that this roster row is in
  // 'init' means that the row is initializing its state,
  // 'search' means that the user can use this row to search for a player to add,
  // 'fetch' means that the row is trying to fetch player data based on the query,
  // 'valid' means that valid player data that meets the row's criteria has been
  // loaded and is being displayed,
  // 'error' means that the user is being notified that an error has occurred.
  const [mode, setMode] = React.useState('init');

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
   * and mode has been set to 'error'.
   * @param errorMessage The error message to set.
   */
  function onError(errorMessage) {
    setErrorMsg(errorMessage);
    setMode('error');
  }

  /**
   * Helper function that returns the elements to display based on the current mode.
   * @returns The elements to display based on the current mode.
   */
  function getModalDisplay() {
    if (mode === 'search') {
      return <PlayerSearchForm
        query={query}
        setQuery={setQuery}
        buttonText={'Add'}
        onFail={onError}
        onPass={() => setMode('fetch')}
      />;
    } else if (mode === 'fetch') {
      return <header>{'Loading data...'}</header>
    } else if (mode === 'error') {
      return <AcknowledgeMessage
        message={errorMsg}
        onAcknowledge={()=> {
          setQuery('');
          setData(null);
          setMode('search');
          setErrorMsg('Unspecified error.');
        }}
      />
    } else if (mode === 'valid') {
      return <header>{data.full_name}</header>;
    } else if (mode === 'remove') {
      return <YesNoChoice
        message={"Remove " + data.full_name + " from roster?"}
        onYes={()=>{
          modifyRoster(null);
          setQuery('');
          setData(null);
          setMode('search');
        }}
        onNo={()=>{
          setMode('valid');
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
    if (mode === 'fetch') {
      // fetch player data and check for errors
      // if no error was detected, add player to roster and set mode to 'valid'
      fetchData(`player/${query}/`, setData, onError);
      if (data != null && !checkForError()) {
        // no error detected
        modifyRoster(data.full_name);
        setMode('valid');
      }
    } else if (mode === 'init') {
      // if this row already contains a player in local storage, update state accordingly
      const preexistent = JSON.parse(localStorage.getItem('pyballRoster'))[rosterIndex];
      if (preexistent != null) {
        // this row already contains a player in local storage
        setQuery(String(preexistent));
        setMode('fetch');
      } else {
        // this row does not contain a player in local storage
        setMode('search');
      }
    }
  }, [data, mode, query, positions, rosterIndex, modifyRoster, setQuery, setMode]);
  
  return (
    <tr>
      <td width='65' style={{textAlign: 'left', padding: '10px'}}>
        {mode === 'valid'
          && <RemoveButton onClick={() => {
            setMode('remove');
          }}/>}
        {' '}
        {label}
      </td>
      <td style={{backgroundColor: mode === 'error' ? 'red' : null}}>
        {getModalDisplay()}
      </td>
      {stats.map((stat) => (
        <td>
          {mode === 'valid' 
            ? getStat(data, stat.accessor, stat.function, metrics[data.gsis_id])
            : null}
        </td>
      ))}
    </tr>
  );
}


import React from 'react';
import Navigation from '../Navigation/Navigation';
import { Roster } from '../Roster/Roster.js';
import { ConfigureRoster } from '../Roster/ConfigureRoster.js';
import { YesNoPrompt } from '../Prompts/Prompts.js';
import './EditTeam.css';

/**
 * Hook to define and display the edit team page.
 * @author Claire Wagner
 * @returns A div containing all page elements.
 */
function EditTeam() {

  // Mode definitions
  const CONFIG_MODE = 1; // the user is able to configure the roster
  const REQUEST_RECONFIG_MODE = 2; // the user has requested to reconfigure the roster
  const ROSTER_MODE = 3; // the user is able to edit the configured roster

  // State to track the mode
  const [mode, setMode] = React.useState(
    localStorage.getItem('pyballRosterConfig')
      ? ROSTER_MODE // if a roster configuration is already stored in local storage, enter ROSTER_MODE
      : CONFIG_MODE);

  // The positions for the roster
  const rosterPositions = {
    'QB': {},
    'RB': {},
    'WR': {},
    'TE': {},
    'Flex': { positions: ['RB', 'WR', 'TE'] },
    'K': {},
    'BN': { positions: ['QB', 'RB', 'WR', 'TE', 'Flex', 'K'] },
  };

  // Get the roster positions according to the user's configuration
  function getRosterPositions() {
    let rosterConfig = JSON.parse(localStorage.getItem('pyballRosterConfig'));
    const positions = Object.keys(rosterPositions);
    for (let i = 0; i < positions.length; i++) {
      rosterPositions[positions[i]].number = parseInt(rosterConfig[i]);
    }
    return rosterPositions;
  };

  // The default number of roster entries for each position, ordered by position
  const defaultConfig = [1,2,2,1,1,1,6]; // 1 QB, 2 RB, 2 WR, 1 TE, 1 Flex, 1 K, 6 BN

  // Helper function that returns the elements to display based on the current mode.
  function getModalDisplay() {
    if (mode === CONFIG_MODE) {
      return (
        <ConfigureRoster
          positions={Object.keys(rosterPositions)}
          defaultConfig={defaultConfig}
          onConfigure={() => setMode(ROSTER_MODE)}
        />
      );
    } else if (mode === ROSTER_MODE || mode === REQUEST_RECONFIG_MODE) {
      return (
        <div>
          <div className='centered warning'>
            <button onClick={() => setMode(REQUEST_RECONFIG_MODE)}>
              Reconfigure Roster
            </button>
            {mode === REQUEST_RECONFIG_MODE
              ? <YesNoPrompt
                  message={'Are you sure you want to reconfigure your roster? Any changes you have made to your roster will be discarded.'}
                  onYes={()=> {
                    // remove preexisting roster and roster config data from local storage
                    localStorage.removeItem('pyballRoster');
                    localStorage.removeItem('pyballRosterConfig');
                    setMode(CONFIG_MODE);
                  }}
                  onNo={()=>{
                    setMode(ROSTER_MODE);
                  }}
                />
              : null}
          </div>
          <Roster rosterPositions={getRosterPositions()}/>
        </div>
      );
    }
  }

  return (
    <div>
      <Navigation />
      <div>
        {getModalDisplay()}
      </div>
    </div>
  );
}
  
export default EditTeam;
  
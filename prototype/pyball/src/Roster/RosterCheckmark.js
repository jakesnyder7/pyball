import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * Hook that displays a checkmark if the specified player is in the roster.
 * @author Claire Wagner
 * @param playername The name of the player.
 * @returns An image of a checkmark if the specified player is in the roster, null otherwise.
 */
 export function RosterCheckmark({playername}) {

    const inRosterRecord = React.useCallback(() => {
        return localStorage.getItem('pyballRoster')
            && JSON.parse(localStorage.getItem('pyballRoster')).some((entry) => String(entry) === String(playername));
    },
    [playername]);
  
    const [playerInRoster, setPlayerInRoster] = React.useState(inRosterRecord());
  
    window.addEventListener('storage', e => {
        setPlayerInRoster(inRosterRecord(playername));
    });
  
    React.useEffect(() => {
        setPlayerInRoster(inRosterRecord(playername));
    },
    [playername, inRosterRecord]);
  
    return (
        playerInRoster
        ? <NavLink to="/edit-team" target='_blank'>
           { <img src='https://upload.wikimedia.org/wikipedia/commons/e/e0/Check_green_icon.svg' title='go to roster' alt='link to roster' height={20} /> }
          </NavLink>
        : null
    );
  }
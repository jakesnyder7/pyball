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
        return localStorage.getItem('roster')
            && !JSON.parse(localStorage.getItem('roster')).every((entry) => String(entry) !== String(playername));
    },
    [playername]);
  
    const [playerInRoster, setPlayerInRoster] = React.useState(inRosterRecord());
  
    window.addEventListener('storage', e => {
        setPlayerInRoster(inRosterRecord(playername));
    });
  
    React.useEffect(() => {
        setPlayerInRoster(inRosterRecord(playername));
    },
    [playername]);
  
    return (
        playerInRoster
        ? <NavLink to="/edit-team" target='_blank'>
           { <img src='https://upload.wikimedia.org/wikipedia/commons/e/e0/Check_green_icon.svg' title='added to roster' alt='added to roster' height={20} />
           }
           {/*
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Antu_task-complete.svg/512px-Antu_task-complete.svg.png' title='added to roster' alt='added to roster' height={20} />
    */}
            {/*<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Eo_circle_green_white_checkmark.svg/240px-Eo_circle_green_white_checkmark.svg.png' title='added to roster' alt='added to roster' height={20} />
            */}
          </NavLink>
        : null
    );
  }

/**
 * Hook that returns the provided argument if the specified player is in the roster and null otherwise.
 * @author Claire Wagner
 * @param playername The name of the player.
 * @param toDisplay The element to return if the player is in the roster.
 * @returns The provided argument if the player is in the roster, null otherwise.
 */
 export function ConditionalRosterElement({playername, toDisplay}) {

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
    [playername]);
  
    return (
        playerInRoster
        ? toDisplay
        : null
    );
  }
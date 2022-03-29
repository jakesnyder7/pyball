import React from 'react';

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
        ?   <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/240px-Eo_circle_green_checkmark.svg.png' title='added to roster' alt='added to roster' height={20} />
        : null
    );
  }
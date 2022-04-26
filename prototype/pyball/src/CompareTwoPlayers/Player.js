import { RosterCheckmark } from '../Roster/RosterCheckmark.js';
import { formatPlayerName } from '../Stats/StatFunctions.js';
import './Player.css';

/**
 * Hook to define the player being searched in the app. Displays
 * the name and image of the appropriate player.
 * @author Marion Geary and Claire Wagner
 * @param {*} props 
 * @returns A div containing the name and image of the player.
 */
export function Player({ player }) {
    return (
        <div className='Player' >
            <div class="img-crop">
                <img class="img-player" src={player.headshot_url} alt={player.full_name} height={200} />
            </div>
            <div>
                <img class="img-logo" src={player.team_logo_espn} alt={player.team_nick} height={50} />
                <p>{player.team_name}</p>
            </div>
            { 'jersey_number' in player ? <p>{player.position} #{player.jersey_number}</p> : null }
            <header>
                {formatPlayerName(player.full_name)}
                {" "}
                {<RosterCheckmark playername={player.full_name} />}
            </header>
        </div>
    );
}
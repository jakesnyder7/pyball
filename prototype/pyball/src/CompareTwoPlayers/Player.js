import { RosterCheckmark } from '../Roster/RosterCheckmark.js';
import { formatPlayerName, getStat, getDataByAccessor } from '../Stats/StatFunctions.js';
import './Player.css';

/**
 * Hook to define the player being searched in the app. Displays
 * the name and image of the appropriate player.
 * @author Marion Geary and Claire Wagner
 * @param {*} props 
 * @returns A div containing the name and image of the player.
 */
export function Player({ player }) {
    //alert(player.team_name);
    //alert(player.team_logo_espn);
    return (
        <div className='Player' >
            <div class="img-crop">
                <img class="img-player" src={player.headshot_url} alt={player.full_name} height={200} />
            </div>
            {player.team_logo_espn != null
            ? <div>
                <img
                    class="img-logo"
                    src={getStat(player, 'team_logo_espn', getDataByAccessor)}
                    alt={getStat(player, 'team_nick', getDataByAccessor)}
                    height={50}
                />
                <p>{getStat(player, 'team_name', getDataByAccessor)}</p>
            </div>
            : null}
            { 'jersey_number' in player
            ? <p>
                {getStat(player, 'position', getDataByAccessor)}
                #{getStat(player, 'jersey_number', getDataByAccessor)}
            </p>
            : null }
            <header>
                {formatPlayerName(player.full_name)}
                {" "}
                {<RosterCheckmark playername={player.full_name} />}
            </header>
        </div>
    );
}
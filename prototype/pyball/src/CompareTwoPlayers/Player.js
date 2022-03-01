import './Player.css';

/**
 * Hook to define the player being searched in the app. Displays
 * the name and image of the appropriate player.
 * @author Marion Geary
 * @param {*} props 
 * @returns A div containing the name and image of the player.
 */
export function Player({ player }) {
    
    return (
        <div className='Player' >
            <img class="img-player" src={player.headshot_url} alt={player.full_name} height={200} />
            <div>
                <img class="img-logo" src={player.team_logo_espn} alt={player.team_nick} height={50} />
                <p>{player.team_name}</p>
            </div>
            <p>{player.position} #{player.jersey_number}</p>
            <header>
                {player.full_name}
            </header>
        </div>
    );
}
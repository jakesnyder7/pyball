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
            <img src={player.headshot_url} alt={player.full_name} height={200} />
            <header>
                {player.full_name}
            </header>
        </div>
    );
}
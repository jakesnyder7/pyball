import './Player.css';

/**
 * Hook to define the player being searched in the app. Displays
 * the name and image of the appropriate player.
 * @author Marion Geary
 * @param {*} props 
 * @returns A div containing the name and image of the player.
 */
export function Player(props) {
    
    return (
        <div className='Player' >
            <img src={props.player.src} alt={props.player.name} height={200} />
            <header>
                {props.player.name}
            </header>
        </div>
    );
}
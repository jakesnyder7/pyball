/**
 * Table.js
 */
import './Table.css'

/**
 * Hook to define the table that shows the player information.
 * Details and formating are based on the input in the App.js file.
 * @author Marion Geary
 * @param {*} props 
 * @returns A div containing a table filled with player information.
 */
export function Table(props) {

    /* The class 'greatest' refers to the more desirable statistic. Note that for
    some statistics, the most desirable statistic is actually the smallest number, 
    not the greatest. */
    return (
        <div className='Table' >
            <table>
                <tr>
                    <td class='greatest' >{props.player1.rating}</td>
                    <th>Rating</th>
                    <td>{props.player2.rating}</td>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.td}</td>
                    <th>TD</th>
                    <td>{props.player2.td}</td>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.pcomp}</td>
                    <th>% Completion</th>
                    <td>{props.player2.pcomp}</td>
                </tr>
                <tr>
                    <td>{props.player1.int}</td>
                    <th>INT</th>
                    <td class='greatest' >{props.player2.int}</td>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.yds}</td>
                    <th>YDS</th>
                    <td>{props.player2.yds}</td>
                </tr>
            </table>
        </div>
    );
};
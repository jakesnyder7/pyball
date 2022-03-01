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
                    <th colspan="3">
                        Average Weekly Stats from 2021 Season
                    </th>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.fantasy_points}</td>
                    <th>Fantasy Points</th>
                    <td>{props.player2.fantasy_points}</td>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.passing_tds + props.player1.rushing_tds}</td>
                    <th>TD</th>
                    <td>{props.player2.passing_tds + props.player1.rushing_tds}</td>
                </tr>
                <tr>
                    <td class='greatest' >{((props.player1.completions / props.player1.attempts) * 100).toFixed(2)}%</td>
                    <th>% Completion</th>
                    <td>{((props.player2.completions / props.player2.attempts) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>{props.player1.interceptions}</td>
                    <th>INT</th>
                    <td class='greatest' >{props.player2.interceptions}</td>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.passing_yards + props.player1.rushing_yards}</td>
                    <th>YDS</th>
                    <td>{props.player2.passing_yards + props.player2.rushing_yards}</td>
                </tr>
            </table>
        </div>
    );
};
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
                <tr class="Title" >
                    <th  colspan="3" >
                        Stats from Week 1 of 2021 Season
                    </th>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.fantasy_points_ppr[0]}</td>
                    <th>Fantasy Points</th>
                    <td>{props.player2.fantasy_points_ppr[0]}</td>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.passing_tds[0] + props.player1.rushing_tds[0]}</td>
                    <th>TD</th>
                    <td>{props.player2.passing_tds[0] + props.player1.rushing_tds[0]}</td>
                </tr>
                <tr>
                    <td class='greatest' >{((props.player1.completions[0] / props.player1.attempts[0]) * 100).toFixed(2)}%</td>
                    <th>% Completion</th>
                    <td>{((props.player2.completions[0] / props.player2.attempts[0]) * 100).toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>{props.player1.interceptions[0]}</td>
                    <th>INT</th>
                    <td class='greatest' >{props.player2.interceptions[0]}</td>
                </tr>
                <tr>
                    <td class='greatest' >{props.player1.passing_yards[0] + props.player1.rushing_yards[0]}</td>
                    <th>YDS</th>
                    <td>{props.player2.passing_yards[0] + props.player2.rushing_yards[0]}</td>
                </tr>
            </table>
        </div>
    );
};
import './Table.css';
import React from 'react';

/**
 * Hook to define a dropdown menu with options that are integers.
 * @param options An array of integer options for the menu.
 * @param choice The selected option.
 * @param setChoice A function to update the selected option.
 * @param addOne Whether or not to add 1 to the option values and labels
 * (for example, to convert a range of options starting at 0 to a range of options starting at 1).
 * @param label The label to display next to the option.
 * @returns The dropdown menu as a select element.
 */
function IntOptionSelect({options, choice, setChoice, addOne, label}) {
    return (
        <select value={choice} onChange={ (e) => { 
            setChoice(e.target.value);
        }}>
            {options.map(opt => (
              <option value={parseInt(opt) + (addOne ? 1 : 0)}>
                {label + (parseInt(opt) + (addOne ? 1 : 0))}
              </option>
            ))}
        </select>
    );
}

 /**
  * Hook to define a table that shows player information based on the position of Player 1.
  * @author Claire Wagner
  * @param player1 The stats for the first player.
  * @param player2 The stats for the second player.
  * @param stats_by_position The stats to display for each position.
  * @param stat_labels The labels to display for the stats.
  * @returns A div containing the table.
  */
 export function ComparisonTable({player1, player2, stats_by_position, stat_labels}) {

    // list of weeks for which stats are available for at least one player (starts at 0)
    const weeks = player1.week.length > player2.week.length ? Object.keys(player1.week) : Object.keys(player2.week);

    // the week for which to show stats
    const [weekChoice, setWeekChoice] = React.useState(parseInt(Object.keys(weeks)[0]) + 1);

     return (
         <div className='Table' >
             <table>
                 <tr>
                     <th colspan="3">
                         {"Stats from "}
                         <IntOptionSelect options={weeks} choice={weekChoice} setChoice={setWeekChoice} addOne={true} label="Week " />
                         {" of 2021 Season"}
                     </th>
                 </tr>
                 {stats_by_position[player1.position].map((stat) => 
                    <tr>
                        <td>
                            {player1[stat][weekChoice - 1] == null ? "N/A": player1[stat][weekChoice - 1]}
                        </td>
                        <th>{stat_labels[stat]}</th>
                        <td>
                            {player2[stat][weekChoice - 1] == null ? "N/A": player2[stat][weekChoice - 1]}
                        </td>
                    </tr>
                 )}
             </table>
         </div>
     );
 };
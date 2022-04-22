import './Table.css';
import React from 'react';
import { round, getSumByAccessor, getAvgByAccessor } from '../Stats/StatFunctions';

/**
 * Hook to define a dropdown menu with options, the value of each of which is that option's index.
 * @author Claire Wagner
 * @param labels An array of labels for the menu options.
 * @param choice The selected option.
 * @param setChoice A function to update the selected option.
 * @returns The dropdown menu as a select element.
 */
function IndexOptionSelect({labels, choice, setChoice}) {
    return (
        <select value={choice} onChange={ (e) => { 
            setChoice(parseInt(e.target.value));
        }}>
            {labels.map((label, index) => (
              <option value={index}>
                {label}
              </option>
            ))}
        </select>
    );
}

/**
 * Helper function to set the element in the provided array at the given index to the appropriate stat.
 */
function populateStatHelper(array_index, player_index, player, player_data, accessor) {
    // Helper function to parse the provided stat
    function parseStat(stat) {
        return stat != null
            ? stat
            : "N/A"
    }
    if (array_index+1 === player.week[player_index]) {
        player_data[array_index] = parseStat(player[accessor][player_index]);
        return player_index+1;
    } else {
        player_data[array_index] = 0;
        return player_index;
    }
}

 /**
  * Hook to define a table that shows player information based on the position of Player 1.
  * @author Claire Wagner and Marion Geary
  * @param player1 The stats for the first player.
  * @param player2 The stats for the second player.
  * @param stats_by_position The stats to display for each position.
  * @param stat_labels The labels to display for the stats.
  * @returns A div containing the table.
  */
 export function ComparisonTable({player1, player2, stats_by_position, stat_labels}) {

    // the data from player1 and player2 that will be displayed for each stat in the table
    let p1_data = {};
    let p2_data = {};

    // the maximum week for which data for at least one of these players exists
    const MAX_WEEK = player1.week.length > player2.week.length
        ? player1.week.at(-1)
        : player2.week.at(-1);

    const NUM_OPTIONS = MAX_WEEK + 2;

    // an array of labels to display for each option in the view selection dropdown menu
    const labels = new Array(NUM_OPTIONS);
    
    // an array of functions to retrieve the data to display for each option in the view selection dropdown menu
    const functions = new Array(NUM_OPTIONS);

    // add option to view each week of the season and the corresponding function
    for (let i = 0; i < MAX_WEEK; i++) {
        labels[i] = `Week ${i+1}`;
        functions[i] = (data, accessor, index) => { return data[accessor][index] };
    }
    
    // add option to view season average and the corresponding function
    labels[NUM_OPTIONS-2] = 'Average';
    functions[NUM_OPTIONS-2] = (data, accessor, index) => {
        return round(getAvgByAccessor(data, accessor),2)
    };

    // add option to view season total and the corresponding function
    labels[NUM_OPTIONS-1] = 'Total';
    functions[NUM_OPTIONS-1] = (data, accessor, index) => {
        return getSumByAccessor(data, accessor)
    };

    // populate p1_data and p2_data for each stat
    stats_by_position[player1.position].forEach((stat) => {
        const p1_stat = new Array(MAX_WEEK);
        const p2_stat = new Array(MAX_WEEK);
        let p1_index = 0;
        let p2_index = 0;
        for (let i = 0; i < MAX_WEEK; i++) {
            p1_index = populateStatHelper(i, p1_index, player1, p1_stat, stat);
            p2_index = populateStatHelper(i, p2_index, player2, p2_stat, stat);
        }
        p1_data[stat] = p1_stat;
        p2_data[stat] = p2_stat;
    });

    // the index of the view for which to show stats
    const [choiceIndex, setChoiceIndex] = React.useState(0);

    return (
        stats_by_position[player1.position] != null &&
        <table>
            {<tr>
                <th colspan="3">
                    {"Stats from "}
                    <IndexOptionSelect labels={labels} choice={choiceIndex} setChoice={setChoiceIndex} />
                    {" of 2021 Season"}
                </th>
            </tr>}
            {stats_by_position[player1.position].map((stat) => 
            <tr>
                <td>
                    {functions[choiceIndex](p1_data, stat, choiceIndex)}
                </td>
                <th>
                    {stat_labels[stat]}
                </th>
                <td>
                {functions[choiceIndex](p2_data, stat, choiceIndex)}
                </td>
            </tr>
            )}
        </table>
    );
}
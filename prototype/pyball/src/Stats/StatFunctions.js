/**
 * Helper function to compute the average of an array (rounded to 2 decimal places).
 * @author Claire Wagner
 * @param array The array.
 * @returns The average.
 */
export function average(array) {
  let sum = 0;
  let len = 0;
  for (let i = 0; i < array.length; i++) {
    if (!isNaN(parseFloat(array[i]))) {
      sum += array[i];
      len++;
    }
  }
  return sum / len;
  //return Number.parseFloat(sum / len).toFixed(2);
}

/**
 * Round to the specified number of decimal places.
 * @param n The number to round.
 * @param places The number of decimal places. 
 * @returns 
 */
export function round(n, places) {
  return Number.parseFloat(n).toFixed(places);
}

/**
 * Compute the average and round to 2 decimal places.
 * @param data The data to round. 
 * @returns The average of the data, rounded to 2 decimal places.
 */
export function averageRoundTo2(data) {
  return round(average(data),2);
}

/** 
 * Helper function to get a single stat from the provided data given a player, accessor, and function.
 * @param data The data from which to obtain the stat.
 * @param accessor The accessor to use to access the relevant data.
 * @param function The function to apply to the data to produce the stat (optional).
 * @returns The stat.
 */
export function getStat(data, accessor, func, metrics) {
  // Helper function to parse stat
  function parseStat(stat) {
    let parsed = (func != null ? func(stat) : stat);
    if (Array.isArray(parsed)) {
      parsed = parsed[0];
    }
    return String(parsed);
  }

  if (data[accessor] == null || data[accessor][0] == null || String(data[accessor]) === "NA") {
    if (metrics && metrics[accessor]) {
      return parseStat(metrics[accessor]);
    } else {
      return "N/A";
    }
  }
  return parseStat(data[accessor]);
}
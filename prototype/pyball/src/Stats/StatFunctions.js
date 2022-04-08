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
  return Number.parseFloat(sum / len, 2).toFixed(2);
}

/** 
 * Helper function to get a single stat from the provided data given a player, accessor, and function.
 * @param data The data from which to obtain the stat.
 * @param accessor The accessor to use to access the relevant data.
 * @param function The function to apply to the data to produce the stat (optional).
 * @returns The stat.
 */
export function getStat(data, accessor, func, metrics) {
  if (data[accessor] == null || data[accessor][0] == null || String(data[accessor]) === "NA") {
    if (metrics && metrics[accessor]) {
      return metrics[accessor];
    }
    //alert(data.full_name);
    //alert(metrics == null);
    /*if (metrics[accessor] == null) {
      alert("metrics[accessor == null]");
    }*/
    return "N/A";
  }
  let stat = (func != null ? func(data[accessor]) : data[accessor]);
  if (Array.isArray(stat)) {
    stat = stat[0];
  }
  return String(stat);
}
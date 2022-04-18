/**
 * Helper function to compute the average of an array.
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
  return sum / (len > 0 ? len : 1);
  //return Number.parseFloat(sum / len).toFixed(2);
}

/**
 * Helper function to sum all values in an array.
 */
export function sum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    if (!isNaN(parseFloat(array[i]))) {
      sum += array[i];
    }
  }
  return sum;
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

export function getMin(data) {
  return Math.min.apply(null, data);
}

export function getMax(data) {
  return Math.max.apply(null, data);
}

/** 
 * Helper function to get a single stat from the provided data given a player, accessor, and function.
 * @param data The data from which to obtain the stat.
 * @param accessor The accessor to use to access the relevant data.
 * @param func The function to apply to the data to produce the stat (optional).
 * @returns The stat.
 */
export function getStat(data, accessor, func) {
  // Helper function to parse stat
  function parseStat(stat) {
    let parsed = (func != null ? func(stat) : stat);
    if (Array.isArray(parsed)) {
      parsed = parsed[0];
    }
    return parsed;
  }

  if (data && data[accessor] != null && data[accessor][0] != null && String(data[accessor]) !== "NA") {
    return parseStat(data[accessor]);
  } else {
    return "N/A";
  }
}
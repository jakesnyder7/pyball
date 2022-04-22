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
 * @author Claire Wagner
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
 * @author Claire Wagner
 * @param n The number to round.
 * @param places The number of decimal places. 
 * @returns 
 */
export function round(n, places) {
  return Number.parseFloat(n).toFixed(places);
}

/**
 * Find the minimum value in an array of data.
 * @author Claire Wagner
 */
export function getMin(data) {
  return Math.min.apply(null, data);
}

/**
 * Find the minimum value in an array of data.
 * @author Claire Wagner
 */
export function getMax(data) {
  return Math.max.apply(null, data);
}

/** 
 * Helper function to get a single stat from the provided data given a player, accessor, and function.
 * If the result of the provided function is an array, the first element in that array will be returned.
 * @author Claire Wagner
 * @param data The data to use.
 * @param accessor The accessor that will be passed to the provided function to select the relevant
 * data.
 * @param accessor The accessor to use to access the relevant data.
 * @param func The function to apply to the data to produce the stat (optional). If provided,
 * this function will be passed the data and accessor.
 * @returns The stat.
 */
export function getStat(data, accessor, func) {
  let parsed = (func != null ? func(data, accessor) : data);
  if (Array.isArray(parsed)) {
    parsed = parsed[0];
  }
  return parsed;
}

/**
 * Helper function that retrieves the value of the appropriate property from the provided data using the
 * provided accessor.
 * If the data is null or the value of the property is invalid, then "N/A" will be returned instead.
 * @author Claire Wagner
 * @param data The data.
 * @param accessor The accessor (which should be the name of a property of data).
 * @returns The value of the appropriate property, or "N/A" if that value is invalid.
 */
export function getDataByAccessor(data, accessor) {
  if (data == null || data[accessor] == null || data[accessor][0] == null || String(data[accessor]) === "NA") {
    return "N/A";
  } else {
    return data[accessor];
  }
}

/**
 * Helper function that calls getDataByAccessor, passing it the provided parameters, and returns
 * the sum of the return value from getDataByAccessor (or "N/A" if the return value is also "N/A").
 * @author Claire Wagner
 * @param data The data to pass getDataByAccessor.
 * @param accessor The accessor to pass getDataByAccessor.
 */
export function getSumByAccessor(data, accessor) {
  const stats = getDataByAccessor(data, accessor);
  return stats === "N/A"
    ? "N/A"
    : sum(stats);
};

/**
 * Helper function that calls getDataByAccessor, passing it the provided parameters, and returns
 * the average of the return value from getDataByAccessor (or "N/A" if the return value is also "N/A").
 * @author Claire Wagner
 * @param data The data to pass getDataByAccessor.
 * @param accessor The accessor to pass getDataByAccessor.
 */
 export function getAvgByAccessor(data, accessor) {
  const stats = getDataByAccessor(data, accessor);
  return stats === "N/A"
    ? "N/A"
    : average(stats);
};
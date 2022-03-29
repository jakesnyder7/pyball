/**
 * Helper function to compute the average of an array.
 * @author Claire Wagner
 * @param array The array.
 * @param decPlaces The number of decimal places to which to round the average (2 by default).
 * @returns The average.
 */
 export function average(array, decPlaces) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    if (decPlaces == undefined) {
      return Number.parseFloat(sum / array.length, 2).toFixed(2);
    } else {
      return Number.parseFloat(sum / array.length, decPlaces).toFixed(2);
    }
  }
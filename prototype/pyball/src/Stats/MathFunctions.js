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
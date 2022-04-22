import Got from './Got';

/**
 * Fetch data from the api.
 * @authors Marion Geary and Claire Wagner
 * @param query The query to send to the api.
 * @param setData The state function to use to set the results of the query.
 * @param onError The function to call if an error occurs (optional).
 */
export const fetchData = async(query, setData, onError) => {
  try {
    const res = await Got.get(query);
    setData(res.data);
  } catch (err) {
    console.error(err);
    onError && onError('Error: failed to fetch data from server.');
    setData(null);
  }
};
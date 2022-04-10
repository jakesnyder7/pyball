import Got from './Got';

// Helper function to fetch data from the backend
export const fetchData = async(query, setData, onError) => {
  try {
    const res = await Got.get(query);
    setData(res.data);
  } catch (err) {
    console.error(err);
    onError && onError('Error: failed to fetch data.');
    setData(null);
  }
};
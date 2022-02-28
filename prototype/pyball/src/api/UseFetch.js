import { useState, useEffect } from "react";
import Got from './Got';

const useFetch = () => {
    const [data, setData] = useState({
      query: "",
      results: [],
    });
  
    useEffect(() => {
      if (data.query !== "") {
        const timeoutId = setTimeout(() => {
          const fetch = async () => {
            try {
              const res = await Got.get(`/${data.query}/`);
              setData({ ...data, results: res.data });
            } catch (err) {
              console.error(err);
            }
          };
          fetch();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }, [data.query]);
  
    return { data, setData };
  };

export default useFetch;
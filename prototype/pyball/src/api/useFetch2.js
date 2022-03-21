import { useState, useEffect } from "react";
import Got from './Got';

const useFetch2 = () => {
    const [data2, setData2] = useState({
      query: "",
      results: [],
    });
  
    useEffect(() => {
      if (data2.query !== "") {
        const timeoutId = setTimeout(() => {
          const fetch = async () => {
            try {
              const res = await Got.get(`/player/${data2.query}/`);
              setData2({ ...data2, results: res.data });
            } catch (err) {
              console.error(err);
            }
          };
          fetch();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }, [data2.query]);
  
    return { data2, setData2 };
  };

export default useFetch2;


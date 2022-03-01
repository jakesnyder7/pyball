import { useState, useEffect } from "react";
import Got from './Got';

const useFetch1 = () => {
    const [data1, setData1] = useState({
      query: "",
      results: [],
    });
  
    useEffect(() => {
      if (data1.query !== "") {
        const timeoutId = setTimeout(() => {
          const fetch = async () => {
            try {
              const res = await Got.get(`/${data1.query}/`);
              setData1({ ...data1, results: res.data });
            } catch (err) {
              console.error(err);
            }
          };
          fetch();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }, [data1.query]);
  
    return { data1, setData1 };
  };

export default useFetch1;
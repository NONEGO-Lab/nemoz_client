import { useEffect, useRef } from "react";


export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(()=>{
    savedCallback.current = callback;
  },[callback]);

  useEffect(()=>{
    const tick = () => {
      //클로저로 최신의 상태를 땡겨온다.
      savedCallback.current();
    }

    if(delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

  },[delay])
}
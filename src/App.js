import React, { useEffect } from "react";
import { sock } from "./socket/config";
import Router from "./shared/router/Router";


function App() {

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(()=>{
    sock.connect();

    return () => {
      sock.offAny();
      sock.disconnect();
    }

  },[])


  return (
      <Router/>
  );
}

export default App;

import React, { useEffect } from "react";
import { sock } from "./socket/config";
import Router from "./shared/router/Router";


function App() {

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

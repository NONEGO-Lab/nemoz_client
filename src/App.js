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

  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`); //"--vh"라는 속성으로 정의해준다.
  }

  window.addEventListener('resize', () => setScreenSize());


  return (
      <Router/>
  );
}

export default App;

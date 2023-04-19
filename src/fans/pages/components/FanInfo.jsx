import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CallControl from "../../../room/components/CallControl";
import ConnectControl from "../../../room/components/ConnectControl";
// import MyTimer from "../video/TimeChecker";
// import { attendeeApi } from "../data/attendee_data";



const FanInfo = ({ type, currentFan, setCurrentFan }) => {


  if(type === "call") {
    return(
        <div className="text-base font-bold">
          <CallControl currentFan={currentFan} setCurrentFan={setCurrentFan}/>
        </div>
    )
  }

  if (type === "test") {
    return (
        <div className="text-base font-bold">
          <ConnectControl/>
        </div>
    )
  }


};


export default FanInfo;
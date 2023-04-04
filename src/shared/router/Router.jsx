import React from "react";
import {BrowserRouter, Routes, Route,} from "react-router-dom";
import SignUp from "../../auth/pages/SignUp";
import RoomList from "../../room/pages/RoomList";
import { Auth } from "../Auth";
import ParticipantList from "../../fans/pages/ParticipantList";
import DeviceTest from "../../test/pages/DeviceTest";
import VideoContainer from "../../room/pages/VideoContainer";
import CreateEvent from "../../event/pages/CreateEvent";
import UpdateEvent from "../../event/pages/UpdateEvent";
import EventList from "../../event/pages/EventList";
import ErrorBoundary from "../../shared/ErrorBoundary";
import ConnectTest from "../../test/pages/ConnectTest";
import Login from "../../auth/pages/Login";
import WaitingRoom from "../../fans/pages/WaitingRoom";


const Router = () => {
  return (
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/roomlist" element={<Auth><RoomList/></Auth>}/>
            <Route path="/userlist" element={<Auth><ParticipantList/></Auth>}/>
            <Route path="/waitcall" element={<Auth><WaitingRoom/></Auth>}/>
            <Route path="/devicetest" element={<Auth><DeviceTest/></Auth>}/>
            <Route path="/test/:id" element={<Auth><ConnectTest/></Auth>}/>
            <Route path="/video/:id" element={<Auth><VideoContainer/></Auth>}/>
            <Route path="/create/event" element={<Auth><CreateEvent/></Auth>}/>
            <Route path="/update/event/:id" element={<Auth><UpdateEvent/></Auth>}/>
            <Route path="/eventlist" element={<Auth><EventList/></Auth>}/>
          </Routes>
          {/*{ isError && <ErrorPopup/> }*/}
        </BrowserRouter>
      </ErrorBoundary>

  );
}

export default Router;
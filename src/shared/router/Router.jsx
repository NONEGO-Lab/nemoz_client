import React from "react";
import {BrowserRouter, Routes, Route,} from "react-router-dom";
import SignUpView from "../../auth/pages/SignUpView";
import RoomList from "../../room/pages/RoomListView";
import { Auth } from "../Auth";
import ParticipantList from "../../fans/pages/ParticipantListView";
import DeviceTest from "../../test/pages/DeviceTest";
import VideoContainer from "../../call/pages/VideoContainer";
import CreateEvent from "../../event/pages/components/CreateEvent";
import UpdateEvent from "../../event/pages/components/UpdateEvent";
import EventListView from "../../event/pages/EventListView";
import ErrorBoundary from "../../shared/ErrorBoundary";
import ConnectTest from "../../test/pages/ConnectTest";
import LoginView from "../../auth/pages/LoginView";
import WaitingRoom from "../../fans/pages/WaitingRoom";
import TmpVideoContainer from "call/pages/TmpVideoContainer";
import ConnectTest2 from "test/pages/ConnectTest2";
import Waiting2 from "../../fans/pages/Waiting2";


const Router = () => {
  return (
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView/>}/>
            <Route path="/signup" element={<SignUpView/>}/>
            <Route path="/roomlist" element={<Auth><RoomList/></Auth>}/>
            <Route path="/userlist" element={<Auth><ParticipantList/></Auth>}/>
            <Route path="/waitcall" element={<Auth><WaitingRoom/></Auth>}/>
            <Route path="/wait2" element={<Waiting2/>}/>
            <Route path="/devicetest" element={<Auth><DeviceTest/></Auth>}/>
            <Route path="/test/:id" element={<Auth><ConnectTest/></Auth>}/>
            <Route path="/test2/:id" element={<Auth><TmpVideoContainer/></Auth>}/>
            <Route path="/video/:id" element={<Auth><VideoContainer/></Auth>}/>
            <Route path="/tmpvideo" element={<Auth><TmpVideoContainer/></Auth>}/>
            <Route path="/create/event" element={<Auth><CreateEvent/></Auth>}/>
            <Route path="/update/event/:id" element={<Auth><UpdateEvent/></Auth>}/>
            <Route path="/eventlist" element={<Auth><EventListView/></Auth>}/>
            
          </Routes>
          {/*{ isError && <ErrorPopup/> }*/}
        </BrowserRouter>
      </ErrorBoundary>

  );
}

export default Router;
import React from "react";
import {BrowserRouter, Routes, Route,} from "react-router-dom";
import RoomList from "../../room/pages/RoomListView";
import { Auth } from "../Auth";
import ParticipantList from "../../fans/pages/ParticipantListView";
import EventListView from "../../event/pages/EventListView";
import ErrorBoundary from "../../shared/ErrorBoundary";
import LoginView from "../../auth/pages/LoginView";
import WaitingRoom from "../../fans/pages/WaitingRoom";
import TmpVideoContainer from "call/pages/TmpVideoContainer";
import VideoContainer2 from "../../call/pages/components/VideoContainer2";


const Router = () => {
  return (
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView/>}/>
            <Route path="/roomlist" element={<Auth><RoomList/></Auth>}/>
            <Route path="/userlist" element={<Auth><ParticipantList/></Auth>}/>
            <Route path="/waitcall" element={<Auth><WaitingRoom/></Auth>}/>
            <Route path="/test/:id" element={<Auth><TmpVideoContainer/></Auth>}/>
            <Route path="/video2/:id" element={<Auth><VideoContainer2/></Auth>}/>
            <Route path="/eventlist" element={<Auth><EventListView/></Auth>}/>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>

  );
}

export default Router;
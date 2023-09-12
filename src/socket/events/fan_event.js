import React from "react";
import {addTestSessionInfo} from "../../redux/modules/testSlice";
import { addRoomInfo, addSessionInfo } from "../../redux/modules/commonSlice";


export const fanEvents = {

  joinTestSession: ({ data, userInfo, dispatch, setIsReadyTest }) => {
    if(data.fanId.toString() === userInfo.id.toString()) {
      console.log('data', data)
      let sessionInfo = { meetName: data.meetName };
      dispatch(addTestSessionInfo(sessionInfo));
      setIsReadyTest(true);
    }
  },

  nextFanTurn: ({ nextFanInfo, sessionInfo, roomInfo, userInfo, dispatch, setIsAvailableCall }) => {
    if(nextFanInfo.fan_id.toString() === userInfo.id.toString()){
      dispatch(addSessionInfo(sessionInfo));
      dispatch(addRoomInfo(roomInfo));
      setIsAvailableCall(true);
    }
  },

  updateWaitOrder: ({ fanList, userInfo, getMyWaitingInfo }) => {
    // 현재 대기열에 있는 팬 리스트들이 order를 update 하게끔 한다.
    if(fanList.find((fan) => fan.fan_id === userInfo.id)) {
      getMyWaitingInfo();
    }
  },
};
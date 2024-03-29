import React from "react";
import { sock } from "../config";
import {
  addTimer,
  subscribedFanInfo,
  toggleRotateFan
} from "../../redux/modules/videoSlice";
import { clearSessionInfo } from "../../redux/modules/commonSlice";
import {nanoid} from "nanoid";
export const videoEvents = {

  chatMessage: ({ msg, getChatFromSocket, addToast }) => {
    addToast({ type: "reaction", msg });
  },

  joinRoom: ({ user,addToast, setFanEnterNoti }) => {
    if(user.role === 'member'){
      setFanEnterNoti(true)
      // fanEnterNoti({ type: "time", join: `${user.username}님이 들어오셨습니다.`, id:nanoid(4) });
      setFanEnterNoti(true)
      setTimeout(()=>{
        setFanEnterNoti(false)
      },3000)

    }

  },

  joinNextRoom: ({ newSessionInfo, userId, nextFan, userInfo, onlyJoinNewRoom }) => {
    if(userId.toString() === userInfo.id.toString()){
      onlyJoinNewRoom(newSessionInfo, nextFan);
    }

  },

  leaveRoom: ({ userInfo, notify, setStaffNoticeList, dispatch, setFanEnterNoti }) => {
    if(userInfo !== undefined) {
      if(userInfo.role === "member") {
        /// fan이면 타이머 멈추기
        dispatch(addTimer(0));
        setFanEnterNoti(false)
      } else {
        let noticeData = { type: "leave", msg: `${userInfo.username}님이 나가셨습니다` };
        setStaffNoticeList((prev) => [...prev, noticeData]);
      }
    }
  },

  endMeet: ({ userInfo, navigate }) => {
    if(userInfo.role === "fan") {
      navigate("/waitcall");
    } else {
      navigate("/roomlist");
    }
  },

  kickOut: ({ fanInfo, userInfo, roomInfo, sessionInfo, navigate, eventId, dispatch, setWarnCnt }) => {
    if(fanInfo.id.toString() === userInfo.id.toString()){
      /// 강퇴 당하는 팬이면, leaveRoom 찍고, 대기방으로 쫓겨나기
      let roomNum = `${eventId||roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
      sock.emit("leaveRoom", roomNum, fanInfo, navigate);
      navigate("/waitcall");
    }else{
      setWarnCnt(0)
      dispatch(subscribedFanInfo({}))
    }
  },

  leftTime: ({ time, dispatch, userInfo }) => {
    if(time === undefined) {
      return;
    }

    if(userInfo.role === "staff") {
      dispatch(addTimer(time));
    }

  },

  reqLeftTime: ({ room, leftTimeRef }) => {
    sock.emit("leftTime", room, leftTimeRef.current);
  },

  timerStart: ({ time, dispatch }) => {
    dispatch(addTimer(time));
  },

  notifyTime: ({ time,addToast }) => {
    addToast({ type: "time", msg: `${time}초 남았습니다.`, id:nanoid(4) });

  },

  warnUser: ({count, role, setWarnCnt, addToast }) => {
    setWarnCnt(count)
    if(role === "fan"|| role === "member") {
      addToast({ type: "warn", msg: `${count}회 경고 받았습니다.`, id:nanoid(4)});
    } else {
      addToast({ type: "warn", msg: `${count}회 경고 주었습니다.`, id:nanoid(4) });
    }
  },

  callFinish: ({ fan, userInfo, dispatch, navigateByRole, clearSession }) => {
    if(fan.fan_id.toString() === userInfo.id.toString()){
      navigateByRole();
      dispatch(clearSession());

    }
  },

  lastMeet: ({ artistId, setCurrentFan, userInfo,
               dispatch, clearSession, addTimer, navigateByRole}) => {
    if(artistId.toString() === userInfo.id.toString()) {
      setCurrentFan({});
      dispatch(clearSession());
      dispatch(addTimer(0));
      navigateByRole();

    }
  },

  rotateFan: ({ rotateState, dispatch }) => {
    dispatch(toggleRotateFan(rotateState))
    }
  ,
};
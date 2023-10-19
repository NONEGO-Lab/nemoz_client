import React from "react";
import { sock } from "../config";
import { addTimer, disconnectSession, setIsCallFinished } from "../../redux/modules/videoSlice";
import { clearSessionInfo } from "../../redux/modules/commonSlice";
import { notify } from "../../call/pages/components/notify";

export const videoEvents = {

  chatMessage: ({ msg, getChatFromSocket }) => {
    getChatFromSocket(msg);
  },

  joinRoom: ({ user, setStaffNoticeList }) => {
    let noticeData = { type: "join", msg: `${user.username}님이 들어오셨습니다.`};
    setStaffNoticeList((prev) => [...prev, noticeData]);
  },

  joinNextRoom: ({ newSessionInfo, userId, nextFan, userInfo, onlyJoinNewRoom }) => {
    if(userId.toString() === userInfo.id.toString()){
      onlyJoinNewRoom(newSessionInfo, nextFan);
    }

  },

  leaveRoom: ({ userInfo, notify, setStaffNoticeList, dispatch }) => {
    console.log(userInfo, 'leaveRoomleaveRoomleaveRoom')
    if(userInfo !== undefined) {
      if(userInfo.role === "fan") {
        /// fan이면 타이머 멈추기
        dispatch(addTimer(0));
      } else {
        notify(userInfo, "leave");
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

  kickOut: ({ fanInfo, userInfo, roomInfo, sessionInfo, navigate, eventId }) => {

    if(fanInfo.id.toString() === userInfo.id.toString()){
      /// 강퇴 당하는 팬이면, leaveRoom 찍고, 대기방으로 쫓겨나기
      let roomNum = `${eventId||roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
      sock.emit("leaveRoom", roomNum, fanInfo, navigate);
      navigate("/waitcall");
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

  notifyTime: ({ time, fan, setStaffNoticeList, userInfo }) => {
    let noticeData = { type: "time", msg: `${fan.fan_name}님에게 ${time}초 남았음을 알려주었습니다.` };
    setStaffNoticeList((prev) => [...prev, noticeData]);

    if(fan.fan_id.toString() === userInfo.id.toString()) {
      notify(time, "time");
    }
  },

  warnUser: ({ user, count, role, notify, setStaffNoticeList,setWarnCnt }) => {
    setWarnCnt(count)
    if(role === "fan") {
      notify(`${count}회 경고 받았습니다.`, "warn");
    } else {
      notify(`경고를 주었습니다. (총 ${count}회)`, "warn");
      let noticeData = { type: "warn", msg: ` ${user.fan_name}님에게 경고를 주었습니다. (총 ${count}회)` };
      setStaffNoticeList((prev) => [...prev, noticeData]);
    }
  },

  callFinish: ({ fan, userInfo, dispatch, navigateByRole, clearSession }) => {
    if(fan.fan_id.toString() === userInfo.id.toString()){
      navigateByRole();
      dispatch(clearSession());

    }
  },

  lastMeet: ({ artistId, setCurrentFan, userInfo,
               dispatch, clearSession, addTimer}) => {
    if(artistId.toString() === userInfo.id.toString()) {
      setCurrentFan({});
      dispatch(clearSession());
      dispatch(addTimer(0));

    }
  },
};
import React, { useState } from "react";
import { Button } from "../../../element";
import { useDispatch, useSelector } from "react-redux";
import { attendeeApi } from "../../../fans/data/attendee_data";
import { meetApi } from "../../data/call_data";
import { sock } from "../../../socket/config";
import { setIsError, setError } from "../../../redux/modules/errorSlice";


const SettingBar = ({ setIsOpenWaitingModal, currentFan, leftTimeRef }) => {

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const roomInfo = useSelector((state) => state.common.roomInfo);
  const sessionInfo = useSelector((state) => state.common.sessionInfo);
  const connectionInfo = useSelector((state) => state.common.connectionInfo);
  const subscribers = useSelector((state) => state.video.subscribers);
  const eventId = useSelector((state) => state.event.eventId);

  let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;

  const sendLeftTimeHandler = () => {

    if(subscribers.length === 0) return;

    // socket 으로 방에 있는 모든 사람들에게 남은 시간을 알려준다!
    let room = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;
    let time = leftTimeRef.current;
    sock.emit("notifyTime", room, time, currentFan);
  }


  const requestKickOutApi = async () => {
    const result = await attendeeApi.banFan({ id: connectionInfo.meet_id, userId: userInfo.id});

    if(result.conn_data.meet_id) {

      const request = {
        user_info: {
          id: result.fan_data.id.toString(),
          role: result.fan_data.role,
        },
        type: 'ban',
        meet_name: result.conn_data.meet_name,
        connection_id: result.conn_data.conn_id,
        connection_name: result.conn_data.conn_name,
        progress_time: 180
      }

      try {
        const response = await meetApi.leaveMeet(request);

        if(response) {
          sock.emit("kickOut", roomNum, result.fan_data[0]);
        }
      } catch (err) {
        dispatch(setError(err));
        dispatch(setIsError(true));
      }


    }
  }

  const kickOutHandler = async () => {

    if(subscribers.length === 0) return;

    let roomId = roomInfo.room_id;

    if(window.confirm(`정말로 ${currentFan.fan_name}씨를 강퇴하시겠습니까?`)){
      requestKickOutApi();
    }
  }

  const warnHandler = async () => {
    // 경고 api + 경고 socket

    if(subscribers.length === 0) return;

    if(window.confirm(`정말로 ${currentFan.fan_name}를 경고하시겠습니까?`)){
      let connId = connectionInfo.meet_id;
      const result = await attendeeApi.warnFan(connId);
      if(result.msg === "Warning Count is Updated") {
        sock.emit("warnUser", roomNum, currentFan, result.warning_count);
      }

      if(result.warning_count >= 3){
        requestKickOutApi();
      }
    }

  }

  return (
      <div className="flex justify-center text-base">
        <Button
            _onClick={() => setIsOpenWaitingModal(true)}
            margin="mr-2" width={"w-[100px]"}>
          대기열보기
        </Button>
        <Button
            _onClick={kickOutHandler}
            margin="mr-2" width={"w-[90px]"}>
          강퇴
        </Button>
        <Button
            _onClick={warnHandler}
            margin="mr-2" width={"w-[90px]"}>
          경고
        </Button>
        <Button
            _onClick={sendLeftTimeHandler}
            margin="mr-2" width={"w-[90px]"}>
          시간 고지
        </Button>
      </div>

  )
}

export default SettingBar;
import React, {useEffect, useState} from "react";
import { Button } from "../../element";
import { useVideo } from "../../call/controller/hooks/useVideo";
import { useSocket } from "../../socket/useSocket";
import {useDispatch, useSelector} from "react-redux";
import { meetApi } from "../../call/data/call_data";
import { roomApi } from "../data/room_data";
import {sock} from "../../socket/config";
import { useNavigate, useSearchParams } from "react-router-dom";
import { attendeeApi } from "../../fans/data/attendee_data";
import { setIsCallFinished, addTimer } from "../../redux/modules/videoSlice";
import { setError, setIsError } from "../../redux/modules/errorSlice";
import {end_meet} from "../../model/call/call_model";

const CallControl = ({ currentFan, setCurrentFan }) => {

  const [isCallProcessing, setIsCallProcessing] = useState(false);
  const [isFirstCall, setIsFirstCall] = useState(true);
  const roomInfo = useSelector((state) => state.common.roomInfo);
  const sessionInfo = useSelector((state) => state.common.sessionInfo);
  const subscribers = useSelector((state) => state.video.subscribers);
  const userInfo = useSelector((state) => state.user.userInfo);
  const eventId = useSelector((state) => state.event.eventId);

  const [searchParams, setSearchParams] = useSearchParams();

  const { leaveSession, joinSession } = useVideo();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;


  const finishCurrentCall = async () => {
    if(window.confirm("정말 통화를 종료하시겠습니까?")){
      try {
        let roomId = roomInfo.room_id;
        const fanList = await roomApi.getListOrder({ eventId, roomId });
        const curFan = subscribers.find((sub) => sub['role'] === 'fan');
        const curFanIndex = fanList.findIndex((fan) => fan.fan_id.toString() === curFan.id.toString());
        const nextFan = fanList[curFanIndex + 1];
        const fanId = fanList[curFanIndex].fan_id;

        //test
        //test
        //test2
        //test2

        const request = {
          ...end_meet,
          meet_id: sessionInfo.meetId,
          meet_name: sessionInfo.meetName,
          room_id: roomId,
          event_id: eventId,
          fan_id: fanId
        }
        const result = await meetApi.endMeet(request);

        if(result) {
          leaveSession();
          setIsCallProcessing(false);
          dispatch(setIsCallFinished());
          dispatch(addTimer(null));

          // sock.emit("leaveRoom", roomNum, userInfo);
          sock.emit("callFinish", currentFan);
          sock.emit("checkSessionState", roomNum, false);


          // 다음 팬이 있으면, 팬 정보 가져오고, 새 session을 열어준다.
          if(nextFan !== undefined) {
            const detail = await attendeeApi.getFanDetail(nextFan.fan_id);
            setCurrentFan(detail);

            // 대기열에 있는 팬들의 대기열 업데이트 필요
            const waitFans = fanList.slice(curFanIndex + 2);
            sock.emit("updateWaitOrder", waitFans);

            // 방에 있는 artist or staff 에게도 알려줘야 함!
            const newSessionInfo = await joinSession(roomId);
            setSearchParams({meetName: newSessionInfo.meetName});
            let roomNum = `${eventId}_${roomId}_${newSessionInfo.meetId}`;

            const otherStaffInfo = subscribers.find((sub) => sub['id'].toString() !== userInfo.id.toString());
            sock.emit("joinNextRoom", roomNum, newSessionInfo, otherStaffInfo['id'], nextFan);
            sock.emit("joinRoom", roomNum, userInfo);

          } else {
            setCurrentFan({});
            const otherStaffInfo = subscribers.find((sub) => sub['id'].toString() !== userInfo.id.toString());
            sock.emit("lastMeet", otherStaffInfo['id']);
          }

        }
      } catch (err) {
        dispatch(setError(err));
        dispatch(setIsError(true));
      }
    }
  };


  const nextCallConnect = async () => {

    // 첫 렌더링때는 이미 join 되어있는 상황이라, fan에게 socket 알람만 가면 된다.
    if(Object.keys(currentFan).length === 0) {
      alert("마지막 팬입니다.");
      navigate("/roomlist");
      return;
    }

    if(isFirstCall) {
      sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
      setIsFirstCall(false);
    } else {
      /// 다음 팬 알리기
      sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
    }
    setIsCallProcessing(true);
    sock.emit("checkSessionState", roomNum, true);
  };

  const getFirstFanInfo = async () => {
    let roomId = roomInfo.room_id;
    try {
      const result = await roomApi.getListOrder({ eventId, roomId });
      const detail = await attendeeApi.getFanDetail(result[0].fan_id);
      setCurrentFan(detail);
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  }

  useEffect(() => {
    getFirstFanInfo();

    if(subscribers.length > 0) {
      setIsCallProcessing(true);
    }

  },[]);

  useEffect(()=>{
    sock.on("checkSessionState", (bool) => {
      setIsCallProcessing(bool);
    })

    return () => {
      sock.off("checkSessionState", (bool) => {
        setIsCallProcessing(bool);
      })
    }
  },[])


  return(
      <>
        <div className={"ml-4"}>
          {/*남은 시간 : { time !== undefined && Math.floor(time/60) + ":" + Math.floor(time%60) }*/}
        </div>
        <div className="items-center my-4 border-b border-black">
          <div className="m-4">팬정보</div>
          <div className="m-6">이름: {currentFan.fan_name}</div>
          <div className="m-6">성별: {currentFan.sex}</div>
          <div className="m-6">나이: {currentFan.age}</div>
          <div className="m-6">팬레터: {currentFan.letter}</div>
        </div>
        <div className="m-auto flex flex-col">
          <Button
              _onClick={finishCurrentCall}
              disabled={isCallProcessing === false}
              margin={"mt-4 m-auto"} width={"w-[150px]"} height={"h-[50px]"}>
            현재 통화 종료
          </Button>
          <Button
              _onClick={nextCallConnect}
              disabled={isCallProcessing === true}
              borderColor={"border-red-600"}
              color={"text-red-600"}
              margin={"mt-4 m-auto"}
              width={"w-[150px]"}
              height={"h-[50px]"}>
            다음 순서 통화
          </Button>

        </div>
      </>
  )

};


export default CallControl;
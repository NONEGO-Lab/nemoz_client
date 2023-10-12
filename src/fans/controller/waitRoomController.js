import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addTestFanInfo, clearTestSession} from "../../redux/modules/testSlice";
import {attendeeApi} from "../data/attendee_data";
import {useMediaQuery} from "react-responsive";
import {useVideo} from "../../call/controller/hooks/useVideo";
import {logout} from "../../redux/modules/userSlice";
import {disconnectSession, setIsCallFinished, videoReset} from "../../redux/modules/videoSlice";
import {clearSessionInfo} from "../../redux/modules/commonSlice";
import {sock} from "../../socket/config";
import {fanEvents} from "../../socket/events/fan_event";
import {eventApi} from "../../event/data/event_data";


export const WaitRoomController = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({
    query: "(max-width: 600px)"
  });

  const { leaveSession } = useVideo();

  const [isAvailableCall, setIsAvailableCall] = useState(false);
  const [isReadyTest, setIsReadyTest] = useState(false);
  const [myWaitInfo, setMyWaitInfo] = useState({});
  const [isMobPopupOpen, setIsMobPopupOpen] = useState(true);

  const userInfo = useSelector((state) => state.user.userInfo);
  const roomInfo = useSelector((state) => state.common.roomInfo);
  // const isConnectTestComplete = useSelector((state) => state.video.isConnectTestComplete);
  const isCallFinished = useSelector((state) => state.video.isCallFinished);
  const eventId = useSelector((state) => state.event.eventId);


  const connectTest = () => {
    navigate(`/test/${userInfo.id}`);
  };

  const goToArtistRoom = () => {
    navigate(`/video2/${roomInfo.room_id}`);
  }

  const closePopup = () => {
    setIsMobPopupOpen(false);
  }

  const fanLogout = () => {
    dispatch(logout());
    dispatch(disconnectSession());
    dispatch(clearSessionInfo());
    leaveSession();
    sock.disconnect();
    sock.offAny();
    dispatch(videoReset());
    navigate("/");
  }


  const getMyWaitingInfo = async () => {
    try {
      // 팬 아이디로 이벤트 리스트 조회
      const evnetList = await  eventApi.getFanIncludedEventList({userId: userInfo.id})
      // const targetEventId = evnetList.map(e => e.no)[0]
      const targetEventId = 12
      const response = await attendeeApi.waitFan(targetEventId, userInfo.id);
      console.log(response)
      if(response.message === "All meet is ended") {
        dispatch(setIsCallFinished());
      } else {
        setMyWaitInfo(response.data.res_data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    getMyWaitingInfo();

  }, [])


  useEffect(() => {
    console.log('WAIT ROOM CONTROLLER')
    sock.on("joinTestSession", (data) => {
    console.log('JOIN TEST SESSION', data)
      fanEvents.joinTestSession({
        data, userInfo, dispatch, setIsReadyTest
      })


    });
    sock.on("nextFanTurn", (nextFanInfo, sessionInfo, roomInfo) => {
      console.log(nextFanInfo, 'nextFanInfonextFanInfo')
      fanEvents.nextFanTurn({
        nextFanInfo, sessionInfo, roomInfo, userInfo, dispatch, setIsAvailableCall
      });
    });

    sock.on("updateWaitOrder", (fanList) => {
      fanEvents.updateWaitOrder({ fanList, userInfo, getMyWaitingInfo })
    });

    return () => {
      sock.off("joinTestSession");
      sock.off("nextFanTurn");
      sock.off("updateWaitOrder");
    }


  }, [])



  return {
    isMobile,
    userInfo,
    isCallFinished,
    connectTest,
    goToArtistRoom,
    closePopup,
    fanLogout,
    myWaitInfo,
    isAvailableCall,
    isReadyTest,
    isMobPopupOpen
  }
}
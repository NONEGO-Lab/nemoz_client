import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addTestFanInfo, clearTestSession, toggleDeviceSettingModal} from "../../redux/modules/testSlice";
import {attendeeApi} from "../data/attendee_data";
import {useMediaQuery} from "react-responsive";
import {useVideo} from "../../call/controller/hooks/useVideo";
import {logout} from "../../redux/modules/userSlice";
import {disconnectSession, setIsCallFinished, videoReset} from "../../redux/modules/videoSlice";
import {clearSessionInfo} from "../../redux/modules/commonSlice";
import {sock} from "../../socket/config";
import {fanEvents} from "../../socket/events/fan_event";
import {eventApi} from "../../event/data/event_data";
import {addEventName, setEventIds} from "../../redux/modules/eventSlice";


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
  const [isMobPopupOpen, setIsMobPopupOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState(null)

  const userInfo = useSelector((state) => state.user.userInfo);
  const roomInfo = useSelector((state) => state.common.roomInfo);
  // const isConnectTestComplete = useSelector((state) => state.video.isConnectTestComplete);
  const isCallFinished = useSelector((state) => state.video.isCallFinished);
  const toggleDeviceSetting = useSelector(state => state.test.toggleDeviceSetting)

  const connectTest = () => {
    dispatch(toggleDeviceSettingModal(true))
    // navigate(`/test/${userInfo.id}`);
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
    sessionStorage.clear()
    navigate("/");
  }


  const getMyWaitingInfo = async () => {
    try {
      // 팬 아이디로 이벤트 리스트 조회
      const eventList = await  eventApi.getFanIncludedEventList({userId: userInfo.id})
      const currentEventId = eventList.event_data[0].no
      const currentEventTitle = eventList.event_data[0].title
      setEventTitle(currentEventTitle)
      dispatch(addEventName(currentEventTitle))
      dispatch(addTestFanInfo(eventList.memberInfo))
      dispatch(setEventIds({event_id: currentEventId}))
      const response = await attendeeApi.waitFan(currentEventId, userInfo.id);

      if(response.message === "All meet is ended") {
        dispatch(setIsCallFinished());
      } else {
        setMyWaitInfo(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    getMyWaitingInfo();

  }, [])


  useEffect(() => {
    sock.on("joinTestSession", (data) => {
      fanEvents.joinTestSession({
        data, userInfo, dispatch, setIsReadyTest
      })


    });
    sock.on("nextFanTurn", (nextFanInfo, sessionInfo, roomInfo) => {
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
    isMobPopupOpen,
    eventTitle,
    toggleDeviceSetting
  }
}
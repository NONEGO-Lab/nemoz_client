import React, {useEffect, useRef, useState} from "react";
import {useMediaQuery} from "react-responsive";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {createBrowserHistory} from "history";
import {meetApi} from "../data/call_data";
import {sock} from "../../socket/config";
import {setError, setIsError} from "../../redux/modules/errorSlice";
import {clearSessionInfo} from "../../redux/modules/commonSlice";
import {roomApi} from "../../room/data/room_data";
import {attendeeApi} from "../../fans/data/attendee_data";
import {addTimer, clearSession} from "../../redux/modules/videoSlice";
import {videoEvents} from "../../socket/events/video_event";
import { notify } from "../pages/components/notify";
import {useVideo} from "./hooks/useVideo";
import {useReaction} from "../../reaction/controller/useReaction";
import {leave_meet} from "../../model/call/call_model";


export const CallController = () => {

  const { joinSession, onlyJoin, newJoinMeet, leaveSession,
    fanJoinSession, msgBeforeOut, onbeforeunload } = useVideo();

  const { getChatFromSocket } = useReaction();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const history = createBrowserHistory();

  const [searchParams, setSearchParams] = useSearchParams();

  const publisher = useSelector((state) => state.video.publisher);
  const subscribers = useSelector((state) => state.video.subscribers);
  const userInfo = useSelector((state) => state.user.userInfo);
  const toastList = useSelector((state) => state.toast.toastList);
  const publisherVideo = useSelector((state) => state.video.publisherVideo);
  const publisherAudio = useSelector((state) => state.video.publisherAudio);
  const session = useSelector((state) => state.video.session);
  const roomInfo = useSelector((state) => state.common.roomInfo);
  const sessionInfo = useSelector((state) => state.common.sessionInfo);
  const connectionInfo = useSelector((state) => state.common.connectionInfo);
  const eventId = useSelector((state) => state.event.eventId);

  const [isOpenWaitingModal, setIsOpenWaitingModal] = useState(false);
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenFanDetail, setIsOpenFanDetail] = useState(false);
  const [isOpenLeftTime, setIsOpenLeftTime] = useState(false);
  const [waitingFanInfo, setWaitingFanInfo] = useState({});
  const [currentFan, setCurrentFan] = useState({});
  const [staffNoticeList, setStaffNoticeList] = useState([]);
  const leftTimeRef = useRef(0);

  let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;

  const navigateByRole = () => {
    if(userInfo.role === "fan") {
      navigate("/waitcall");
    } else {
      navigate("/roomlist");
    }
  }

  const endRoom = async () => {
    /// 방을 아예 종료
    if(window.confirm("정말 방을 종료하시겠습니까?")) {

      const request = {
        meet_id: sessionInfo.meetId,
        meet_name: sessionInfo.meetName,
        room_id: roomInfo.room_id,
        event_id: eventId,
      }

      try {
        const response = await meetApi.endMeet(request);

        if (response) {
          sock.emit("endMeet", roomNum);
          leaveSession();
        }
      } catch (err) {
        dispatch(setError(err));
        dispatch(setIsError(true));
      }
    }
  }

  const outRoom = async () => {
    console.log("!!!! out Room !!!!!!!~~~~~~~~")
    // 방을 단순히 나가는 용도로 사용
    try {
      // 방에 팬만 1명 있으면 못 나가게 하기
      if(subscribers.length === 1 && subscribers[0].role === "fan") {
        alert("방에 팬이 있어서 나갈 수 없습니다! 방 종료 해주세요!")
        return;
      }
      const request = {
        ...leave_meet,
        user_info: {
          id: userInfo.id.toString(),
          role: userInfo.role,
        },
        type: 'leave',
        meet_name: sessionInfo.meetName,
        connection_id: connectionInfo.meet_id,
        connection_name: connectionInfo.connection_id,
        progress_time: leftTimeRef.current
      }

      console.log("request!!~~~~~~~~~", request);
      const response = await meetApi.leaveMeet(request);

      if(response) {
        dispatch(clearSessionInfo());
        leaveSession();
        sock.emit("leaveRoom", roomNum, userInfo.username, navigate);
        // sock.emit("endMeet", roomNum);
        navigateByRole();
      }
    } catch (err) {
      navigateByRole();
    }
  }

  const showTime = () => {
    setIsOpenLeftTime(prev => !prev)
  }

  let roomId = params.id;


  const createAndJoin = async () => {
    const sessionInfo = await joinSession(roomInfo.room_id, false);
    return sessionInfo;
  }

  const completeSession = (sessionInfo) => {

    let roomMsg = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;
    setSearchParams({meetName: sessionInfo.meetName});
    sock.emit("joinRoom", roomMsg, userInfo);
  }

  const getCurrentFanInfo = async () => {
    let roomId = roomInfo.room_id;

    try {
      const result = await roomApi.getListOrder({ eventId, roomId });
      const currentFan = result.find((fan) => fan.orders === 1);
      const response = await attendeeApi.getFanDetail(currentFan.fan_id);
      setCurrentFan(response);
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  };

  const fanDetailOpenHandler = (fan) => {
    setWaitingFanInfo(fan);
    setIsOpenFanDetail(true);
  }

  const onlyJoinNewRoom = async (newSessionInfo, nextFan) => {
    dispatch(clearSession());
    dispatch(addTimer(0));
    newJoinMeet(newSessionInfo).then((sessionInfo) => {
      completeSession(sessionInfo);
    });
    //nextFan detail 요청하기
    const detail = await attendeeApi.getFanDetail(nextFan.fan_id);
    setCurrentFan(detail);
  };


  const toBack = () => {
    navigate(-1);
  }


  useEffect(() => {
    if(publisher) {
      return;
    }
    if(userInfo.role === "fan"){
      let roomId = roomInfo.room_id;
      let callTime = roomInfo.reserved_time;

      fanJoinSession({ roomId, sessionInfo }).then((sessionInfo) => {
        completeSession(sessionInfo);
        let roomNum = `${eventId}_${roomId}_${sessionInfo.meetId}`;
        sock.emit("timerStart", roomNum, callTime);
        dispatch(addTimer(roomInfo.reserved_time));
      });

    } else {
      if(roomInfo.meet_id !== "") {
        // 현재 진행중인 meet가 이미 있을 때 중간에 join
        onlyJoin(roomId).then((sessionInfo) => {
          completeSession(sessionInfo);

          if(userInfo.role === "staff"){
            let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;
            sock.emit("reqLeftTime", roomNum);
          }
        });

      } else {
        // 현재 진행중인 meet가 없다면, create -> join
        createAndJoin().then((sessionInfo) => {
          completeSession(sessionInfo);
          dispatch(addTimer(0));
        })
      }
      //현재 팬의 정보를 가져오는 것.
      getCurrentFanInfo();
    }

    //Fixme: 나갈때, 나가는 leave api가 두번 실행되는거 고민하기

    // return () => {
    //   msgBeforeOut();
    // }

  },[]);


  useEffect(()=>{
    if(session === undefined) {
      return;
    }

    history.listen((location) => {
      if(history.action === "POP") {
        //뒤로가기일 경우
        onbeforeunload();
        navigateByRole();
      }
    })

  },[session])


  useEffect(() => {
    sock.on("chatMessage", (msg) => videoEvents.chatMessage({ msg, getChatFromSocket }));
    sock.on("joinRoom", (user) => videoEvents.joinRoom({ user, setStaffNoticeList}));
    sock.on("joinNextRoom", (num, newSessionInfo, userId, nextFan) => videoEvents.joinNextRoom({ newSessionInfo, userId, nextFan, userInfo, onlyJoinNewRoom }));
    sock.on("leaveRoom", (num, userInfo) => videoEvents.leaveRoom({ userInfo, notify, setStaffNoticeList, dispatch }));
    sock.on("endMeet", () => videoEvents.endMeet({ userInfo, navigate }));
    sock.on("kickOut", (fanInfo) => videoEvents.kickOut({ fanInfo, userInfo, roomInfo, sessionInfo, navigate, eventId }));
    sock.on("timerStart", (time) => videoEvents.timerStart({ time, dispatch }));
    sock.on("leftTime", (currentTime) => videoEvents.leftTime({ currentTime, userInfo, dispatch }));
    sock.on("notifyTime", (time, fan) => videoEvents.notifyTime({ time, fan, setStaffNoticeList, userInfo }));
    sock.on("warnUser", (user, count) => videoEvents.warnUser({ user, count, role: userInfo.role, notify,  setStaffNoticeList, userInfo }));
    sock.on("callFinish", (fan) => videoEvents.callFinish({ fan, userInfo, dispatch, navigateByRole, clearSession }));
    sock.on("lastMeet", (artistId) => videoEvents.lastMeet({ artistId, setCurrentFan, userInfo, dispatch, clearSession, addTimer }));

    return () => {
      sock.off("chatMessage");
      sock.off("joinRoom");
      sock.off("joinNextRoom");
      sock.off("leaveRoom");
      sock.off("endMeet");
      sock.off("kickOut");
      sock.off("timerStart");
      sock.off("leftTime");
      sock.off("notifyTime");
      sock.off("warnUser");
      sock.off("callFinish");
      sock.off("lastMeet");
    }

  },[])

  return {
    subscribers,
    publisher,
    leftTimeRef,
    publisherAudio,
    publisherVideo,
    toastList,
    endRoom,
    outRoom,
    showTime,
    staffNoticeList,
    userInfo,
    setIsOpenWaitingModal,
    currentFan,
    setCurrentFan,
    setIsOpenAddUser,
    fanDetailOpenHandler,
    isOpenAddUser,
    isOpenFanDetail,
    waitingFanInfo,
    setIsOpenFanDetail,
    isOpenLeftTime,
    roomInfo,
    toBack,
    isOpenWaitingModal
  }

}
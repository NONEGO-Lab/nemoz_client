import React, { useEffect, useRef, useState } from "react";
import { SizeLayout, VideoLayout, SideBar } from "../../shared/Layout";
import Header from "../../shared/Header";
import { Button } from "../../element";
import SettingBar from "../../call/pages/components/Settingbar";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FanInfo from "../../fans/pages/FanInfo";
import ReactionButton from "../../reaction/components/ReactionButton";
import { useMediaQuery } from "react-responsive"
import ReactionBoard from "../../reaction/components/Board";
import { useVideo } from "../../call/controller/useVideo";
import Video from "../../video/pages/Video";
import { useSelector, useDispatch } from "react-redux";
import WaitingList from "../../call/pages/components/WaitingList";
import ConnectInfo from "../components/ConnectInfo";
import { MobilePopup } from "../../shared/MobilePopup";
import dots from "../../../../../bloc_nemoz/nemoz/src/static/image/dots.png";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { sock } from "../../socket/config";
import { useReaction } from "../../reaction/controller/useReaction";
import AddUser from "../../call/pages/components/AddUser";
import FanDetail from "../../fans/pages/FanDetailInfo";
import { clearSessionInfo } from "../../redux/modules/commonSlice";
import { meetApi } from "../../call/data/call_data";
import Timer from "../../call/pages/components/Timer";
import { roomApi } from "../data/room_data";
import { attendeeApi } from "../../fans/data/attendee_data";
import { videoEvents } from "../../socket/events/video_event";
import {setError, setIsError} from "../../redux/modules/errorSlice";
import {addTimer, clearSession} from "../../redux/modules/videoSlice";
import { createBrowserHistory } from "history";

const VideoContainer = () => {
  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const history = createBrowserHistory();

  const [searchParams, setSearchParams] = useSearchParams();

  const { joinSession, onlyJoin, newJoinMeet, leaveSession, videoMuteHandler,
    audioMuteHandler, fanJoinSession, msgBeforeOut, onbeforeunload } = useVideo();

  const { getChatFromSocket } = useReaction();

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

  const [isOpenMobileSetting, setOpenMobileSetting] = useState(false);
  const [isOpenWaitingModal, setIsOpenWaitingModal] = useState(false);
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const [isOpenFanDetail, setIsOpenFanDetail] = useState(false);
  const [isOpenLeftTime, setIsOpenLeftTime] = useState(false);
  const [waitingFanInfo, setWaitingFanInfo] = useState({});
  const [currentFan, setCurrentFan] = useState({});
  const [staffNoticeList, setStaffNoticeList] = useState([]);
  const leftTimeRef = useRef(0);

  let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;

  // video Size 관련
  const [isBigScreen, setIsBigScreen] = useState({
    pub: "default",
    sub: "default"
  });

  const [isWebFullScreen, setIsWebFullScreen] = useState({
    open: false,
    type: ""
  });

  //mobile button onClick에 붙일 함수(확대 버튼이 눌릴 때)
  const makeBigScreen = (type) => {
    if(type === "half") {
      setIsBigScreen({
        pub: "default",
        sub: "default"
      })
      setOpenMobileSetting(false);
    } else {
      if(isMobile && (subscribers.length === 0 || subscribers[0].role === "staff")) {
        return;
      }

      setIsBigScreen({
        pub: "small",
        sub: "large"
      })
      setOpenMobileSetting(false);
    }
  }


  const changeMobVideoSize = (type) => {
    switch(type) {
      case "default":
        return "w-[100%] h-[50vh]";
      case "small":
        return "w-[150px] h-[150px] absolute bottom-[70px] right-[20px]";
      case "large":
        return "w-[100%] h-[100vh]"
    }
  }


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
      try {
        const response = await meetApi.endMeet({
          meetId: sessionInfo.meetId,
          meetName: sessionInfo.meetName,
          roomId: roomInfo.room_id,
          eventId: eventId
        });

        if (response === "Meet Ended") {
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
    // 방을 단순히 나가는 용도로 사용
    try {
      // 방에 팬만 1명 있으면 못 나가게 하기
      if(subscribers.length === 1 && subscribers[0].role === "fan") {
        alert("방에 팬이 있어서 나갈 수 없습니다! 방 종료 해주세요!")
        return;
      }

      const response = await meetApi.leaveMeet({
        id: userInfo.id,
        role: userInfo.role,
        type: "leave",
        meetName: sessionInfo.meetName,
        connectionId: connectionInfo.id,
        connectionName: connectionInfo.response.connectionId,
        time: leftTimeRef.current
      });

      if(response === "LEAVED") {
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

  const webFullScreenSize = isWebFullScreen.open ? "w-[100%] flex justify-center" : "w-[calc(50%-10px)]";
  const webFullScreenSizeOther = isWebFullScreen.open ? "hidden" : "w-[calc(50%-10px)] flex";

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
    return () => {
      msgBeforeOut();
    }
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

  if(isMobile) {
    return (
        <div className="w-[100%] h-[100vh] border border-gray-200">
          <div className="w-[100%] h-[50px]">
            <div
                onClick={() => navigate(-1)}
                className={"ml-4 pt-3"}> &lt; </div>
          </div>
          <div>
            {
              subscribers.map((subscriber) => {
                if(subscriber.role !== "staff") {
                  return (
                      <div className={`${changeMobVideoSize(isBigScreen.sub)} flex bg-gray-200`}>
                        {/*상대방 화면*/}
                        {
                          subscribers.map((subscriber, i) => {
                            if(subscriber.role !== "staff") {
                              return (
                                  <div id={"sub"} key={i}>
                                    <Video streamManager={subscriber}/>
                                  </div>
                              )
                            }
                          })
                        }
                      </div>
                  )
                }
              })
            }
            {/*내 화면*/}
            { publisher !== undefined &&
                <div id={"pub"} className={`${changeMobVideoSize(isBigScreen.pub)} relative flex bg-gray-300`}>
                  <Video streamManager={publisher}/>
                  {
                    isBigScreen.pub === "default" ?
                        <div>
                          <div className="flex absolute left-[20px] top-[20px]">
                            <div className={"mr-4 cursor-pointer text-[12px]"} onClick={audioMuteHandler}>
                              { publisherAudio ? "오디오 켜짐" : "오디오 꺼짐" }
                            </div>
                            <div className={"cursor-pointer text-[12px]"} onClick={videoMuteHandler}>
                              { publisherVideo ? "비디오 켜짐" : "비디오 꺼짐" }
                            </div>
                          </div>
                          <div className={`${isOpenLeftTime ? "visible" : "invisible"}`}>
                            <Timer type={"default"} leftTimeRef={leftTimeRef}/>
                          </div>


                          <div
                              onClick={() => {
                                setOpenMobileSetting((prev) => !prev);
                              }}
                              className="absolute top-[20px] right-[20px]">
                            <img className="w-[20px]" src={dots} alt={"setting-dots"}/>
                          </div>
                        </div>
                        :
                        <div>
                          <div className="flex absolute left-[10px] top-[2px]">
                            <div className={"mr-2 text-[10px]"} onClick={audioMuteHandler}>
                              { publisherAudio ? "오디오 켜짐" : "오디오 꺼짐" }
                            </div>
                            <div className={"text-[10px]"} onClick={videoMuteHandler}>
                              { publisherVideo ? "비디오 켜짐" : "비디오 꺼짐" }
                            </div>
                          </div>

                          <div className={`${isOpenLeftTime ? "visible" : "invisible"}`}>
                            <Timer type={"small"} leftTimeRef={leftTimeRef}/>
                          </div>
                          <div
                              onClick={() => {
                                setOpenMobileSetting((prev) => !prev);
                              }}
                              className="absolute top-[20px] right-[10px]">
                            <img className="w-[15px]" src={dots} alt={"setting-dots"}/>
                          </div>
                        </div>
                  }
                  <ReactionButton/>
                </div>
            }
          </div>
          <ToastContainer
              className="absolute"
              position="bottom-center"
              autoClose={3000}
              hideProgressBar
          />
          {
              isOpenMobileSetting &&
              <MobilePopup
                  showTime={showTime}
                  makeBigScreen={makeBigScreen}
                  closePopup={() => setOpenMobileSetting(false)}/>
          }
          { toastList.length !==0 && <ReactionBoard/>}
        </div>
    )
  } else {
    //웹 화면
    return (
        <SizeLayout>
          <Header/>
          <div className="flex">
            <VideoLayout title={"A 아티스트 팬미팅 방"} buttonText={"나가기"} _onClick={outRoom}
                         _endClick={endRoom} endText={"방 종료"} role={userInfo.role}>
              <div className="flex space-between bg-white h-[480px] p-[20px] mx-[20px]">
                {/*비디오 영역*/}
                {/* 상대방 화면 = subscriber*/}
                {
                  subscribers.map((subscriber, i) => {
                    if(subscriber.role !== "staff") {
                      return (
                          <div id={"sub"} key={i} className={`relative ${webFullScreenSize} h-[360px] border-2 border-box border-black m-auto flex`}>
                            {
                                isWebFullScreen.open && isWebFullScreen.type === "sub" &&
                                <div
                                    onClick={()=> setIsWebFullScreen({open: false, type: null})}
                                    className="absolute top-0 right-2 cursor-pointer z-20">닫기</div>
                            }
                            {
                                !isWebFullScreen.open && <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsWebFullScreen({ open: true, type: "sub" });
                                    }} className="absolute top-[50px] right-2 cursor-pointer z-20">
                                  전체 화면
                                </div>
                            }

                            <Video streamManager={subscriber}/>
                            <div className={"flex absolute bottom-[-30px] font-bold text-lg"}>
                              {subscriber.username}
                            </div>
                          </div>
                      )
                    }
                  })
                }

                {/* 내 화면 = publisher */}
                {
                    publisher !== undefined && userInfo.role !== "staff" &&
                    <div id={"pub"}
                         className={`relative ${webFullScreenSizeOther} h-[360px] border-2 border-box border-black m-auto`}>
                      {
                          isWebFullScreen.open && isWebFullScreen.type === "pub" &&
                          <div
                              onClick={() => setIsWebFullScreen({ open: false, type: null })}
                              className="absolute top-0 right-2 cursor-pointer z-20">
                            닫기</div>
                      }

                      <Video streamManager={publisher}/>
                      <div className={"absolute bottom-[-30px] font-bold text-lg"}>{userInfo.username}</div>
                      <div className="flex absolute">
                        <div className={"mr-4 cursor-pointer"} onClick={audioMuteHandler}>
                          { publisherAudio ? "오디오 켜짐" : "오디오 꺼짐" }
                        </div>
                        <div className={"cursor-pointer"} onClick={videoMuteHandler}>
                          { publisherVideo ? "비디오 켜짐" : "비디오 꺼짐" }
                        </div>
                      </div>

                    </div>
                }

              </div>
              {/*하단 세팅 영역 = 권한에 따라 다름*/}
              <div
                  className="relative m-auto h-[90px] px-[20px] w-[calc(100%-40px)]
                                        bg-white border-black border-t pt-6">

                {
                  userInfo.role !== "staff" ?
                      <div className={"flex justify-center"}>
                        <ReactionButton/>
                      </div>

                      :
                      <div className="flex items-center justify-between">
                        <ConnectInfo staffNoticeList={staffNoticeList}/>
                        <SettingBar setIsOpenWaitingModal={setIsOpenWaitingModal} currentFan={currentFan}
                                    leftTimeRef={leftTimeRef}/>
                      </div>
                }
                <ToastContainer
                    className="absolute"
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar
                />
              </div>
            </VideoLayout>
            <SideBar>
              <Timer leftTimeRef={leftTimeRef}/>
              {
                userInfo.role === "fan" ?
                    <>
                      <ReactionBoard/>
                      <div className={"w-[150px] m-auto"}>
                        <Button
                            _onClick={() => setIsWebFullScreen({ open: true, type: "sub" })}
                            width={"w-[150px]"}
                            margin={"my-[20px]"}
                            disabled={(subscribers.length === 0 || subscribers[0].role === "staff")}>
                          상대방 크게 보기
                        </Button>
                        <Button
                            _onClick={() => setIsWebFullScreen({ open: false, type: "null" })}
                            width={"w-[150px]"}
                            disabled={subscribers.length === 0}>
                          반반으로 보기
                        </Button>
                      </div>
                    </>
                    : toastList.length === 0 ?
                        <FanInfo
                            currentFan={currentFan}
                            setCurrentFan={setCurrentFan}
                            type={"call"}
                        />
                        : <ReactionBoard/>
              }
            </SideBar>
          </div>

          { isOpenWaitingModal &&
              <WaitingList
                  addUserOpenHandler={() => setIsOpenAddUser(true)}
                  fanDetailOpenHandler={fanDetailOpenHandler}
                  curRoomId={roomInfo.room_id}
                  setOnModal={() => setIsOpenWaitingModal(false)}/>
          }

          { isOpenAddUser && <AddUser setOnModal={() => setIsOpenAddUser(false)}/> }
          { isOpenFanDetail && <FanDetail currentFanId={waitingFanInfo.fan_id} setOnModal={() => setIsOpenFanDetail(false)}/>}
        </SizeLayout>
    )
  }
}

export default VideoContainer;


export const notify = (info, type) => {

  switch (type) {
    case "leave":
      return  toast(`${info}님이 나가셨습니다.`);
    case "time":
      return toast(`통화가 ${info}초 남았습니다.`);
    case "warn":
      return toast(info)
    case "in":
      return toast(`${info}님이 연결되었습니다.`);
    default:
  }
}
import React, { useState, useEffect } from "react";
import { Layout, SizeLayout, VideoLayout, SideBar } from "../../shared/Layout";
import Header from "../../shared/Header";
import ReactionButton from "../../reaction/pages/components/ReactionButton";
import ReactionBoard from "../../reaction/pages/components/ReactionBoard";
import { Button } from "../../element";
import Video from "../../video/pages/Video";
import {useSelector, useDispatch} from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTestVideo } from "../controller/useTestVideo";
import { useReaction } from "../../reaction/controller/useReaction";
import { useMediaQuery } from "react-responsive";
import { setConnectTest } from "../../redux/modules/videoSlice";
import FanInfo from "../../fans/pages/FanInfo";
import { MobilePopup } from "../../shared/MobilePopup";
import dots from "../../static/image/dots.png";
import { sock } from "../../socket/config";
import { testApi } from "../data/call_test_data";
import { clearToast } from "../../redux/modules/toastSlice";
import { testEvents } from "../../socket/events/test_event";
import { createBrowserHistory } from "history";



const ConnectTest = () => {

  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  })

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const history = createBrowserHistory();

  const [isOpenMobileSetting, setOpenMobileSetting] = useState(false);
  const [mobileSettingType, setMobileSettingType] = useState("");

  const publisher = useSelector((state) => state.test.publisher);
  const subscriber = useSelector((state) => state.test.subscriber);
  const userInfo = useSelector((state) => state.user.userInfo);
  const toastList = useSelector((state) => state.toast.toastList);
  const publisherVideo = useSelector((state) => state.test.publisherVideo);
  const publisherAudio = useSelector((state) => state.test.publisherAudio);

  const fanInfo = useSelector((state) => state.test.fanInfo);
  const meetInfo = useSelector((state) => state.test.sessionInfo);
  const connectInfo = useSelector((state) => state.test.connectInfo);
  const session = useSelector((state) => state.test.session);

  const eventId = useSelector((state) => state.event.eventId);


  const { createJoinSession, joinTestSession, preventBrowserBack,
    onbeforeunload, muteHandler } = useTestVideo();
  const { getChatFromSocket } = useReaction();

  const completeConnectTest = () => {
    dispatch(setConnectTest());
    navigate("/waitcall");
  }

  const quitTest = async () => {
    if(window.confirm("정말 나가시겠습니까?")) {
      if(userInfo.role === "fan") {
        try {
          const response = await testApi.testLeave({
            meetName: meetInfo.meetName,
            connectionName: connectInfo
          });

          if(response === "LEAVED") {
            navigate("/waitcall");
            let roomNum = `1_test_${userInfo.id}`;
            sock.emit("leaveRoom", roomNum, userInfo, navigate);
          }
        } catch (err) {

        }


      } else {
        const response = await testApi.testEnd(meetInfo.meetName);
        if(response) {
          navigate("/userlist");
          let roomNum = `1_test_${fanInfo.fan_id}`;
          sock.emit("leaveRoom", roomNum, userInfo, navigate);
        }
      }
    }
  }


  // video Size 관련
  const [isBigScreen, setIsBigScreen] = useState({
    pub: "default",
    sub: "default"
  });

  const [isWebFullScreen, setIsWebFullScreen] = useState(false);

  //mobile button onClick에 붙일 함수(확대 버튼이 눌릴 때)
  const makeBigScreen = (type) => {
    if(type === "half") {
      setIsBigScreen({
        pub: "default",
        sub: "default"
      })
      setOpenMobileSetting(false);
    } else {
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
        return "w-[200px] h-[200px] absolute bottom-[80px] right-[20px]";
      case "large":
        return "w-[100%] h-[100vh]"
    }
  }

  const webFullScreenSize = isWebFullScreen ? "w-[100%] flex justify-center" : "w-[calc(50%-10px)] flex";
  const webFullScreenSizeOther = isWebFullScreen ? "hidden" : "w-[calc(50%-10px)] flex";

  useEffect(() => {

    if(subscriber !== undefined) {
      return;
    }

    if(userInfo.role !== "fan") {
      // staff 이면,
      // test meet create -> join 까지 한다.
      // create, join 하고 나온 방을 socket 으로 보낸다!
      createJoinSession().then((sessionInfo) => {
        let data = { meetName: sessionInfo.meet_name, fanId: fanInfo.fan_id }
        sock.emit("joinTestSession", data);
        let roomNum = `${eventId}_test_${fanInfo.fan_id}`;
        sock.emit("joinRoom", roomNum, userInfo);
      })
    } else {
      // fan 이면 socket으로 받은 test meet으로 testJoinMeet 한다.
      joinTestSession().then(() => {
        let roomNum = `${eventId}_test_${userInfo.id}`;
        sock.emit("joinRoom", roomNum, userInfo);
      })
    }

  },[]);

  useEffect(()=>{
    sock.on("chatMessage", (msg) => testEvents.chatMessage({ msg, getChatFromSocket }));
    sock.on("testFail", (fanInfo) => testEvents.testFail({ fanInfo, userInfo, navigate }));
    sock.on("testSuccess", (fanInfo) => testEvents.testSuccess({ fanInfo, userInfo, dispatch, navigate }));

    return () => {
      sock.removeAllListeners("chatMessage");
      sock.removeAllListeners("testFail");
      sock.removeAllListeners("testSuccess");
      dispatch(clearToast());
    }
  },[]);


  useEffect(()=>{

    if(session === undefined) {
      return;
    }

    // window.addEventListener("beforeunload", onbeforeunload);
    // window.addEventListener("popstate", onbeforeunload);

    // return () => {
    // window.removeEventListener("beforeunload", onbeforeunload);
    // window.removeEventListener('popstate', onbeforeunload);
    history.listen((location) => {
      console.log("location!!!!!: ", location);
      if(history.action === "POP") {
        //뒤로가기일 경우
        onbeforeunload();
      }
    })
    // }
  },[session])


  if(isMobile) {
    return (
        //모바일
        <div className="w-[100%] border border-gray-200">
          <div className="w-[100%] h-[50px]">
            <div
                onClick={() => navigate(-1)}
                className={"ml-4 pt-3"}> &lt; </div>
          </div>
          {/*연결 비디오 들어가야 함*/}
          <div className={"h-[calc(100vh-150px)]"}>

            {/*상대방 화면*/}

            <div className={`${changeMobVideoSize(isBigScreen.sub)} flex`}>
              {
                  subscriber !== undefined &&
                  <div id={"sub"}>
                    <Video streamManager={subscriber}/>
                  </div>
              }
            </div>

            {/*내 화면*/}
            { publisher !== undefined &&
                <div id={"pub"} className={`${changeMobVideoSize(isBigScreen.pub)} absolute flex`}>
                  <Video streamManager={publisher}/>
                  <div
                      onClick={() => {
                        setMobileSettingType("connectTest");
                        setOpenMobileSetting((prev) => !prev);
                      }}
                      className="absolute top-[20px] right-[20px]">
                    <img className="w-[20px]" src={dots} alt={"setting-dots"}/>
                  </div>
                </div>
            }
          </div>
          <ReactionButton/>
          {
              isOpenMobileSetting &&
              <MobilePopup
                  type={"connectTest"}
                  makeBigScreen={makeBigScreen}
                  closePopup={() => setOpenMobileSetting(false)}/>
          }

          { toastList.length !== 0 && <ReactionBoard/>}
        </div>
    )
  } else {
    return (
        //웹
        <SizeLayout>
          <Header/>
          <div className="flex">
            <VideoLayout title={"연결 테스트"} _onClick={quitTest} buttonText={"나가기"}>
              <div className="px-[20px] flex bg-white w-[calc(100%-40px)] h-[480px] m-auto box-border flex justify-between">
                <div className={`${webFullScreenSize} items-center`}>
                  {/*상대방 화면*/}
                  { subscriber !== undefined &&
                      <div id={"sub"} className="h-[100%]">
                        <Video streamManager={subscriber}/>
                      </div>
                  }

                </div>

                {/*내 화면*/}
                {
                    publisher !== undefined &&
                    <div id={"pub"} className={`${webFullScreenSizeOther} ${subscriber === undefined && "m-auto"} relative`}>
                      <Video streamManager={publisher} publisherAudio={publisherAudio} publisherVideo={publisherVideo}
                             muteHandler={muteHandler}/>
                      <div className={`flex absolute ${subscriber === undefined ? "top-[20px] left-[10px]" : "top-[80px]"}`}>
                        <div className={"mr-4 cursor-pointer"} onClick={() => muteHandler("audio", publisherAudio)}>
                          { publisherAudio ? "오디오 켜짐" : "오디오 꺼짐" }
                        </div>
                        <div className={"cursor-pointer"} onClick={() => muteHandler("video", publisherVideo)}>
                          { publisherVideo ? "비디오 켜짐" : "비디오 꺼짐" }
                        </div>
                      </div>
                    </div>

                }
              </div>

              <div className={"w-[calc(100%-40px)] h-[100px] bg-white m-auto border border-t-black relative flex justify-center items-center"}>
                <ReactionButton/>
              </div>
            </VideoLayout>
            <SideBar>
              <div className={"border-b border-black pb-2 mb-4 ml-4"}>
                남은시간: 연결 테스트 중
              </div>
              {
                userInfo.role === "fan" ?
                    <>
                      <ReactionBoard/>
                      <div className={"w-[150px] m-auto"}>
                        <Button
                            _onClick={() => setIsWebFullScreen(true)}
                            width={"w-[150px]"}
                            margin={"my-[20px]"}
                            disabled={subscriber === undefined}>
                          상대방 크게 보기
                        </Button>
                        <Button
                            _onClick={() => setIsWebFullScreen(false)}
                            width={"w-[150px]"}
                            disabled={subscriber === undefined}>
                          반반으로 보기
                        </Button>
                      </div>
                    </>
                    : toastList.length === 0 ? <FanInfo type={"test"}/> : <ReactionBoard/>
              }

            </SideBar>
          </div>

        </SizeLayout>
    )
  }

};

export default ConnectTest;
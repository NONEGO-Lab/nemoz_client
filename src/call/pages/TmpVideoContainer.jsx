import React, {useEffect, useState} from 'react';
import Header from "../../shared/Header";
import {SizeLayout} from "../../shared/Layout";
import TestCallUtil from './components/TestCallUtil';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createBrowserHistory} from "history";
import {useTestVideo} from "../../test/controller/useTestVideo";
import {testApi} from "../../test/data/call_test_data";
import {sock} from "../../socket/config";
import {testEvents} from "../../socket/events/test_event";
import TestVideoArea from "./components/TestVideoArea";
import VideoForMobile from "../../video/pages/VideoForMobile";
import {useMobileView} from "../controller/hooks/useMobileView";

const TmpVideoContainer = () => {

    const currentLocation = () => window.location.pathname.split('/')[1]
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const history = createBrowserHistory();

    const [toggleFanLetter, setToggleFanLetter] = useState(false)
    const publisher = useSelector((state) => state.test.publisher);
    const subscriber = useSelector((state) => state.test.subscriber);
    const userInfo = useSelector((state) => state.user.userInfo);
    const publisherVideo = useSelector((state) => state.test.publisherVideo);
    const publisherAudio = useSelector((state) => state.test.publisherAudio);
    const fanInfo = useSelector((state) => state.test.fanInfo);
    const meetInfo = useSelector((state) => state.test.sessionInfo);
    const connectInfo = useSelector((state) => state.test.connectInfo);
    const session = useSelector((state) => state.test.session);
    const eventId = useSelector((state) => state.event.eventId);
    const eventName = useSelector(state => state.event.eventName)
    const sessionInfo = useSelector((state) => state.test.sessionInfo);

    const {
        createJoinSession, joinTestSession,
        onbeforeunload, muteHandler
    } = useTestVideo();
    const {
        isMobile,
    } = useMobileView();
    const [toggleNext, setToggleNext] = useState(false)
    const [isSuccess, setIsSuccess] = useState(null)
    const quitTest = async () => {
        // quitTest 룸 넘버 확인
        if (window.confirm("정말 나가시겠습니까?")) {
            if (userInfo.role === "fan") {
                try {
                    const response = await testApi.testLeave({
                        meet_name: meetInfo.meet_name,
                        connectionName: connectInfo
                    });

                    if (response === "LEAVED") {
                        navigate("/waitcall");
                        let roomNum = `1_test_${userInfo.id}`;
                        sock.emit("leaveRoom", roomNum, userInfo, navigate);
                    }
                } catch (err) {

                }
            } else {
                const response = await testApi.testEnd(sessionInfo.meet_name);
                if (response) {
                    navigate("/userlist");
                    let roomNum = `${eventId}_test_${fanInfo.fan_id}`;
                    sock.emit("leaveRoom", roomNum, userInfo, navigate);
                }
            }
        }
    }



    useEffect(() => {
        if (subscriber !== undefined) {
            return;
        }
        if (userInfo.role !== "member") {
            // staff 이면,
            // test meet create -> join 까지 한다.
            // create, join 하고 나온 방을 socket 으로 보낸다!
            createJoinSession().then((sessionInfo) => {
                let data = {meetName: sessionInfo.meet_name, fanId: fanInfo.fan_id}
                sock.emit("joinTestSession", data);
                let roomNum = `${fanInfo.event_id}_test_${fanInfo.fan_id}`;
                sock.emit("joinRoom", roomNum, userInfo);
            })
        } else {
            // fan 이면 socket으로 받은 test meet으로 testJoinMeet 한다.
            joinTestSession().then(() => {
                let roomNum = `${eventId}_test_${userInfo.id}`;
                sock.emit("joinRoom", roomNum, userInfo);
            })
        }

    }, []);

    useEffect(() => {
        sock.on("testFail", (fanInfo, eventId) => testEvents.testFail({fanInfo, userInfo, navigate, setToggleNext, eventId}));
        sock.on("testSuccess", (fanInfo, eventId) => testEvents.testSuccess({fanInfo, userInfo, dispatch, navigate,setToggleNext, eventId}));
        return () => {
            sock.removeAllListeners("testFail");
            sock.removeAllListeners("testSuccess");
        }
    }, []);


    useEffect(() => {
        if (session === undefined) {
            return;
        }
        history.listen((location) => {
            if (history.action === "POP") {
                //뒤로가기일 경우
                onbeforeunload();
            }
        })

    }, [session])


    const [isFullScreenMobile, setIsFullScreenMobile] = useState(false);
    if (isMobile) {
        return (
            <>
                <div className="w-[100vw] h-[100vh] absolute left-0 top-0">
                    {/* mobile header */}
                    <div className="w-[100%] h-[56px] flex justify-start p-[1rem] items-center">
                        <img
                            className="w-[15px] h-[25px] mr-[1.2rem]"
                            src="/images/leftArrowIcon.png"
                            alt={"leftArrow"}
                        />
                        <h1 className="text-[1.2rem] font-[600]">{eventName}</h1>
                    </div>

                    <div>
                        <div className="w-[100vw] h-[80vw] relative">
                            {subscriber !== undefined &&
                                <VideoForMobile
                                    streamManager={subscriber}
                                    publisherAudio={publisherAudio}
                                    publisherVideo={publisherVideo}
                                    setIsFullScreenMobile={setIsFullScreenMobile}
                                    isFullScreenMobile={isFullScreenMobile}
                                    reserved_time={subscriber}
                                    fanInfo={fanInfo}
                                    isTest = {true}
                                />
                            }
                        </div>
                        <div className=" w-[100vw] h-[80vw] relative">
                            {publisher !== undefined &&
                                <VideoForMobile
                                    streamManager={publisher}
                                    publisherAudio={publisherAudio}
                                    publisherVideo={publisherVideo}
                                    setIsFullScreenMobile={setIsFullScreenMobile}
                                    fanInfo={fanInfo}
                                    isTest = {true}
                                />
                            }
                        </div>
                    </div>
                    <TestCallUtil
                        customStyle="flex justify-center items-center flex-row absolute bottom-[1rem] w-[100vw]"
                        publisherAudio={publisherAudio}
                        publisherVideo={publisherVideo}
                        muteHandler={muteHandler}
                        quitTest={quitTest}
                        role={userInfo.role}
                        dispatch={dispatch}
                        navigate={navigate}
                        fanInfo={fanInfo}
                        toggleNext = {toggleNext}
                        isSuccess={isSuccess}
                        setIsSuccess={setIsSuccess}
                        eventId={eventId}
                        session={sessionInfo}
                        userInfo={userInfo}
                        createJoinSession={createJoinSession}
                    />
                </div>
                    </>)}


if(!isMobile)
    return (
        <SizeLayout isVideo={true} width={'w-[1366px]'} height={'min-h-[1024px]'}>
            <Header/>
            <div className={"bg-main_theme flex flex-col justify-center"}>
                <div className={"flex justify-center pt-[100px] text-[23px] text-[#444] font-[500] mb-[80px]"}>
                    <span>
                        <img className='w-[30px] h-[30px]' src="/images/roomIcon.png" alt="room-icon"/>
                    </span>
                    <span className='ml-[10px]'>{eventName}</span>
                </div>

                <div className='flex justify-center mb-[-30px]'>
                    <span
                        className='w-[125px] h-[30px] rounded-[15px] border-[1.5px] border-[#444] text-[16px] text-[#444] flex items-center justify-center'>
                        <div>Test Call</div>
                        <div className='w-[8px] h-[8px] rounded-full bg-[#02c5cb] ml-[6px]'/>
                    </span>
                </div>

                <TestVideoArea
                    userInfo={userInfo}
                    fanInfo={fanInfo}
                    publisher={publisher}
                    subscriber={subscriber}
                    publisherVideo={publisherVideo}
                    publisherAudio={publisherAudio}
                    muteHandler={muteHandler}
                    toggleFanLetter={toggleFanLetter}
                    setToggleFanLetter={setToggleFanLetter}
                    isTestConnect={currentLocation() === 'test'}
                    setToggleNext={setToggleNext}
                    setIsSuccess={setIsSuccess}
                />

                {/* 기능 Component */}
                <TestCallUtil
                    publisherAudio={publisherAudio}
                    publisherVideo={publisherVideo}
                    muteHandler={muteHandler}
                    quitTest={quitTest}
                    role={userInfo.role}
                    dispatch={dispatch}
                    navigate={navigate}
                    fanInfo={fanInfo}
                    toggleNext = {toggleNext}
                    isSuccess={isSuccess}
                    setIsSuccess={setIsSuccess}
                    eventId={eventId}
                    session={sessionInfo}
                    userInfo={userInfo}
                    createJoinSession={createJoinSession}
                />

            </div>
        </SizeLayout>
    );
};

export default TmpVideoContainer;
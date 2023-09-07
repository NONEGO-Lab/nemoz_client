import React, {useEffect, useState} from 'react';
import Header from "../../shared/Header";
import {SizeLayout} from "../../shared/Layout";
import TestCallUtil from './components/TestCallUtil';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createBrowserHistory} from "history";
import {useTestVideo} from "../../test/controller/useTestVideo";
import {useReaction} from "../../reaction/controller/useReaction";
import {testApi} from "../../test/data/call_test_data";
import {sock} from "../../socket/config";
import {useMediaQuery} from "react-responsive";
import {testEvents} from "../../socket/events/test_event";
import {clearToast} from "../../redux/modules/toastSlice";
import VideoArea from "./components/VideoArea";

const TmpVideoContainer = () => {

    const currentLocation = () => window.location.pathname.split('/')[1]
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const history = createBrowserHistory();

    const isMobile = useMediaQuery({
        query: "(max-width: 600px)"
    })
    const [isOpenMobileSetting, setOpenMobileSetting] = useState(false);
    const [mobileSettingType, setMobileSettingType] = useState("");

    const publisher = useSelector((state) => state.test.publisher);
    const publisherLoading = useSelector((state) => state.test.publisherLoading);
    const subscriber = useSelector((state) => state.test.subscriber);
    const subscriberLoading = useSelector((state) => state.test.subscriberLoading);
    const userInfo = useSelector((state) => state.user.userInfo);
    const toastList = useSelector((state) => state.toast.toastList);
    const publisherVideo = useSelector((state) => state.test.publisherVideo);
    const publisherAudio = useSelector((state) => state.test.publisherAudio);
    const fanInfo = useSelector((state) => state.test.fanInfo);
    const meetInfo = useSelector((state) => state.test.sessionInfo);
    const connectInfo = useSelector((state) => state.test.connectInfo);
    const session = useSelector((state) => state.test.session);
    const eventId = useSelector((state) => state.event.eventId);
    const eventName = useSelector(state => state.event.eventName)
    console.log(eventName, 'event Name?')
    const {
        createJoinSession, joinTestSession, preventBrowserBack,
        onbeforeunload, muteHandler
    } = useTestVideo();

    const {getChatFromSocket} = useReaction();

    const quitTest = async () => {
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
                const response = await testApi.testEnd(meetInfo);
                if (response) {
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
    const [showBtn, setShowBtn] = useState(false)
    const makeBigScreen = (type) => {
        if (type === "half") {
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
    console.log(publisherLoading,'publisherLoadingpublisherLoadingpublisherLoadingpublisherLoading')
    console.log(subscriberLoading, 'subscriberLoadingsubscriberLoadingsubscriberLoading')

    useEffect(() => {

        if (subscriber !== undefined) {
            return;
        }

        if (userInfo.role !== "fan") {
            // staff 이면,
            // test meet create -> join 까지 한다.
            // create, join 하고 나온 방을 socket 으로 보낸다!
            createJoinSession().then((sessionInfo) => {
                console.log('CREATE JOIN SESSION in Video View', sessionInfo)
                console.log(fanInfo)
                let data = {meetName: sessionInfo.meet_name, fanId: fanInfo.fan_id}
                console.log(data, "DATA")
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

    }, []);

    useEffect(() => {
        sock.on("chatMessage", (msg) => testEvents.chatMessage({msg, getChatFromSocket}));
        sock.on("testFail", (fanInfo) => testEvents.testFail({fanInfo, userInfo, navigate}));
        sock.on("testSuccess", (fanInfo) => testEvents.testSuccess({fanInfo, userInfo, dispatch, navigate}));

        return () => {
            sock.removeAllListeners("chatMessage");
            sock.removeAllListeners("testFail");
            sock.removeAllListeners("testSuccess");
            dispatch(clearToast());
        }
    }, []);


    useEffect(() => {

        if (session === undefined) {
            return;
        }

        // window.addEventListener("beforeunload", onbeforeunload);
        // window.addEventListener("popstate", onbeforeunload);
        //
        // return () => {
        //     window.removeEventListener("beforeunload", onbeforeunload);
        //     window.removeEventListener('popstate', onbeforeunload);
        history.listen((location) => {
            if (history.action === "POP") {
                //뒤로가기일 경우
                onbeforeunload();
            }
        })

    }, [session])

    console.log(publisher?.stream.videoActive)
    return (
        <SizeLayout isVideo={true} width={'w-[1366px]'} height={'min-h-[1024px]'}>
            <Header/>
            <div className={"bg-main_theme flex flex-col justify-center"}>
                <div className={"flex justify-center pt-[100px] text-[23px] text-[#444] font-[500] mb-[80px]"}>
                    <span>
                        <img className='w-[30px] h-[30px]' src="../images/roomIcon.png" alt="room-icon"/>
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

                <VideoArea
                    userInfo={userInfo}
                    fanInfo={fanInfo}
                    publisher={publisher}
                    subscriber={subscriber}
                    publisherVideo={publisherVideo}
                    publisherAudio={publisherAudio}
                    muteHandler={muteHandler}
                    isTestConnect={currentLocation() === 'test'} />
                {/*                     
                    <div className={"bg-pink-600 h-[40%] flex justify-center items-center"}>
                        <ReactionButton />
                    </div> */}

                {/* 기능 Component */}
                <TestCallUtil
                    publisherAudio={publisherAudio}
                    publisherVideo={publisherVideo}
                    muteHandler={muteHandler}
                    quitTest={quitTest}
                    role={userInfo.role}
                    dispatch={dispatch}
                    navigate={navigate}
                    isTest = {currentLocation() === 'test'}
                />

            </div>
        </SizeLayout>
    );
};

export default TmpVideoContainer;
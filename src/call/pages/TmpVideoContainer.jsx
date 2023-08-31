import React, {useEffect} from 'react';
import Header from "../../shared/Header";
import {SizeLayout} from "../../shared/Layout";
import {ReactionButton} from "../../reaction/pages/components/index";

import {useState} from 'react';
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
import InnerCircleText from "../../common/InnerCircleText";
import Video2 from "../../video/pages/Video2";
// const isVideoTurnOn = false;
// const isVoiceOn = true
const TmpVideoContainer = () => {

    const [isVideoTurnOn, SetIsVideoTurnOn] = useState(false)
    const [isVoiceoTurnOn, SetIsVoiceTurnOn] = useState(false)

    const fan_gender = '여'
    const fan_letter = '블핑 김지수 1호팬, 여기 숨 쉰 채 발견되다'
    const artist_name = "블핑 지수"
    const staff_name = "찌오"
    // const role = "staff"

    const screenName = (role) => role === 'staff' ? staff_name : artist_name

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const history = createBrowserHistory();

    const isMobile = useMediaQuery({
        query: "(max-width: 600px)"
    })
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
    const eventName = useSelector(state => state.event.eventName)

    const {age, fan_name, sex, message} = fanInfo
    const isStaff = userInfo.role === 'staff'

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
            console.log('HELLO?')
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
                console.log("location!!!!!: ", location);
                if (history.action === "POP") {
                    //뒤로가기일 경우
                    onbeforeunload();
                }
            })

    }, [session])


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

                <div className={"flex flex-row justify-evenly"}>
                    {/* Fan Area */}
                    <div className='w-[650px] text-center'>
                        <span
                            className='text-[19px] font-medium flex justify-center items-center'>
                            {`Fan ${fan_name} (${age}세)`}
                            <InnerCircleText gender={sex} width={"w-[22px]"} height={"h-[22px]"} bgcolor={"bg-[#444]"}
                                             ml={"ml-[13px]"} textSize={"text-[15px]"} textColor={"text-white"}
                                             fontWeight={"font-normal"}/></span>
                        <div className={"flex flex-col mt-[24px]"}>

                            <div
                                id={"sub"}
                                className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex  flex-col justify-end`}>

                                {subscriber == undefined && <div
                                    className='flex justify-center items-center text-[25px] text-white w-full'>FAN</div>}
                                {subscriber !== undefined && (

                                    <Video2 style={`rounded-[15px] border-2 border-rose-600`}
                                            streamManager={subscriber}/>

                                )
                                }

                                {isStaff &&
                                    <div
                                        className={`w-full flex justify-center items-end mb-[43px] ${!isVideoTurnOn ? "mt-[98px]" : ""}`}>

                                        <div
                                            className='w-[180px] min-h-[50px] mr-[35px] rounded-[25px] bg-white flex items-center justify-center cursor-pointer'>
                                            <div className='text-[#02c5cb] text-[19px] font-medium'>연결 성공</div>
                                        </div>
                                        <div
                                            className='w-[180px] min-h-[50px] rounded-[25px] bg-[#ff483a] flex items-center justify-center cursor-pointer'>
                                            <span className='text-white text-[19px] font-medium'>연결 실패</span>

                                        </div>
                                    </div>}
                            </div>
                            {message && <div className='text-center mt-[27px]'>
                                {/* <image /> */}
                                <span>{message}</span>
                            </div>}
                        </div>
                    </div>

                    {/* Artist or Staff Area */}

                    <div className='w-[650px]'>
                        <div className='flex justify-center items-center'>
                            {/*{isStaff ?*/}
                            {/*    <>*/}
                            {/*        <img src="../images/staffIcon.png" alt='stafficon'*/}
                            {/*             className='w-[24px] h-[24px] mr-[7px]'/>*/}
                            {/*        <div className='text-[19px] font-medium'>{staff_name}</div>*/}
                            {/*    </>*/}
                            {/*    :*/}
                            {/*    <>*/}
                            {/*        <img src="../images/starIcon.png" alt='staricon'*/}
                            {/*             className='w-[24px] h-[24px] mr-[7px]'/>*/}
                            {/*        <div className='text-[19px] font-medium'>{artist_name}</div>*/}
                            {/*    </>*/}
                            {/*}*/}
                            <>
                                <img src="../images/starIcon.png" alt='staricon'
                                     className='w-[24px] h-[24px] mr-[7px]'/>
                                <div className='text-[19px] font-medium'>{'바꿔야함'}</div>
                            </>
                        </div>
                        <div className={"flex flex-col mt-[24px]"}>
                            <div className={`h-[368px] ${publisherVideo ? "" : "hidden"}`}>
                                {publisher !== undefined && (
                                    <Video2 streamManager={publisher} publisherAudio={publisherAudio}
                                            publisherVideo={publisherVideo}
                                            muteHandler={muteHandler} style={`rounded-[15px] `}/>)
                                }
                            </div>

                            {!publisherVideo &&
                                <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>

                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{screenName(userInfo.role)}</span>


                                </div>}
                        </div>
                    </div>
                </div>

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
                />

            </div>
        </SizeLayout>
    );
};

export default TmpVideoContainer;
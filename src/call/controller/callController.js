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
import {addToast as addToastRedux} from "../../redux/modules/toastSlice";
import {videoEvents} from "../../socket/events/video_event";
import {useVideo} from "./hooks/useVideo";
import {leave_meet} from "../../model/call/call_model";


export const CallController = () => {

    const {
        joinSession, onlyJoin, newJoinMeet, leaveSession,
        fanJoinSession, msgBeforeOut, onbeforeunload
    } = useVideo();


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
    const eventId = useSelector((state) => state.event.currentEventId);

    const [isOpenWaitingModal, setIsOpenWaitingModal] = useState(false);
    const [isOpenAddUser, setIsOpenAddUser] = useState(false);
    const [isOpenFanDetail, setIsOpenFanDetail] = useState(false);
    const [isOpenLeftTime, setIsOpenLeftTime] = useState(false);
    const [waitingFanInfo, setWaitingFanInfo] = useState({});
    const [currentFan, setCurrentFan] = useState({});
    const [staffNoticeList, setStaffNoticeList] = useState([]);
    const leftTimeRef = useRef(0);
    const [isLastFan, setIsLastFan] = useState(false)
    const [warnCnt, setWarnCnt] = useState(0);
    const [emoticonToggle, setEmoticonToggle] = useState({left:false, right:false})
    const [toasts, setToasts] = useState([]);

    function setDefaultNextToggle(){
        if(roomInfo.fan_joined !== 1 || (roomInfo?.fan_joined === 1 && roomInfo.fan_leaved === 1)){
            return true
        }
        else if(roomInfo?.fan_joined === 1 && roomInfo.fan_leaved === 1){
            return false
        }
    }

    const [toggleNext, setToggleNext] = useState(setDefaultNextToggle())

    let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;
    const navigateByRole = () => {
        if (userInfo.role === "fan" || userInfo.role === 'member') {
            navigate("/waitcall");
        } else {
            navigate("/roomlist");
        }
    }

    const endRoom = async () => {
        /// 방을 아예 종료
        if (window.confirm("정말 방을 종료하시겠습니까?")) {
            const request = {
                meet_id: sessionInfo.meetId,
                meet_name: sessionInfo.meetName,
                room_id: roomInfo.room_id,
                event_id: eventId,
                //   fan_id 추가 필요
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

    const outRoom = async (role) => {
        console.log("!!!! out Room !!!!!!!~~~~~~~~")
        // 방을 단순히 나가는 용도로 사용
        try {
        console.log(role)
            if(role === 'member'){
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

                    const response = await meetApi.leaveMeet(request);

                    if (response) {
                        leaveSession();
                        sock.emit("leaveRoom", roomNum, userInfo.username, navigate);
                        // sock.emit("endMeet", roomNum);
                        navigateByRole();
                    }
            }else{
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

                if (response) {
                    leaveSession();
                    sock.emit("leaveRoom", roomNum, userInfo.username, navigate);
                    // sock.emit("endMeet", roomNum);
                    navigateByRole();
                }
            }




        } catch (err) {
            // navigateByRole();
            console.error(err, 'in out room')
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
        let roomMsg = `${eventId || roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
        setSearchParams({meetName: sessionInfo.meetName});
        sock.emit("joinRoom", roomMsg, userInfo);
    }

    const getCurrentFanInfo = async () => {
        let roomId = roomInfo.room_id;
        try {
            const result = await roomApi.getListOrder({eventId, roomId});
            const currentFan = result.fan_orders.find((fan) => fan.orders === 1);
            const response = await attendeeApi.getFanDetail(currentFan.fan_id);
            console.log('getCurrentFanInfo', response)
            setCurrentFan(response);
            setWarnCnt(response?.warning_count)
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
        console.log('ONLY NEW JOIN ROOM', nextFan)
        dispatch(clearSession());
        dispatch(addTimer(0));
        newJoinMeet(newSessionInfo).then((sessionInfo) => {
            completeSession(sessionInfo);
        });
        console.log(roomInfo.event_id,eventId, '????')
        const detail = await attendeeApi.getFanDetail(nextFan.fan_id, roomInfo.event_id);
        setCurrentFan(detail);
        setWarnCnt(detail?.warning_count)
    };

    const toBack = () => {
        navigate(-1);
    }

    const requestKickOutApi = async () => {
        const result = await attendeeApi.banFan({id: connectionInfo.meet_id, userId: userInfo.id});
        const conn_data = result?.conn_data
        const fan_data = result.fan_data
        if (conn_data.meet_id) {

            const request = {
                ...leave_meet,
                user_info: {
                    id: fan_data?.user_info.id.toString(),
                    role: fan_data?.user_info.role,
                },
                type: 'ban',
                meet_name: conn_data.meet_name,
                connection_id: conn_data.conn_id,
                connection_name: conn_data.conn_name,
                progress_time: leftTimeRef.current
            }

            try {
                const response = await meetApi.leaveMeet(request);
                if (response) {
                    sock.emit("kickOut", roomNum, fan_data?.user_info);
                }
            } catch (err) {
                console.error(err)
                dispatch(setError(err));
                dispatch(setIsError(true));
            }


        }
    }

    const warnHandler = async () => {
        if (subscribers.length === 0) return;

        if (window.confirm(`정말로 ${currentFan.fan_name}를 경고하시겠습니까?`)) {
            let connId = connectionInfo.meet_id;
            const result = await attendeeApi.warnFan(connId);
            if (result.message === "Warning Count is Updated") {
                sock.emit("warnUser", roomNum, currentFan, result.data.warning_count);
            }
            if (result.data.warning_count >= 3) {
                requestKickOutApi();
            }
        }
    }

    const kickOutHandler = async () => {
        if (subscribers.length === 0) return;
        if (window.confirm(`정말로 ${currentFan.fan_name}씨를 강퇴하시겠습니까?`)) {
            requestKickOutApi();
        }
    }

    const sendLeftTimeHandler = (subscribers, leftTimeRef) => {
        console.log('noti Time Left')
        if (subscribers.length === 0) return;

        // socket 으로 방에 있는 모든 사람들에게 남은 시간을 알려준다!
        let room = `${eventId || roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
        let time = leftTimeRef.current;
        console.log("notifyTime", room, time, currentFan)
        sock.emit("notifyTime", room, time);
    }

    const sendReactionHandler = (msg) => {
        let room = `${eventId || roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
        console.log('sendReact', room, msg)
        sock.emit("chatMessage", room, msg)
    }

    const addToast = (message) => {
        dispatch(addToastRedux(message))
    }

    const removeToast = () => {
        setToasts((prevToasts) => prevToasts.slice(1));
    };

    useEffect(() => {
        if (publisher) {
            return;
        }
        if (userInfo.role === "fan" || userInfo.role === "member") {
            let roomId = roomInfo.room_id;
            let callTime = roomInfo.reserved_time;
            fanJoinSession({roomId, sessionInfo}).then((sessionInfo) => {
                completeSession(sessionInfo);
                let roomNum = `${eventId || roomInfo.event_id}_${roomId}_${sessionInfo.meetId}`;
                sock.emit("timerStart", roomNum, callTime);
                dispatch(addTimer(roomInfo.reserved_time));
            });

        } else {
            if (roomInfo.meet_id !== "") {
                // 현재 진행중인 meet가 이미 있을 때 중간에 join
                onlyJoin(roomId).then((sessionInfo) => {
                    completeSession(sessionInfo);
                    if (userInfo.role === "staff") {
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

    }, []);


    useEffect(() => {
        if (session === undefined) {
            return;
        }
        history.listen((location) => {
            if (history.action === "POP") {
                //뒤로가기일 경우
                onbeforeunload();
                navigateByRole();
            }
        })

    }, [session])


    useEffect(() => {
        console.log('VIDEO SOCKET ON')
        sock.on("chatMessage", (msg) => videoEvents.chatMessage({msg, addToast}));
        sock.on("joinRoom", (user) => videoEvents.joinRoom({user, setStaffNoticeList}));
        sock.on("joinNextRoom", (num, newSessionInfo, userId, nextFan) => videoEvents.joinNextRoom({
            newSessionInfo,
            userId,
            nextFan,
            userInfo,
            onlyJoinNewRoom
        }));
        sock.on("leaveRoom", (num, userInfo) => videoEvents.leaveRoom({
            userInfo,
            setStaffNoticeList,
            dispatch
        }));
        sock.on("endMeet", () => videoEvents.endMeet({userInfo, navigate}));
        sock.on("kickOut", (fanInfo) => videoEvents.kickOut({
            fanInfo,
            userInfo,
            roomInfo,
            sessionInfo,
            navigate,
            eventId
        }));
        sock.on("timerStart", (time) => videoEvents.timerStart({time, dispatch}));
        sock.on("leftTime", (currentTime) => videoEvents.leftTime({currentTime, userInfo, dispatch}));
        sock.on("notifyTime", (time) => videoEvents.notifyTime({
            time,
            addToast
        }));
        sock.on("warnUser", (user, count) => videoEvents.warnUser({
            user,
            count,
            role: userInfo.role,
            setStaffNoticeList,
            userInfo,
            setWarnCnt,
            addToast
        }));
        sock.on("callFinish", (fan) => videoEvents.callFinish({fan, userInfo, dispatch, navigateByRole, clearSession}));
        sock.on("lastMeet", (artistId) => videoEvents.lastMeet({
            artistId,
            setCurrentFan,
            userInfo,
            dispatch,
            clearSession,
            addTimer,
            navigateByRole
        }));

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

    }, [])

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
        isOpenWaitingModal,
        isLastFan,
        warnHandler,
        warnCnt,
        setWarnCnt,
        kickOutHandler,
        emoticonToggle,
        setEmoticonToggle,
        sendLeftTimeHandler,
        sendReactionHandler,
        toasts,
        setToasts,
        addToast,
        removeToast,
        toggleNext,
        setToggleNext,
    }

}
import React, {useEffect, useState} from 'react';
import {useVideo} from "../../controller/hooks/useVideo";
import {addTimer, disconnectSession, setIsCallFinished} from "../../../redux/modules/videoSlice";
import {clearSessionInfo} from "../../../redux/modules/commonSlice";
import {sock} from "../../../socket/config";
import {useDispatch, useSelector} from "react-redux";
import {roomApi} from "../../../room/data/room_data";
import {end_meet} from "../../../model/call/call_model";
import {meetApi} from "../../data/call_data";
import {attendeeApi} from "../../../fans/data/attendee_data";
import {setError, setIsError} from "../../../redux/modules/errorSlice";
import {useNavigate, useSearchParams} from "react-router-dom";

const MainCallUtil = ({audioMuteHandler, videoMuteHandler,role, currentFan, setCurrentFan, session, subscribers, outRoom}) => {
    const [isCallProcessing, setIsCallProcessing] = useState(false);
    const [isFirstCall, setIsFirstCall] = useState(true);
    const roomInfo = useSelector((state) => state.common.roomInfo);
    const sessionInfo = useSelector((state) => state.common.sessionInfo);
    // const subscribers = useSelector((state) => state.video.subscribers);
    const userInfo = useSelector((state) => state.user.userInfo);
    const eventId = useSelector((state) => state.event.currentEventId);
    const { leaveSession, joinSession, publisherAudio, publisherVideo } = useVideo();

    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;

    const routeToFanList = () =>{
        if(role === 'fan'||'member'){
            alert("스태프 혹은 아티스트만 이용하실 수 있습니다.")
            return
        }
        if (session) {
            dispatch(disconnectSession());
            dispatch(clearSessionInfo());
            leaveSession();
            navigate("/userlist")
        } else {
            navigate("/userlist");
        }
    }
    const nextCallConnect = async () => {
        console.log('다음 팬 호출')
        if(role === 'fan'){
            alert("스태프 혹은 아티스트만 이용하실 수 있습니다.")
            return
        }
        // 첫 렌더링때는 이미 join 되어있는 상황이라, fan에게 socket 알람만 가면 된다.
        if(Object.keys(currentFan).length === 0) {
            alert("마지막 팬입니다.");
            return;
        }

        if(isFirstCall) {
            sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
            setIsFirstCall(false);
        } else {
            /// 다음 팬 알리기
            console.log('NEXT FAN', currentFan, sessionInfo, roomInfo)
            sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
        }
        setIsCallProcessing(true);
        sock.emit("checkSessionState", roomNum, true);
    };

    const finishCurrentCall = async () => {
        if(window.confirm("정말 통화를 종료하시겠습니까?")){
            try {
                let roomId = roomInfo.room_id;
                const fanList = await roomApi.getListOrder({ eventId, roomId });
                const curFan = subscribers.find((sub) => sub['role'] === 'fan');
                const curFanIndex = fanList.findIndex((fan) => fan.fan_id.toString() === curFan.id.toString());
                const nextFan = fanList[curFanIndex + 1];
                const fanId = fanList[curFanIndex].fan_id;
                const request = {
                    ...end_meet,
                    meet_id: sessionInfo.meetId,
                    meet_name: sessionInfo.meetName,
                    room_id: roomId,
                    event_id: eventId,
                    fan_id: fanId
                }
                const result = await meetApi.endMeet(request);console.log(result)

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
                        console.log(newSessionInfo, 'NEW SESSION INFO')
                        setSearchParams({meetName: newSessionInfo.meetName});
                        let roomNum = `${eventId}_${roomId}_${newSessionInfo.meetId}`;

                        const otherStaffInfo = subscribers.find((sub) => sub['id'].toString() !== userInfo.id.toString());
                        sock.emit("joinNextRoom", roomNum, newSessionInfo, otherStaffInfo['id'], nextFan);
                        sock.emit("joinRoom", roomNum, userInfo);

                    } else {
                        console.log('마지막 팬 미팅 종료!')
                        setCurrentFan({});
                        console.log(subscribers, 'Last Fan Meeting')
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

    const getFirstFanInfo = async () => {
        let roomId = roomInfo.room_id;
        try {
            const result = await roomApi.getListOrder({ eventId, roomId });
            const detail = await attendeeApi.getFanDetail(result[0].fan_id, eventId);
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



   return (
        <div className={"flex justify-start items-center flex-row mt-[153px] mx-[110px]"}>
            {/* 팬 리스트 */}
            <div className={"flex flex-col text-[8px] items-center mr-[57px]"}>
                <div className={"cursor-pointer"} onClick={routeToFanList}>
                    <img src="../images/callOutFanList.png" alt='fanlist'/>
                </div>
                <span className={"mt-[25px] flex flex-col items-center text-[#848484] text-[12px] whitespace-nowrap"}>
                   {`FAN LIST`}
                </span>
            </div>
            {/* 다음 사람 */}
            <div className={"flex flex-col text-[8px] items-center  mr-[285px]"}>
                <div className={`w-[44px] cursor-pointer`}  onClick={nextCallConnect}>
                    {!isCallProcessing ? <img src="../images/callOutNext.png" alt="next" /> : <img src="../images/callOutNextOff.png" alt="next" />}
                </div>
                <span className={"mt-[20px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    {`NEXT`}
                </span>
            </div>


            {/* 캠 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={videoMuteHandler}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {publisherVideo ? <img src="../images/callOutCameraOn.png" alt="cam-on" /> : <img src="../images/callOutCameraOff.png" alt="cam-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`CAM`}</div>

                </div>
            </div>
            {/* 마이크 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={audioMuteHandler}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {publisherAudio ? <img src="../images/callOutMicOn.png" alt="mic-on" /> : <img src="../images/callOutMicOff.png" alt="mic-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`MIC`}</div>

                </div>
            </div>
            {/* 연결 끊기 */}
           <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[370px]"}>
                <div className={"w-[75px] h-[75px]  cursor-pointer"} onClick={finishCurrentCall}>
                    <img src="../images/callOutQuit.png" alt="quit"/>
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`DISCONNECT`}</div>
                </div>
            </div>

            {/* 방 나가기 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                <div className={"w-[55px] h-[55px]  cursor-pointer"} onClick={()=>outRoom(role)}>
                    <img src="../images/callOutRoomEnd.png" alt="close" />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`CLOSE`}</div>
                </div>
            </div>

        </div>
    );
};

export default MainCallUtil;

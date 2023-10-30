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

const MainCallUtil = ({
                          audioMuteHandler,
                          videoMuteHandler,
                          role,
                          currentFan,
                          setCurrentFan,
                          session,
                          subscribers,
                          outRoom,
                          leftTimeRef,
                          warnHandler,
                          kickOutHandler,
                          setWarnCnt,
                          sendLeftTimeHandler,
                      }) => {
    const [isCallProcessing, setIsCallProcessing] = useState(false);
    const [isFirstCall, setIsFirstCall] = useState(true);
    const roomInfo = useSelector((state) => state.common.roomInfo);
    const sessionInfo = useSelector((state) => state.common.sessionInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const eventId = useSelector((state) => state.event.currentEventId);
    const {leaveSession, joinSession, publisherAudio, publisherVideo, currentEventId} = useVideo();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    let roomNum = `${eventId||roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;

    const routeToFanList = () => {
        if (role === 'fan' || role === 'member') {
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
        // 첫 렌더링때는 이미 join 되어있는 상황이라, fan에게 socket 알람만 가면 된다.

        if (Object.keys(currentFan).length === 0) {
            alert("마지막 팬입니다.");
            // 방종료 로직 meetEnd
            return;
        }

        if (isFirstCall) {
            sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
            setIsFirstCall(false);
        } else {
            await finishCurrentCall()
        }

    };

    const finishCurrentCall = async () => {
            try {
                let roomId = roomInfo.room_id;
                let eventId = roomInfo.event_id || roomInfo.event_id
                const fanList = await roomApi.getListOrder({eventId, roomId});
                const curFan = subscribers.find((sub) => sub['role'] === 'fan' || sub['role'] === 'member');
                const curFanIndex = fanList.findIndex((fan) => fan.fan_id.toString() === curFan.id.toString());
                const nextFan = fanList[curFanIndex + 1];
                console.log(nextFan, 'NEXT FAN In FINISH CALL FUNC')
                const fanId = fanList[curFanIndex].fan_id;
                const request = {
                    ...end_meet,
                    meet_id: sessionInfo.meetId,
                    meet_name: sessionInfo.meetName,
                    room_id: roomId,
                    event_id: eventId,
                    fan_id: fanId
                }
                const result = await meetApi.endMeet(request);
                if (result) {
                    leaveSession();
                    setIsCallProcessing(false);
                    dispatch(setIsCallFinished());
                    dispatch(addTimer(null));

                    // sock.emit("leaveRoom", roomNum, userInfo);
                    sock.emit("callFinish", currentFan);
                    sock.emit("checkSessionState", roomNum, false);


                    // 다음 팬이 있으면, 팬 정보 가져오고, 새 session을 열어준다.
                    if (nextFan !== undefined) {
                        const detail = await attendeeApi.getFanDetail(nextFan.fan_id, eventId);
                        setCurrentFan(detail);

                        // 대기열에 있는 팬들의 대기열 업데이트 필요
                        const waitFans = fanList.slice(curFanIndex + 2);
                        sock.emit("updateWaitOrder", waitFans);

                        // 방에 있는 artist or staff 에게도 알려줘야 함!
                        const newSessionInfo = await joinSession(roomId);
                        setSearchParams({meetName: newSessionInfo.meetName});
                        let roomNum = `${eventId}_${roomId}_${newSessionInfo.meetId}`;

                        const otherStaffInfo = subscribers.find((sub) => sub['id'].toString() !== userInfo.id.toString());
                        sock.emit("joinNextRoom", roomNum, newSessionInfo, otherStaffInfo['id'], nextFan);
                        sock.emit("joinRoom", roomNum, userInfo);

                        sock.emit("nextCallReady", nextFan, sessionInfo, roomInfo);
                        setIsCallProcessing(true);
                        sock.emit("checkSessionState", nextFan, roomNum, true);

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

    };

    const getFirstFanInfo = async () => {
        let roomId = roomInfo.room_id;
        let eventId = roomInfo.event_id
        try {
            const result = await roomApi.getListOrder({eventId: currentEventId || eventId, roomId});
            const detail = await attendeeApi.getFanDetail(result[0].fan_id, eventId);
            setCurrentFan(detail);
            setWarnCnt(detail?.warning_count)
        } catch (err) {
            dispatch(setError(err));
            dispatch(setIsError(true));
        }
    }


    useEffect(() => {
        getFirstFanInfo();
        if (subscribers.length > 0) {
            setIsCallProcessing(true);
        }

    }, []);

    useEffect(() => {
        sock.on("checkSessionState", (bool) => {
            setIsCallProcessing(bool);
        })

        return () => {
            sock.off("checkSessionState", (bool) => {
                setIsCallProcessing(bool);
            })
        }
    }, [])


    return (
        <div className={"flex justify-center items-center flex-row mt-[153px] mx-[110px]"}>
            {userInfo.role === 'staff' &&
                <>
                    {/* 팬 목록 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={routeToFanList}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/staffFanListIcon.png" alt="staff_fan_list"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`FANLIST`}</div>
                        </div>
                    </div>

                    {/* 알람 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={()=>sendLeftTimeHandler(subscribers, leftTimeRef)}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/staffAlramIcon.png" alt="close"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`ALRAM`}</div>
                        </div>
                    </div>

                    {/* 경고 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={warnHandler}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/staffWarningIcon.png" alt="close"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`WARNING`}</div>
                        </div>
                    </div>

                    {/* 강퇴 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={kickOutHandler}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/staffOutIcon.png" alt="close"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`OUT`}</div>
                        </div>
                    </div>

                    {/* 다음 사람 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={nextCallConnect}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/staffNextIcon.png" alt="close"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`NEXT`}</div>
                        </div>
                    </div>

                    {/* 나가기 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={() => outRoom(role)}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/callOutRoomEnd.png" alt="close"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`QUIT`}</div>
                        </div>
                    </div>
                </>
            }
            {/* 팬 리스트 */}
            {userInfo.role !== 'staff' &&
                <>
                    {/* 캠 토글 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={videoMuteHandler}>
                        <div className={"w-[75px] h-[75px] cursor-pointer"}>
                            {publisherVideo ? <img src="../images/callOutCameraOn.png" alt="cam-on"/> :
                                <img src="../images/callOutCameraOff.png" alt="cam-off"/>}
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`CAM`}</div>
                        </div>
                    </div>
                    {/* 마이크 토글 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={audioMuteHandler}>
                        <div className={"w-[75px] h-[75px] cursor-pointer"}>
                            {publisherAudio ? <img src="../images/callOutMicOn.png" alt="mic-on"/> :
                                <img src="../images/callOutMicOff.png" alt="mic-off"/>}
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`MIC`}</div>
                        </div>
                    </div>
                    {/* 다음 사람 */}
                    {userInfo.role === 'artist' &&
                        <div className={"flex flex-col text-[8px] items-center  mr-[30px]"}>
                        <div className={`w-[75px] cursor-pointer`} onClick={nextCallConnect}>
                            <img src="../images/callOutNext.png" alt="next"/>
                        </div>
                        <span className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    {`NEXT`}
                </span>
                    </div>}
                    {/* 방 나가기 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                        <div className={"w-[75px] cursor-pointer"} onClick={() => outRoom(role)}>
                            <img src="../images/callOutQuit.png" alt="close"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`QUIT`}</div>
                        </div>
                    </div>
                </>}
        </div>
    );
};

export default MainCallUtil;

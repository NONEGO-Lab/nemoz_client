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
                          toggleNext,
                          setToggleNext,
                          setCurrentRoom,
                          custonStyle,
                          finishCurrentCall,
                      }) => {
    const [isFirstCall, setIsFirstCall] = useState(true);
    const roomInfo = useSelector((state) => state.common.roomInfo);
    const sessionInfo = useSelector((state) => state.common.sessionInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const eventId = useSelector((state) => state.event.currentEventId);
    const {publisherAudio, publisherVideo, currentEventId} = useVideo();
    const dispatch = useDispatch();

    let roomNum = `${eventId || roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;

    let style = "flex justify-center items-center flex-row mt-[153px] mx-[110px] absolute bottom-[100px] left-[20%]";

    const nextCallConnect = async () => {
        if (role === 'member') {
            alert("스태프 혹은 아티스트만 이용하실 수 있습니다.")
            return
        }
        // 첫 렌더링때는 이미 join 되어있는 상황이라, fan에게 socket 알람만 가면 된다.
        if (Object.keys(currentFan).length === 0) {
            alert("마지막 팬입니다.");
            return;
        }

        if (isFirstCall) {
            sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
            setIsFirstCall(false);

        } else {
            /// 다음 팬 알리기
            sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
        }
        setToggleNext(prev => !prev)
        sock.emit("checkSessionState", roomNum, true);
    };


    const getFirstFanInfo = async (role) => {
        let roomId = roomInfo.room_id;
        let eventId = roomInfo.event_id
        if(role==='member'){
            try {
                const detail = await attendeeApi.getFanDetail(userInfo.id, eventId);
                setCurrentFan(detail);
                setWarnCnt(detail?.warning_count)
            } catch (err) {
                dispatch(setError(err));
                dispatch(setIsError(true));
            }
        }else{
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

    }


    useEffect(() => {
        getFirstFanInfo(userInfo.role);
    }, []);


    return (
        <div
            className={custonStyle ?? style}>
            {userInfo.role === 'staff' &&
                <>
                    {/* 팬 목록 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={() => setCurrentRoom(roomInfo)}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/staffFanListIcon.png" alt="staff_fan_list"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`FANLIST`}</div>
                        </div>
                    </div>

                    {/* 알람 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={() => sendLeftTimeHandler(subscribers, leftTimeRef)}>
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

                    {/* 연결 끊기 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}
                         onClick={finishCurrentCall}>
                        <div className={"w-[75px] cursor-pointer"}>
                            <img src="../images/callOutQuit.png" alt="disconnect"/>
                        </div>
                        <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                            <div>{`DISCONNECT`}</div>
                        </div>
                    </div>

                    {/* 다음 사람 */}
                    <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}>
                        {toggleNext ?
                            <img src="../images/callOutNext.png" className={`cursor-pointer`} alt="next"
                                 onClick={nextCallConnect}/>
                            : <img src="../images/callOutNextOff.png" alt="next"/>}
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
                            <div className={`w-[75px]`}>
                                {toggleNext ?
                                    <img src="../images/callOutNext.png" className={`cursor-pointer`} alt="next"
                                         onClick={nextCallConnect}/>
                                    : <img src="../images/callOutNextOff.png" alt="next"/>}
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

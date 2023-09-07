import React, {useState} from 'react';
import {useVideo} from "../../controller/hooks/useVideo";
import {disconnectSession} from "../../../redux/modules/videoSlice";
import {clearSessionInfo} from "../../../redux/modules/commonSlice";
import {sock} from "../../../socket/config";
import {useSelector} from "react-redux";

const MainCallUtil = ({publisherAudio, publisherVideo, muteHandler, role, quitTest, isTest, dispatch, session, navigate, currentFan, setCurrentFan}) => {
    const isTestTmp = true
    const isRealService = isTest && role === 'staff'
    const roomInfo = useSelector((state) => state.common.roomInfo);
    const sessionInfo = useSelector((state) => state.common.sessionInfo);
    const subscribers = useSelector((state) => state.video.subscribers);
    const userInfo = useSelector((state) => state.user.userInfo);
    const eventId = useSelector((state) => state.event.eventId);
    const {leaveSession, joinSession} = useVideo();

    const routeToFanList = () =>{
        if (session) {
            dispatch(disconnectSession());
            dispatch(clearSessionInfo());
            leaveSession();
            navigate("/userlist")
        } else {
            navigate("/userlist");
        }
    }
    const [isCallProcessing, setIsCallProcessing] = useState(false);
    const [isFirstCall, setIsFirstCall] = useState(true);

    let roomNum = `${eventId}_${roomInfo.room_id}_${sessionInfo.meetId}`;
    const nextCallConnect = async () => {

        // 첫 렌더링때는 이미 join 되어있는 상황이라, fan에게 socket 알람만 가면 된다.
        if(Object.keys(currentFan).length === 0) {
            alert("마지막 팬입니다.");
            navigate("/roomlist");
            return;
        }

        if(isFirstCall) {
            sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
            setIsFirstCall(false);
        } else {
            /// 다음 팬 알리기
            sock.emit("nextCallReady", currentFan, sessionInfo, roomInfo);
        }
        setIsCallProcessing(true);
        sock.emit("checkSessionState", roomNum, true);
    };

   return (
        <div className={"flex justify-start items-center flex-row mt-[153px] mx-[110px]"}>
            {/* 팬 리스트 */}
            {isRealService && <div className={"flex flex-col text-[8px] items-center mr-[57px]"} >
                <div className={"cursor-pointer"} onClick={routeToFanList}>
                    <img src="../images/callOutFanList.png" alt='fanlist'/>
                </div>
                <span className={"mt-[25px] flex flex-col items-center text-[#848484] text-[12px] whitespace-nowrap"}>
                   {`FAN LIST`}
                </span>
            </div>}
            {/* 다음 사람 */}
            <div className={"flex flex-col text-[8px] items-center  mr-[285px]"}>
                <div className={`w-[44px] ${isRealService ? "cursor-pointer" : ""}`}  onClick={nextCallConnect}>
                    {isTestTmp ? <img src="../images/callOutNext.png" alt="next" /> : <img src="../images/callOutNextOff.png" alt="next" />}
                </div>
                <span className={"mt-[20px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    {`NEXT`}
                </span>
            </div>


            {/* 캠 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={() => muteHandler("video", publisherVideo)}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {publisherVideo ? <img src="../images/callOutCameraOn.png" alt="cam-on" /> : <img src="../images/callOutCameraOff.png" alt="cam-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`CAM`}</div>

                </div>
            </div>
            {/* 마이크 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={() => muteHandler("audio", publisherAudio)}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {publisherAudio ? <img src="../images/callOutMicOn.png" alt="mic-on" /> : <img src="../images/callOutMicOff.png" alt="mic-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`MIC`}</div>

                </div>
            </div>
            {/* 연결 끊기 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[370px]"}>
                <div className={"w-[75px] h-[75px]  cursor-pointer"}  onClick={()=>alert('팬 -> 대기, 스태프 -> 유지?')}>
                    <img src="../images/callOutQuit.png" alt="quit" />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`DISCONNECT`}</div>
                </div>
            </div>

            {/* 방 종료 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                <div className={"w-[55px] h-[55px]  cursor-pointer"} onClick={quitTest}>
                    <img src="../images/callOutRoomEnd.png" alt="quit" />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`CLOSE`}</div>
                </div>
            </div>

        </div>
    );
};

export default MainCallUtil;

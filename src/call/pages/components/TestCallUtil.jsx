import React from 'react'
import {disconnectSession} from "../../../redux/modules/videoSlice";
import {clearSessionInfo} from "../../../redux/modules/commonSlice";
import {useVideo} from "../../controller/hooks/useVideo";


const TestCallUtil = ({ publisherAudio, publisherVideo, muteHandler, role, quitTest, isTest, dispatch, session, navigate }) => {


    return (
        <div className={"flex justify-center items-center flex-row mt-[153px] mx-[110px]"}>
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
            {/* 다음 사람 */}
            <div className={"flex flex-col text-[8px] items-center mr-[30px] "}>
                <div className={`w-[75px] cursor-pointer`}  onClick={()=>alert('현재 방 종료 -> 새 방 오픈')}>
                    <img src="../images/callOutNext.png" alt="next" />
                </div>
                <span className={"mt-[20px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    {`NEXT`}
                </span>
            </div>

            {/* 방 나가기 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                <div className={"w-[75px] cursor-pointer"} onClick={()=>quitTest()}>
                    <img src="../images/callOutQuit.png" alt="close"/>
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`QUIT`}</div>
                </div>
            </div>




        </div>
    )
}

export default TestCallUtil
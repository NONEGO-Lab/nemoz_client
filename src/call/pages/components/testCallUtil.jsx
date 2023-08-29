import React from 'react'


const TestCallUtil = ({ isVideoTurnOn, SetIsVideoTurnOn, isVoiceoTurnOn, SetIsVoiceTurnOn, role }) => {
    const isTest = true
    const isRealService = isTest && role === 'staff'
    return (
        <div className={"flex justify-start items-center flex-row mt-[153px] mx-[110px]"}>
            {/* 팬 리스트 */}
            {isRealService && <div className={"flex flex-col text-[8px] items-center mr-[57px]"} >
                <div className={"cursor-pointer"}>
                    <img src="../images/callOutFanList.png" alt='fanlist'/>
                </div>
                <span className={"mt-[25px] flex flex-col items-center text-[#848484] text-[12px] whitespace-nowrap"}>
                   {`FAN LIST`}
                </span>
            </div>}
            {/* 다음 사람 */}
            <div className={"flex flex-col text-[8px] items-center  mr-[285px]"}>
                <div className={`w-[44px] ${isRealService ? "cursor-pointer" : ""}`}>
                    {isTest ? <img src="../images/callOutNext.png" alt="next" /> : <img src="../images/callOutNextOff.png" alt="next" />}
                </div>
                <span className={"mt-[20px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    {`NEXT`}
                </span>
            </div>


            {/* 캠 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={() => SetIsVideoTurnOn(prev => !prev)}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {isVideoTurnOn ? <img src="../images/callOutCameraOn.png" alt="cam-on" /> : <img src="../images/callOutCameraOff.png" alt="cam-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`CAM`}</div>

                </div>
            </div>
            {/* 마이크 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={() => SetIsVoiceTurnOn(prev => !prev)}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {isVoiceoTurnOn ? <img src="../images/callOutMicOn.png" alt="mic-on" /> : <img src="../images/callOutMicOff.png" alt="mic-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`MIC`}</div>

                </div>
            </div>
            {/* 연결 끊기 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[370px]"}>
                <div className={"w-[75px] h-[75px]  cursor-pointer"}>
                    <img src="../images/callOutQuit.png" alt="quit" />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`DISCONNECT`}</div>
                </div>
            </div>

            {/* 방 종료 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                <div className={"w-[55px] h-[55px]  cursor-pointer"}>
                    <img src="../images/callOutRoomEnd.png" alt="quit" />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`CLOSE`}</div>
                </div>
            </div>

        </div>
    )
}

export default TestCallUtil
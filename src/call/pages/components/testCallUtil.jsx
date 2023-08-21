import React from 'react'


const TestCallUtil = ({ isVideoTurnOn, SetIsVideoTurnOn, isVoiceoTurnOn, SetIsVoiceTurnOn, role }) => {
    const isTest = true
    const isRealService = isTest && role === 'staff'
    return (
        <div className={"flex justify-center items-center flex-row mt-[110px]"}>
            {/* 팬 리스트 */}
            {isRealService && <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} >
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    <img src="../images/callOutFanList.png" alt='fanlist' />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`FAN LIST`}</div>

                </div>
            </div>}
            {/* 강퇴 */}
            {isRealService && <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} >
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    <img src="../images/callOutBan.png" alt='ban' />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`OUT`}</div>

                </div>
            </div>}
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

            {/* 다음 사람 */}
            {isRealService && <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"}>
                <div className={`w-[75px] h-[75px]  ${isRealService ? "cursor-pointer" : ""}`}>
                    {isRealService ? <img src="../images/callOutNext.png" alt="next" /> : <img src="../images/callOutNextOff.png" alt="next" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`NEXT`}</div>
                </div>
            </div>
            }

            {/* 나가기 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                <div className={"w-[75px] h-[75px]  cursor-pointer"}>
                    <img src="../images/callOutQuit.png" alt="quit" />
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`QUIT`}</div>
                </div>
            </div>


        </div>
    )
}

export default TestCallUtil
import React, {useState, useEffect} from "react";
import {SizeLayout, VideoLayout, SideBar} from "../../shared/Layout";
import Header from "../../shared/Header";
import {Button} from "../../element";
import {MobilePopup} from "../../shared/MobilePopup";
import {secondsToMins} from "../../utils/convert";
import {WaitRoomController as controller} from "../controller/waitRoomController"
import WaitingMents from "./components/WaitingMents";


const Waiting2 = () => {

    const {
        isMobile, userInfo, isCallFinished, connectTest, goToArtistRoom,
        closePopup, fanLogout, myWaitInfo, isAvailableCall, isReadyTest, isMobPopupOpen

    } = controller();
    console.log(userInfo)
    // const isMobile = false
    const fan_name = 'lovejisoo99'
    const img_url = "https://images8.alphacoders.com/132/1321612.jpeg"
    // const userInfo = {isCallTested: false}
    // const isCallFinished = false
    // const isAvailableCall = false
    // const isReadyTest = true

    if (!isMobile) {
        return (
            <SizeLayout isWaitingRoom={true}>
                <Header/>
                <div className="flex flex-col">
                    {/* 대기 화면*/}
                    <div className={"min-h-[781px]"}>
                        <img src={img_url}/>
                    </div>


                    <div className={"mt-[59px] mx-[66px] mb-[72px] flex"}>
                        {/* 멘트 */}
                        <div className={"w-[68px] mr-[35px]"}>
                            <img src={"../images/roomIcon.png"} alt={"roomIcon"}/>
                        </div>

                        <div className={"text-[#444] font-medium mr-[87px]"}>
                            <WaitingMents isCallTested={userInfo.isCallTested} isCallFinished={isCallFinished}
                                          fan_name={fan_name}/>
                        </div>

                        {/* 버튼 */}
                        <div className={'flex justify-center items-center'}>
                            <button
                                disabled={!isReadyTest}
                                className={`w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer  text-white font-medium ${isReadyTest ? "bg-[#00cace]" : "bg-[#c8c8c8]" } flex items-center justify-center mr-[35px]`}>
                                연결테스트 시작
                            </button>
                            <button
                                disabled={!isAvailableCall}
                                className={`w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer text-white font-medium ${isAvailableCall ? "bg-[#00cace]" : "bg-[#c8c8c8]"} flex items-center justify-center`}>통화
                                시작
                            </button>

                            {userInfo.isCallTested && isCallFinished &&
                                <button
                                    className={"w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer text-white font-medium bg-[#00cace] flex items-center justify-center ml-[215px]"}>나가기</button>}
                        </div>
                    </div>
                </div>
            </SizeLayout>
        )
    }

};

export default Waiting2;
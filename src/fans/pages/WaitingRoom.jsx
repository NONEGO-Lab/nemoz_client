import React, {useState, useEffect} from "react";
import {SizeLayout, VideoLayout, SideBar} from "../../shared/Layout";
import Header from "../../shared/Header";
import {MobilePopup} from "../../shared/MobilePopup";
import {WaitRoomController as controller} from "../controller/waitRoomController"
import WaitingMents from "./components/WaitingMents";
import {useSelector} from "react-redux";


const WaitingRoom = () => {
    const {
        isMobile, userInfo, isCallFinished, connectTest, goToArtistRoom,
        closePopup, fanLogout, myWaitInfo, isAvailableCall, isReadyTest, isMobPopupOpen
    } = controller();

    const img_url = "https://images8.alphacoders.com/132/1321612.jpeg"

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
                                          myWaitInfo={myWaitInfo}
                                          fan_name={userInfo.username}/>
                        </div>

                        {/* 버튼 */}
                        <div className={'flex justify-center items-center'}>
                            <button
                                disabled={!isReadyTest}
                                onClick={connectTest}
                                className={`w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer  text-white font-medium ${isReadyTest ? "bg-[#00cace]" : "bg-[#c8c8c8]"} flex items-center justify-center mr-[35px]`}>
                                연결테스트 시작
                            </button>
                            <button
                                disabled={!isAvailableCall}
                                onClick={goToArtistRoom}
                                className={`w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer text-white font-medium ${isAvailableCall ? "bg-[#00cace]" : "bg-[#c8c8c8]"} flex items-center justify-center`}>통화
                                시작
                            </button>

                            {userInfo.isCallTested && isCallFinished &&
                                <button
                                    onClick={fanLogout}>
                                    className={"w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer text-white font-medium bg-[#00cace] flex items-center justify-center ml-[215px]"}>나가기</button>}
                        </div>
                    </div>
                </div>
            </SizeLayout>
        )
    } else {
        return (
            <div className={"bg-gray-200 w-[100vw] h-[100vh]"}>
                <div className={"flex justify-center items-center pt-[100px]"}>
                    대기화면입니다...
                </div>

                {
                    isMobPopupOpen && (
                        userInfo.isCallTested ?
                            isCallFinished ?
                                <MobilePopup type={"endCall"} closePopup={closePopup}/>
                                :
                                <MobilePopup type={"waiting"} closePopup={closePopup}
                                             isAvailableCall={isAvailableCall}/>
                            : <MobilePopup type={"goToConnectTest"} closePopup={closePopup}
                                           isReadyTest={isReadyTest}/>
                    )
                }

            </div>
        )
    }

};

export default WaitingRoom;
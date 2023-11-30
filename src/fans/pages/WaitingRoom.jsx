import React from "react";
import {SizeLayout} from "../../shared/Layout";
import Header from "../../shared/Header";
import {WaitRoomController as controller} from "../controller/waitRoomController";
import WaitingMents from "./components/WaitingMents";
import ReactPlayer from "react-player";
import DeviceSetting from "../../test/pages/DeviceSetting";
import MobileHeader from "shared/MobileHeader";
import MobileDeviceSetting from "test/pages/MobileDeviceSetting";
import {secondsToMins} from "../../utils/convert";

const WaitingRoom = () => {
    const {
        isMobile,
        userInfo,
        isCallFinished,
        connectTest,
        goToArtistRoom,
        eventTitle,
        closePopup,
        fanLogout,
        myWaitInfo,
        isAvailableCall,
        isReadyTest,
        toggleDeviceSetting,
    } = controller();

    const wait_url = myWaitInfo?.waiting?.std_screen_url;
    const isVideo = myWaitInfo?.waiting?.mimetype?.includes("video");
    const isTest = myWaitInfo?.fan_info?.is_tested === 0

    if (!isMobile) {
        return (
            <SizeLayout isWaitingRoom={true}>
                <Header/>
                <div className="flex flex-col">
                    {/* 대기 화면*/}
                    {!isVideo ? (
                        wait_url ? (
                            <div className={"min-h-[781px]"}>
                                <img src={wait_url} alt={"waiting?"} className={"max-h-[781px] object-cover m-auto"}/>
                            </div>
                        ) : (
                            <div
                                className={
                                    "min-h-[781px] text-[36px] flex items-center justify-center"
                                }
                            >
                                이벤트 대기중
                            </div>
                        )
                    ) : (
                        <ReactPlayer
                            width={"1366px"}
                            height={"781px"}
                            url={wait_url}
                            // muted={true}
                            playing={true}
                            controls={true}
                        />
                    )}

                    <div className={"mt-[59px] mx-[66px] mb-[72px] flex"}>
                        {/* 멘트 */}
                        <div className={"w-[68px] mr-[35px]"}>
                            <img src={"../images/roomIcon.png"} alt={"roomIcon"}/>
                        </div>

                        <div className={"text-[#444] font-medium mr-[86.5px]"}>
                            <WaitingMents
                                isReadyTest={isReadyTest}
                                isCallTested={userInfo.isCallTested}
                                isCallFinished={isCallFinished}
                                myWaitInfo={myWaitInfo}
                                eventTitle={eventTitle}
                                fan_name={userInfo.username}
                            />
                        </div>

                        {/* 버튼 */}
                        <div className={"flex justify-center items-center"}>
                            <button
                                disabled={!isReadyTest}
                                onClick={connectTest}
                                className={`w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer  text-white font-medium ${
                                    isReadyTest ? "bg-[#00cace]" : "bg-[#c8c8c8]"
                                } flex items-center justify-center mr-[35px]`}
                            >
                                연결테스트 시작
                            </button>
                            <button
                                disabled={!isAvailableCall}
                                onClick={goToArtistRoom}
                                className={`w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer text-white font-medium ${
                                    isAvailableCall ? "bg-[#00cace]" : "bg-[#c8c8c8]"
                                } flex items-center justify-center`}
                            >
                                통화 시작
                            </button>

                            {isCallFinished && (
                                <button
                                    onClick={fanLogout}
                                    className={`w-[180px] min-h-[50px] rounded-[25px] text-[19px] cursor-pointer text-white font-medium bg-[#00cace] flex items-center justify-center ml-[215px]`}
                                >
                                    나가기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {toggleDeviceSetting && <DeviceSetting/>}
            </SizeLayout>
        );
    } else {
        return (
            <div className={"bg-white w-[100vw] "} style={{height: 'calc(var(--vh, 1vh) * 100)'}}>

                <MobileHeader/>
                <div
                    className={
                        "flex flex-col justify-center items-center pt-[50px] top-55 w-[100vw]"
                    }
                >
                    <img className="w-[68px] m-[16px]" src={"../images/roomIcon.png"}/>
                    <h1 className="text-[#444] font-[600] text-[1.4rem] text-center">
                        {eventTitle}
                    </h1>

                    <div className="my-[1.5rem]">
                        {!isVideo ? (
                            wait_url ? (
                                <div>
                                    <img src={wait_url} alt={"waiting"}/>
                                </div>
                            ) : (
                                <div
                                    className={
                                        "min-h-[331px] text-[1.2rem] flex items-center justify-center"
                                    }
                                >
                                    이벤트 대기중
                                </div>
                            )
                        ) : (
                            <ReactPlayer
                                width={"100%"}
                                url={wait_url}
                                // muted={true}
                                playing={true}
                                controls={true}
                            />
                        )}
                    </div>
                    {isTest ?
                        <>
                            <p className="text-[1.2rem] text-[#444] font-[400] m-[10px] text-center">
                                <span className="font-[700] ">{userInfo.username}</span>님의 <br/>
                                테스트 순서입니다
                            </p>
                            <p className="text-[1.2rem] text-[#5bc7cc] font-[700]">
                                연결 테스트를 진행해주세요
                            </p>
                        </> :

                        <>
                            <p className="text-[1.2rem] text-[#444] font-[400] m-[10px] text-center">
                                <span className="font-[700] ">{userInfo.username}</span>님의 <br/>
                                대기번호는 {myWaitInfo.waiting?.orders}번입니다.
                            </p>
                            <p className="text-[1.2rem] text-[#5bc7cc] font-[700]">
                                예상 대기 시간은 {secondsToMins(myWaitInfo.waiting?.wait_seconds)}분입니다.
                            </p></>

                    }


                </div>

                {/* button area */}
              <div className="w-[100%] px-[5vw] mt-[5vw]">
                {(isTest)
                    && (
                        <button
                            disabled={!isReadyTest}
                            onClick={connectTest}
                            className={`w-[100%] min-h-[25px] rounded-[10px] py-[1.2rem] text-[1.2rem] cursor-pointer  text-white font-medium ${
                                isReadyTest ? "bg-[#00cace]" : "bg-[#444444]"
                            } flex items-center justify-center mr-[35px]`}
                        >
                          연결테스트 시작
                        </button>
                    )
                }
                {(!isTest)
                    && (
                        <button
                            disabled={!isAvailableCall}
                            onClick={goToArtistRoom}
                            className={`w-[100%] min-h-[50px] rounded-[10px] text-[1.2rem] cursor-pointer  text-white font-medium ${
                                isAvailableCall ? "bg-[#00cace]" : "bg-[#c8c8c8]"
                            } flex items-center justify-center`}
                        >
                          통화 시작
                        </button>
                    )
                }
              </div>
                {toggleDeviceSetting &&
                    <MobileDeviceSetting closeDeviceSetting={closePopup}/>}
            </div>
        );
    }
};

export default WaitingRoom;

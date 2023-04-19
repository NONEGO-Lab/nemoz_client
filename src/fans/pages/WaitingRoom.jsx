import React, {useState, useEffect} from "react";
import {SizeLayout, VideoLayout, SideBar} from "../../shared/Layout";
import Header from "../../shared/Header";
import {Button} from "../../element";
import {MobilePopup} from "../../shared/MobilePopup";
import {secondsToMins} from "../../utils/convert";
import { WaitRoomController as controller} from "../controller/waitRoomController"


const WaitingRoom = () => {

  const { isMobile, userInfo,  isCallFinished, connectTest, goToArtistRoom,
    closePopup, fanLogout, myWaitInfo, isAvailableCall, isReadyTest, isMobPopupOpen

  } = controller();

  if (!isMobile) {
    return (
        <SizeLayout>
          <Header/>
          <div className="flex">
            <VideoLayout title={"대기화면"}>
              <div className="flex space-between bg-white h-[550px] p-[20px] mx-[20px]">
                대기 영상이 들어갑니다.
              </div>
            </VideoLayout>
            <SideBar>
              {/*영상통화 시작 전 or 시작 후의 사이드바를 state 에 따라 분기할 예정*/}
              {
                userInfo.isCallTested ?
                    isCallFinished ?
                        <div>
                          <div className={"ml-4 mt-4"}>
                            <div>
                              <span className={"font-bold"}>{myWaitInfo.artist_name}</span>
                              (와/과)의 영상 통화가 종료되었습니다.
                            </div>
                            <div className="mt-2">영상 통화는
                              <span className={"font-bold"}> 예정일 </span>
                              이후
                            </div>

                            <div className="mt-2 mb-[100px]">녹화된 영상으로 제공됩니다.</div>
                          </div>
                          <Button
                              width={"w-[200px]"}
                              height={"h-[50px]"}
                              margin={"m-auto flex justify-center items-center"}
                              _onClick={fanLogout}>
                            로그아웃
                          </Button>
                        </div>
                        :
                        <div>
                          <div className={"ml-4"}>
                            <div className="border-b-2 border-black pb-2 font-bold">
                              남은시간: 통화 대기중
                            </div>
                            <div className="mt-[40px] leading-6">
                              {myWaitInfo.fan_name}님의 대기번호는 <br/>
                              <span className={"font-bold"}>{myWaitInfo.orders}번</span>입니다.
                            </div>
                            <div className="mt-[30px]">
                              예상 대기 시간은
                              <span className={"font-bold ml-1"}>
                                                    {secondsToMins(myWaitInfo.wait_seconds)}
                                                </span>분입니다.
                            </div>
                            <div className="mt-[30px] mb-[60px]">
                              곧 <span className="font-bold">{myWaitInfo.artist_name}</span>와 만나요!
                            </div>
                          </div>
                          <Button
                              margin={"flex items-center justify-center m-auto mt-[150px]"}
                              width={"w-[180px]"}
                              _onClick={goToArtistRoom}
                              disabled={!isAvailableCall}
                          >
                            통화 시작하기
                          </Button>
                        </div>

                    :
                    <Button
                        disabled={!isReadyTest}
                        margin={"flex items-center justify-center m-auto mt-[300px]"}
                        width={"w-[180px]"}
                        _onClick={connectTest}>
                      연결 테스트 하기
                    </Button>

              }
            </SideBar>
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
import React from "react";
import { SizeLayout, VideoLayout, SideBar } from "../../shared/Layout";
import Header from "../../shared/Header";
import { Button } from "../../element";
import FanInfo from "../../fans/pages/FanInfo";
import { ReactionButton, ReactionBoard } from "../../reaction/pages/components/index";
import Video from "../../video/pages/Video";
import ConnectInfo from "../../room/components/ConnectInfo";
import { MobilePopup } from "../../shared/MobilePopup";
import dots from "../../static/image/dots.png";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FanDetail from "../../fans/pages/FanDetail";
import { useVideo } from "../controller/hooks/useVideo";
import {AddUser, WaitingList, Timer, SettingBar } from "./components"
import { CallController as controller } from "../controller/callController";
import {useMobileView} from "../controller/hooks/useMobileView";
import { AdminProvider, ArtistProvider, StaffProvider, FanProvider } from "../../provider";

const VideoContainer = () => {

  const { videoMuteHandler, audioMuteHandler, subscribers,
    publisher, publisherAudio, publisherVideo } = useVideo();

  const { roomInfo, leftTimeRef, toastList,
    endRoom, outRoom, showTime, staffNoticeList, userInfo, setIsOpenWaitingModal, currentFan,
    setCurrentFan, setIsOpenAddUser, fanDetailOpenHandler, isOpenAddUser, isOpenFanDetail,
    waitingFanInfo, setIsOpenFanDetail, isOpenLeftTime, toBack, isOpenWaitingModal
  } = controller();

  const { isMobile, changeMobVideoSize, isBigScreen, makeBigScreen, isWebFullScreen, setIsWebFullScreen,
    isOpenMobileSetting, setOpenMobileSetting, webFullScreenSize, webFullScreenSizeOther } = useMobileView();


  if(isMobile) {
    return (
        <div className="w-[100%] h-[100vh] border border-gray-200">
          <div className="w-[100%] h-[50px]">
            <div
                onClick={toBack}
                className={"ml-4 pt-3"}> &lt; </div>
          </div>
          <div>
            {
              subscribers.map((subscriber) => {
                if(subscriber.role !== "staff") {
                  return (
                      <div className={`${changeMobVideoSize(isBigScreen.sub)} flex bg-gray-200`}>
                        {/*상대방 화면*/}
                        {
                          subscribers.map((subscriber, i) => {
                            if(subscriber.role !== "staff") {
                              return (
                                  <div id={"sub"} key={i}>
                                    <Video streamManager={subscriber}/>
                                  </div>
                              )
                            }
                          })
                        }
                      </div>
                  )
                }
              })
            }
            {/*내 화면*/}
            { publisher !== undefined &&
                <div id={"pub"} className={`${changeMobVideoSize(isBigScreen.pub)} relative flex bg-gray-300`}>
                  <Video streamManager={publisher}/>
                  {
                    isBigScreen.pub === "default" ?
                        <div>
                          <div className="flex absolute left-[20px] top-[20px]">
                            <div className={"mr-4 cursor-pointer text-[12px]"} onClick={audioMuteHandler}>
                              { publisherAudio ? "오디오 켜짐" : "오디오 꺼짐" }
                            </div>
                            <div className={"cursor-pointer text-[12px]"} onClick={videoMuteHandler}>
                              { publisherVideo ? "비디오 켜짐" : "비디오 꺼짐" }
                            </div>
                          </div>
                          <div className={`${isOpenLeftTime ? "visible" : "invisible"}`}>
                            <Timer type={"default"} leftTimeRef={leftTimeRef}/>
                          </div>


                          <div
                              onClick={() => {
                                setOpenMobileSetting((prev) => !prev);
                              }}
                              className="absolute top-[20px] right-[20px]">
                            <img className="w-[20px]" src={dots} alt={"setting-dots"}/>
                          </div>
                        </div>
                        :
                        <div>
                          <div className="flex absolute left-[10px] top-[2px]">
                            <div className={"mr-2 text-[10px]"} onClick={audioMuteHandler}>
                              { publisherAudio ? "오디오 켜짐" : "오디오 꺼짐" }
                            </div>
                            <div className={"text-[10px]"} onClick={videoMuteHandler}>
                              { publisherVideo ? "비디오 켜짐" : "비디오 꺼짐" }
                            </div>
                          </div>

                          <div className={`${isOpenLeftTime ? "visible" : "invisible"}`}>
                            <Timer type={"small"} leftTimeRef={leftTimeRef}/>
                          </div>
                          <div
                              onClick={() => {
                                setOpenMobileSetting((prev) => !prev);
                              }}
                              className="absolute top-[20px] right-[10px]">
                            <img className="w-[15px]" src={dots} alt={"setting-dots"}/>
                          </div>
                        </div>
                  }
                  <ReactionButton/>
                </div>
            }
          </div>
          <ToastContainer
              className="absolute"
              position="bottom-center"
              autoClose={3000}
              hideProgressBar
          />
          {
              isOpenMobileSetting &&
              <MobilePopup
                  showTime={showTime}
                  makeBigScreen={makeBigScreen}
                  closePopup={() => setOpenMobileSetting(false)}/>
          }
          { toastList.length !==0 && <ReactionBoard/> }
        </div>
    )
  } else {
    //웹 화면
    return (
        <SizeLayout>
          <Header/>
          <div className="flex">
            <VideoLayout title={"A 아티스트 팬미팅 방"} buttonText={"나가기"} _onClick={outRoom}
                         _endClick={endRoom} endText={"방 종료"} role={userInfo.role}>
              <div className="flex space-between bg-white h-[480px] p-[20px] mx-[20px]">
                {/*비디오 영역*/}
                {/* 상대방 화면 = subscriber*/}
                {
                  subscribers.map((subscriber, i) => {
                    if(subscriber.role !== "staff") {
                      return (
                          <div id={"sub"} key={i} className={`relative ${webFullScreenSize} h-[360px] border-2 border-box border-black m-auto flex`}>
                            {
                                isWebFullScreen.open && isWebFullScreen.type === "sub" &&
                                <div
                                    onClick={()=> setIsWebFullScreen({open: false, type: null})}
                                    className="absolute top-0 right-2 cursor-pointer z-20">닫기</div>
                            }
                            {
                                !isWebFullScreen.open && <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setIsWebFullScreen({ open: true, type: "sub" });
                                    }} className="absolute top-[50px] right-2 cursor-pointer z-20">
                                  전체 화면
                                </div>
                            }

                            <Video streamManager={subscriber}/>
                            <div className={"flex absolute bottom-[-30px] font-bold text-lg"}>
                              {subscriber.username}
                            </div>
                          </div>
                      )
                    }
                  })
                }

                {/* 내 화면 = publisher */}
                {
                    publisher !== undefined && userInfo.role !== "staff" &&
                    <div id={"pub"}
                         className={`relative ${webFullScreenSizeOther} h-[360px] border-2 border-box border-black m-auto`}>
                      {
                          isWebFullScreen.open && isWebFullScreen.type === "pub" &&
                          <div
                              onClick={() => setIsWebFullScreen({ open: false, type: null })}
                              className="absolute top-0 right-2 cursor-pointer z-20">
                            닫기</div>
                      }

                      <Video streamManager={publisher}/>
                      <div className={"absolute bottom-[-30px] font-bold text-lg"}>{userInfo.username}</div>
                      <div className="flex absolute">
                        <div className={"mr-4 cursor-pointer"} onClick={audioMuteHandler}>
                          { publisherAudio ? "오디오 켜짐" : "오디오 꺼짐" }
                        </div>
                        <div className={"cursor-pointer"} onClick={videoMuteHandler}>
                          { publisherVideo ? "비디오 켜짐" : "비디오 꺼짐" }
                        </div>
                      </div>

                    </div>
                }
              </div>

              {/*하단 영역*/}
              <div
                  className="relative m-auto h-[90px] px-[20px] w-[calc(100%-40px)]
                                        bg-white border-black border-t pt-6">
                  <FanProvider>
                    <div className={"flex justify-center"}>
                      <ReactionButton/>
                    </div>
                  </FanProvider>
                  <ArtistProvider>
                    <div className={"flex justify-center"}>
                      <ReactionButton/>
                    </div>
                  </ArtistProvider>
                <StaffProvider>
                  <div className="flex items-center justify-between">
                    <ConnectInfo staffNoticeList={staffNoticeList}/>
                    <SettingBar setIsOpenWaitingModal={setIsOpenWaitingModal}
                                currentFan={currentFan} leftTimeRef={leftTimeRef}/>
                  </div>
                </StaffProvider>
                <ToastContainer
                    className="absolute"
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar
                />
              </div>
            </VideoLayout>
            <SideBar>
              <Timer leftTimeRef={leftTimeRef}/>
                  <FanProvider>
                    <ReactionBoard/>
                    <div className={"w-[150px] m-auto"}>
                      <Button
                          _onClick={() => setIsWebFullScreen({ open: true, type: "sub" })}
                          width={"w-[150px]"}
                          margin={"my-[20px]"}
                          disabled={(subscribers.length === 0 || subscribers[0].role === "staff")}>
                        상대방 크게 보기
                      </Button>
                      <Button
                          _onClick={() => setIsWebFullScreen({ open: false, type: "null" })}
                          width={"w-[150px]"}
                          disabled={subscribers.length === 0}>
                        반반으로 보기
                      </Button>
                    </div>
                  </FanProvider>
                  <AdminProvider>
                    { toastList.length === 0 ?
                        <FanInfo
                            currentFan={currentFan}
                            setCurrentFan={setCurrentFan}
                            type={"call"}
                        />
                        :
                        <ReactionBoard/>
                    }
                  </AdminProvider>
            </SideBar>
          </div>

          {/*모달 영역*/}
          { isOpenWaitingModal &&
              <WaitingList
                  addUserOpenHandler={() => setIsOpenAddUser(true)}
                  fanDetailOpenHandler={fanDetailOpenHandler}
                  curRoomId={roomInfo.room_id}
                  setOnModal={() => setIsOpenWaitingModal(false)}/>
          }

          { isOpenAddUser && <AddUser setOnModal={() => setIsOpenAddUser(false)}/> }
          { isOpenFanDetail && <FanDetail currentFanId={waitingFanInfo.fan_id} setOnModal={() => setIsOpenFanDetail(false)}/>}
        </SizeLayout>
    )
  }
}

export default VideoContainer;



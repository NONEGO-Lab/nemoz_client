import React, { useState } from "react";
import Header from "../../../shared/Header";
import VideoArea from "./VideoArea";
import { SizeLayout } from "../../../shared/Layout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserHistory } from "history";
import { useReaction } from "../../../reaction/controller/useReaction";
import { useVideo } from "../../controller/hooks/useVideo";
import { CallController as controller } from "../../controller/callController";
import MainCallUtil from "./MainCallUtil";
import StaffVideoArea from "./StaffVideoArea";
import Timer from "./Timer";
import { useMobileView } from "../../controller/hooks/useMobileView";
import WaitingList from "./WaitingList";
import FanDetail from "../../../fans/pages/components/FanDetail";
import AddUser from "./AddUser";
import { RoomListController } from "../../../room/controller/roomListController";

const VideoContainer2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subscribedArtistInfo = useSelector(
    (state) => state.video.subscribedArtistInfo
  );
  const subscribedFanInfo = useSelector(
    (state) => state.video.subscribedFanInfo
  );

  const {
    videoMuteHandler,
    audioMuteHandler,
    subscribers,
    publisher,
    publisherAudio,
    publisherVideo,
    routeToFanList,
  } = useVideo();
  const {
    roomInfo,
    leftTimeRef,
    endRoom,
    outRoom,
    userInfo,
    currentFan,
    setCurrentFan,
    warnHandler,
    warnCnt,
    kickOutHandler,
    setWarnCnt,
    emoticonToggle,
    setEmoticonToggle,
    sendLeftTimeHandler,
    sendReactionHandler,
    toasts,
    setToasts,
    addToast,
    removeToast,
    finishCurrentCall,
    toggleNext,
    setToggleNext,
      fanEnterNoti
  } = controller();
  const {
    addUserOpenHandler,
    fanDetailOpenHandler,
    setCurrentRoom,
    currentRoom,
    isEmptyCheck,
    setCurrentFanInfo,
    currentFanInfo,
    isOpenAddUser,
    setIsOpenAddUser,
    eventList,
  } = RoomListController();
  const [toggleFanLetter, setToggleFanLetter] = useState(false);
  const {
    isMobile,
    changeMobVideoSize,
    isBigScreen,
    makeBigScreen,
    isWebFullScreen,
    setIsWebFullScreen,
    isOpenMobileSetting,
    setOpenMobileSetting,
    webFullScreenSize,
    webFullScreenSizeOther,
  } = useMobileView();

  const { artist_name, room_name, reserved_time } = roomInfo;
  const isStaff = userInfo.role === "staff";
  let isFullScrennMobile = true;
  if (isMobile) {
    return (
      <>
        <div className="w-[100vw] h-[100vh] absolute left-0 top-0">
          {/* mobile header */}
          {isFullScrennMobile ? null : (
            <div className="w-[100%] h-[56px] flex justify-start p-[1rem] items-center">
              <img
                className="w-[15px] h-[25px] mr-[1.2rem]"
                src="../images/leftArrowIcon.png"
              />
              <h1 className="text-[1.2rem] font-[600]">매칭 제목</h1>
            </div>
          )}

          {/* mobile videos */}
          {isFullScrennMobile ? (
            <div className="bg-[yellow] w-[100vw] h-[100vh] ">texttest</div>
          ) : (
            <div>
              <div className="bg-[yellow] w-[100vw] h-[80vw]">
                {/* 비디오 코드.. */}
              </div>
              <div className="bg-[green] w-[100vw] h-[80vw]">
                {/* 비디오 코드.. */}
              </div>
            </div>
          )}

          {/* action buttons ... */}
          <div
            style={
              isFullScrennMobile
                ? {
                    margin: "-50vw 0",
                    transform: "translate(-100%, -50%) rotate(90deg)",
                    transformOrigin: "bottom right",
                  }
                : {}
            }
          >
            <MainCallUtil
              custonStyle="flex justify-center items-center flex-row absolute bottom-[1rem] w-[100vw]"
              audioMuteHandler={audioMuteHandler}
              videoMuteHandler={videoMuteHandler}
              quitTest={false}
              role={userInfo.role}
              dispatch={dispatch}
              navigate={navigate}
              currentFan={currentFan}
              setCurrentFan={setCurrentFan}
              subscribers={subscribers}
              routeToFanList={routeToFanList}
              endRoom={endRoom}
              outRoom={outRoom}
              leftTimeRef={leftTimeRef}
              warnHandler={warnHandler}
              setWarnCnt={setWarnCnt}
              kickOutHandler={kickOutHandler}
              sendLeftTimeHandler={sendLeftTimeHandler}
              toasts={toasts}
              setToasts={setToasts}
              addToast={addToast}
              removeToast={removeToast}
              setCurrentRoom={setCurrentRoom}
              roomInfo={roomInfo}
              toggleNext={toggleNext}
              setToggleNext={setToggleNext}
              finishCurrentCall={finishCurrentCall}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <SizeLayout isVideo={true} width={"w-[1366px]"} height={"min-h-[1024px]"}>
      <Header />
      <div className={"bg-main_theme flex flex-col justify-center"}>
        {!isWebFullScreen && (
          <>
            <div
              className={
                "flex justify-center pt-[100px] text-[23px] text-[#444] font-[500] mb-[80px]"
              }
            >
              <span>
                <img
                  className="w-[30px] h-[30px]"
                  src="../images/roomIcon.png"
                  alt="room-icon"
                />
              </span>
              <span className="ml-[10px]">{room_name}</span>
            </div>

            <div className="flex justify-center mb-[-30px]">
              <span className="w-[125px] h-[30px] text-[16px] text-[#444] flex items-center justify-center">
                <Timer leftTimeRef={leftTimeRef} />
                <div className="w-[8px] h-[8px] rounded-full bg-[#02c5cb] ml-[6px]" />
              </span>
            </div>
          </>
        )}
        {isStaff ? (
          <StaffVideoArea
            subscribedArtistInfo={subscribedArtistInfo}
            subscribedFanInfo={subscribedFanInfo}
            artistName={artist_name}
            fanInfo={currentFan}
            roomInfo={roomInfo}
            warnCnt={warnCnt}
            publisher={publisher}
            toasts={toasts}
            toggleFanLetter={toggleFanLetter}
            setToggleFanLetter={setToggleFanLetter}
            removeToast={removeToast}
            reserved_time={reserved_time}
            fanEnterNoti={fanEnterNoti}

          />
        ) : (
          <VideoArea
            userInfo={userInfo}
            fanInfo={currentFan}
            publisher={publisher}
            subscriber={subscribers[0]}
            subscribedArtistInfo={subscribedArtistInfo}
            subscribedFanInfo={subscribedFanInfo}
            publisherVideo={audioMuteHandler}
            publisherAudio={videoMuteHandler}
            roomInfo={roomInfo}
            artistName={artist_name}
            warnCnt={warnCnt}
            emoticonToggle={emoticonToggle}
            setEmoticonToggle={setEmoticonToggle}
            toasts={toasts}
            sendReactionHandler={sendReactionHandler}
            removeToast={removeToast}
            isWebFullScreen={isWebFullScreen}
            setIsWebFullScreen={setIsWebFullScreen}
            toggleFanLetter={toggleFanLetter}
            setToggleFanLetter={setToggleFanLetter}
            reserved_time={reserved_time}
            fanEnterNoti={fanEnterNoti}
            leftTimeRef={leftTimeRef}
          />
        )}

        {/* 기능 Component */}
        <MainCallUtil
          audioMuteHandler={audioMuteHandler}
          videoMuteHandler={videoMuteHandler}
          quitTest={false}
          role={userInfo.role}
          dispatch={dispatch}
          navigate={navigate}
          currentFan={currentFan}
          setCurrentFan={setCurrentFan}
          subscribers={subscribers}
          routeToFanList={routeToFanList}
          endRoom={endRoom}
          outRoom={outRoom}
          leftTimeRef={leftTimeRef}
          warnHandler={warnHandler}
          setWarnCnt={setWarnCnt}
          kickOutHandler={kickOutHandler}
          sendLeftTimeHandler={sendLeftTimeHandler}
          toasts={toasts}
          setToasts={setToasts}
          addToast={addToast}
          removeToast={removeToast}
          setCurrentRoom={setCurrentRoom}
          roomInfo={roomInfo}
          toggleNext={toggleNext}
          setToggleNext={setToggleNext}
          finishCurrentCall={finishCurrentCall}
        />
      </div>
      {currentRoom.room_id && (
        <WaitingList
          curRoomId={currentRoom.room_id}
          eventId={currentRoom.event_id}
          fanDetailOpenHandler={fanDetailOpenHandler}
          setOnModal={() => setCurrentRoom({})}
          addUserOpenHandler={addUserOpenHandler}
        />
      )}
      {!isEmptyCheck(currentFanInfo) && (
        <FanDetail
          currentFanId={currentFanInfo["fan_id"]}
          eventId={currentRoom.event_id}
          setOnModal={() => setCurrentFanInfo({})}
        />
      )}
      {isOpenAddUser && (
        <AddUser
          eventList={eventList}
          currentRoom={currentRoom}
          eventId={currentRoom.event_id}
          roomId={currentRoom.room_id}
          setOnModal={() => setIsOpenAddUser((prev) => !prev)}
        />
      )}
    </SizeLayout>
  );
};

export default VideoContainer2;

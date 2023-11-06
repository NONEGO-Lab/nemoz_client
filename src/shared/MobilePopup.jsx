import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { attendeeApi } from "../fans/data/attendee_data";
import { secondsToMins } from "../utils/convert";
import {setIsCallFinished} from "../redux/modules/videoSlice";

export const MobilePopup = ({ closePopup, type, makeBigScreen, showTime, isReadyTest, isAvailableCall }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const eventId = useSelector((state) => state.event.eventId);

  const [myWaitInfo, setMyWaitInfo] = useState({});
  const userInfo = useSelector((state) => state.user.userInfo);
  const roomInfo = useSelector((state) => state.common.roomInfo);
  const subscribers = useSelector((state) => state.video.subscribers);

  const getMyWaitingInfo = async () => {
    try {
      const response = await attendeeApi.waitFan(eventId, userInfo.id);
      if(response === "All meet is ended") {
        dispatch(setIsCallFinished());
      } else {
        setMyWaitInfo(response);
      }

    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    getMyWaitingInfo();
  },[])

  const showContentByType = (type) => {
    switch (type) {
      case "endCall":
        return (
            <div className="mb-[50px] mt-[70px]">
              <div className="px-4 leading-8 text-ml">
                {myWaitInfo.artist_name} (와/과)의 영상 통화가 종료되었습니다.
              </div>
              <div className="px-4 leading-8 text-ml">영상 통화는 예정일 이후</div>
              <div className="px-4 pb-[50px] leading-8 text-ml">녹화된 영상으로 제공됩니다.</div>
              <div
                  onClick={closePopup}
                  className="mb-2 absolute w-[100%] bottom-0 border-black border-y h-[40px] flex items-center justify-center">
                닫기
              </div>
            </div>
        )
      case "waiting":
        return (
            <div className="mt-[70px] mb-[10px]">
              <div className="px-6 leading-6 text-xl">{myWaitInfo.fan_name}님의 대기번호는 <span className={"font-bold"}>
                        {myWaitInfo.orders}번</span>입니다.</div>
              <div className="px-6 leading-6 mb-6 text-xl">예상 대기 시간은
                <span className={"font-bold"}> {secondsToMins(myWaitInfo.wait_seconds)}분</span>입니다.</div>
              <div className="px-6 pb-[50px] leading-6 text-xl">
                곧 <span className={"font-bold"}>{myWaitInfo.artist_name}</span>와 만나요!
              </div>
              <div
                  onClick={() => navigate(`/video/${roomInfo.room_id}`)}
                  className={`border-black border-y h-[40px] flex items-center justify-center
                                ${isAvailableCall && "font-bold"}
                            `}>
                <button
                    disabled={!isAvailableCall}>
                  통화하러 가기
                </button>
              </div>
              <div
                  onClick={closePopup}
                  className="w-[100%] h-[40px] border-black border-b flex items-center justify-center">
                닫기
              </div>
            </div>
        )
      case "goToConnectTest":
        return (
            <div className="mt-[90px] mb-[20px]">
              <div
                  onClick={() => navigate("/devicetest")}
                  className={`border-black border-y h-[40px] flex items-center justify-center
                                ${isReadyTest && "font-bold"}
                            `}>
                <button
                    disabled={!isReadyTest}
                >
                  연결 테스트 하러가기
                </button>
              </div>
              <div
                  onClick={closePopup}
                  className="w-[100%] h-[40px] border-black border-b flex items-center justify-center">
                닫기
              </div>
            </div>
        )
      case "connectTest":
        return (
            <div className={"mt-[70px]"}>
              <div
                  onClick={() => makeBigScreen("half", subscribers)}
                  className="border-y h-[40px] flex items-center justify-center">
                반반 모드로 보기
              </div>
              <div
                  onClick={() => makeBigScreen("big", subscribers)}
                  className="border-b h-[40px] flex items-center justify-center">
                상대방 크게 보기
              </div>
              <div className="border-b h-[40px] flex items-center justify-center">
                나가기
              </div>
              <div className="h-[40px] flex items-center justify-center"
                   onClick={closePopup}>
                닫기
              </div>
            </div>
        )
      default:
        return (
            <div>
              <div
                  onClick={showTime}
                  className="border-y h-[40px] flex items-center justify-center mt-[70px]">
                남은 시간 표시하기
              </div>
              <div
                  onClick={() => makeBigScreen("half")}
                  className="border-b h-[40px] flex items-center justify-center">
                반반 모드로 보기
              </div>
              <div
                  onClick={() => makeBigScreen("big")}
                  className="border-b h-[40px] flex items-center justify-center">
                상대방 크게 보기
              </div>
              <div

                  className="border-b h-[40px] flex items-center justify-center">
                나가기
              </div>
              <div className="h-[40px] flex items-center justify-center"
                   onClick={closePopup}>
                닫기
              </div>
            </div>
        )
    }
  }

  return (
      <div className="absolute bottom-0 bg-white w-[100%] z-50 animate-fade rounded-t-3xl h-fit border border-black">
        {showContentByType(type)}
      </div>
  )
}
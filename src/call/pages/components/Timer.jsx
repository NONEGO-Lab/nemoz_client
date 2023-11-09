import React, { useEffect, useState } from "react";
import { secondsToTime } from "../../../utils/convert";
import { useInterval } from "../../controller/hooks/useInterval";
import { useSelector, useDispatch } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {sock} from "../../../socket/config";
import {videoEvents} from "../../../socket/events/video_event";


const Timer = ({type, leftTimeRef, inMeet}) => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  })

  const timer = useSelector((state) => state.video.timer);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [meetingTime, setMeetingTime] = useState(0);

  let delay = 1000;

  useInterval(() => {
    if(meetingTime > 0) {
      setMeetingTime((meetingTime) => meetingTime - 1);
      leftTimeRef.current = meetingTime - 1;
    }
  }, delay);

  useEffect(() => {
    if (timer === 0) {
      return;
    }

    if (timer === null) {
      setMeetingTime(0);
      return;
    }

    if (leftTimeRef.current > 0) {
      setMeetingTime(leftTimeRef.current);
    } else {
      setMeetingTime(timer);
    }
  }, [timer]);


  useEffect(() => {
    if(meetingTime < 0) {
      delay = null;
    }
  },[delay]);


  useEffect(() => {
    sock.on("reqLeftTime", (room) => videoEvents.reqLeftTime({ room, leftTimeRef }));
    sock.on("leftTime", (time) => videoEvents.leftTime({ time, dispatch, userInfo }));

    return () => {
      sock.off("reqLeftTime");
      sock.off("leftTime");
    }
  },[]);

  if(inMeet){
    return(
        <div className={`text-[1.2rem] font-medium text-white`}> {secondsToTime(meetingTime)}</div>
    )
  }


  return (
      <>
        {
          isMobile ?
              type === "default" ?
                  <div className={"text-sm w-[fit] absolute right-[45px] top-[20px] bg-white rounded-[10px] px-2"}>
                    {secondsToTime(meetingTime)}
                  </div>
                  :
                  <div className={"text-[10px] w-[fit] absolute right-[30px] top-[20px] bg-white rounded-[8px] px-1"}>
                    {secondsToTime(meetingTime)}
                  </div>

              :
              <div className={"text-[24px] text-[#454444] font-[500]"}>
                {secondsToTime(meetingTime) }
              </div>
        }
      </>
  )


};

export default Timer;


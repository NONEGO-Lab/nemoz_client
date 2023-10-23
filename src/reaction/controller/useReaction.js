import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {addToast, deleteToast, deleteToastAfter3s} from "../../redux/modules/toastSlice";
import { useParams } from "react-router-dom";
import { meetApi } from "../../call/data/call_data";
import { sock } from "../../socket/config";

export const useReaction = () => {

  const dispatch = useDispatch();
  const eventId = useSelector((state) => state.common.currentEventId);
  const roomInfo = useSelector((state) => state.common.roomInfo);
  const sessionInfo = useSelector((state) => state.common.sessionInfo);


  const params = useParams();
  const count = useRef(0);


  const onClickReactBtn = (button) => {
    console.log(button)
    count.current += 1;
    let newButton = {
      id: count.current,
      ...button
    }

    let num;

    if(window.location.pathname.includes("test")) {
      num = `${eventId}_test_${params.id}`;
    } else {
      num = `${eventId||roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
    }
    console.log(num)
    console.log(newButton)
    sock.emit("chatMessage", num, newButton);

    // meetId랑 content 보내야 함. 즉 함수 보낼때 meetId도 같이 보내야 함!
    // const result = await meetApi.addHistoryMeet();
    // if(result !== "History Added"){
    //     alert("리액션 보내는데 실패했습니다.");
    //     return;
    // }
  }

  const onClickDeleteBtn = (id) => {
    dispatch(deleteToast(id));
  }


  const getChatFromSocket = (msg) => {

    if(msg.msg) {
      dispatch(addToast(msg));
      dispatch(deleteToastAfter3s(msg.id));
    }
  }

  return {
    onClickReactBtn,
    onClickDeleteBtn,
    getChatFromSocket
  }
}
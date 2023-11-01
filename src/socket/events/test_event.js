import React from "react";
import {loginCheck} from "../../redux/modules/userSlice";


export const testEvents = {

  chatMessage: ({ msg, getChatFromSocket }) => {
    getChatFromSocket(msg);
  },

  testFail: ({ fanInfo, userInfo, navigate, setToggleNext }) => {
    if(fanInfo.fan_id.toString() === userInfo.id.toString()) {
      alert("테스트에 실패했습니다!");
      setToggleNext(false)
      navigate("/waitcall");

    }
  },

  testSuccess: ({ fanInfo, userInfo, dispatch, navigate, setToggleNext }) => {
    if(fanInfo.fan_id.toString() === userInfo.id.toString()) {
      alert("테스트에 성공했습니다");
      dispatch(loginCheck());
      setToggleNext(false)
      navigate("/waitcall");
    }
  }
};
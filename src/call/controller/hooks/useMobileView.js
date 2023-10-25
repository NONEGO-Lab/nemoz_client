import React, {useState} from "react";
import {useMediaQuery} from "react-responsive";


export const useMobileView = () => {

  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  });

  const [isOpenMobileSetting, setOpenMobileSetting] = useState(false);
  const [isBigScreen, setIsBigScreen] = useState({
    pub: "default",
    sub: "default"
  });

  const [isWebFullScreen, setIsWebFullScreen] = useState(false);

  const webFullScreenSize = isWebFullScreen.open ? "w-[100%] flex justify-center" : "w-[calc(50%-10px)]";
  const webFullScreenSizeOther = isWebFullScreen.open ? "hidden" : "w-[calc(50%-10px)] flex";

  const changeMobVideoSize = (type) => {
    switch(type) {
      case "default":
        return "w-[100%] h-[50vh]";
      case "small":
        return "w-[150px] h-[150px] absolute bottom-[70px] right-[20px]";
      case "large":
        return "w-[100%] h-[100vh]"
    }
  }

  //mobile button onClick에 붙일 함수(확대 버튼이 눌릴 때)
  const makeBigScreen = (type, subscribers) => {
    if(type === "half") {
      setIsBigScreen({
        pub: "default",
        sub: "default"
      })
      setOpenMobileSetting(false);
    } else {
      if(isMobile && (subscribers.length === 0 || subscribers[0].role === "staff")) {
        return;
      }

      setIsBigScreen({
        pub: "small",
        sub: "large"
      })
      setOpenMobileSetting(false);
    }
  }

  return {
    isMobile,
    changeMobVideoSize,
    isBigScreen,
    makeBigScreen,
    isOpenMobileSetting,
    setOpenMobileSetting,
    webFullScreenSize,
    webFullScreenSizeOther,
    isWebFullScreen,
    setIsWebFullScreen
  }

}
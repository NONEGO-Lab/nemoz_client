import React from "react";
import { useMediaQuery } from "react-responsive";
import { useReaction } from "../../controller/useReaction";
import { buttonList } from "../form";

const ReactionButton = () => {

  const { onClickReactBtn } = useReaction();


  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  })


  if(isMobile) {
    return (
        <div className="w-[280px] h-[40px]
            absolute bottom-[15px] right-[50%] translate-x-1/2
            border border-black rounded-[16px]
            flex items-center justify-center">
          {
            buttonList.map((button, idx) => {
              return (
                  <div
                      key={button.buttonId}
                      onClick={() => onClickReactBtn(button)}
                      className={`${idx !== buttonList.length - 1 && "mr-[20px]"}`}>
                    {button.msg}
                  </div>
              )

            })
          }
        </div>
    )
  } else {
    return (
        <div className="absolute h-[40px] border border-black rounded-[16px] flex py-2 px-[35px] m-auto items-center">
          {
            buttonList.map((button) => {
              return (
                  <div
                      key={button.id}
                      onClick={() => onClickReactBtn(button)}
                      className="cursor-pointer mr-4">
                    {button.msg}
                  </div>
              )

            })
          }
        </div>
    )
  }
}

export default ReactionButton;

import React from "react";
import ToastMessage from "./ToastMessage";
import {useMediaQuery} from "react-responsive";
import { Button } from "../../element";
import {useSelector} from "react-redux";
import { useReaction } from "../../reaction/controller/useReaction";




const ReactionBoard = () => {

  const { onClickDeleteBtn } = useReaction();
  const toastList = useSelector((state) => state.toast.toastList);

  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  });

  if(isMobile) {
    return (
        <div className="w-[100%] h-[200px] max-h-[200px] absolute z-40 bottom-[50px] overflow-y-scroll">
          {
            toastList.map((toast, idx) => {
              return <ToastMessage key={idx} toast={toast} onClickDeleteBtn={onClickDeleteBtn} />
            })
          }
        </div>
    )
  } else {
    return (
        <div className="h-[300px] overflow-y-auto relative z-20">
          {
            toastList.map((toast, idx) => {
              return <ToastMessage key={idx} toast={toast} onClickDeleteBtn={onClickDeleteBtn}/>
            })
          }
        </div>
    )
  }

}

export default ReactionBoard;
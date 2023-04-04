import React from "react";



const ToastMessage = ({toast, onClickDeleteBtn}) => {

  return (
      <div
          className="p-4 bg-red-100 p-2 border-none border-2 rounded-md w-fit m-auto my-2">
        <span className="mr-4">{toast.msg}를 보냈습니다.</span>
        <button onClick={() => onClickDeleteBtn(toast.id)}>
          X
        </button>
      </div>
  )
}


export default ToastMessage;

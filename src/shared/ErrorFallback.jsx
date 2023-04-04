import React from "react";
import { Button } from "../element";


const ErrorFallback = ({error, reset}) => {
  return (
      <div className="w-[400px] py-10 absolute left-[50%] bg-white p-[20px]
         -translate-x-2/4	translate-y-2/4 drop-shadow-md m-auto mt-10">
        <h1 className={"mb-[10px]"}>에러가 발생했어요!🥺 다시 시도해주세요 </h1>
        <div className={"mb-[20px]"}>에러내용: {error.message}</div>
        <Button
            margin={"flex justify-center m-auto"}
            width={"w-[130px]"}
            className={"cursor-pointer"}
            _onClick={reset}>
          돌아가기
        </Button>
      </div>
  )

}

export default ErrorFallback;
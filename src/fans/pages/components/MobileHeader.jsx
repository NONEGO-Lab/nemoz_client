import React from 'react';
import {secondsToMins} from "../../../utils/convert";


const MobileHeader = () => {

  return (<>
    <div className={"text-[25px] "}>이벤트 제목
    </div>
    <div className={"text-[20px] "}> 대기번호는 1번입니다. <span className={"text-[#00cace]"}>예상 대기 시간은 10분입니다.</span></div>
  </>);
}
import React from 'react';
import {secondsToMins} from "../../../utils/convert";

const WatingMents = ({isCallFinished, myWaitInfo, fan_name, eventTitle}) => {
    const isCallTested = myWaitInfo.fan_info?.is_tested === 0
    if(isCallTested){
        return(
            <>
                <div className={"text-[25px] "}>{eventTitle}
                </div>
                <div className={"text-[20px] "}><b>{`${fan_name}님`}</b>의 테스트 순서입니다. <span
                    className={"text-[#00cace]"}>연결 테스트를 진행해주세요</span></div>
            </>
        )
    }

    if(!isCallTested && !isCallFinished){
        return(
            <>
                <div className={"text-[25px] "}>{eventTitle}</div>
                <div className={"text-[20px] "}> 대기번호는 {myWaitInfo.waiting?.orders}번입니다. <span className={"text-[#00cace]"}>예상 대기 시간은 {secondsToMins(myWaitInfo.waiting?.wait_seconds)}분입니다.</span></div>
            </>
        )
    }

    if(!isCallTested && isCallFinished){
        return(                   <>
            <div className={"text-[25px] text-[#00cace]"}>영상 통화가 종료되었습니다.</div>
            <div className={"text-[20px] "}>영상 통화는 2023.08.31 이후 녹화된 영상으로 다운로드하실 수 있습니다.</div>
        </>)
    }
};

export default WatingMents;

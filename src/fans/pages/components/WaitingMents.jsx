import React from 'react';
import {secondsToMins} from "../../../utils/convert";

const WatingMents = ({isCallTested, isCallFinished, myWaitInfo, fan_name}) => {
    if(!isCallTested){
        return(
            <>
                <div className={"text-[25px] "}>Jisoo First Single Album ‘ME’ 첫번째 팬미팅(Fan Meeting)
                </div>
                <div className={"text-[20px] "}><b>{`${fan_name}님`}</b>의 테스트 순서입니다. <span
                    className={"text-[#00cace]"}>연결 테스트를 진행해주세요</span></div>
            </>
        )
    }

    if(isCallTested && !isCallFinished){
        return(
            <>
                <div className={"text-[25px] "}>Jisoo First Single Album ‘ME’ 첫번째 팬미팅(Fan Meeting)</div>
                <div className={"text-[20px] "}> 대기번호는 {myWaitInfo.orders}번입니다. <span className={"text-[#00cace]"}>예상 대기 시간은 {secondsToMins(myWaitInfo.wait_seconds)}분입니다.</span></div>
            </>
        )
    }

    if(isCallTested && isCallFinished){
        return(                   <>
            <div className={"text-[25px] text-[#00cace]"}>영상 통화가 종료되었습니다.</div>
            <div className={"text-[20px] "}>영상 통화는 2023.08.31 이후 녹화된 영상으로 다운로드하실 수 있습니다.</div>
        </>)
    }
};

export default WatingMents;

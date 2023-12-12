import React from 'react';
import {secondsToMins} from "../../../utils/convert";

const WaitingMents = ({isCallFinished, myWaitInfo, fan_name, eventTitle, isReadyTest}) => {
    const isCallTested = myWaitInfo.fan_info?.is_tested === 0
    if(isCallTested){
        return(
            <>
                <div className={"text-[25px]"}>{eventTitle}</div>

                {!isReadyTest ?
                    <div className={"text-[20px]"}><b>{`${fan_name}님`}</b>의 테스트 순서 대기중입니다.
                        <span className={"text-[#00cace]"}> 예상 테스트 대기 시간은 {secondsToMins(myWaitInfo.waiting?.wait_seconds)}분입니다.</span>
                    </div>

                    :
                    <div className={"text-[20px]"}><b>{`${fan_name}님`}</b>의 테스트 순서입니다.
                    <span className={"text-[#00cace]"}>연결 테스트를 진행해주세요</span>
                </div>
                }
            </>
        )
    }

    if(!isCallTested && !isCallFinished){
        return(
            <>
                <div className={"text-[25px]"}>{eventTitle}</div>
                <div className={"text-[20px]"}> 대기번호는 {myWaitInfo.waiting?.orders}번입니다. <span className={"text-[#00cace]"}>예상 대기 시간은 {secondsToMins(myWaitInfo.waiting?.wait_seconds)}분입니다.</span></div>
            </>
        )
    }

    if (!isCallTested && isCallFinished) {
        return <div className={"text-[25px] text-[#00cace]"}>영상 통화가 종료되었습니다.</div>
    }
};

export default WaitingMents;

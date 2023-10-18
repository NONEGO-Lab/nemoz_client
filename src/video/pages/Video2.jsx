import React, {useRef, useEffect, Fragment} from "react";
import InnerCircleText from "../../common/InnerCircleText";
import {useSelector} from "react-redux";


const Video2 = ({streamManager, style, fanInfo, warnCnt}) => {
    // console.log('streamManager', streamManager)
    const videoRef = useRef();
    const userInfo = useSelector(state => state.user.userInfo)
    const subscribedFanInfo = useSelector(state => state.video.subscribedFanInfo)
    useEffect(() => {

        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }

    }, [streamManager]);

    const {role} = userInfo
    const fan = streamManager.role === 'member'
    console.log(warnCnt, 'warnCntwarnCntwarnCnt')
    return (
        <>
            {
                <video
                    className={`object-contain h-[100%] w-full ${style} scale-x-[-1] `}
                    autoPlay
                    ref={videoRef}
                />



            }
            {/*{userInfo &&*/}
            {/*    <div className={'absolute top-[90%] w-full'}>*/}
            {/*        <div className={'text-[19px] font-medium text-white flex justify-center items-center'}>*/}
            {/*            {`${userInfo.role} ${userInfo.name??''}${userInfo.age?(userInfo.age + '세'):''}`}*/}
            {/*            <InnerCircleText gender={userInfo.gender} textSize={'text-[15px]'}*/}
            {/*                             fontWeight={"font-medium"}*/}
            {/*                             textColor={"text-[#444]"} bgcolor={"bg-white"} width={"w-[22px]"} />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*}*/}

            <div
                className={`absolute w-[650px] mt-[-50px] flex items-center text-white ${fan?'justify-between':'justify-end'} bg-amber-200`}>
                {fan && <div className={"ml-[30px] flex items-center"}>
                    <span>{fanInfo.fan_name}님, 연결되었습니다.(영상통화 <b>1분30초</b>)</span>
                </div>}
                <div className={"flex items-center ml-[165px] mr-[30px]"}>
                    <div className={"flex items-center"}>
                        <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                             alt={"warningIcon"}/>
                        <span className={"text-[24px] ml-[8.5px]"}>{warnCnt}</span>
                    </div>
                    <div className={"ml-[30px] flex items-center"}>
                        <img className={"w-[30px]"} src={"/images/fullScreenIcon.png"} alt={"fullScreenIcon"}/>
                    </div>
                </div>
            </div>
        </>
    )


};

export default Video2;
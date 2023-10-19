import React, {useRef, useEffect, Fragment} from "react";
import InnerCircleText from "../../common/InnerCircleText";
import {useSelector} from "react-redux";


const Video2 = ({streamManager, style, fanInfo, warnCnt, left, right}) => {
    // console.log('streamManager', streamManager)
    const videoRef = useRef();
    const userInfo = useSelector(state => state.user.userInfo)
    const subscribedFanInfo = useSelector(state => state.video.subscribedFanInfo)
    useEffect(() => {

        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }

    }, [streamManager]);

    const currentRole = userInfo.role
    return (
        <>
            {
                <video
                    className={`object-contain h-[100%] w-full ${style} scale-x-[-1] `}
                    autoPlay
                    ref={videoRef}
                />


            }

            {left && <div
                className={`absolute w-[650px] mt-[-50px] flex items-center text-white justify-between`}>
                {left && <div className={"ml-[30px] flex items-center"}>
                    <img className={"w-[22px] mr-[12px]"} src={"/images/screenIconChatroom.png"} alt={"screenIconChatroom"}/>
                    <span className={"whitespace-nowrap"}>{fanInfo.fan_name}님, 연결되었습니다.(영상통화 <b>1분30초</b>)</span>
                </div>}
                <div className={"flex items-center ml-[165px] mr-[30px]"}>
                    {left && <div className={"flex items-center"}>
                        <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                             alt={"warningIcon"}/>
                        <span className={"text-[24px] ml-[8.5px]"}>{warnCnt}</span>
                    </div>}
                    {currentRole !== 'artist' &&
                        <div className={"ml-[30px] flex items-center"}>
                            {currentRole === 'staff' ?
                                <img className={"w-[30px]"} src={"/images/fullScreenIcon.png"} alt={"fullScreenIcon"}/>
                                :
                                <img className={"w-[30px]"} src={"/images/emoticonIcon.png"} alt={"emoticonIcon"}/>
                            }
                        </div>
                    }
                </div>
            </div>}

            {right && <div
                className={`absolute w-[650px] mt-[-50px] flex items-center text-white justify-end`}>
                <div className={"flex items-center"}>
                    {currentRole === 'artist' ?
                        <img className={"w-[30px] mr-[30px]"} src={"/images/emoticonIcon.png"} alt={"emoticonIcon"}/> :
                        <img className={"w-[30px] mr-[30px]"} src={"/images/fullScreenIcon.png"}
                             alt={"fullScreenIcon"}/>}
                </div>
            </div>}
        </>
    )


};

export default Video2;
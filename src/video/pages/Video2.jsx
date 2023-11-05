import React, {useRef, useEffect, Fragment} from "react";
import {useSelector} from "react-redux";
import {upper_imoticon_path, down_imoticon_path} from "../../common/imoticon_path";
import Toast from "../../shared/Toast";
import {nanoid} from "nanoid";
import {subscribedFanInfo} from "../../redux/modules/videoSlice";
import {timeToKorean} from "../../utils/convert";
import {Timer} from "../../call/pages/components";


const Video2 = ({
                    streamManager,
                    style,
                    fanInfo,
                    warnCnt,
                    left,
                    right,
                    emoticonToggle,
                    setEmoticonToggle,
                    sendReactionHandler,
                    isWebFullScreen,
                    setIsWebFullScreen,
                    deviceSetting,
                    reserved_time,
                    fanEnterNoti,
                    leftTimeRef
                }) => {

    const videoRef = useRef();
    const userInfo = useSelector(state => state.user.userInfo)
    const toastList = useSelector(state => state.toast.toastList)
    const unique_id = nanoid(4)
    const selectedAudioOutputDeviceId = localStorage.getItem("audioOutputId")
    useEffect(() => {

        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }

        // if (videoRef.current && !deviceSetting) {
        //     videoRef.current.setSinkId(selectedAudioOutputDeviceId)
        //         .then(() => {
        //             console.log(`Audio output set to ${selectedAudioOutputDeviceId}`);
        //         })
        //         .catch(error => {
        //             console.error('Error setting audio output: ', error);
        //         });
        // }

    }, [streamManager]);

    const currentRole = userInfo.role
    const toggleEmoticon = (location) => {
        if (location === 'left') {
            setEmoticonToggle({...emoticonToggle, left: !emoticonToggle.left})
        } else {
            setEmoticonToggle({...emoticonToggle, right: !emoticonToggle.right})
        }

    }

    const toggleFullScreen = () => {
        setIsWebFullScreen(prev => !prev)
        if ((isWebFullScreen && emoticonToggle.left) || (!isWebFullScreen && emoticonToggle.left)) {
            setEmoticonToggle({...emoticonToggle, left: false})
        }

    }
    console.log(fanEnterNoti, 'fanEnterNotifanEnterNotifanEnterNoti')
    return (
        <>
            {
                <video
                    className={`object-contain h-[100%] w-full ${style} scale-x-[-1] `}
                    autoPlay
                    ref={videoRef}
                />
            }

            <div
                className={`w-[250px] h-[300px] absolute top-[31%] flex flex-col justify-end overflow-y-hidden overflow-x-hidden ${isWebFullScreen ? "ml-[1040px]" : "ml-[400px]"}`}>
                {toastList?.map((message, index) => (
                    <Toast key={index} message={message} left={left} right={right} isWebFullScreen={isWebFullScreen}/>
                ))}
            </div>

            {(emoticonToggle?.left) &&
                <div
                    className={`w-[390px] h-[200px] bg-white absolute rounded-[15px] pt-[34px] pb-[36px] px-[40px] z-10 ${isWebFullScreen ? "top-[72.5%] left-[58%]" : "top-[61%] left-[15.5%] "}`}>
                    <img src={"/images/boxTale.png"} className={"w-[16px] h-[14px] absolute left-[98%] top-[10%]"}/>
                    <div className={"flex"}>
                        {upper_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col items-center mr-[35px]`} key={i.name}
                                 onClick={() => sendReactionHandler({
                                     emo: i.emo,
                                     msg: i.kor,
                                     id: i.id,
                                     sender: currentRole,
                                     unique_id
                                 })}>
                                <div className={"text-[31px]"}>{i.emo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)
                        }
                    </div>
                    <div className={"flex"}>
                        {down_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col items-center ${idx === 0 ? "mr-[40px]" : "mr-[35px]"}`}
                                 key={i.name} onClick={() => sendReactionHandler({
                                emo: i.emo,
                                msg: i.kor,
                                id: i.id,
                                sender: currentRole,
                                unique_id
                            })}>
                                <div className={"text-[31px]"}>{i.emo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)

                        }
                    </div>
                </div>
            }

            {(left && warnCnt > 0) &&
                <>
                    <div
                        className={`h-[50px] w-[650px] top-[31.5%] bg-[#f00] absolute flex items-center justify-center opacity-[0.7] rounded-t-[15px]`}>
                        <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                             alt={"warningIcon"}/>
                        <span className={"text-[17px] ml-[10.5px] font-bold text-white"}>경고 ({warnCnt || 0}회)</span>
                    </div>
                </>
            }
            {left && <div
                className={`absolute w-[650px] mt-[-50px] flex items-center text-white justify-between z-100`}>
                {left && (fanEnterNoti ? <div className={`flex items-center mx-[30px] `}>

                    <img className={"w-[22px] mr-[12px]"} src={"/images/screenIconChatroom.png"}
                         alt={"screenIconChatroom"}/>
                    <span
                        className={"whitespace-nowrap"}>{fanInfo?.fan_name}님, 연결되었습니다.(영상통화 <b>{timeToKorean(reserved_time)}</b>)</span>
                </div> : <div className={`flex items-center`}>

                </div>)

                }
                <div className={`flex items-center ${fanEnterNoti ? "ml-[165px]" : "mx-[30px]"}`}>
                    {left && <div className={"flex items-center"}>
                        <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                             alt={"warningIcon"}/>
                        <span className={"text-[24px] ml-[8.5px]"}>{warnCnt}</span>
                    </div>}
                    {currentRole === 'member' &&
                        <div className={"ml-[30px] flex items-center"}>
                            <img className={"w-[30px] cursor-pointer"} src={"/images/emoticonIcon.png"}
                                 alt={"emoticonIcon"} onClick={() => toggleEmoticon('left')}/>
                        </div>
                    }
                </div>
            </div>}

            {(right && emoticonToggle?.right) &&
                <div
                    className={`w-[390px] h-[200px] bg-white absolute rounded-[15px] pt-[34px] pb-[36px] px-[40px] z-10 top-[61%] left-[64.5%]`}>
                    <img src={"/images/boxTale.png"} className={"w-[16px] h-[14px] absolute left-[98%] top-[10%]"}
                         alt={"boxTale"}/>
                    <div className={"flex"}>
                        {upper_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col  items-center mr-[35px]`} key={i.name}
                                 onClick={() => sendReactionHandler({
                                     emo: i.emo,
                                     msg: i.kor,
                                     id: i.id,
                                     sender: currentRole
                                 })}>
                                <div className={"text-[31px]"}>{i.emo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)
                        }
                    </div>
                    <div className={"flex"}>
                        {down_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col items-center ${idx === 0 ? "mr-[40px]" : "mr-[35px]"}`}
                                 key={i.name} onClick={() => sendReactionHandler({
                                emo: i.emo,
                                msg: i.kor,
                                id: i.id,
                                sender: currentRole
                            })}>
                                <div className={"text-[31px]"}>{i.emo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)

                        }
                    </div>

                </div>
            }
            {(right) &&
                <>
                    <div
                        className={`h-[50px] w-[1297px] bg-[#f00] absolute flex items-center justify-center opacity-[0.7] rounded-t-[15px] top-[7.5%] ${(isWebFullScreen && warnCnt > 0) ? '' : 'hidden'}`}>
                        <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                             alt={"warningIcon"}/>
                        <span className={"text-[17px] ml-[10.5px] font-bold text-white"}>경고 ({warnCnt || 0}회)</span>
                    </div>
                </>
            }

            {right && <div
                className={`absolute ${isWebFullScreen ? "w-[1280px]" : "w-[650px]"} mt-[-50px] flex items-center text-white justify-end z-100`}>
                <div className={`flex items-center ${isWebFullScreen ? 'w-full' : ''}`}>
                    {currentRole === 'artist' ?
                        <img className={"w-[30px] mr-[30px] cursor-pointer"} src={"/images/emoticonIcon.png"}
                             alt={"emoticonIcon"} onClick={() => toggleEmoticon('right')}/>
                        :
                        <>


                            {isWebFullScreen &&
                                <>
                                    <div className="flex justify-between w-[100%]">
                                        <div className={"flex items-center ml-[30px]"}>
                                            <img src={"/images/leftTimeIcon.png"} className={"w-[30px] mr-[0.6rem]"}/>
                                            <Timer inMeet={true} leftTimeRef={leftTimeRef}/>
                                        </div>
                                        <div className="flex items-center">
                                            <div className={"flex items-center"}>
                                                <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                                                     alt={"warningIcon"}/>
                                                <span className={"text-[24px] ml-[8.5px]"}>{warnCnt}</span>
                                            </div>

                                            <img className={"w-[30px] mx-[30px] cursor-pointer"}
                                                 src={"/images/emoticonIcon.png"}
                                                 alt={"emoticonIcon"} onClick={() => toggleEmoticon('left')}/>
                                        </div>
                                    </div>
                                </>
                            }

                            <img
                                className={`w-[30px] mr-[30px] cursor-pointer ${currentRole === 'staff' ? 'hidden' : ''}`}
                                src={isWebFullScreen ? "/images/halfScreenIcon.png" : "/images/fullScreenIcon.png"}
                                alt={"fullScreenIcon"} onClick={toggleFullScreen}/>
                        </>
                    }
                </div>
            </div>}


        </>
    )


};


export default Video2;
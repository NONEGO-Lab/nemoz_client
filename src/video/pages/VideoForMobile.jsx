import React, {useRef, useEffect, Fragment, useState} from "react";
import {useSelector} from "react-redux";
import {upper_imoticon_path, down_imoticon_path, emoji_list} from "../../common/imoticon_path";
import Toast from "../../shared/Toast";
import {nanoid} from "nanoid";
import {subscribedFanInfo} from "../../redux/modules/videoSlice";
import {timeToKorean} from "../../utils/convert";
import {Timer} from "../../call/pages/components";
import MobileToast from "../../shared/MobileToast";
import {sock} from "../../socket/config";

const VideoForMobile = ({
                            streamManager,
                            style,
                            fanInfo,
                            warnCnt,
                            // emoticonToggle,
                            setEmoticonToggle,
                            sendReactionHandler,
                            isWebFullScreen,
                            setIsWebFullScreen,
                            deviceSetting,
                            reserved_time,
                            fanEnterNoti,
                            leftTimeRef,
                            isFullScreenMobile,
                            setIsFullScreenMobile,
                            isTest,
                            roomInfo
                        }) => {

    const videoRef = useRef();
    const userInfo = useSelector(state => state.user.userInfo)
    const toastList = useSelector(state => state.toast.toastList)
    const sessionInfo = useSelector((state) => state.common.sessionInfo);
    const unique_id = nanoid(4)
    const [toggleMobileFanLetter, setToggleMobileFanLetter] = useState(false);
    const [toggleMobilsEmoticons, setToggleMobilsEmoticons] = useState(false);
    useEffect(() => {
        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);


    const isFan = streamManager.role === 'member'
    const isStaff = streamManager.role === 'staff'
    const removeFanLetterInMobile = (e) =>{
        e.stopPropagation()
        setToggleMobileFanLetter(false)
    }
    const onClickMobileFullScreen = () =>{
        let roomNum = `${roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
        sock.emit('rotateFan', roomNum, true)
        setIsFullScreenMobile(true)
    }
    const onClickMobileHalfScreen = () =>{
        let roomNum = `${roomInfo.event_id}_${roomInfo.room_id}_${sessionInfo.meetId}`;
        sock.emit('rotateFan', roomNum, false)
        setIsFullScreenMobile(false)
    }

    return (
        <>
            {
                <video
                    className={`${isFullScreenMobile ? '' : 'object-cover'} absolute h-[100%]  w-full ${style} scale-x-[-1] relative`}
                    autoPlay
                    ref={videoRef}
                />
            }
            {isFan &&
                <>
                    <div className={`w-[100vw] text-white text-[18px] absolute top-[1rem] left-[80%] flex items-center`}>

                        <Timer inMeet={true} leftTimeRef={leftTimeRef} />
                        <div className={'w-[8px] h-[8px] rounded-full bg-[#02c5cb] ml-[6px]'}/>
                    </div>
                <div
                    className={` w-[100vw] text-white text-[18px] absolute bottom-[5vw] flex ${fanEnterNoti ? "justify-between" : "justify-end"} `}>
                    {fanEnterNoti && <div className={`ml-[30px]`}>
                        <img className={"w-[22px] mr-[12px]"} src={"/images/screenIconChatroom.png"}
                             alt={"screenIconChatroom"}/>
                        <span
                            className={"whitespace-nowrap transition-none"}>{userInfo?.username}님, 연결되었습니다.<br/>
                        (영상통화 <b>{timeToKorean(reserved_time)}</b>)
                    </span>
                    </div>}
                    <div className={`mr-[30px] flex ${isTest && 'hidden'}`}>
                        <div className={`flex items-center`}>
                            <img className={"w-[30px]"} src={"/images/fanLetterWhite.png"}
                                 onClick={() => setToggleMobileFanLetter(true)}
                                 alt={"fanletterIcon"}/>
                        </div>
                        <div className={`flex items-center ml-[12.5px] mr-[10px]`}>
                            <img className={"w-[30px] mr-[5px]"}
                                 src={`/images/${warnCnt > 0 ? "warningIconInScreen.png" : "warningPhoneIcon.png"}`}
                                 alt={"warningIcon"}/>
                            <span className={"font-bold text-white"}>{warnCnt || 0}</span>
                        </div>
                        <div className={`flex items-center `}>
                            <img className={"w-[30px]"} src={"/images/emoticonIcon.png"}
                                 onClick={() => setToggleMobilsEmoticons(true)}
                                 alt={"emoticonIcon"}/>
                        </div>
                    </div>
                </div>
                </>
            }
            {(isFan && toggleMobileFanLetter) &&
                <div className={'bg-white w-[100vw] h-[390px] z-10 absolute bottom-[-50vw]'}>
                    <img src={"../images/closeIcon.png"}
                         className={"w-[15px] h-[15px] float-right mr-[30px] mt-[30px] cursor-pointer"}
                         alt={"close-icon"}
                         onClick={() => setToggleMobileFanLetter(false)}/>
                    <div className={`clear-both py-[25px] px-[40px]`}>
                        {fanInfo.letter}
                    </div>
                </div>

            }
            {isFan && <div
                className={`items-end w-[55vw] h-[55vw] float-right bottom-[60px] left-[45%] absolute flex flex-col justify-end overflow-y-hidden overflow-x-hidden ${isWebFullScreen ? "ml-[1040px]" : ""}`}>
                {toastList?.map((message, index) => (
                    <MobileToast key={index} message={message} isWebFullScreen={isWebFullScreen}/>
                ))}
            </div>}
            {(isFan && toggleMobilsEmoticons) &&
                <div className={'bg-white w-[100vw] h-[390px] z-10 absolute bottom-[-50vw]'}>
                    <img src={"../images/closeIcon.png"}
                         className={"w-[15px] h-[15px] float-right mr-[30px] mt-[30px] mb-[60px] cursor-pointer"}
                         alt={"close-icon"}
                         onClick={() => setToggleMobilsEmoticons(false)}/>
                    <div className={`clear-both mx-[62px]`}>
                        <div className={"flex"}>
                            {upper_imoticon_path?.map((i, idx) =>
                                <div className={`flex flex-col items-center mr-[35px]`} key={i.name}
                                     onClick={() => sendReactionHandler({
                                         emo: i.emo,
                                         msg: i.kor,
                                         id: i.id,
                                         sender: userInfo.role,
                                         unique_id
                                     })}>
                                    <div className={"text-[31px]"}>{i.emo}</div>
                                    <span
                                        className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
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
                                    sender: userInfo.role
                                })}>
                                    <div className={"text-[31px]"}>{i.emo}</div>
                                    <span
                                        className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                                </div>)

                            }
                        </div>
                    </div>
                </div>
            }

            {isFullScreenMobile ?
                <div className={'bottom-[1rem] w-[150vw] absolute'}>
                    <div
                        className={`w-[100vh] flex justify-between bottom-[1rem] absolute px-[1rem]`}>
                        <div className={'flex'}>
                            <div className={`flex items-center ml-[12.5px] mr-[10px]`}>
                                <img className={"w-[30px] mr-[5px]"}
                                     src={`/images/leftTimeIcon.png`}
                                     alt={"warningIcon"}/>
                                <Timer inMeet={true} color={'white'} leftTimeRef={leftTimeRef}/>
                            </div>
                        </div>

                        <div className={'flex'}>
                            <div className={`flex items-center`}>
                                <img className={"w-[30px]"} src={"/images/fanLetterWhite.png"}
                                     onClick={() => setToggleMobileFanLetter(true)}
                                     alt={"fanletterIcon"}/>
                            </div>
                            <div className={`flex items-center mx-[20px]`}>
                                <img className={"w-[30px] mr-[5px]"}
                                     src={`/images/${warnCnt > 0 ? "warningIconInScreen.png" : "warningPhoneIcon.png"}`}
                                     alt={"warningIcon"}/>
                                <span className={"font-bold text-white"}>{warnCnt || 0}</span>
                            </div>
                            <div className={`flex items-center mr-[20px]`}>
                                <img className={"w-[30px]"} src={"/images/emoticonIcon.png"}
                                     onClick={() => setToggleMobilsEmoticons(true)}
                                     alt={"emoticonIcon"}/>
                            </div>

                            <img
                                className={`w-[30px] cursor-pointer`}
                                src={"/images/halfScreenIcon.png"}
                                alt={"fullScreenIcon"} onClick={onClickMobileHalfScreen}/>

                        </div>
                    </div>

                    <div className={`w-[50%] flex left-[1rem] bottom-[85vw] items-center absolute`}>
                        <img className={"w-[30px] mr-[5px]"}
                             src={`/images/starWhiteIcon.png`}
                             alt={"warningIcon"}/>
                        <span className={"font-bold text-white text-[19px]"}>{streamManager.username}</span>
                    </div>
                </div>
                :

                !isFan &&

                (<div className={` w-[100vw] text-white text-[18px] absolute bottom-[5vw] flex justify-between `}>
                    <div className={`flex items-center ml-[12.5px] mr-[10px]`}>
                        <img className={"w-[30px] mr-[5px]"}
                             src={`/images/${isStaff ? "staffIcon.png" : "starWhiteIcon.png"}`}
                             alt={"warningIcon"}/>
                        <span
                            className={"font-bold text-white text-[19px]"}>{streamManager.username}</span>
                    </div>
                    <div className={`${isTest && 'hidden'}`}>
                        <img
                            className={`w-[30px] mr-[30px] cursor-pointer`}
                            src={isFullScreenMobile ? "/images/halfScreenIcon.png" : "/images/fullScreenIcon.png"}
                            alt={"fullScreenIcon"} onClick={onClickMobileFullScreen}/>
                    </div>
                </div>)

            }

            {(isFullScreenMobile && toggleMobileFanLetter)&&
                <div className={'bg-white top-0 right-0 w-[30%] h-full absolute z-[99999]'}>
                    <img src={"../images/closeIcon.png"}
                         className={"w-[15px] h-[15px] float-right mr-[30px] mt-[30px] cursor-pointer"}
                         alt={"close-icon"}
                         onClick={(e)=>removeFanLetterInMobile(e)}/>
                    <div className={`clear-both py-[25px] px-[40px]`}>
                        {fanInfo.letter || '없음'}
                    </div>
                </div>

            }

            {(isFullScreenMobile && toggleMobilsEmoticons)&&
                <div className={'bg-white top-0 right-0 w-[30%] h-full absolute z-[99999]'}>
                    <img src={"../images/closeIcon.png"}
                         className={"w-[15px] h-[15px] float-right mr-[30px] mt-[30px] mb-[60px] cursor-pointer"}
                         alt={"close-icon"}
                         onClick={() => setToggleMobilsEmoticons(false)}/>
                    <div className={`clear-both mx-[62px]`}>
                        <div className={"flex"}>
                            {emoji_list.slice(0,3)?.map((i, idx) =>
                                <div className={`flex flex-col items-center mr-[35px]`} key={i.name}
                                     onClick={() => sendReactionHandler({
                                         emo: i.emo,
                                         msg: i.kor,
                                         id: i.id,
                                         sender: userInfo.role,
                                         unique_id
                                     })}>
                                    <div className={"text-[31px]"}>{i.emo}</div>
                                    <span
                                        className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                                </div>)
                            }
                        </div>
                        <div className={"flex"}>
                            {emoji_list.slice(3,6)?.map((i, idx) =>
                                <div className={`flex flex-col items-center mr-[35px]`} key={i.name}
                                     onClick={() => sendReactionHandler({
                                         emo: i.emo,
                                         msg: i.kor,
                                         id: i.id,
                                         sender: userInfo.role,
                                         unique_id
                                     })}>
                                    <div className={"text-[31px]"}>{i.emo}</div>
                                    <span
                                        className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                                </div>)
                            }
                        </div>
                        <div className={"flex"}>
                            {emoji_list.slice(6,9)?.map((i, idx) =>
                                <div className={`flex flex-col items-center mr-[35px]`} key={i.name}
                                     onClick={() => sendReactionHandler({
                                         emo: i.emo,
                                         msg: i.kor,
                                         id: i.id,
                                         sender: userInfo.role,
                                         unique_id
                                     })}>
                                    <div className={"text-[31px]"}>{i.emo}</div>
                                    <span
                                        className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                                </div>)
                            }
                        </div>
                        <div className={"flex"}>
                            {emoji_list.slice(9)?.map((i, idx) =>
                                <div className={`flex flex-col items-center mr-[35px]`} key={i.name}
                                     onClick={() => sendReactionHandler({
                                         emo: i.emo,
                                         msg: i.kor,
                                         id: i.id,
                                         sender: userInfo.role,
                                         unique_id
                                     })}>
                                    <div className={"text-[31px]"}>{i.emo}</div>
                                    <span
                                        className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
            }

            {isFullScreenMobile &&
                <div
                    className={`items-end top-[-5rem] right-0 w-[30%] h-full absolute  flex flex-col justify-end overflow-y-hidden overflow-x-hidden ${isWebFullScreen ? "ml-[1040px]" : ""}`}>
                    {toastList?.map((message, index) => (
                        <MobileToast key={index} message={message} isWebFullScreen={isWebFullScreen}/>
                    ))}
                </div>
            }
        </>
    )
};


export default VideoForMobile;
import React, {useState} from 'react';
import InnerCircleText from "../../../common/InnerCircleText";
import Video2 from "../../../video/pages/Video2";
import ConnectControl2 from "../../../room/components/ConnectControl2";

const VideoArea = ({
                       userInfo,
                       fanInfo,
                       publisher,
                       subscriber,
                       subscribedFanInfo,
                       subscribedArtistInfo,
                       subscribers,
                       isTestConnect,
                       publisherVideo,
                       publisherAudio,
                       muteHandler,
                       artistName,
                       warnCnt,
                       emoticonToggle,
                       setEmoticonToggle,
                       toastList,
                       onClickReactBtn,
                       sendReactionHandler,
                       removeToast,
                       toasts,
                       isWebFullScreen, 
                       setIsWebFullScreen,
                       toggleFanLetter,
                       setToggleFanLetter,
                       reserved_time,
                       fanEnterNoti,
                       leftTimeRef
                   }) => {


    const {role} = userInfo
    const isStaff = role === 'staff'
    const isFan = role === 'fan' || role === 'member'
    const username = fanInfo?.fan_name
    const age = fanInfo?.age
    const gender = fanInfo?.sex

    return (
        <div className={"flex flex-row justify-evenly"}>
            {/* Fan Area */}
            <div className={`text-center w-[650px] ${isWebFullScreen?"hidden" : '' }`}>
                        <span
                            className='text-[19px] font-medium flex justify-center items-center'>
                            {`FAN ${username} (${age}세)`}
                            <InnerCircleText gender={gender} width={"w-[22px]"} height={"h-[22px]"}
                                             bgcolor={"bg-[#444]"}
                                             ml={"ml-[13px]"} textSize={"text-[15px]"} textColor={"text-white"}
                                             fontWeight={"font-normal"}/>
                        </span>
                <div className={"flex flex-col mt-[24px]"}>
                    <div
                        className={`h-[368px] ${(!isFan && !subscribedFanInfo) || (isFan && !publisher) ? 'hidden': ''}`}>

                        {
                            isFan ?
                                (
                                    publisher !== undefined && (
                                        <Video2 streamManager={publisher}
                                                publisherAudio={publisherAudio}
                                                publisherVideo={publisherVideo}
                                                role={role}
                                                fanInfo={fanInfo}
                                                warnCnt={warnCnt}
                                                left={true}
                                                muteHandler={muteHandler}
                                                emoticonToggle={emoticonToggle}
                                                setEmoticonToggle={setEmoticonToggle}
                                                toasts={toasts}
                                                onClickReactBtn={onClickReactBtn}
                                                sendReactionHandler={sendReactionHandler}
                                                removeToast={removeToast}
                                                reserved_time={reserved_time}
                                                fanEnterNoti={fanEnterNoti}
                                                style={`rounded-[15px]`}/>)

                                )
                                :
                                (
                                    subscribedFanInfo !== undefined && (
                                        <Video2 style={`rounded-[15px]`}
                                                role={role}
                                                fanInfo={fanInfo}
                                                warnCnt={warnCnt}
                                                left={true}
                                                streamManager={subscribedFanInfo}
                                                isStaff={isStaff}
                                                emoticonToggle={emoticonToggle}
                                                setEmoticonToggle={setEmoticonToggle}
                                                toasts={toasts}
                                                onClickReactBtn={onClickReactBtn}
                                                sendReactionHandler={sendReactionHandler}
                                                reserved_time={reserved_time}
                                                fanEnterNoti={fanEnterNoti}
                                        />
                                    )
                                )
                        }
                    </div>
                    {!isFan && isTestConnect && <ConnectControl2/>}
                    { (role === 'artist' && !subscribedFanInfo) &&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{fanInfo?.fan_name}</span>
                        </div>}

                    {fanInfo?.letter && <div className='flex mt-[27px] w-full justify-center'>
                        <div className={"w-[380px] justify-start items-center flex"}>
                            <img src="../images/callOutFanLetter.png" className={"w-[24.5px] cursor-pointer"}
                                 onClick={() => setToggleFanLetter(prev => !prev)}/>
                            {/*<div className={"ml-[13px] grow"}>{fanInfo?.letter}</div>*/}
                            <div className={"ml-[13px] grow truncate"}>{fanInfo?.letter}</div>
                            {toggleFanLetter &&

                                <div
                                    className={"w-[450px] min-h-[200px] bg-white z-10 fixed rounded-[15px] top-[65%] left-[195px]"}>
                                    <img src={"../images/boxTale.png"} alt={"box-tail"}
                                         className={"rotate-180 w-[14px] h-[16px] z-10 mt-[45.5px] fixed ml-[-10px]"}/>
                                    <div className={`ml-[24.5px] mt-[24.5px] mr-[20px] mb-[28.5px] flex`}>
                                <span className={"text-left min-w-[366.5px]"}>
                                    {fanInfo?.letter}
                                </span>
                                        <img src={"../images/closeIcon.png"}
                                             className={"w-[15px] h-[15px] ml-[24px] cursor-pointer"} alt={"close-icon"}
                                             onClick={() => setToggleFanLetter(false)}/>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>}
                </div>
            </div>

            {/* Artist or Staff Area */}

            <div className={` text-center ${isWebFullScreen? "w-[1300px]":"w-[650px]"}`}>
                <div className={`flex justify-center items-center ${isWebFullScreen? 'hidden' : ''}`}>
                    <>
                        <img src="../images/starIcon.png" alt='staricon'
                             className='w-[24px] h-[24px] mr-[7px]'/>
                        <div className='text-[19px] font-medium'>{artistName}</div>
                    </>
                </div>
                <div className={"flex flex-col mt-[24px]"}>
                    <div className={`${isWebFullScreen?"h-[727px]":"h-[368px]"} ${(isFan && !subscribedArtistInfo) || (!isFan && !publisher) ? 'hidden': ''}`}>

                        {!isFan && (
                            publisher !== undefined && (
                                <Video2 streamManager={publisher} publisherAudio={publisherAudio}
                                        publisherVideo={publisherVideo} right={true}
                                        muteHandler={muteHandler} style={`rounded-[15px] `}
                                        emoticonToggle={emoticonToggle}
                                        setEmoticonToggle={setEmoticonToggle}
                                        toastList={toastList}
                                        onClickReactBtn={onClickReactBtn}
                                        sendReactionHandler={sendReactionHandler}
                                        removeToast={removeToast}
                                        toasts={toasts}
                                        warnCnt={warnCnt}
                                        isWebFullScreen={isWebFullScreen}
                                        setIsWebFullScreen={setIsWebFullScreen}
                                        reserved_time={reserved_time}
                                        leftTimeRef={leftTimeRef}
                                />)

                        )}
                        {isFan && (
                            subscribedArtistInfo !== undefined && (
                                <Video2 style={`rounded-[15px]`} right={true}
                                        streamManager={subscribedArtistInfo}
                                        isStaff={isStaff}
                                        isTestConnect={isTestConnect}
                                        emoticonToggle={emoticonToggle}
                                        setEmoticonToggle={setEmoticonToggle}
                                        toastList={toastList}
                                        onClickReactBtn={onClickReactBtn}
                                        sendReactionHandler={sendReactionHandler}
                                        removeToast={removeToast}
                                        toasts={toasts}
                                        warnCnt={warnCnt}
                                        isWebFullScreen={isWebFullScreen}
                                        setIsWebFullScreen={setIsWebFullScreen}
                                        reserved_time={reserved_time}
                                        leftTimeRef={leftTimeRef}
                                />
                            )
                        )}
                    </div>

                    {((role === 'staff' && !publisherVideo) || (isFan && subscribedArtistInfo === undefined)) &&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{artistName}</span>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default VideoArea;

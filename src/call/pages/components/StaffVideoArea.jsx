import React, {useState} from 'react';
import Video2 from "../../../video/pages/Video2";
import InnerCircleText from "../../../common/InnerCircleText";

const StaffVideoArea = ({subscribedArtistInfo,subscribedFanInfo, fanInfo, roomInfo, warnCnt, toasts, removeToast, toggleFanLetter, setToggleFanLetter}) => {

    return (
        <div className={"flex flex-row justify-evenly"}>
            {/* Fan Area */}
            <div className='w-[650px] text-center'>
                        <span
                            className='text-[19px] font-medium flex justify-center items-center'>
                            {`FAN ${fanInfo?.fan_name} (${fanInfo?.age}세)`}
                            <InnerCircleText gender={fanInfo?.sex} width={"w-[22px]"} height={"h-[22px]"} bgcolor={"bg-[#444]"}
                                             ml={"ml-[13px]"} textSize={"text-[15px]"} textColor={"text-white"}
                                             fontWeight={"font-normal"}/></span>
                <div className={"flex flex-col mt-[24px]"}>
                    <div
                        className={`h-[368px] ${subscribedFanInfo ? "" : "hidden"}`}>
                        {subscribedFanInfo && (
                            <Video2 style={`rounded-[15px]`}
                                    streamManager={subscribedFanInfo}
                                    fanInfo={fanInfo}
                                    warnCnt={warnCnt}
                                    left={true}
                                    toasts={toasts}
                                    removeToast={removeToast}
                            />
                        )}

                    </div>

                    {!subscribedFanInfo &&<div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{roomInfo?.fan_name}</span>
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

            {/* Artist Area */}
            <div className='w-[650px]'>
                <div className='flex justify-center items-center'>
                    <>
                        <img src="../images/starIcon.png" alt='staricon'
                             className='w-[24px] h-[24px] mr-[7px]'/>
                        <div className='text-[19px] font-medium'>{subscribedArtistInfo?.username || roomInfo.artist_name}</div>
                    </>
                </div>
                <div className={"flex flex-col mt-[24px]"}>
                    <div className={`h-[368px] ${subscribedArtistInfo ? "" : "hidden"}`}>
                        {/*{isArtistLoading && <div>Loading...</div>}*/}
                        {subscribedArtistInfo&& (
                            <Video2 streamManager={subscribedArtistInfo}
                                    fanInfo={fanInfo}
                                    warnCnt={warnCnt}
                                    right={true}
                                    style={`rounded-[15px]`}
                                    toasts={toasts}
                                    removeToast={removeToast}
                            />)
                        }
                    </div>
                    {!subscribedArtistInfo &&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{roomInfo.artist_name}</span>
                        </div>}
                </div>
            </div>
        </div>);
};

export default StaffVideoArea;

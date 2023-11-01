import React from 'react';
import StaffVideoArea from "./StaffVideoArea";
import InnerCircleText from "../../../common/InnerCircleText";
import Video2 from "../../../video/pages/Video2";
import ConnectControl2 from "../../../room/components/ConnectControl2";

const TestVideoArea = ({
                           userInfo,
                           fanInfo,
                           publisher,
                           subscriber,
                           isTestConnect,
                           publisherVideo,
                           publisherAudio,
                           muteHandler,
                           toggleFanLetter,
                           setToggleFanLetter
                       }) => {

    const {age, fan_name, sex, } = fanInfo
    const {role, userId, username} = userInfo
    const isStaff = role === 'staff'
    const isFan = role === 'member'
    // const screenName = (userInfo) => userInfo.role === 'staff' ? staff_name : artist_name
    const left = (isFan, publisherVideo) => !isFan ? "" : publisherVideo ? "" : "hidden"
    const right = (isFan, publisherVideo) => isFan ? "" : publisherVideo ? "" : "hidden"
    const staffName = (role) => role === 'staff' ? (userInfo.username||'이름 없음') : (subscriber?.username||'이름 없음')

    return (
        <div className={"flex flex-row justify-evenly"}>
            {/* Fan Area */}
            <div className='w-[650px] text-center'>
                        <span
                            className='text-[19px] font-medium flex justify-center items-center'>
                            {`FAN ${fan_name||username} (${age}세)`}
                            <InnerCircleText gender={sex} width={"w-[22px]"} height={"h-[22px]"} bgcolor={"bg-[#444]"}
                                             ml={"ml-[13px]"} textSize={"text-[15px]"} textColor={"text-white"}
                                             fontWeight={"font-normal"}/>
                        </span>
                <div className={"flex flex-col mt-[24px]"}>
                    <div
                        className={`h-[368px] ${left(isFan, publisherVideo)}`}>

                        {
                            isFan ?
                                (
                                    publisher !== undefined && (
                                        <Video2 streamManager={publisher} publisherAudio={publisherAudio}
                                                publisherVideo={publisherVideo}
                                                muteHandler={muteHandler} style={`rounded-[15px]`}/>)

                                )
                                :
                                (
                                    subscriber !== undefined && (
                                        <Video2 style={`rounded-[15px]`}
                                                streamManager={subscriber} isStaff={isStaff}
                                                isTestConnect={isTestConnect}/>
                                    )
                                )
                        }
                    </div>
                    {!isFan && isTestConnect && <ConnectControl2/>}
                    {(!isFan && !subscriber) || (isFan && !publisherVideo)&&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{isFan? username:fan_name}</span>
                        </div>
                    }

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

            <div className='w-[650px]'>
                <div className='flex justify-center items-center'>
                    <>
                        <img src="../images/staffIcon.png" alt='stafficon'
                             className='w-[24px] h-[24px] mr-[7px]'/>
                        <div className='text-[19px] font-medium'>{staffName(userInfo.role)}</div>
                    </>
                </div>
                <div className={"flex flex-col mt-[24px]"}>
                    <div className={`h-[368px] ${right(isFan, publisherVideo)}`}>

                        {!isFan && (
                            publisher !== undefined && (
                                <Video2 streamManager={publisher} publisherAudio={publisherAudio}
                                        publisherVideo={publisherVideo}
                                        muteHandler={muteHandler} style={`rounded-[15px] `}/>)

                        )}
                        {isFan && (
                            subscriber !== undefined && (
                                <Video2 style={`rounded-[15px]`}
                                        streamManager={subscriber} isStaff={isStaff} isTestConnect={isTestConnect}/>
                            )
                        )}
                    </div>

                    {role === 'staff' && !publisherVideo &&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{staffName(userInfo.role)}</span>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default TestVideoArea;

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
                           subscribers,
                           isTestConnect,
                           publisherVideo,
                           publisherAudio,
                           muteHandler
                       }) => {

    const {age, fan_name, sex, message, name} = fanInfo
    const {role, userId, uesrname} = userInfo
    const isStaff = role === 'staff'
    const isFan = role === 'member'
    // const screenName = (userInfo) => userInfo.role === 'staff' ? staff_name : artist_name
    const left = (isFan, publisherVideo) => !isFan ? "" : publisherVideo ? "" : "hidden"
    const right = (isFan, publisherVideo) => isFan ? "" : publisherVideo ? "" : "hidden"

    return (
        <div className={"flex flex-row justify-evenly"}>
            {/* Fan Area */}
            <div className='w-[650px] text-center'>
                        <span
                            className='text-[19px] font-medium flex justify-center items-center'>
                            {`Fan ${fan_name || name} (${age}세)`}
                            <InnerCircleText gender={sex} width={"w-[22px]"} height={"h-[22px]"} bgcolor={"bg-[#444]"}
                                             ml={"ml-[13px]"} textSize={"text-[15px]"} textColor={"text-white"}
                                             fontWeight={"font-normal"}/></span>
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
                    {(isFan && !publisherVideo)&&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{"Fan 이름 나와야함"}</span>
                        </div>}

                    {message && <div className='text-center mt-[27px]'>
                        {/* <image /> */}
                        <span>{message}</span>
                    </div>}
                </div>
            </div>

            {/* Artist or Staff Area */}

            <div className='w-[650px]'>
                <div className='flex justify-center items-center'>
                    <>
                        <img src="../images/staffIcon.png" alt='stafficon'
                             className='w-[24px] h-[24px] mr-[7px]'/>
                        <div className='text-[19px] font-medium'>{'스태프이름'}</div>
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
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{"Staff 이름 나와야함"}</span>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default TestVideoArea;

import React from 'react';
import InnerCircleText from "../../../common/InnerCircleText";

import Video2 from "../../../video/pages/Video2";
import ConnectControl2 from "../../../room/components/ConnectControl2";
import StaffVideoArea from "./StaffVideoArea";

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
                   }) => {


    const {role} = userInfo
    const isStaff = role === 'staff'
    const isFan = role === 'fan'
    // const screenName = (userInfo) => userInfo.role === 'staff' ? staff_name : artist_name
    const left = (isFan, publisherVideo) => !isFan ? "" : publisherVideo ? "" : "hidden"
    const right = (isFan, publisherVideo) => isFan ? "" : publisherVideo ? "" : "hidden"

    console.log(fanInfo, 'fanInfo')

    const username = fanInfo?.fan_name
    const age = fanInfo?.age
    const gender = fanInfo?.sex
    const letter =  fanInfo?.letter

    return (
        <div className={"flex flex-row justify-evenly"}>
            {/* Fan Area */}
            <div className='w-[650px] text-center'>
                        <span
                            className='text-[19px] font-medium flex justify-center items-center'>
                            {`Fan ${username} (${age}세)`}
                            <InnerCircleText gender={gender} width={"w-[22px]"} height={"h-[22px]"} bgcolor={"bg-[#444]"}
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
                                    subscribedFanInfo !== undefined && (
                                        <Video2 style={`rounded-[15px]`}
                                                streamManager={subscribedFanInfo} isStaff={isStaff}
                                               />
                                    )
                                )
                        }
                    </div>
                    {!isFan && isTestConnect && <ConnectControl2/>}
                    {(role === 'fan' && !publisherVideo)&&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{fanInfo?.fan_name}</span>
                        </div>}

                    {letter && <div className='text-center mt-[27px]'>
                        {/* <image /> */}
                        <span>{letter}</span>
                    </div>}
                </div>
            </div>

            {/* Artist or Staff Area */}

            <div className='w-[650px]'>
                <div className='flex justify-center items-center'>
                    {/*{isStaff ?*/}
                    {/*    <>*/}
                    {/*        <img src="../images/staffIcon.png" alt='stafficon'*/}
                    {/*             className='w-[24px] h-[24px] mr-[7px]'/>*/}
                    {/*        <div className='text-[19px] font-medium'>{staff_name}</div>*/}
                    {/*    </>*/}
                    {/*    :*/}
                    {/*    <>*/}
                    {/*        <img src="../images/starIcon.png" alt='staricon'*/}
                    {/*             className='w-[24px] h-[24px] mr-[7px]'/>*/}
                    {/*        <div className='text-[19px] font-medium'>{artist_name}</div>*/}
                    {/*    </>*/}
                    {/*}*/}
                    <>
                        <img src="../images/starIcon.png" alt='staricon'
                             className='w-[24px] h-[24px] mr-[7px]'/>
                        <div className='text-[19px] font-medium'>{artistName}</div>
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
                            subscribedArtistInfo !== undefined && (
                                <Video2 style={`rounded-[15px]`}
                                        streamManager={subscribedArtistInfo} isStaff={isStaff} isTestConnect={isTestConnect}/>
                            )
                        )}
                    </div>

                    {role === 'staff' && !publisherVideo &&
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

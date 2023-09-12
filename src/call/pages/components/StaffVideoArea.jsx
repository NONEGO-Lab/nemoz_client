import React from 'react';
import Video2 from "../../../video/pages/Video2";
import InnerCircleText from "../../../common/InnerCircleText";

const StaffVideoArea = ({subscribedArtistInfo,subscribedFanInfo, fanInfo}) => {

    return (
        <div className={"flex flex-row justify-evenly"}>
            {/* Fan Area */}
            <div className='w-[650px] text-center'>
                        <span
                            className='text-[19px] font-medium flex justify-center items-center'>
                            {`Fan ${fanInfo?.fan_name} (${fanInfo?.age}세)`}
                            <InnerCircleText gender={fanInfo?.gender} width={"w-[22px]"} height={"h-[22px]"} bgcolor={"bg-[#444]"}
                                             ml={"ml-[13px]"} textSize={"text-[15px]"} textColor={"text-white"}
                                             fontWeight={"font-normal"}/></span>
                <div className={"flex flex-col mt-[24px]"}>
                    <div
                        className={`h-[368px] ${subscribedFanInfo ? "" : "hidden"}`}>
                        {subscribedFanInfo && (
                            <Video2 style={`rounded-[15px]`}
                                    streamManager={subscribedFanInfo}
                            />
                        )}

                    </div>

                    {!subscribedFanInfo &&<div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{subscribedFanInfo?.username}</span>
                    </div>}

                    {subscribedFanInfo?.message && <div className='text-center mt-[27px]'>
                        {/* <image /> */}
                        <span>{subscribedFanInfo?.message}</span>
                    </div>}
                </div>
            </div>

            {/* Artist Area */}
            <div className='w-[650px]'>
                <div className='flex justify-center items-center'>
                    <>
                        <img src="../images/starIcon.png" alt='staricon'
                             className='w-[24px] h-[24px] mr-[7px]'/>
                        <div className='text-[19px] font-medium'>{subscribedArtistInfo?.username}</div>
                    </>
                </div>
                <div className={"flex flex-col mt-[24px]"}>
                    <div className={`h-[368px] ${subscribedArtistInfo ? "" : "hidden"}`}>
                        {/*{isArtistLoading && <div>Loading...</div>}*/}
                        {subscribedArtistInfo&& (
                            <Video2 streamManager={subscribedArtistInfo}
                                    style={`rounded-[15px] `}/>)
                        }
                    </div>
                    {!subscribedArtistInfo &&
                        <div className={`relative h-[368px] border-none rounded-[15px] bg-[#444] flex`}>
                                <span
                                    className='flex justify-center items-center text-[25px] text-white w-full'>{"artist 이름 나와야함"}</span>
                        </div>}
                </div>
            </div>
        </div>);
};

export default StaffVideoArea;

import React, {useRef, useEffect, Fragment} from "react";
import {useSelector} from "react-redux";
import InnerCircleText from "../../common/InnerCircleText";


const Video2 = ({streamManager, name, age, gender}) => {

    const videoRef = useRef();
    console.log('in Video', streamManager)
    useEffect(() => {
        console.log('useEffect in Video')
        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }

    }, [streamManager]);


    return (
        <>
            {
                streamManager !== undefined &&
                <video
                    className={`object-contain h-[100%] w-full`}
                    autoPlay
                    ref={videoRef}

                />
            }
            <div className={'absolute top-[90%] w-full'}>
                <div className={'text-[19px] font-medium text-white flex justify-center items-center'}>
                    {`FAN ${name}(${age}세)`}
                <InnerCircleText gender={gender} textSize={'text-[15px]'} fontWeight={"font-medium"} textColor={"text-[#444]"} bgcolor={"bg-white"} width={"w-[22px]"} height={"h-[22px]"} ml={"ml-[9px]"} />
                </div>
                </div>
        </>
    )


};

export default Video2;
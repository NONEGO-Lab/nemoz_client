import React, {useRef, useEffect, Fragment} from "react";
import InnerCircleText from "../../common/InnerCircleText";


const Video2 = ({streamManager, userInfo}) => {

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
            {userInfo &&
                <div className={'absolute top-[90%] w-full'}>
                    <div className={'text-[19px] font-medium text-white flex justify-center items-center'}>
                        {`FAN ${userInfo.name}(${userInfo.age}세)`}
                        <InnerCircleText gender={userInfo.gender} textSize={'text-[15px]'}
                                         fontWeight={"font-medium"}
                                         textColor={"text-[#444]"} bgcolor={"bg-white"} width={"w-[22px]"} />
                    </div>
                </div>
            }
        </>
    )


};

export default Video2;
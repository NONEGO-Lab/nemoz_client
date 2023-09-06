import React, {useRef, useEffect, Fragment} from "react";
import InnerCircleText from "../../common/InnerCircleText";
import ConnectControl2 from "../../room/components/ConnectControl2";


const Video2 = ({streamManager, userInfo, style, isStaff, isTestConnect}) => {

    const videoRef = useRef();
    useEffect(() => {

        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }

    }, [streamManager]);


    return (
        <>
            {
                streamManager !== undefined &&
                <video
                    className={`object-contain h-[100%] w-full ${style}`}
                    autoPlay
                    ref={videoRef}

                />
            }
            {userInfo &&
                <div className={'absolute top-[90%] w-full'}>
                    <div className={'text-[19px] font-medium text-white flex justify-center items-center'}>
                        {`${userInfo.role} ${userInfo.name??''}${userInfo.age?(userInfo.age + '세'):''}`}
                        <InnerCircleText gender={userInfo.gender} textSize={'text-[15px]'}
                                         fontWeight={"font-medium"}
                                         textColor={"text-[#444]"} bgcolor={"bg-white"} width={"w-[22px]"} />
                    </div>
                </div>
            }
            {isStaff && isTestConnect &&
                <ConnectControl2 />
            }
        </>
    )


};

export default Video2;
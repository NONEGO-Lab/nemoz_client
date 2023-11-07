import React, {useRef, useEffect, Fragment} from "react";
import {useSelector} from "react-redux";
import {upper_imoticon_path, down_imoticon_path} from "../../common/imoticon_path";
import Toast from "../../shared/Toast";
import {nanoid} from "nanoid";
import {subscribedFanInfo} from "../../redux/modules/videoSlice";
import {timeToKorean} from "../../utils/convert";
import {Timer} from "../../call/pages/components";


const VideoForMobile = ({
                    streamManager,
                    style,
                    fanInfo,
                    warnCnt,
                    emoticonToggle,
                    setEmoticonToggle,
                    sendReactionHandler,
                    isWebFullScreen,
                    setIsWebFullScreen,
                    deviceSetting,
                    reserved_time,
                    fanEnterNoti,
                    leftTimeRef
                }) => {

    const videoRef = useRef();
    const userInfo = useSelector(state => state.user.userInfo)
    const toastList = useSelector(state => state.toast.toastList)
    const unique_id = nanoid(4)
    const selectedAudioOutputDeviceId = localStorage.getItem("audioOutputId")
    useEffect(() => {

        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }

        if (videoRef.current && deviceSetting) {
            videoRef.current.setSinkId(selectedAudioOutputDeviceId)
                .then(() => {
                })
                .catch(error => {
                    console.error('Error setting audio output: ', error);
                });
        }

    }, [streamManager]);

    return (
        <>
            {
                <video
                    className={`object-contain h-[100%] w-full ${style} scale-x-[-1] `}
                    autoPlay
                    ref={videoRef}
                />
            }

        </>
    )


};


export default VideoForMobile;
import DeviceSelect from "element/DeviceSelect";
import { ModalFrame } from "modal/ModalFrame";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearDeviceSession } from "redux/modules/deviceSlice";
import { useDeviceTest } from "test/controller/useDeviceTest";
import { testApi } from "test/data/call_test_data";
import Video2 from "video/pages/Video2";
import { setError, setIsError } from "../../redux/modules/errorSlice";


const DeviceSetting = ({ closeDeviceSetting }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const style = "w-[650px] min-h-[900px] drop-shadow-md  rounded-[15px] bg-[#fff]";

    const { register, watch } = useForm();
    const { createJoinSession, msgBeforeOut } = useDeviceTest();
    const publisher = useSelector((state) => state.device.publisher);
    const sessionInfo = useSelector((state) => state.device.sessionInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const fanInfo = useSelector((state) => state.test.fanInfo);
    const videoDevices = useSelector((state) => state.device.videoDevices);
    const audioDevices = useSelector((state) => state.device.audioDevices);
    const eventName = useSelector(state => state.event.eventName)

    let videoList = videoDevices.map((video) => video.label);
    let audioList = audioDevices.map((audio) => audio.label);

    console.log(sessionInfo)

    const endMeet = async () => {
        try {
            console.log('end Meet in Device Setting', sessionInfo.meetName)
            const response = await testApi.testEnd(sessionInfo.meetName);
            if (response) {
                dispatch(clearDeviceSession());
                closeDeviceSetting()
            } else {
                alert("미팅이 종료되지 않았습니다.");
            }
        } catch (err) {
            dispatch(setError(err));
            dispatch(setIsError(true));
        }

    }

    const outRoom = async () => {
        if (window.confirm("정말 나가시겠습니까?")) {
            await endMeet()
            closeDeviceSetting()

        }
    }

    const setDefaultDevice = () => {
        if (!localStorage.getItem("audioId")) {
            localStorage.setItem("audioId", audioDevices[0].deviceId);
        }
        if (!localStorage.getItem("videoId")) {
            localStorage.setItem("videoId", videoDevices[0].deviceId);
        }
    }

    const setDeviceHandler = async () => {
        //완료 버튼을 누르면, 장비 체크 여부 확인을 하고 연결 테스트 화면으로 넘어간다.
        setDefaultDevice();

        if (userInfo.role !== "fan") {
            localStorage.setItem("isSetDevice", "true");
            await endMeet();
            navigate(`/test/${fanInfo.fan_id}`);

        } else {
            await endMeet();
            navigate(`/test/${userInfo.id}`);


        }
    }

    useEffect(() => {
        //meet start를 해준다. 완료할때 /meet end 를 해준다.
        createJoinSession().then((sessionInfo) => {

        })

    }, [])



    return (
        <ModalFrame setOnModal={closeDeviceSetting} style={style}>
            <div className="flex flex-col justify-center">
                <div className=" flex justify-between items-center px-[60px] mt-[60px]">
                    <div className="text-[22.5px] font-medium w-[433px] ">{eventName}</div>
                    <img className={"w-20px h-[20px] cursor-pointer"} src={"../images/closeIcon.png"} alt={"close-icon"}
                        onClick={outRoom} />
                </div>
                <div className="mt-[40px]">
                    <div className="h-[368px] flex justify-center relative">
                        {publisher !== undefined && (
                            <Video2 streamManager={publisher} userInfo={userInfo} />)
                        }
                    </div>
                </div>
                <div className="mt-[50px] mx-[60px]">
                    <form>
                        <DeviceSelect
                            register={register}
                            options={videoList ?? []}
                            name={"videoDevices"}
                            isVideo={true}
                            width={"w-[100%]"}
                            mb={"mb-[20px]"}
                            border={"border border-[#c7c7c7] rounded-[10px]"}
                        />
                        <DeviceSelect
                            register={register}
                            options={audioList ?? []}
                            name={"audioDevices"}
                            isAudio={true}
                            width={"w-[100%]"}
                            border={"border border-[#c7c7c7] rounded-[10px]"}
                        />

                    </form>
                </div>
                <div className="m-[60px]">
                    <button onClick={setDeviceHandler}
                        className="min-h-[67px]  w-[100%] rounded-[10px] flex items-center justify-center bg-[#00cace] text-white text-[26px]">완료
                    </button>
                </div>
            </div>

        </ModalFrame>

    )
}


export default DeviceSetting
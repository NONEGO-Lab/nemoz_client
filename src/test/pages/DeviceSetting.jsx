import DeviceSelect from "element/DeviceSelect";
import { ModalFrame } from "modal/ModalFrame";
import React, {useEffect} from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearDeviceSession } from "redux/modules/deviceSlice";
import { useDeviceTest } from "test/controller/useDeviceTest";
import { testApi } from "test/data/call_test_data";
import Video2 from "video/pages/Video2";
import { setError, setIsError } from "../../redux/modules/errorSlice";
import {toggleDeviceSettingModal} from "../../redux/modules/testSlice";


const DeviceSetting = ({ closeDeviceSetting }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const style = "w-[650px] h-[900px] rounded-[15px] drop-shadow-md";

    const { register, watch, handleSubmit } = useForm();
    const { createJoinSession } = useDeviceTest();
    const publisher = useSelector((state) => state.device.publisher);
    const sessionInfo = useSelector((state) => state.device.sessionInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const fanInfo = useSelector((state) => state.test.fanInfo);
    const videoDevices = useSelector((state) => state.device.videoDevices);
    const audioDevices = useSelector((state) => state.device.audioDevices);
    const audioOutputDevices = useSelector((state) => state.device.audioOutputDevices);
    const eventName = useSelector(state => state.event.eventName)
    const eventId = useSelector((state) => state.event.eventId);
    // let videoList = videoDevices.map((video) => video.label);
    const userRole = userInfo.role
    let audioList = audioDevices.map((audio) => ({label:audio.label, deviceId:audio.deviceId}));

    let audioOuputList = audioOutputDevices.map((audio) => ({label:audio.label, deviceId:audio.deviceId}));

    const endMeet = async () => {
        try {
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

    const setDefaultDevice = (data) => {
        const { selectedAudioDevices, selectedAudioOutputDevices } = data
        if (!localStorage.getItem("audioId")) {
            localStorage.setItem("audioId", selectedAudioDevices||audioDevices[0].deviceId);
        }
        if (!localStorage.getItem("audioOutputId")) {
            localStorage.setItem("audioOutputId", selectedAudioOutputDevices||audioOutputDevices[0].deviceId);
        }
        if (!localStorage.getItem("videoId")) {
            localStorage.setItem("videoId", videoDevices[0].deviceId);
        }

    }

    const setDeviceHandler = async (data) => {
        //완료 버튼을 누르면, 장비 체크 여부 확인을 하고 연결 테스트 화면으로 넘어간다.
        setDefaultDevice(data);
        if (userInfo.role !== "fan") {
            localStorage.setItem("isSetDevice", "true");
            await endMeet();
            dispatch(toggleDeviceSettingModal(false))
            navigate(`/test/${eventId}_${userRole !=='member' ?fanInfo.fan_id : userInfo.id}`);

        } else {
            await endMeet();
            navigate(`/test/${eventId}_${fanInfo.fan_id}`);


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
                <div className=" flex justify-between items-center h-[150px] px-[60px]">
                    <div className="text-[22.5px] font-medium w-[433px] ">{eventName}</div>
                    <img className={"w-[20px] h-[20px] cursor-pointer"} src={"/images/closeIcon.png"} alt={"close-icon"}
                        onClick={outRoom} />
                </div>
                <div >
                    <div className="h-[367.5px] flex justify-center relative">
                        {publisher !== undefined && (
                            <Video2 streamManager={publisher} userInfo={userInfo} deviceSetting={true} />)
                        }
                    </div>
                </div>
                <div className="mx-[45px] mt-[50px]">
                    <form>
                        {/*<DeviceSelect*/}
                        {/*    register={register}*/}
                        {/*    options={videoList ?? []}*/}
                        {/*    name={"videoDevices"}*/}
                        {/*    isVideo={true}*/}
                        {/*    width={"w-[100%]"}*/}
                        {/*    mb={"mb-[20px]"}*/}
                        {/*    border={"border border-[#c7c7c7] rounded-[10px]"}*/}
                        {/*/>*/}
                        <DeviceSelect
                            label={
                                <img
                                    src="/images/micIcon.png"
                                    className="w-[15px] h-[21px] mr-[10px]"
                                    alt={"mic"}
                                />
                            }
                            register={register}
                            options={audioList ?? []}
                            name={"selectedAudioDevices"}
                            width={"w-[100%]"}
                            border={"border border-[#c7c7c7] rounded-[10px]"}
                            mb={"mb-[25px]"}
                        />
                        <DeviceSelect
                            label={<img src="/images/soundIcon.png" className="w-[15px] h-[21px] mr-[10px]" alt={'speaker'}/>}
                            register={register}
                            options={audioOuputList ?? []}
                            name={"selectedAudioOutputDevices"}
                            width={"w-[100%]"}
                            border={"border border-[#c7c7c7] rounded-[10px]"}
                        />
                    </form>
                </div>
                <div className="mt-[60.5px] mx-[40px]">
                    <button onClick={handleSubmit(setDeviceHandler)}
                        className="min-h-[66.5px]  w-[100%] rounded-[10px] flex items-center justify-center bg-[#00cace] text-white text-[26.3px]">완료
                    </button>
                </div>
            </div>

        </ModalFrame>

    )
}


export default DeviceSetting
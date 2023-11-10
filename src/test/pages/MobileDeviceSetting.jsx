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
import { toggleDeviceSettingModal } from "../../redux/modules/testSlice";

const MobileDeviceSetting = ({ closeDeviceSetting }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const style =
    "w-[100%] max-w-[100vw] max-h-[100vh] min-h-[100%] h-[100vh] bg-[#fff] absolute top-0 left-0 z-[100] p-[2rem] overflow-hidden";

  const { register, watch, handleSubmit } = useForm();
  const { createJoinSession, isMobile } = useDeviceTest();
  const publisher = useSelector((state) => state.device.publisher);
  const sessionInfo = useSelector((state) => state.device.sessionInfo);
  const userInfo = useSelector((state) => state.user.userInfo);
  const fanInfo = useSelector((state) => state.test.fanInfo);
  const videoDevices = useSelector((state) => state.device.videoDevices);
  const audioDevices = useSelector((state) => state.device.audioDevices);
  const audioOutputDevices = useSelector(
    (state) => state.device.audioOutputDevices
  );
  const eventName = useSelector((state) => state.event.eventName);
  const eventId = useSelector((state) => state.event.eventId);

  let videoList = videoDevices.map((video) => video.label);
  let audioList = audioDevices.map((audio) => ({
    label: audio.label,
    deviceId: audio.deviceId,
  }));

  let audioOuputList = audioOutputDevices.map((audio) => ({
    label: audio.label,
    deviceId: audio.deviceId,
  }));

  const endMeet = async () => {
    try {
      const response = await testApi.testEnd(sessionInfo.meetName);
      if (response) {
        dispatch(clearDeviceSession());
        closeDeviceSetting();
      } else {
        alert("미팅이 종료되지 않았습니다.");
      }
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  };

  const outRoom = async () => {
    if (window.confirm("정말 나가시겠습니까?")) {
      await endMeet();
      closeDeviceSetting();
    }
  };

  const setDefaultDevice = (data) => {
    const { selectedAudioDevices, selectedAudioOutputDevices } = data;
    if (!localStorage.getItem("audioId")) {
      localStorage.setItem(
        "audioId",
        selectedAudioDevices || audioDevices[0].deviceId
      );
    }
    if (!localStorage.getItem("audioOutputId") && !isMobile) {
      localStorage.setItem(
        "audioOutputId",
        selectedAudioOutputDevices || audioOutputDevices[0].deviceId
      );
    }
    if (!localStorage.getItem("videoId")) {
      localStorage.setItem("videoId", videoDevices[0].deviceId);
    }
  };

  const setDeviceHandler = async (data) => {
    //완료 버튼을 누르면, 장비 체크 여부 확인을 하고 연결 테스트 화면으로 넘어간다.
    setDefaultDevice(data);
    if (userInfo.role !== "fan") {
      localStorage.setItem("isSetDevice", "true");
      await endMeet();
      dispatch(toggleDeviceSettingModal(false));
      navigate(`/test/${eventId}_${userInfo.id}`);
    } else {
      await endMeet();
      navigate(`/test/${eventId}_${fanInfo.fan_id}`);
    }
  };

  useEffect(() => {
    //meet start를 해준다. 완료할때 /meet end 를 해준다.
    createJoinSession().then((sessionInfo) => {});
  }, []);

  return (
    <ModalFrame setOnModal={closeDeviceSetting} style={style}>
      <div className="flex flex-col justify-center ">
        <div className="flex justify-between items-center">
          <div></div>
          <img
            className={"w-[20px] h-[20px] mt-[2rem] cursor-pointer"}
            src={"../images/closeIcon.png"}
            alt={"close-icon"}
            onClick={outRoom}
          />
        </div>
        <div className="mt-[40px]">
          <div className="text-[1.2rem] font-medium">{eventName}</div>
          <div className="w-[100vw] h-[75vw] mx-[-2rem] my-[2rem] flex justify-center bg-[#eee]">
            {publisher !== undefined && (
              <Video2
                streamManager={publisher}
                userInfo={userInfo}
                deviceSetting={true}
              />
            )}
          </div>
        </div>
        <div className="">
          <form>

            <DeviceSelect
              label={
                <img
                  src="/images/micIcon.png"
                  className="w-[19px] h-[28px] mr-[2px]"
                  alt={"mic"}
                />
              }
              register={register}
              options={audioList ?? []}
              name={"selectedAudioDevices"}
              width={"w-[100%]"}
              border={"border border-[#c7c7c7] rounded-[10px]"}
              mb={"items-center mb-[20px] py-[0.6rem]"}

            />

            <DeviceSelect
                label={<img src="/images/soundIcon.png" className="w-[27px] h-[23px] mr-[2px]" alt={'speaker'}/>}
                register={register}
                options={audioOuputList ?? []}
                name={"selectedAudioOutputDevices"}
                width={"w-[100%]"}
                mb={"items-center mb-[20px] py-[0.6rem]"}
                border={"border border-[#c7c7c7] rounded-[10px]"}
            />
          </form>
        </div>
        <div className="my-[60px]">
          <button
            onClick={handleSubmit(setDeviceHandler)}
            className={`w-[100%] min-h-[50px] rounded-[10px] text-[1.2rem] cursor-pointer  text-white font-medium ${"bg-[#00cace]"} flex items-center justify-center`}
          >
            완료
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default MobileDeviceSetting;

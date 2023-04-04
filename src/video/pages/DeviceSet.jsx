import React, { useEffect } from "react";
import { Select, Button } from "../../element";
import { useForm, useWatch } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const DeviceSet = () => {

  const { register, watch } = useForm();
  const videoDevices = useSelector((state) => state.device.videoDevices);
  const audioDevices = useSelector((state) => state.device.audioDevices);

  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  })

  let videoList = videoDevices.map((video) => video.label);
  let audioList = audioDevices.map((audio) => audio.label);

  const watchAllFields = watch((data, { name, type }) => {
    let videoId = videoDevices.find((vi) => vi.label === data.videoDevices);
    let audioId = audioDevices.find((au) => au.label === data.audioDevices);

    localStorage.setItem("audio", audioId.deviceId);
    localStorage.setItem("video", videoId.deviceId);
  });

  if(isMobile) {
    return (
        <div className="mt-10 m-auto w-[calc(100%-50px)]">
          <form>
            <Select
                register={register}
                options={videoList}
                name={"videoDevices"}
                label={"비디오 설정"}
                placeholder={"입력..."}
                width={"w-[100%]"}
                height={"h-[45px]"}
                marginBottom={"mb-[20px]"}

            />
            <Select
                register={register}
                options={audioList}
                name={"audioDevices"}
                label={"오디오 설정"}
                placeholder={"입력..."}
                width={"w-[100%]"}
                height={"h-[45px]"}
            />
          </form>
        </div>

    )
  } else {
    return (
        //웹
        <form>
          <Select
              register={register}
              options={videoList}
              name={"videoDevices"}
              label={"비디오 설정"}
              placeholder={"입력..."}
              width={"w-[100%]"}

          />
          <Select
              register={register}
              options={audioList}
              name={"audioDevices"}
              label={"오디오 설정"}
              placeholder={"입력..."}
              width={"w-[100%]"}
          />

        </form>
    )
  }


}

export default DeviceSet;
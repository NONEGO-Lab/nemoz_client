import { Select } from "element";
import DeviceSelect from "element/DeviceSelect";
import { ModalFrame } from "modal/ModalFrame";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";



const DeviceSetting = ({ closeDeviceSetting }) => {



    const style = "w-[650px] min-h-[900px] drop-shadow-md  rounded-[15px] bg-[#fff]";

    const { register, watch } = useForm();
    const videoDevices = useSelector((state) => state.device.videoDevices);
    const audioDevices = useSelector((state) => state.device.audioDevices);
    
    let videoList = videoDevices.map((video) => video.label);
    let audioList = audioDevices.map((audio) => audio.label);

    let tmpList = ['testtesttest1','testtesttest2'];
    
    const watchAllFields = watch((data, { name, type }) => {
        let videoId = videoDevices.find((vi) => vi.label === data.videoDevices);
        let audioId = audioDevices.find((au) => au.label === data.audioDevices);

        localStorage.setItem("audio", audioId.deviceId);
        localStorage.setItem("video", videoId.deviceId);
    });

    return (
        <ModalFrame setOnModal={closeDeviceSetting} style={style}>
            <div className="flex flex-col justify-center">
                <div className=" flex justify-between items-center px-[60px] mt-[60px]">
                    <div className="text-[22.5px] font-medium ">BLACKPINK Jisoo First Single Album ‘ME’
                        Fan Meeting Event</div>
                    <img className={"w-20px h-[20px] cursor-pointer"} src={"../images/closeIcon.png"} alt={"close-icon"}
                        onClick={closeDeviceSetting} />
                </div>
                <div className="mt-[40px]">
                    <div className="h-[368px] bg-amber-500">
                        <div className="flex flex-col items-center">FAN 누렁이(20세) 남</div>
                    </div>
                </div>
                <div className="mt-[50px] mx-[60px]">
                    <form>
                        <DeviceSelect
                            register={register}
                            options={tmpList}
                            name={"videoDevices"}
                            isVideo={true}
                            width={"w-[100%]"}
                            mb={"mb-[20px]"}
                            border={"border border-[#c7c7c7] rounded-[10px]"}

                        />
                        <DeviceSelect
                            register={register}
                            options={tmpList}
                            name={"audioDevices"}
                            isAudio={true}
                            width={"w-[100%]"}
                            border={"border border-[#c7c7c7] rounded-[10px]"}
                        />

                    </form>
                </div>
                <div className="m-[60px]">
                    <button  onClick={closeDeviceSetting} className="min-h-[67px]  w-[100%] rounded-[10px] flex items-center justify-center bg-[#00cace] text-white text-[26px]">완료</button>
                </div>
            </div>

        </ModalFrame>

    )
}


export default DeviceSetting
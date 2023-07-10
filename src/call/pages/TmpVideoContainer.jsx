import React from 'react';
import Header from "../../shared/Header";
import { SizeLayout } from "../../shared/Layout";
import { ReactionButton } from "../../reaction/pages/components/index";
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useState } from 'react';
// const isVideoTurnOn = false;
// const isVoiceOn = true
const TmpVideoContainer = () => {
    const [isVideoTurnOn, SetIsVideoTurnOn] = useState(true)
    const [isVoiceoTurnOn, SetIsVoiceTurnOn] = useState(true)
    return (
        <SizeLayout>
            <Header />
            <div className={"h-[700px] bg-main_theme flex flex-col justify-center"}>
                <div className={"h-[150px] flex justify-center pt-[100px] text-[18px]"}>
                    fan meeting title Area
                </div>
                <div className={"h-[350px] bg-yellow-400 flex flex-row justify-between "}>
                    <div className={"w-[50%] bg-blue-300 flex flex-col"}>
                        <div className={"text-center"}>Fan Info</div>
                        <div className={`relative h-[360px] mx-[10px] border-2 border-box border-black flex`}>Fan Video</div>
                        <div className={"text-center"}>Fan Letter</div>
                    </div>
                    <div className={"w-[50%] bg-purple-300 flex flex-col"}>
                        <div className={"text-center"}>Artist Info</div>
                        <div className={`relative h-[360px] mx-[10px] border-2 border-box border-black flex `}>Artist Video</div>
                        <div className={"text-center"}>Artist Letter</div>
                    </div>
                </div>
                <div className={"h-[200px] bg-green-400 flex flex-col "}>
                    <div className={"bg-pink-600 h-[40%] flex justify-center items-center"}>
                        <ReactionButton />
                    </div>
                    <div className={"bg-indigo-600 h-[60%] flex justify-center items-center flex-row"}>

                        <div className={"flex flex-col text-[8px] items-center w-[75px]"} onClick={() => SetIsVideoTurnOn(prev => !prev)}>
                            <div className={"w-[32px] h-[32px] rounded-full bg-white flex justify-center items-center  hover:bg-slate-300 cursor-pointer"}>
                                {isVideoTurnOn? <VideocamOutlinedIcon />:<VideocamOffOutlinedIcon/>}
                            </div>
                            <div className={"mt-[10px] flex flex-col items-center"}>
                                <div>{`영상`}</div>
                                <div className='mt-[-5px]'>{`on/off`}</div>
                            </div>
                        </div>


                        <div className={"flex flex-col text-[8px] items-center w-[75px]"}  onClick={() => SetIsVoiceTurnOn(prev => !prev)}>
                            <div className={"w-[32px] h-[32px] rounded-full bg-white flex justify-center items-center  hover:bg-slate-300 cursor-pointer"}>
                                {isVoiceoTurnOn ? <KeyboardVoiceOutlinedIcon /> : <MicOffOutlinedIcon/>}
                            </div>
                            <div className={"mt-[10px] flex flex-col items-center"}>
                                <div>{`음성`}</div>
                                <div className='mt-[-5px]'>{`on/off`}</div>
                            </div>
                        </div>


                        <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                            <div className={"w-[32px] h-[32px] rounded-full bg-white flex justify-center items-center  hover:bg-slate-300 cursor-pointer"}>
                                <CloseOutlinedIcon/>
                            </div>
                            <div className={"mt-[10px] flex flex-col items-center"}>
                                <div>{`다음 순서 통화`}</div>
                            </div>
                        </div>



                        <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                            <div className={"w-[32px] h-[32px] rounded-full bg-white flex justify-center items-center  hover:bg-slate-300 cursor-pointer"}>
                                <CloseOutlinedIcon/>
                            </div>
                            <div className={"mt-[10px] flex flex-col items-center"}>
                                <div>{`현재 통화 종료`}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </SizeLayout>
    );
};

export default TmpVideoContainer;
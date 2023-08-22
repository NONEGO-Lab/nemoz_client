import React from 'react';
import Header from "../../shared/Header";
import { SizeLayout } from "../../shared/Layout";
import { ReactionButton } from "../../reaction/pages/components/index";

import { useState } from 'react';
import TestCallUtil from './components/testCallUtil';
// const isVideoTurnOn = false;
// const isVoiceOn = true
const TmpVideoContainer = () => {
    const [isVideoTurnOn, SetIsVideoTurnOn] = useState(false)
    const [isVoiceoTurnOn, SetIsVoiceTurnOn] = useState(false)
    const title = 'Jisoo First Single Album ‘ME’ Fan Meeting'
    const fan_name = '누렁이'
    const fan_age = 20
    const fan_letter = '블핑 김지수 1호팬, 여기 숨 쉰 채 발견되다'
    const artist_name = "블핑 지수"

    return (
        <SizeLayout isVideo={true} width={'w-[1366px]'} height={'min-h-[1024px]'}>
            <Header />
            <div className={"bg-main_theme flex flex-col justify-center"}>
                <div className={"flex justify-center pt-[100px] text-[23px] text-[#444] font-[500] mb-[80px]"}>
                    <span>
                        <img className='w-[30px] h-[30px]' src="../images/roomIcon.png" alt="room-icon" />
                    </span>
                    <span className='ml-[10px]'>{title}</span>
                </div>

                <div className='flex justify-center mb-[-30px]'>
                    <span className='w-[125px] h-[30px] rounded-[15px] border-[1.5px] border-[#444] text-[16px] text-[#444] flex items-center justify-center'>
                        <div>Test Call</div>
                        <div className='w-[8px] h-[8px] rounded-full bg-[#02c5cb] ml-[6px]' />
                    </span>
                </div>

                <div className={"flex flex-row justify-evenly"}>
                    {/* Fan Area */}
                    <div className='w-[650px] text-center'>
                        <span className='text-[19px] font-medium'>{`Fan ${fan_name} (${fan_age}세)`}</span>
                        <div className={"flex flex-col mt-[24px]"}>
                            <div className={`relative h-[360px] border-none rounded-[15px] bg-[#444] flex  flex-col justify-end`}>
                                {!isVideoTurnOn && <div className='flex justify-center items-center text-[25px] text-white w-full'>FAN</div>}
                             
                                    <div className={`w-full flex justify-center items-end mb-[43px] ${!isVideoTurnOn ? "mt-[98px]" :""}`}>
                                        <div className='w-[180px] min-h-[50px] mr-[35px] rounded-[25px] bg-white flex items-center justify-center cursor-pointer'>
                                            <div className='text-[#02c5cb] text-[19px] font-medium'>연결 성공</div>
                                          </div>
                                        <div className='w-[180px] min-h-[50px] rounded-[25px] bg-[#ff483a] flex items-center justify-center cursor-pointer'>
                                            <span className='text-white text-[19px] font-medium'>연결 실패</span>
                                        </div>
                                    </div>
                            </div>
                            {fan_letter && <div className='text-center mt-[27px]'>
                                {/* <image /> */}
                                <span>{fan_letter}</span>
                            </div>}
                        </div>
                    </div>

                    {/* Artist Area */}
                    <div className='w-[650px]'>
                        <div className='flex justify-center items-center'>
                            <img src="../images/starIcon.png" alt='staricon' className='w-[24px] h-[24px] mr-[7px]' />

                            <div className='text-[19px] font-medium'>{artist_name}</div>
                        </div>
                        <div className={"flex flex-col mt-[24px]"}>
                            <div className={`relative h-[360px] border-none rounded-[15px] bg-[#444] flex`}>
                                {!isVideoTurnOn && <span className='flex justify-center items-center text-[25px] text-white w-full'>ARTIST</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/*                     
                    <div className={"bg-pink-600 h-[40%] flex justify-center items-center"}>
                        <ReactionButton />
                    </div> */}

                {/* 기능 Component */}
                <TestCallUtil isVideoTurnOn={isVideoTurnOn}
                    SetIsVideoTurnOn={SetIsVideoTurnOn}
                    isVoiceoTurnOn={isVoiceoTurnOn}
                    SetIsVoiceTurnOn={SetIsVoiceTurnOn}
                    role={'staff'}
                />

            </div>
        </SizeLayout>
    );
};

export default TmpVideoContainer;
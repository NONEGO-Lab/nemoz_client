import React, {useRef, useEffect, Fragment} from "react";
import InnerCircleText from "../../common/InnerCircleText";
import {useSelector} from "react-redux";
import {upper_imoticon_path, down_imoticon_path} from "../../common/imoticon_path";
import {ToastContainer} from "react-toastify";
import styled from "@emotion/styled";
import 'react-toastify/dist/ReactToastify.css';

const Video2 = ({streamManager, style, fanInfo, warnCnt, left, right, imoticonToggle, setImoticonToggle, toastList, onClickReactBtn}) => {

    const videoRef = useRef();
    const userInfo = useSelector(state => state.user.userInfo)
    const subscribedFanInfo = useSelector(state => state.video.subscribedFanInfo)
    useEffect(() => {

        if (streamManager.stream && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }

    }, [streamManager]);


    console.log(toastList, 'toastList')
    const currentRole = userInfo.role

    return (
        <>
            {
                <video
                    className={`object-contain h-[100%] w-full ${style} scale-x-[-1] `}
                    autoPlay
                    ref={videoRef}
                />
            }
            <div className={"w-[250px] h-[300px] bg-amber-200 absolute top-[31%] ml-[400px] flex flex-col justify-end"}>

                {/*<div className={"flex justify-center items-center bg-black bg-opacity-[0.15] rounded-[22.5px] w-[172.5px] ml-[78px] h-[45.5px]"}>*/}
                {/*    <span className={"text-[16px] text-white mr-[12.5px] my-[15px] flex items-center"}>*/}
                {/*        <span className={"text-[34px]"}>🥲</span>를 받았습니다.*/}
                {/*    </span>*/}
                {/*    <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"} onClick={()=>alert('close chat')}/>*/}
                {/*</div>*/}

                {/*<div className={"flex justify-center items-center bg-black bg-opacity-[0.7] rounded-[22.5px] mt-[10px] h-[45.5px]"}>*/}
                {/*    <img src={"/images/warningIconInScreen.png"} className={"w-[25px] h-[25px] mr-[9px]"}*/}
                {/*         alt={"warning"}/>*/}
                {/*    <span className={"text-[16px] text-white mr-[12.5px] my-[15px]"}>경고를 1회 받았습니다.</span>*/}
                {/*    <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"} onClick={()=>alert('close chat')}/>*/}
                {/*</div>*/}
                <StyledToastContainer
                    className="absolute"
                    position="bottom-center"
                    autoClose={false}
                    hideProgressBar
                />
            </div>
            {(left && imoticonToggle) &&
                <div
                    className={"w-[390px] h-[200px] bg-white top-[61%] left-[15.5%] absolute rounded-[15px] pt-[34px] pb-[36px] px-[40px] z-10"}>
                    <img src={"/images/boxTale.png"} className={"w-[16px] h-[14px] absolute left-[98%] top-[10%]"}/>
                    <div className={"flex"}>
                        {upper_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col items-center mr-[35px]`} key={i.name} onClick={()=>onClickReactBtn(i)}>
                                <div className={"text-[31px]"}>{i.imo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)
                        }
                    </div>
                    <div className={"flex"}>
                        {down_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col items-center ${idx===0?"mr-[40px]":"mr-[35px]"}`} key={i.name} onClick={()=>onClickReactBtn(i)}>
                                <div className={"text-[31px]"}>{i.imo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)

                        }
                    </div>
                </div>
            }
            {(left && warnCnt > 0) && <div
                className={"h-[50px] w-[650px] bg-[#f00] absolute flex items-center justify-center opacity-[0.7] rounded-t-[15px] top-[31%]"}>
                <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                     alt={"warningIcon"}/>
                <span className={"text-[17px] ml-[10.5px] font-bold text-white"}>경고 ({warnCnt || 0}회)</span>
            </div>}
            {left && <div
                className={`absolute w-[650px] mt-[-50px] flex items-center text-white justify-between z-100`}>
                {left && <div className={"ml-[30px] flex items-center"}>
                    <img className={"w-[22px] mr-[12px]"} src={"/images/screenIconChatroom.png"}
                         alt={"screenIconChatroom"}/>
                    <span className={"whitespace-nowrap"}>{fanInfo.fan_name}님, 연결되었습니다.(영상통화 <b>1분30초</b>)</span>
                </div>}
                <div className={"flex items-center ml-[165px] mr-[30px]"}>
                    {left && <div className={"flex items-center"}>
                        <img className={"w-[30px]"} src={"/images/warningIconInScreen.png"}
                             alt={"warningIcon"}/>
                        <span className={"text-[24px] ml-[8.5px]"}>{warnCnt}</span>
                    </div>}
                    {currentRole !== 'artist' &&
                        <div className={"ml-[30px] flex items-center"}>
                            {currentRole === 'staff' ?
                                <img className={"w-[30px] cursor-pointer"} src={"/images/fullScreenIcon.png"}
                                     alt={"fullScreenIcon"} onClick={() => alert('풀화면')}/>
                                :
                                <img className={"w-[30px] cursor-pointer"} src={"/images/emoticonIcon.png"}
                                     alt={"emoticonIcon"} onClick={() => setImoticonToggle(prev => !prev)}/>
                            }
                        </div>
                    }
                </div>
            </div>}

            {(right && imoticonToggle) &&
                <div
                    className={"w-[390px] h-[200px] bg-white top-[61%] left-[64.5%] absolute rounded-[15px] pt-[34px] pb-[36px] px-[40px] z-10"}>
                    <img src={"/images/boxTale.png"} className={"w-[16px] h-[14px] absolute left-[98%] top-[10%]"}/>
                    <div className={"flex"}>
                        {upper_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col  items-center mr-[35px]`} key={i.name} onClick={()=>onClickReactBtn(i)}>
                                <div className={"text-[31px]"}>{i.imo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)
                        }
                    </div>
                    <div className={"flex"}>
                        {down_imoticon_path?.map((i, idx) =>
                            <div className={`flex flex-col items-center ${idx===0?"mr-[40px]":"mr-[35px]"}`} key={i.name} onClick={()=>onClickReactBtn(i)}>
                                <div className={"text-[31px]"}>{i.imo}</div>
                                <span className={"text-[15px] font-medium text-[#444] whitespace-nowrap"}>{i.kor}</span>
                            </div>)

                        }
                    </div>

                </div>
            }

            {right && <div
                className={`absolute w-[650px] mt-[-50px] flex items-center text-white justify-end z-100`}>
                <div className={"flex items-center"}>
                    {currentRole === 'artist' ?
                        <img className={"w-[30px] mr-[30px] cursor-pointer"} src={"/images/emoticonIcon.png"}
                             alt={"emoticonIcon"} onClick={() => setImoticonToggle(prev => !prev)}/>
                        :
                        <img className={"w-[30px] mr-[30px] cursor-pointer"} src={"/images/fullScreenIcon.png"}
                             alt={"fullScreenIcon"} onClick={() => alert('풀화면')}/>
                    }
                </div>
            </div>}
        </>
    )


};

/**
 *   <div className={"flex justify-center items-center bg-black bg-opacity-[0.15] rounded-[22.5px] w-[172.5px] ml-[78px] h-[45.5px]"}>
 *                     <span className={"text-[16px] text-white mr-[12.5px] my-[15px] flex items-center"}>
 *                         <span className={"text-[34px]"}>🥲</span>를 받았습니다.
 *                     </span>
 *                     <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"} onClick={()=>alert('close chat')}/>
 *                 </div>
 */

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    //position: absolute;
    background-color: black;
    border-radius: 22.5px;
    opacity: 0.15;
    width: 172.5px;
  }
`
export default Video2;
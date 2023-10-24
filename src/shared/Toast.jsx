import React, {useEffect} from 'react';

const Toast = ({message, removeToast}) => {
    console.log('Toast!!', message)
    const {type, msg, emo} = message
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast();
        }, 300000);

        return () => {
            clearTimeout(timer);
        };
    }, [removeToast]);
    if (type === 'warn') {
        return (
            <div
                className={"flex justify-center items-center bg-black bg-opacity-[0.7] rounded-[22.5px] mt-[10px] h-[45.5px]"}>
                <img src={"/images/warningIconInScreen.png"} className={"w-[25px] h-[25px] mr-[9px]"}
                     alt={"warning"}/>
                <span className={"text-[16px] text-white mr-[12.5px] my-[15px]"}>{msg}</span>
                <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"}
                     onClick={() => removeToast()}/>
            </div>
        )
    } else if (type === 'reaction') {
        return (

            <div
                className={"flex justify-center items-center bg-black bg-opacity-[0.15] rounded-[22.5px] w-[172.5px] ml-[78px] h-[45.5px]"}>
                                 <span className={"text-[16px] text-white mr-[12.5px] my-[15px] flex items-center"}>
                                     <span className={"text-[34px]"}>{emo}</span>를 받았습니다.
                                 </span>
                <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"}
                     onClick={() => removeToast()}/>
            </div>

        )
    } else {
        return (
            <div
                className="flex justify-center items-center  w-[172.5px] ml-[78px] h-[45.5px] bg-black  bg-opacity-[0.15] rounded-[22.5px]">
                <span className={"text-[16px] text-white mr-[12.5px] my-[15px] flex items-center"}>
                    {msg}
                    {/*<span className={"text-[34px]"}>🥲</span>를 받았습니다.*/}
                </span>
                <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"}
                     onClick={() => removeToast()}/>
            </div>
        );
    }
};

export default Toast;

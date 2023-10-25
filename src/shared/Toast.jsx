import React, {useEffect} from 'react';
import {emoji_list} from "../common/imoticon_path";
import {useDispatch, useSelector} from "react-redux";
import {deleteToastAfter3s, removeToast} from "../redux/modules/toastSlice";

const Toast = ({message, left, right, isWebFullScreen}) => {
    // console.log('Toast!!', message)
    const dispatch = useDispatch()
    const {type, msg, id} = message
    const targetEmoji = (id) => emoji_list.find(e => e.id === id).emo

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(deleteToastAfter3s())
        }, 300000);

        return () => {
            clearTimeout(timer);
        };
    }, [deleteToastAfter3s]);

    if (type === 'warn' && left) {
        return (
            <div
                className={"flex justify-center items-center bg-black bg-opacity-[0.7] rounded-[22.5px] mt-[10px] h-[45.5px] mb-[10px]"}>
                <img src={"/images/warningIconInScreen.png"} className={"w-[25px] h-[25px] mr-[9px]"}
                     alt={"warning"}/>
                <span className={"text-[16px] text-white mr-[12.5px] my-[15px]"}>{msg}</span>
                <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"}
                     onClick={() => removeToast(id)}/>
            </div>
        )
    } else if (type === 'reaction') {
        return (

            <div
                className={"flex justify-center items-center bg-black bg-opacity-[0.15] rounded-[22.5px] w-[172.5px] ml-[78px] h-[45.5px] mb-[10px]"}>
                {left && <span className={"text-[16px] text-white mr-[12.5px] my-[15px] flex items-center"}>
                                     <span
                                         className={"text-[34px]"}>{targetEmoji(msg.id)}</span>를 {left && msg.sender === 'member'? '보냈습니다.' : "받았습니다."}
                                 </span>}
                {right &&
                    <span className={"text-[16px] text-white mr-[12.5px] my-[15px] flex items-center"}>
                                     <span
                                         className={"text-[34px]"}>{targetEmoji(msg.id)}</span>를 {right && msg.sender === 'artist' ? '보냈습니다.' : "받았습니다."}
                                 </span>
                }
                <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"}
                     onClick={() => dispatch(removeToast(msg.unique_id))}/>
            </div>

        )
    } else {
        return (
            <div
                className="flex justify-center items-center  w-[172.5px] ml-[78px] h-[45.5px] bg-black  bg-opacity-[0.15] rounded-[22.5px] mb-[10px]">
                <span className={"text-[16px] text-white mr-[12.5px] my-[15px] flex items-center"}>
                    {msg}
                </span>
                <img src={"/images/popupClose.png"} className={"w-[10px] h-[10px] cursor-pointer"} alt={"close"}
                     onClick={() => removeToast()}/>
            </div>
        );
    }
};

export default Toast;

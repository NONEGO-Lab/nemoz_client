import React, {useState, useEffect} from "react";
import {ModalFrameDepth} from "../../../modal/ModalFrame";
import {Button} from "../../../element";
import {attendeeApi} from "../../data/attendee_data";

const FanDetail = ({setOnModal, currentFanId, eventId}) => {

    let style = "w-[488px] h-[675px] rounded-[15px] drop-shadow-md";

    const [fanInfo, setFanInfo] = useState({});

    const getFanDetailApi = async () => {
        const result = await attendeeApi.getFanDetail(currentFanId, eventId);
        setFanInfo(result);
    }

    useEffect(() => {
        getFanDetailApi();
    }, [])

    return (
        <ModalFrameDepth setOnModal={setOnModal} style={style}>
            <div>
                <div className="text-[1.2rem] font-[500] px-[45px] pt-[45px] pb-[30px]">
                    Fan Info
                </div>
                <div>

                    <div className={"bg-[#f0f0f0] min-h-[63px] flex items-center"}>
                        <div className={"text-[1.2rem] min-w-[50px] text-[#444] mx-[60px]"}>
                            이름
                        </div>
                        <div className={"text-[1.3rem] text-[#444] font-[500]"}>
                            {fanInfo.fan_name || '정보 없음'}
                        </div>
                    </div>

                    <div className={"bg-[#fff] min-h-[63px] flex items-center"}>
                        <div className={"text-[1.2rem] min-w-[50px] text-[#444] mx-[60px]"}>
                            성별
                        </div>
                        <div className={"text-[1.3rem] text-[#444] font-[500]"}>
                            {fanInfo.sex || '정보 없음'}
                        </div>
                    </div>

                    <div className={"bg-[#f0f0f0] min-h-[63px] flex items-center"}>
                        <div className={"text-[1.2rem] min-w-[50px] text-[#444] mx-[60px]"}>
                            나이
                        </div>
                        <div className={"text-[1.3rem] text-[#444] font-[500]"}>
                            {fanInfo?.age || '나이 없음'}
                        </div>

                    </div>

                    <div className={"bg-[#fff] min-h-[63px] flex items-center"}>
                        <div className={"text-[1.2rem] min-w-[50px] text-[#444] mx-[60px]"}>
                            팬레터
                        </div>
                    </div>

                    <div className={"bg-[#f0f0f0] min-h-[350px] flex"}>
                        <div
                            className={"text-[1.3rem] font-[500] min-w-[50px] text-[#444] mx-[60px] mt-[36px]"}>
                            {fanInfo?.letter}
                        </div>
                    </div>

                </div>
                <Button
                    style={"fixed bottom-[60px] right-[60px] rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center"}
                    width={"w-[106px]"}
                    textColor={"text-[#444]"}
                    _onClick={setOnModal}>
                  <span className={"my-[18px]"}>
               <img src={"/images/closeIcon.png"} className={"w-[15px] h-[15px]"} alt={"close-icon"}/>
             </span>
                    <span className={"ml-[8px] text-[16px] text-[#444]"}>Close</span>
                </Button>

            </div>
        </ModalFrameDepth>
    )
}

export default FanDetail;


export const FanDetailInto = ({value, fanInfo}) => {

    return (
        <div className="mb-6">
            <span className="mr-2">{value.key}:</span>
            <span>{fanInfo[value.dataKey]}</span>
        </div>
    )
}
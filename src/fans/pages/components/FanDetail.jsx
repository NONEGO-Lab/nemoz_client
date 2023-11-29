import React, {useState, useEffect} from "react";
import {ModalFrameDepth} from "../../../modal/ModalFrame";
import {Button} from "../../../element";
import {attendeeApi} from "../../data/attendee_data";

const FanDetail = ({setOnModal, currentFanId, eventId}) => {

    let style = "w-[650px] h-[900px] rounded-[15px] drop-shadow-md";

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
                <div className={"text-[24px] px-[45px] pt-[45px] pb-[30px] font-bold"} >
                    Fan Info
                </div>
                <div>

                    <div className={"bg-[#f0f0f0] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[73.5px] "}>
                            이름
                        </div>
                        <div className={"text-[21px] text-[#444] font-[500]"}>
                            {fanInfo.fan_name || '정보 없음'}
                        </div>
                    </div>

                    <div className={"bg-[#fff] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[73.5px]"}>
                            성별
                        </div>
                        <div className={"text-[21px] text-[#444] font-[500] "}>
                            {fanInfo.sex || '정보 없음'}
                        </div>
                    </div>

                    <div className={"bg-[#f0f0f0] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[73.5px]"}>
                            나이
                        </div>
                        <div className={"text-[21px] text-[#444] font-[500]"}>
                            {fanInfo?.age || '나이 없음'}
                        </div>

                    </div>

                    <div className={"bg-[#fff] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[73.5px]"}>
                            팬레터
                        </div>
                    </div>

                    <div className={"bg-[#f0f0f0] min-h-[190px] flex"}>
                        <div
                            className={"text-[21px] font-[500] min-w-[50px] text-[#444] ml-[77px] mr-[73.5px] mt-[36px]"}>
                            {fanInfo?.letter || '내용 없음'}
                        </div>
                    </div>

                </div>
                <Button
                    style={"fixed h-[50px] bottom-[60px] right-[60px] rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center"}
                    width={"w-[140px]"}
                    textColor={"text-[#444]"}
                    _onClick={setOnModal}>
                  <span className={"my-[13px]"}>
               <img src={"/images/closeIcon.png"} className={"w-[14.5px] h-[14.5px]"} alt={"close-icon"}/>
             </span>
                    <span className={"ml-[8px] text-[15.8px] text-[#444]"}>Close</span>
                </Button>

            </div>
        </ModalFrameDepth>
    )
}

export default FanDetail;

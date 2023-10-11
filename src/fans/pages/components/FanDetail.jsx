import React, {useState, useEffect} from "react";
import {ModalFrameDepth} from "../../../modal/ModalFrame";
import {Button} from "../../../element";
import {attendeeApi} from "../../data/attendee_data";

const FanDetail = ({setOnModal, currentFanId, currentFanEventId}) => {

    let style = "w-[650px] h-[900px] rounded-[15px]  drop-shadow-md";

    let itemList = [
        {key: "이름", dataKey: "fan_name"},
        {key: "성별", dataKey: "sex"},
        {key: "나이", dataKey: "age"},
        {key: "팬레터", dataKey: "letter"}
    ];

    const [fanInfo, setFanInfo] = useState({});

    const getFanDetailApi = async () => {
        const result = await attendeeApi.getFanDetail(currentFanId, currentFanEventId);
        setFanInfo(result.data);
    }

    useEffect(() => {
        getFanDetailApi();
    }, [])

    return (
        <ModalFrameDepth setOnModal={setOnModal} style={style}>
            <div>
                <div className="text-[24px] font-[500] px-[60px] pt-[60px] pb-[40px]">
                    Fan Info
                </div>
                <div>
                    {/*{*/}
                    {/*  itemList.map((value, idx) => {*/}
                    {/*    return <FanDetailInto key={idx} value={value} fanInfo={fanInfo}/>*/}
                    {/*  })*/}
                    {/*}*/}
                    <div className={"bg-[#f0f0f0] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[74px]"}>
                            이름
                        </div>
                        <div className={"text-[21px] text-[#444] font-[500]"}>
                            {fanInfo.fan_name || '이름 없음'}
                        </div>

                    </div>

                    <div className={"bg-[#fff] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[74px]"}>
                            성별
                        </div>
                        <div className={"text-[21px] text-[#444] font-[500]"}>
                            {fanInfo.sex || '정보 없음'}
                        </div>

                    </div>

                    <div className={"bg-[#f0f0f0] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[74px]"}>
                            나이
                        </div>
                        <div className={"text-[21px] text-[#444] font-[500]"}>
                            {fanInfo.age || '나이 없음'}
                        </div>

                    </div>

                    <div className={"bg-[#fff] min-h-[63px] flex items-center"}>
                        <div className={"text-[19px] min-w-[50px] text-[#444] ml-[77px] mr-[74px]"}>
                            팬레터
                        </div>
                    </div>

                    <div className={"bg-[#f0f0f0] min-h-[350px] flex"}>
                        <div
                            className={"text-[21px] font-[500] min-w-[50px] text-[#444] ml-[77px] mr-[74px] mt-[36px]"}>
                            {fanInfo.letter}
                        </div>
                    </div>

                </div>
                <Button
                    style={"fixed bottom-[60px] right-[60px] rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center"}
                    width={"w-[140px]"}
                    textColor={"text-[#444]"}
                    _onClick={setOnModal}>
                  <span className={"my-[18px]"}>
               <img src={"../images/closeIcon.png"} className={"w-[17px] h-[17px]"} alt={"plus-icon"}/>
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
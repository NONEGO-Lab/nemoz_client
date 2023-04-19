import React, { useState, useEffect } from "react";
import { ModalFrameDepth } from "../../../modal/ModalFrame";
import { Button } from "../../../element";
import { attendeeApi } from "../../data/attendee_data";

const FanDetail = ({ setOnModal, currentFanId }) => {

  let style = "w-[600px] h-[500px] drop-shadow-md";

  let itemList = [
    { key: "이름", dataKey: "fan_name" },
    { key:"성별", dataKey: "sex" },
    { key: "나이", dataKey: "age" },
    { key: "팬레터", dataKey:"letter" }
  ];

  const [fanInfo, setFanInfo] = useState({});

  const getFanDetailApi = async () => {
    const result = await attendeeApi.getFanDetail(currentFanId);
    setFanInfo(result);
  }

  useEffect(()=>{
    getFanDetailApi();
  },[])

  return (
      <ModalFrameDepth setOnModal={setOnModal} style={style}>
        <div>
          <div className="text-[32px] font-bold py-6 px-8">
            팬 정보 보기
          </div>
          <div className="px-10 text-[20px]">
            {
              itemList.map((value, idx) => {
                return <FanDetailInto key={idx} value={value} fanInfo={fanInfo}/>
              })
            }
          </div>
          <Button
              style={"fixed bottom-[30px] right-[30px]"}
              width={"w-[100px]"}
              _onClick={setOnModal}>
            닫기
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
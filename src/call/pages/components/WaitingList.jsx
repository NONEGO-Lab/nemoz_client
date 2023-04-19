import React, { useState, useEffect, useRef } from "react";
import { ModalFrame } from "../../../modal/ModalFrame";
import { Button } from "../../../element";
import FanDetail from "../../../fans/pages/components/FanDetail";
import { roomApi } from "../../../room/data/room_data";
import {useSelector} from "react-redux";


const WaitingList = ({ curRoomId, setOnModal, fanDetailOpenHandler, addUserOpenHandler }) => {


  const containerRef = useRef()
  let roomId = curRoomId;
  const originalWaitingList = useRef([]);

  const eventId = useSelector((state) => state.event.eventId);

  const getWaitingListApi = async (eventId, roomId) => {
    const result = await roomApi.getListOrder({eventId, roomId});
    setWaitingList(result);
    originalWaitingList.current = result;
  }

  let style = "w-[600px] h-[500px] drop-shadow-md";


  const [waitingList, setWaitingList] = useState([]);
  const [dragAndDrop, setDragAndDrop] = useState({
    draggedFrom: null, // 드래그 시작하는 index
    draggedTo: null, // 변경될 드래그 인덱스
    isDragging: false,
    originalOrder: [], // 변경전 원래 배열 list
    updatedOrder: [], // 변경 후의 배열
  });

  const resetOrder = () => {
    setWaitingList(originalWaitingList.current);
  }

  const saveReOrder = async () => {
    const fanIds = [];
    waitingList.map((fan, idx) => {
      fanIds.push({fan_id: fan.fan_id, order: idx + 1})
    });

    const result = await roomApi.updateListOrder(eventId, roomId, fanIds);
    if(result === "UPDATED"){
      alert("순서 저장 완료!");
    } else {
      alert("순서 저장에 실패했습니다.");
    }
  }


  useEffect(()=>{
    getWaitingListApi(eventId, roomId);
  },[])


  return (
      <ModalFrame setOnModal={setOnModal} style={style}>
        <div>
          <div className="text-[32px] font-bold py-6 px-8">
            대기열 보기
          </div>

          <div
              ref={containerRef}
              className="h-[320px] w-[480px] m-auto overflow-y-auto">
            {
              waitingList.length > 0 ?
                waitingList.map((fan, index) => {
                  return (
                      <WaitingFan
                          fan={fan}
                          setDragAndDrop={setDragAndDrop}
                          dragAndDrop={dragAndDrop}
                          waitingList={waitingList}
                          setWaitingList={setWaitingList}
                          key={fan.fan_id}
                          index={index}
                          id={fan.fan_id}
                          fanDetailOpenHandler={fanDetailOpenHandler}
                      />
                    )
                  })
                :
                <div>대기자가 없습니다.</div>
            }
          < /div>

          <div className="text-right mr-[40px] pt-4">
            <Button
                _onClick={addUserOpenHandler}
                width={"w-[100px]"}
                margin={"mr-4"}>
              참여자 추가
            </Button>
            <Button
                _onClick={resetOrder}
                width={"w-[100px]"}
                margin={"mr-4"}>
              순서 초기화
            </Button>
            <Button
                _onClick={saveReOrder}
                width={"w-[100px]"}
                margin={"mr-4"}>
              순서 저장
            </Button>
            <Button
                width={"w-[100px]"}
                margin={"mr-4"}
                _onClick={setOnModal}>
              닫기
            </Button>
          </div>
        </div>
      </ModalFrame>

  )

}

export default WaitingList;


const WaitingFan = ({fan, id, index, fanDetailOpenHandler, setDragAndDrop,
                      dragAndDrop, waitingList, setWaitingList}) => {

  //드래그 시작할 때,
  const onDragStart = (event) => {
    event.currentTarget.style.opacity = "0.4";
    const initialPosition = parseInt(event.currentTarget.dataset.position); //시작한 드래그의 인덱스 값
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: initialPosition,
      originalOrder: waitingList,
    });
  };

  // 드래그 하면서 마우스가 객체 위에 있을 때
  const onDragOver = (event) => {
    event.preventDefault();
    let newList = dragAndDrop.originalOrder;
    const draggedFrom = dragAndDrop.draggedFrom;					   // 드래그 되는 항목의 인덱스(시작)
    const draggedTo = parseInt(event.currentTarget.dataset.position);  // 놓을 수 있는 영역의 인덱스(끝)
    const itemDragged = newList[draggedFrom];
    const remainingItems = newList.filter(			// draggedFrom(시작) 항목 제외한 배열 목록
        (item, index) => index !== draggedFrom
    );
    // 드래그 시작, 끝 인덱스를 활용해 새로운 배열로 반환해줌
    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];
    if (draggedTo !== dragAndDrop.draggedTo) {		// 놓을 수 있는 영역이 변경 되면 객체를 변경해줌
      setDragAndDrop({
        ...dragAndDrop,
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  //드래그가 끝나고 놓았을 때,
  const onDrop = () => {
    setWaitingList(dragAndDrop.updatedOrder);
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
    });
  };

  //드래그가 범위를 벗어날 때,
  const onDragLeave = (event) => {
    event.currentTarget.classList.remove("over");
    setDragAndDrop({
      ...dragAndDrop,
      draggedTo: null,
    });
  };

  // 잡은 item을 놓았을 때,
  const onDragEnd = (event) => {
    event.currentTarget.style.opacity = "1";
    const listItems = document.querySelectorAll("#draggable");
    listItems.forEach((item) => {
      item.classList.remove("over");
    });
  }

  // 잡은 item이 다른 item이랑 겹쳐졌을 때 발생
  const onDragEnter = (event) => {
    event.currentTarget.classList.add("over");
  }



  return (
      <div
          id={"draggable"}
          draggable={true}
          data-position={index}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          onDragEnd={onDragEnd}
          className={`flex items-start justify-between w-[80%] border-b border-black m-auto pt-6 pb-2`}>
        <div className="flex items-center">
          <div className="mr-6 font-bold">
            {index + 1}
          </div>
          <div>
            <div className="text-[18px]">
              {fan.fan_name}
            </div>
            <div className="text-[14px] text-gray-500">
              {fan.status === "waiting" ? "대기중" : "접속중"}
            </div>
          </div>
        </div>

        <Button
            _onClick={() => fanDetailOpenHandler(fan)}
            width={"w-[120px]"}
            height={"h-[45px]"}>
          정보 보기
        </Button>
      </div>
  )

}
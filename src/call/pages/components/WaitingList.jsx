import React, {useState, useEffect, useRef} from "react";
import {ModalFrame} from "../../../modal/ModalFrame";
import {Button} from "../../../element";
import FanDetail from "../../../fans/pages/components/FanDetail";
import {roomApi} from "../../../room/data/room_data";
import {useSelector} from "react-redux";


const WaitingList = ({curRoomId, setOnModal, fanDetailOpenHandler, addUserOpenHandler, eventId}) => {


    const containerRef = useRef()
    let roomId = curRoomId;
    const originalWaitingList = useRef([]);

    // const eventId = useSelector((state) => state.event.eventId);
    console.log(eventId, 'CURRENT eventId')
    const getWaitingListApi = async (eventId, roomId) => {
        const result = await roomApi.getListOrder({eventId, roomId});
        console.log(result, 'Waiting Result')
        setWaitingList(result.data.fan_orders);
        originalWaitingList.current = result.data.fan_orders;
    }

    const style = "w-[650px] min-h-[900px] drop-shadow-md  rounded-[15px] bg-[#fff]";


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
        if (result === "UPDATED") {
            alert("순서 저장 완료!");
        } else {
            alert("순서 저장에 실패했습니다.");
        }
    }


    useEffect(() => {
        getWaitingListApi(eventId, roomId);
    }, [])


    return (
        <ModalFrame setOnModal={setOnModal} style={style}>

            <div className="flex justify-between items-center mt-[60px] mb-[40px] mx-[60px]">
                <div className={"text-[24px] font-[600] text-[#444]"}>Fan List</div>

                <img className={"w-20px h-[20px] cursor-pointer"} src={"../images/closeIcon.png"} alt={"close-icon"}
                     onClick={setOnModal}/>

            </div>

            <div
                ref={containerRef}
                className="overflow-y-auto">
                {
                    waitingList.length > 0 ?
                        waitingList.map((fan, index) => {
                            console.log(fan, 'Fan')
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
            </div>

            <div className="flex items-center justify-start pt-[46px] px-[60px]">
                <div>
                    <Button
                        _onClick={addUserOpenHandler}
                        width={"w-[140px]"}
                        height={"min-h-[50px]"}
                        style={"rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center"}
                    >
             <span>
               <img src={"../images/plusIcon.png"} className={"w-[17px] h-[17px]"} alt={"plus-icon"}/>
             </span>
                        <span className={"ml-[8px] text-[16px] text-[#444]"}>Add Fan</span>
                    </Button>
                </div>

                <Button
                    _onClick={resetOrder}
                    width={"w-[140px]"}
                    height={"min-h-[50px]"}
                    style={"rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center  ml-[90px] mr-[20px]"}
                >
                           <span>
               <img src={"../images/refreshIcon.png"} className={"w-[17px] h-[17px]"} alt={"refresh-icon"}/>
             </span>
                    <span className={"ml-[8px] text-[16px] text-[#444]"}>Refresh</span>
                </Button>

                <Button
                    _onClick={saveReOrder}
                    width={"w-[140px]"}
                    height={"min-h-[50px]"}
                    style={"rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center"}
                >
                  <span>
               <img src={"../images/saveIcon.png"} className={"w-[17px] h-[17px]"} alt={"plus-icon"}/>
             </span>
                    <span className={"ml-[8px] text-[16px] text-[#444]"}>Save List</span>
                </Button>
            </div>

        </ModalFrame>

    )

}

export default WaitingList;


const WaitingFan = ({
                        fan, id, index, fanDetailOpenHandler, setDragAndDrop,
                        dragAndDrop, waitingList, setWaitingList
                    }) => {

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
            className={`flex ${index % 2 === 0 ? "bg-[#f0f0f0]" : "bg-[#e9e9e9]"} min-h-[63px] w-[650px]`}>
            <div className="flex items-center justify-between pl-[80px]">

                <div className="text-[19px] font-bold">
                    {fan.fan_name}
                </div>
                <div className="text-[19px] ml-[72px] mr-[211px]">
                    {fan.status === "waiting" ? "대기중" : "접속중"}
                </div>


                <button
                    onClick={() => {fanDetailOpenHandler(fan)}}
                    className="w-[110px] rounded-[15px] border-[1px] border-[#aaa] text-[#444]"
                >
                   <div className={"flex items-center justify-center"}>
                    Fan Info
                    <img src={"../images/rightArrowIcon.png"} className={"w-[7px] h-[11px] ml-[10px]"} alt={"arrow-icon"}/>
                   </div>
                </button>

            </div>
        </div>
    )

}
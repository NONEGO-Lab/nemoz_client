import React, {useState, useEffect, useRef} from "react";
import {ModalFrame} from "../../../modal/ModalFrame";
import {Button} from "../../../element";
import {roomApi} from "../../../room/data/room_data";
import {useSelector} from "react-redux";
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {TouchBackend} from "react-dnd-touch-backend";


const WaitingList = ({curRoomId, setOnModal, fanDetailOpenHandler, addUserOpenHandler, eventId}) => {

    let roomId = curRoomId;
    const originalWaitingList = useRef([]);

    const getWaitingListApi = async (eventId, roomId) => {
        const result = await roomApi.getListOrder({eventId, roomId});
        setWaitingList(result);
        originalWaitingList.current = result?.data;
    }

    const style = "w-[488px] h-[675px] rounded-[15px] drop-shadow-md";;
    const addFanModal = useSelector(state => state.common.addFanModalToggle)

    const [waitingList, setWaitingList] = useState([]);
    const updateOrder = (fromIndex, toIndex) => {
        const updatedWaitingList = [...waitingList];
        const [updateOrder] = updatedWaitingList.splice(fromIndex, 1);
        updatedWaitingList.splice(toIndex, 0, updateOrder);
        setWaitingList(updatedWaitingList);
    };

    const resetOrder = () => {
        getWaitingListApi(eventId, roomId);
    }

    const saveReOrder = async () => {
        const fanIds = [];
        waitingList.map((fan, idx) => {
            fanIds.push({fan_id: fan.fan_id, order: idx + 1})
        });

        const result = await roomApi.updateListOrder(eventId, roomId, fanIds);
        if (result.message === "UPDATED") {
            alert("순서 저장 완료!");
        } else {
            alert(result.message);
        }
    }


    useEffect(() => {
        getWaitingListApi(eventId, roomId)
    }, [addFanModal])


    return (
        <ModalFrame setOnModal={setOnModal} style={style}>

            <div className="flex justify-between items-center mt-[45px] mb-[30px] mx-[45px] ">
                <div className={"text-[1.25rem] font-[600] text-[#444]"}>Fan List</div>

                <img className={"w-[15px] h-[15px] cursor-pointer"} src={"/images/closeIcon.png"} alt={"close-icon"}
                     onClick={setOnModal}/>

            </div>

            <DndProvider backend={TouchBackend}>
                <div style={containerStyles}>
                    {waitingList.map((fan, index) => (
                        <DraggableBox
                            key={fan.fan_id}
                            id={fan.fan_id}
                            fan={fan}
                            updateOrder={updateOrder}
                            fanDetailOpenHandler={fanDetailOpenHandler}
                            index={index}
                        />
                    ))}
                </div>
            </DndProvider>

            <div className="flex items-center justify-start pt-[32px] px-[22.5px]">
                <div>
                    <Button
                        _onClick={addUserOpenHandler}
                        width={"w-[7rem]"}
                        height={"min-h-[50px]"}
                        style={"rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center"}
                    >
             <span>
               <img src={"/images/plusIcon.png"} className={"w-[17px] h-[17px]"} alt={"plus-icon"}/>
             </span>
                        <span className={"ml-[8px] text-[16px] text-[#444]"}>Add Fan</span>
                    </Button>
                </div>

                <Button
                    _onClick={resetOrder}
                    width={"w-[7rem]"}
                    height={"min-h-[50px]"}
                    style={"rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center  ml-[90px] mr-[20px]"}
                >
                           <span>
               <img src={"/images/refreshIcon.png"} className={"w-[17px] h-[17px]"} alt={"refresh-icon"}/>
             </span>
                    <span className={"ml-[8px] text-[16px] text-[#444]"}>Refresh</span>
                </Button>

                <Button
                    _onClick={saveReOrder}
                    width={"w-[7rem]"}
                    height={"min-h-[50px]"}
                    style={"rounded-[10px] border-[1px] border-[#aaa] flex items-center justify-center"}
                >
                  <span>
               <img src={"/images/saveIcon.png"} className={"w-[17px] h-[17px]"} alt={"plus-icon"}/>
             </span>
                    <span className={"ml-[8px] text-[16px] text-[#444]"}>Save List</span>
                </Button>
            </div>

        </ModalFrame>

    )

}

export default WaitingList;

const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    width: "100%",
    maxHeight: "475px",
    overflowY: "scroll"
};


function DraggableBox({id, fan, updateOrder, index, fanDetailOpenHandler}) {
    const [{isDragging}, ref] = useDrag({
        type: 'BOX',
        item: {id, index},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'BOX',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                updateOrder(draggedItem.index, index);
                draggedItem.index = index;
            }
        },

    });

    const styles = {
        minHeight: '62.5px',
        backgroundColor: `${index % 2 === 0 ? "#f0f0f0" : "#e9e9e9"}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'move',
        padding:'0 45px'
    };


    return (
        <div ref={(node) => ref(drop(node))} style={{...styles, opacity: isDragging ? 0.4 : 1}}>
            <div className="text-[1rem] font-bold">
                {fan.fan_name}
            </div>
            <div className="text-[1rem] ml-[4.5rem] mr-[9rem]">
                {fan.status === "waiting" ? "대기중" : "접속중"}
            </div>


            <button
                onClick={() => {
                    fanDetailOpenHandler(fan)
                }}
                className="w-[83px] rounded-[15px] border-[1px] border-[#aaa] text-[#444]"
            >
                <div className={"flex items-center justify-center"}>
                    Fan Info
                    <img src={"/images/rightArrowIcon.png"} className={"w-[7px] h-[11px] ml-[10px]"}
                         alt={"arrow-icon"}/>
                </div>
            </button>
        </div>
    );
}

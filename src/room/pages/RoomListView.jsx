import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {Button} from "../../element";
import {Layout} from "../../shared/Layout";
import CreateRoom from "../../room/components/CreateRoom";
import WaitingList from "../../call/pages/components/WaitingList";
import FanDetail from "../../fans/pages/components/FanDetail";
import AddUser from "../../call/pages/components/AddUser";
import {addRoomInfo} from "../../redux/modules/commonSlice";
import {RoomListController as controller} from "../controller/roomListController";
import {StaffProvider, ArtistProvider} from "../../provider/index";
import {currentEvent} from "../../redux/modules/eventSlice";


const RoomListView = () => {

    const {
        roomList, setIsOpenRoomCreate, movePage,
        isOpenRoomCreate, currentRoom, fanDetailOpenHandler, addUserOpenHandler, setCurrentRoom,
        isEmptyCheck, currentPage, currentFanInfo, isOpenAddUser, setIsOpenAddUser, endRoomApi,
        setCurrentFanInfo, userInfo, getEventListApi, totalPage
    } = controller();
    const eventList = useSelector(state => state.event.eventList)
    const role = useSelector((state) => state.user.userInfo.role);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const page = [...new Array(totalPage)].map((_, i) => i + 1) || []
    const createRoom = () =>{
        if(eventList.length<=0){
            alert('소속된 이벤트가 없습니다')
            setIsOpenRoomCreate(false)
        }else{
            setIsOpenRoomCreate(true)
        }
    }
    return (
        <Layout title={"방목록"} buttonText={"방 만들기"} _onClick={createRoom}
                >

            {/*table 뷰*/}
            {/* Tabler Header*/}

                <div
                    className="flex items-center w-[100%]  px-[100px] text-[16px] text-[#444444] border-b-[#e0e0e0] border-b-2 pb-[14px]">
                    <div className="w-[30vw]">Event</div>
                    <div className="w-[20vw]">Artist</div>
                    <div className="w-[30vw]">Fan</div>
                    <div className="w-[10vw] text-center">Waiting</div>
                    <div className="w-[10vw] text-center">Start</div>
                    <div className={'w-[10vw] text-center'}>Quit</div>
                </div>


                <div className="w-[100vw] px-[100px]">

                    <StaffProvider role={role}>
                        {
                            roomList?.map((room, idx) => {
                                return <Room room={room} key={room.room_id} id={idx}  setCurrentRoom={setCurrentRoom}
                                             eventList={eventList} navigate={navigate} dispatch={dispatch}
                                             endRoomApi={endRoomApi} bgColor={idx % 2 === 0 ? "" : "bg-[#e9e9e9]"}/>
                            })
                        }
                    </StaffProvider>

                    <ArtistProvider role={role}>
                        {
                            roomList.filter((room) => room.artist_id === userInfo.artistNo||userInfo.no).map((room, idx) => {
                                return <Room room={room} key={room?.room_id} id={idx}  eventList={eventList} setCurrentRoom={setCurrentRoom}
                                             navigate={navigate} dispatch={dispatch}
                                             endRoomApi={endRoomApi} bgColor={idx % 2 === 0 ? "" : "bg-[#e9e9e9]"}/>
                            })
                        }
                    </ArtistProvider>
                </div>


            {/* page */}
            <div className={"text-[15px] pt-[20px] flex justify-center items-center"}>
                {
                    page?.map((num, index) => {
                        return (

                            <span key={index}
                                  onClick={() => movePage(num)}
                                  className={`w-[35px] h-[35px] cursor-pointer rounded-full  ml-[20px] flex items-center justify-center
                                          ${currentPage === num ? "bg-[#01dfe0]" : "bg-white"}`}>
                {num}
              </span>

                        )
                    })
                }

            </div>


            {isOpenRoomCreate && <CreateRoom setOnModal={() => setIsOpenRoomCreate(false)}
                                              getEventListApi={getEventListApi} eventList={eventList}/>}
            {currentRoom.room_id &&
                <WaitingList
                    curRoomId={currentRoom.room_id}
                    eventId={currentRoom.event_id}
                    fanDetailOpenHandler={fanDetailOpenHandler}
                    setOnModal={() => setCurrentRoom({})}
                    addUserOpenHandler={addUserOpenHandler}/>
            }
            {!isEmptyCheck(currentFanInfo) && <FanDetail currentFanId={currentFanInfo["fan_id"]}
                                                         eventId={currentRoom.event_id}
                                                         setOnModal={() => setCurrentFanInfo({})}/>}
            {isOpenAddUser && <AddUser eventList={eventList} currentRoom={currentRoom} eventId={currentRoom.event_id} roomId={currentRoom.room_id} setOnModal={() => setIsOpenAddUser(prev => !prev)}/>}
        </Layout>
    )
}


export default RoomListView;

const Room = ({room, endRoomApi, setCurrentRoom, id, bgColor, eventList, navigate, dispatch}) => {

    const event_id = eventList.find(e => e.event_name === room.room_name)?.event_id
    const roomEnd = (room) => {
        endRoomApi(room)
    }
    //dispatch 하고 navigate 해야해서 한 어쩔수 없는 방법 이게 최선일까..
    const joinNewSession = (room) => {
        dispatch(addRoomInfo(room));
    }

    const joinAdminSession = async (room) => {
        dispatch(currentEvent(event_id))
        await joinNewSession(room);
        navigate(`/video2/${room.room_id}`);
    }

    return (
        <div className={`flex items-center h-[70px] ${bgColor} w-[100%]`} key={id}>
            <div className="w-[30vw]">
                {room.room_name}
            </div>

            <div className="font-bold w-[20vw]">
                {room.artist_name}
            </div>

            <div className="w-[30vw]">
                {room.fan_name}
            </div>

            <Button _onClick={() => setCurrentRoom({event_id, ...room})} coverWidth={'w-[10vw]'}>
                <div className={"w-[26px] h-[25px]"}>
                    <img src="../images/waitingIcon.png" alt={'waiting-icon'}/>
                </div>
            </Button>
            <Button _onClick={() => joinAdminSession(room)} coverWidth={'w-[10vw]'}>
                <div className={"w-[26px] h-[25px]"}>
                    <img src="../images/startIcon.png" alt={'start-icon'} />
                </div>
            </Button>
            <Button
                _onClick={() => roomEnd(room)}
                coverWidth={'w-[10vw]'}
            >
                <div className={"w-[26px] h-[25px]"} >
                    <img src="../images/quitIcon.png" alt={'quit-icon'}/>
                </div>
            </Button>

        </div>
    )
}
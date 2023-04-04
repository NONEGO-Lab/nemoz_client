import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/Header";
import { Button, Input } from "../../element";
import {Layout, ContainerHeader} from "../../shared/Layout";
import CreateRoom from "../../room/components/CreateRoom";
import WaitingList from "../../call/pages/components/WaitingList";
import FanDetail from "../../fans/pages/FanDetailInfo";
import AddUser from "../../call/pages/components/AddUser";
import { roomApi } from "../data/room_data";
import { addRoomInfo } from "../../redux/modules/commonSlice";
import {setError, setIsError} from "../../redux/modules/errorSlice";



const RoomList = () => {


  const dispatch = useDispatch();

  const [roomList, setRoomList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRoom, setCurrentRoom] = useState({});
  const [isOpenRoomCreate, setIsOpenRoomCreate] = useState(false);
  const [isOpenFanDetail, setIsOpenFanDetail] = useState(false);
  const [currentFanInfo, setCurrentFanInfo] = useState({});
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const eventId = useSelector((state) => state.event.eventId);


  const isEmptyCheck = (value) => {
    return Object.keys(value).length === 0;
  }

  const fanDetailOpenHandler = (fanInfo) => {
    if(isEmptyCheck(fanInfo)) {
      setCurrentFanInfo({});
    } else {
      setCurrentFanInfo(fanInfo);
    }
  }

  const addUserOpenHandler = () => {
    setIsOpenAddUser(true);
  }


  const getRoomListApi = async (page) => {
    try {
      const result = await roomApi.getRoomList(eventId, page);
      setRoomList(result.data);
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }

  }

  const endRoomApi = async (room) => {
    // if(room.meet_id !== ""){
    //     alert("현재 진행중인 영상통화가 있습니다");
    //     return;
    // };

    if(window.confirm("정말 종료하시겠습니까?")){
      try {
        const result = await roomApi.endRoom(room.room_id);
        if(result === "Room Ended") {
          alert("삭제 완료");
          getRoomListApi(currentPage);
        } else {
          alert("방 삭제 실패");
        }
      } catch (err) {
        dispatch(setError(err));
        dispatch(setIsError(true));
      }

    }
  }

  const movePage = async (num) => {

    if(num === 0 || num === 11) {
      return;
    }

    setCurrentPage(num);
    await getRoomListApi(num);
  }

  useEffect(()=>{
    getRoomListApi(1);
  },[])


  const roomArray = [...new Array(10)].map((_, i) => i + 1);

  return (
      <Layout title={"방목록"} buttonText={"방 만들기"} _onClick={() => setIsOpenRoomCreate(true)}>

        {/*table 뷰*/}
        <div className="bg-white h-[500px]">
          <div className="flex items-center w-[100%] bg-gray-100 h-[50px] px-[20px] font-bold">
            <div className="w-[340px]">방제목</div>
            <div className="w-[180px]">아티스트</div>
            <div className="w-[160px]">팬</div>
          </div>

          <div className="overflow-y-auto h-[450px]">
            {
              // userInfo.role === "staff" ?
              roomList.map((room, idx) => {
                return <Room room={room} key={idx} setCurrentRoom={setCurrentRoom}
                             endRoomApi={endRoomApi}/>
              })
              // :
              // roomList.filter((room) => room.artist_id === userInfo.id).map((room) => {
              //     return <Room room={room} key={room.room_id} setCurrentRoom={setCurrentRoom}
              //                  endRoomApi={endRoomApi}/>
              // })
            }
          </div>
        </div>
        {
          <div className={"flex justify-end absolute bottom-4 right-4 text-xl text-gray-600"}>
                    <span onClick={() => movePage(currentPage - 1)}
                          className="cursor-pointer mr-2"> {"<"} </span>
            {
              roomArray.map((num, index) => {
                return(
                    <div key={index} className={`pr-4`}>
                                    <span onClick={() => movePage(num)}
                                          className={`cursor-pointer text-center ${currentPage === num && "bg-blue-600 px-2 py-1 text-white"}`}>
                                        {num}
                                    </span>
                    </div>
                )
              })
            }
            <div onClick={() => movePage(currentPage + 1)}>
              <span className="cursor-pointer mr-2">다음</span>
              <span className="cursor-pointer"> {">"} </span>
            </div>
          </div>
        }

        { isOpenRoomCreate && <CreateRoom setOnModal={() => setIsOpenRoomCreate(false)} getRoomListApi={getRoomListApi}/> }
        { currentRoom.room_id &&
            <WaitingList
                curRoomId={currentRoom.room_id}
                fanDetailOpenHandler={fanDetailOpenHandler}
                setOnModal={() => setCurrentRoom({})}
                addUserOpenHandler={addUserOpenHandler}/>
        }
        { !isEmptyCheck(currentFanInfo) && <FanDetail currentFanId={currentFanInfo["fan_id"]} setOnModal={() => setCurrentFanInfo({})}/> }
        { isOpenAddUser && <AddUser setOnModal={() => setIsOpenAddUser(prev => !prev)}/> }
      </Layout>
  )
}


export default RoomList;


const Room = ({ room, endRoomApi, setCurrentRoom }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const roomEnd = (room) => {
    endRoomApi(room)
  }


  //dispatch 하고 navigate 해야해서 한 어쩔수 없는 방법 이게 최선일까..
  const joinNewSession = (room) => {
    dispatch(addRoomInfo(room));
  }

  const joinAdminSession = async (room) => {
    await joinNewSession(room);
    navigate(`/video/${room.room_id}`);
  }

  return (
      <div className="flex justify-center items-center mt-2 mb-4 px-[20px]">
        <div className="flex w-[780px]">
          <div className="w-[340px]">
            {room.room_name}
          </div>
          <div className="w-[180px]">
            {room.artist_name}
          </div>
          <div className="w-[160px]">
            {room.fan_name}
          </div>
        </div>

        <div className="w-[360px] flex justify-between">
          <Button _onClick={() => setCurrentRoom(room)}>대기열 보기</Button>
          <Button _onClick={() => joinAdminSession(room)}>입장하기</Button>
          <Button
              _onClick={() => roomEnd(room)}
              color={"text-red-500"} borderColor={"border-red-500"}>
            팬미팅 종료
          </Button>
        </div>
      </div>
  )
}
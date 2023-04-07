import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../element";
import { Layout } from "../../shared/Layout";
import CreateRoom from "../../room/components/CreateRoom";
import WaitingList from "../../call/pages/components/WaitingList";
import FanDetail from "../../fans/pages/FanDetail";
import AddUser from "../../call/pages/components/AddUser";
import { addRoomInfo } from "../../redux/modules/commonSlice";
import { RoomListController as controller } from "../controller/roomListController";
import { StaffProvider, ArtistProvider } from "../../provider/index";


const RoomListView = () => {

  const { roomList, setIsOpenRoomCreate, roomArray, movePage,
    isOpenRoomCreate, currentRoom, fanDetailOpenHandler, addUserOpenHandler, setCurrentRoom,
    isEmptyCheck, currentPage, currentFanInfo, isOpenAddUser, setIsOpenAddUser, endRoomApi,
    getRoomListApi, setCurrentFanInfo, userInfo
  } = controller();

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

                <StaffProvider>
                  {
                    roomList.map((room, idx) => {
                      return <Room room={room} key={idx} setCurrentRoom={setCurrentRoom}
                                   endRoomApi={endRoomApi}/>
                    })
                  }
                </StaffProvider>

                <ArtistProvider>
                  {
                    roomList.filter((room) => room.artist_id === userInfo.id).map((room) => {
                      return <Room room={room} key={room.room_id} setCurrentRoom={setCurrentRoom}
                                   endRoomApi={endRoomApi}/>
                    })
                  }
                </ArtistProvider>
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
                                          className={`cursor-pointer text-center 
                                          ${currentPage === num && "bg-blue-600 px-2 py-1 text-white"}`}>
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

        { isOpenRoomCreate && <CreateRoom setOnModal={() => setIsOpenRoomCreate(false)}
                                          getRoomListApi={getRoomListApi}/> }
        { currentRoom.room_id &&
            <WaitingList
                curRoomId={currentRoom.room_id}
                fanDetailOpenHandler={fanDetailOpenHandler}
                setOnModal={() => setCurrentRoom({})}
                addUserOpenHandler={addUserOpenHandler}/>
        }
        { !isEmptyCheck(currentFanInfo) && <FanDetail currentFanId={currentFanInfo["fan_id"]}
                                                      setOnModal={() => setCurrentFanInfo({})}/> }
        { isOpenAddUser && <AddUser setOnModal={() => setIsOpenAddUser(prev => !prev)}/> }
      </Layout>
  )
}


export default RoomListView;


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
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../element";
import { Layout } from "../../shared/Layout";
import CreateRoom from "../../room/components/CreateRoom";
import CreateRoom2 from "../../room/components/CreateRoom2";
import WaitingList from "../../call/pages/components/WaitingList";
import FanDetail from "../../fans/pages/components/FanDetail";
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
  const isRoomList = window.location.pathname.split('/')[1] === 'roomlist'
  return (
      <Layout title={"방목록"} buttonText={"방 만들기"} _onClick={() => setIsOpenRoomCreate(true)} isRoomList={isRoomList}>

        {/*table 뷰*/}
        {/* Tabler Header*/}
        <div>
          <div className="flex items-center w-[100%]  px-[100px] text-[16px] text-[#444444] border-b-[#e0e0e0] border-b-2">
            <div className="w-[195px]">Artist</div>
            <div className="w-[140px]">Fan</div>
              <div className="w-[550px]">Title</div>
              <div className="w-[132px]">Waiting</div>
              <div className="w-[120px]">Staff</div>
              <div >Quit</div>

          </div>

          <div className="px-[100px]">

                <StaffProvider>
                  {
                    roomList.map((room, idx) => {
                      return <Room room={room} key={idx} setCurrentRoom={setCurrentRoom}
                                   endRoomApi={endRoomApi} bgColor={idx %2 === 0 ?"":"bg-[#e9e9e9]" }/>
                    })
                  }
                </StaffProvider>

                <ArtistProvider>
                  {
                    roomList.filter((room) => room.artist_id === userInfo.id).map((room) => {
                      return <Room room={room} key={room.room_id} setCurrentRoom={setCurrentRoom}
                                   endRoomApi={endRoomApi} />
                    })
                  }
                </ArtistProvider>
          </div>
        </div>
        {/* page */}
        {
          <div className={"w-[100%] text-[15px] pt-[20px] flex justify-center items-center"}>
                    {/*<span onClick={() => movePage(currentPage - 1)}*/}
                    {/*      className="cursor-pointer mr-2"> {"<"} </span>*/}
            {
              roomArray.map((num, index) => {
                return(

                                    <span  key={index} onClick={() => movePage(num)}
                                          className={`w-[35px] h-[35px] cursor-pointer rounded-full  ml-[20px] flex items-center justify-center
                                          ${currentPage === num ? "bg-[#01dfe0]" : "bg-white"}
                                          `}>
                                        {num}
                                    </span>

                )
              })
            }
            {/*<div onClick={() => movePage(currentPage + 1)}>*/}
            {/*  <span className="cursor-pointer mr-2">다음</span>*/}
            {/*  <span className="cursor-pointer"> {">"} </span>*/}
            {/*</div>*/}
          </div>
        }

        {/*{ isOpenRoomCreate && <CreateRoom setOnModal={() => setIsOpenRoomCreate(false)}
                                          getRoomListApi={getRoomListApi}/> }*/}
          { isOpenRoomCreate && <CreateRoom2 setOnModal={() => setIsOpenRoomCreate(false)}
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


const Room = ({ room, endRoomApi, setCurrentRoom, key, bgColor }) => {

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
      <div className={`flex items-center h-[70px] ${bgColor} `}>

          <div className="w-[195px] font-bold">
              {room.artist_name}

          </div>
          <div className="w-[140px]">
              {room.fan_name}
          </div>
          <div className="w-[550px]">

              {room.room_name}
          </div>

          <Button _onClick={() => setCurrentRoom(room)} width={"w-[132px]"}>
              <div className={"w-[26px] h-[25px]"}>
              <img src="../images/waitingIcon.png" alt={'waiting-icon'}/>
              </div>
          </Button>
          <Button _onClick={() => joinAdminSession(room)} width={"w-[120px]"}>
              <div className={"w-[26px] h-[25px]"}>
                  <img src="../images/startIcon.png" alt={'start-icon'}/>
              </div>
          </Button>
          <Button
              _onClick={() => roomEnd(room)}
             >
              <div className={"w-[26px] h-[25px]"}>
                  <img src="../images/quitIcon.png" alt={'quit-icon'}/>
              </div>
          </Button>

      </div>
  )
}
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {roomApi} from "../data/room_data";
import {setError, setIsError} from "../../redux/modules/errorSlice";



export const RoomListController = () => {

  const roomArray = [...new Array(10)].map((_, i) => i + 1);
  const dispatch = useDispatch();

  const [roomList, setRoomList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRoom, setCurrentRoom] = useState({});
  const [isOpenRoomCreate, setIsOpenRoomCreate] = useState(false);
  const [currentFanInfo, setCurrentFanInfo] = useState({});
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);

  const eventId = useSelector((state) => state.event.eventId);
  const userInfo = useSelector((state) => state.user.userInfo);


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
    console.log('GET ROOM LIST')
    console.log(userInfo.adminNo)
    // eventList 부르기
    try {
      const result = await roomApi.getRoomList(eventId, page);
      setRoomList(result.data?.slice(0,10));
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
        if(result) {
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



  return {
    roomList,
    setIsOpenRoomCreate,
    roomArray,
    movePage,
    isOpenRoomCreate,
    currentRoom,
    fanDetailOpenHandler,
    addUserOpenHandler,
    setCurrentRoom,
    isEmptyCheck,
    currentPage,
    currentFanInfo,
    isOpenAddUser,
    setIsOpenAddUser,
    endRoomApi,
    getRoomListApi,
    setCurrentFanInfo,
    userInfo
  }
}
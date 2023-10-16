import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {roomApi} from "../data/room_data";
import {setError, setIsError} from "../../redux/modules/errorSlice";
import {addEventList, setEventIds} from "../../redux/modules/eventSlice"
import {eventApi} from "../../event/data/event_data";
import {useNavigate} from "react-router-dom";
import {sock} from "../../socket/config";


export const RoomListController = () => {
    const roomArray = [...new Array(10)].map((_, i) => i + 1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [roomList, setRoomList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRoom, setCurrentRoom] = useState({});
    const [isOpenRoomCreate, setIsOpenRoomCreate] = useState(false);
    const [currentFanInfo, setCurrentFanInfo] = useState({});
    const [isOpenAddUser, setIsOpenAddUser] = useState(false);
    const eventId = localStorage.getItem("eventId");
    const currentEventId = useSelector(state => state.event.currentEventId)
    const userInfo = useSelector((state) => state.user.userInfo);
    const eventList = useSelector(state => state.event.eventList)

    const isEmptyCheck = (value) => {
        return Object.keys(value).length === 0;
    }

    const fanDetailOpenHandler = (fanInfo) => {
        if (isEmptyCheck(fanInfo)) {
            setCurrentFanInfo({});
        } else {
            setCurrentFanInfo(fanInfo);
        }
    }

    const addUserOpenHandler = () => {
        setIsOpenAddUser(true);
    }

    // const getRoomListApi = async (page) => {
    //   console.log('GET ROOM LIST')
    //   console.log(eventList)
    //   console.log(eventList.map(e => e.event_id), 'DDF?DF?')
    //   try {
    //     const result = await roomApi.getRoomList(eventId, page);
    //     setRoomList(result.data?.slice(0,10));
    //   } catch (err) {
    //     dispatch(setError(err));
    //     dispatch(setIsError(true));
    //   }
    //
    // }

    const getEventListApi = async (userId) => {
        //팬일 경우 바로 대기화면으로
        if (userInfo.role === "fan") {
            navigate("/waitcall");
        }
        try {
            const eventList = await eventApi.getEventList({userId})
            dispatch(addEventList({eventList}))
            const eventIds = eventList.map(e => e.event_id)
            dispatch(setEventIds({event_id: eventIds}))
        } catch (err) {
            console.error(err)
        }
    }


    const endRoomApi = async (room, userId) => {
        let roomNum = `${currentEventId}_${room.room_id}_${room.meet_id}`;
        // if(room.meet_id !== ""){
        //     alert("현재 진행중인 영상통화가 있습니다");
        //     return;
        // };
        if (window.confirm("정말 종료하시겠습니까?")) {
            try {
                const result = await roomApi.endRoom(room.room_id);
                if (result) {
                    alert("삭제 완료");
                    await getEventListApi({userId});
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

        if (num === 0 || num === 11) {
            return;
        }

        setCurrentPage(num);
        await getEventListApi(num);
    }

    useEffect(() => {
        console.log('get Room List')
        if (eventList?.length > 0) {
            const getRoomListApi = async (eventId) => {
                try {
                    const result = await roomApi.getRoomList(eventId, 1);
                    setRoomList(result.data?.room_data?.slice(0, 10));
                } catch (err) {
                    dispatch(setError(err));
                    dispatch(setIsError(true));
                }
            }
            getRoomListApi(eventId)
        }
    }, [eventList, dispatch, eventId]);


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
        // getRoomListApi,
        getEventListApi,
        setCurrentFanInfo,
        userInfo,
        eventList
    }
}
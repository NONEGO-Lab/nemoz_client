import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {roomApi} from "../data/room_data";
import {setError, setIsError} from "../../redux/modules/errorSlice";
import {addEventList, setEventIds} from "../../redux/modules/eventSlice"
import {eventApi} from "../../event/data/event_data";
import {useNavigate} from "react-router-dom";


export const RoomListController = () => {
    const dispatch = useDispatch();
    const [roomList, setRoomList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1)
    const [currentRoom, setCurrentRoom] = useState({});
    const [isOpenRoomCreate, setIsOpenRoomCreate] = useState(false);
    const [currentFanInfo, setCurrentFanInfo] = useState({});
    const [isOpenAddUser, setIsOpenAddUser] = useState(false);
    const eventId = localStorage.getItem("eventId");
    const currentEventId = useSelector(state => state.event.currentEventId)
    const userInfo = useSelector((state) => state.user.userInfo);
    const eventList = useSelector(state => state.event.eventList)
    const navigate = useNavigate()

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
                    // await getEventListApi({userId});
                    window.location.reload();
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
        await roomApi.getRoomList(eventId, currentPage)
    }

    useEffect(() => {
        if (eventList?.length > 0 && eventId) {
            const getRoomListApi = async (eventId) => {
                try {
                    const result = await roomApi.getRoomList(eventId, currentPage);
                    const total = result.data.total_page
                    setTotalPage(total)
                    setRoomList(result.data?.room_data?.slice(0, 10));
                } catch (err) {
                    dispatch(setError(err));
                    dispatch(setIsError(true));
                }
            }
            getRoomListApi(eventId)
        }
    }, [eventList, dispatch, eventId, currentPage]);


    return {
        roomList,
        setIsOpenRoomCreate,
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
        getEventListApi,
        setCurrentFanInfo,
        userInfo,
        eventList,
        totalPage
    }
}
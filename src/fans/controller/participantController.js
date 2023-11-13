import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addTestFanInfo, clearTestSession} from "../../redux/modules/testSlice";
import {attendeeApi} from "../data/attendee_data";
import {addEventName, setEventIds} from "../../redux/modules/eventSlice";

export const ParticipantController = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1)
  const [attendeeList, setAttendeeList] = useState([]);
  const [isOpenFanDetail, setIsOpenFanDetail] = useState(false);
  const [currentFanId, setCurrentFanId] = useState();
  const [currentFanEventId, setCurrentFanEventId] = useState()
  const [openDeviceSetting, setOpenDeviceSetting] = useState(false)
  const roomArray = [...new Array(10)].map((_, i) => i + 1);
  const eventId = localStorage.getItem("eventId")
  const eventList = useSelector(state => state.event.eventList)

  const connectToTest = (user) => {

    dispatch(addTestFanInfo(user))
    dispatch(setEventIds({event_id : user.event_id}))
    dispatch(addEventName(user.status.room_name))

    if(localStorage.getItem("isSetDevice") === "true"){
      navigate(`/test/${user.event_id}_${user.fan_id}`);
    } else {
      setOpenDeviceSetting(true)
    }

  };

  const setOnModal = () => {
    setIsOpenFanDetail(false);
    setCurrentFanId(null);
    setCurrentFanEventId(null);
  }

  const closeDeviceSetting = () => {
    setOpenDeviceSetting(false)

  }

  const getAttendeeListApi = async (eventId, page) => {
    try {
      const result = await attendeeApi.getAttendeeList(eventId, page);
      setAttendeeList(result.fan_lists);
      setTotalPage(result.paging.total_page)
    } catch (err) {
      // dispatch(setError(err));
      // dispatch(setIsError(true));
    }
  }

  useEffect(()=> {
    if(eventList?.length>0){
      getAttendeeListApi(eventId,currentPage);
    }
    dispatch(clearTestSession());
  },[eventList, eventId, currentPage])


  const movePage = async (num) => {

    if(num === 0 || num === 11) {
      return;
    }

    setCurrentPage(num);
    await getAttendeeListApi(eventId, num);
  }

  return {
    attendeeList,
    movePage,
    roomArray,
    isOpenFanDetail,
    currentPage,
    connectToTest,
    setIsOpenFanDetail,
    setCurrentFanId,
    currentFanEventId,
    setCurrentFanEventId,
    currentFanId,
    setOnModal,
    openDeviceSetting, 
    setOpenDeviceSetting,
    closeDeviceSetting,
    totalPage
  }
}
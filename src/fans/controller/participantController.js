import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addTestFanInfo, clearTestSession} from "../../redux/modules/testSlice";
import {attendeeApi} from "../data/attendee_data";
import {roomApi} from "../../room/data/room_data";
import {setError, setIsError} from "../../redux/modules/errorSlice";
import {currentEvent} from "../../redux/modules/eventSlice";

export const ParticipantController = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
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
    dispatch(currentEvent(user.event_id))
    if(localStorage.getItem("isSetDevice") === "true"){
      navigate(`/test/${user.fan_id}`);
    } else {
      setOpenDeviceSetting(true)
    }

  };



  const setOnModal = () => {
    setIsOpenFanDetail(false);
    setCurrentFanId();
    setCurrentFanEventId();
  }

  const closeDeviceSetting = () => {
    setOpenDeviceSetting(false)
  }

  const getAttendeeListApi = async (eventId, page) => {
    try {
      const result = await attendeeApi.getAttendeeList(eventId, page);
      setAttendeeList(result.fan_lists);
    } catch (err) {
      // dispatch(setError(err));
      // dispatch(setIsError(true));
    }
  }

  useEffect(()=> {
    if(eventList?.length>0){
      getAttendeeListApi(eventId,1);
    }
    dispatch(clearTestSession());
  },[eventList, eventId])


  const movePage = async (num) => {

    if(num === 0 || num === 11) {
      return;
    }

    setCurrentPage(num);
    await getAttendeeListApi(num);
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
    closeDeviceSetting
  }
}
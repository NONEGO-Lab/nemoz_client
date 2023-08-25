import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addTestFanInfo, clearTestSession} from "../../redux/modules/testSlice";
import {attendeeApi} from "../data/attendee_data";

export const ParticipantController = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState([]);
  const [isOpenFanDetail, setIsOpenFanDetail] = useState(false);
  const [currentFanId, setCurrentFanId] = useState();
  const [openDeviceSetting, setOpenDeviceSetting] = useState(false)
  const roomArray = [...new Array(10)].map((_, i) => i + 1);
  const eventId = useSelector((state) => state.event.eventId);

  const connectToTest = (user) => {
    dispatch(addTestFanInfo(user))
    if(localStorage.getItem("isSetDevice") === "true"){
      navigate(`/test/${user.fan_id}`);
    } else {
      setOpenDeviceSetting(true)
    }

  };

  const getAttendeeListApi = async (page) => {
    try {
      const result = await attendeeApi.getAttendeeList(eventId, page);
      setAttendeeList(result.fan_lists);
    } catch (err) {
      // dispatch(setError(err));
      // dispatch(setIsError(true));
    }
  }

  const setOnModal = () => {
    setIsOpenFanDetail(false);
    setCurrentFanId();
  }

  const closeDeviceSetting = () => {
    setOpenDeviceSetting(false)
  }

  useEffect(()=>{
    getAttendeeListApi(1);
    dispatch(clearTestSession());
  },[])

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
    currentFanId,
    setOnModal,
    openDeviceSetting, 
    setOpenDeviceSetting,
    closeDeviceSetting
  }
}
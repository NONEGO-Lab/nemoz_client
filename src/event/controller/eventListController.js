import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addEventInfo, addEventList, setEventIds} from "../../redux/modules/eventSlice";
import {eventApi} from "../data/event_data";
import {setError, setIsError} from "../../redux/modules/errorSlice";


export const EventListController = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [eventList, setEventList] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);

  const roomArray = [...new Array(10)].map((_, i) => i + 1);

  const goToUpdatePage = (event) => {
    navigate(`/update/event/${event.event_id}`);
  }

  const goToStartEvent = (event) => {
    dispatch(addEventInfo(event));
    navigateByRole();
  }

  const navigateByRole = () => {
    if(userInfo.role === "fan") {
      navigate("/waitcall");
    } else {
      navigate("/roomlist");
    }
  }


  const getEventList = async () => {
    try {
      const response = await eventApi.getEventList({ page });
      dispatch(addEventList(response))
      setEventList(response);
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  };

  useEffect(() => {
    getEventList();
  }, [page]);

  return {
    eventList,
    getEventList,
    goToUpdatePage,
    goToStartEvent,
    page,
    setPage,
    roomArray,
  }

}
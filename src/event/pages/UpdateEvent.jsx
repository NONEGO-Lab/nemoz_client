import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input } from "../../element";
import { Controller, useForm } from "react-hook-form";
import SelectBox, { components } from "react-select";
import { eventApi } from "../data/event_data";
import { setError, setIsError } from "../../redux/modules/errorSlice";


const UpdateEvent = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const userInfo = useSelector((state) => state.user.userInfo);

  const [event, setEvent] = useState({});
  const [selectedFans, setSelectedFans] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [newEventInfo, setNewEventInfo] = useState({
    name: "",
    date: ""
  });


  const { register, handleSubmit, control } = useForm();

  const getEventDetail = async () => {
    try {
      const response = await eventApi.getEventDetail({ page:1, eventId: params.id});
      let detail = response.response_data.events[0];
      setEvent(detail);
      setNewEventInfo({name: detail.event_name, date: detail.due_dt});
      setSelectedFans(valueMaker(detail.target_fan_ids));
      setSelectedArtists(valueMaker(detail.target_artist_ids));
      setSelectedStaffs(valueMaker(detail.target_staff_ids));
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  }

  useEffect(()=>{
    getEventDetail();
  },[])



  const valueMaker = (array) => {

    array = array?.map((el) => {
      el.value = el.username;
      el.label = el.username;
    })
    return array;
  };


  const idArrayMaker = (array) => {
    return array.map((el) => el.id);
  }


  const onSubmit = async (data) => {

    const response = await eventApi.updateEvent({
      id: Number(params.id),
      eventName: data.name,
      artistIds: idArrayMaker(selectedArtists),
      staffIds: idArrayMaker(selectedStaffs),
      fanIds: idArrayMaker(selectedFans),
      creator: userInfo.id,
      dueDt: data.date.replace("T", " ")+":00"
    });

    if(response.event_data.length > 0) {
      alert("수정 완료!");
      navigate("/eventlist");
    }

  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setNewEventInfo({
      ...newEventInfo,
      [name]: value
    });
  }


  return (
      <div className={"m-auto w-[1080px] text-center"}>
        <div className="text-[30px] font-bold mt-[90px] mb-[30px]">
          이벤트 수정
        </div>
        <form className={"text-center m-auto w-[500px]"}>
          <Input
              register={register}
              label={"이벤트 이름"}
              name={"name"}
              value={newEventInfo.name}
              onChange={onChange}
              required={true}
              width={"w-[500px]"}
              height={"h-[44px]"}
              marginBottom={"mb-[20px]"}
              placeholder={"이벤트 이름을 입력하세요"}
              type={"text"}
          />
          <Input
              register={register}
              value={newEventInfo.date.substring(0,16)}
              onChange={onChange}
              label={"시작 날짜"}
              name={"date"}
              required={true}
              width={"w-[500px]"}
              height={"h-[44px]"}
              marginBottom={"mb-[20px]"}
              placeholder={"이벤트 이름을 입력하세요"}
              type={"datetime-local"}
          />

          <label htmlFor={"fanList"}
                 className="text-gray-400 text-[14px] mb-[10px] flex flex-start">
            팬 목록
          </label>
          <Controller
              name="fanIds"
              control={control}
              render={({ field }) =>
                  <SelectBox
                      {...field}
                      styles={customStyles}
                      value={selectedFans}
                      onChange={setSelectedFans}
                      closeMenuOnSelect={false}
                      components={{ DropdownIndicator }}
                      options={valueMaker(event.target_fan_ids)}
                      isMulti
                  />}
          />

          <label htmlFor={"fanList"}
                 className="text-gray-400 text-[14px] mb-[10px] flex flex-start">
            아티스트 목록
          </label>
          <Controller
              name="artistIds"
              control={control}
              render={({ field }) =>
                  <SelectBox
                      {...field}
                      styles={customStyles}
                      value={selectedArtists}
                      onChange={setSelectedArtists}
                      closeMenuOnSelect={false}
                      components={{ DropdownIndicator }}
                      options={valueMaker(event.target_artist_ids)}
                      isMulti
                  />}
          />

          <label htmlFor={"fanList"}
                 className="text-gray-400 text-[14px] mb-[10px] flex flex-start">
            스탭 목록
          </label>
          <Controller
              name="staffIds"
              control={control}
              render={({ field }) =>
                  <SelectBox
                      {...field}
                      styles={customStyles}
                      value={selectedStaffs}
                      onChange={setSelectedStaffs}
                      closeMenuOnSelect={false}
                      components={{ DropdownIndicator }}
                      // options={valueMaker(event.target.staff_ids)}
                      isMulti
                  />}
          />
          <Button
              width={"w-[150px]"}
              margin={"mt-[55px] mb-[80px]"}
              _onClick={handleSubmit(onSubmit)}
          >
            수정
          </Button>

        </form>
      </div>
  )
};

export default UpdateEvent;


const DropdownIndicator = (props) => {
  return (
      <components.DropdownIndicator {...props}>

      </components.DropdownIndicator>
  );
};


const customStyles = {
  menu: (provided, state) => ({
    ...provided,
    border: '1px solid rgb(156, 163, 175, 1)',
    padding: 20,
    display: "flex"
  }),

  control: (_, { selectProps: {  }}) => ({
    width: "500px",
    height: "44px",
    borderRadius: "7px",
    border: '2px solid rgb(156, 163, 175)',
    padding: 2,
    marginBottom: '18px'
  }),

  indicatorsContainer: () => ({
    display: "none"
  }),
}
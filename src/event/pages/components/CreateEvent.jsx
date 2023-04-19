import React, { useState, useEffect } from "react";
import { Input, Button } from "../../../element";
import { useForm, Controller } from "react-hook-form";
import SelectBox,  { components } from 'react-select'
import { eventApi } from "../../data/event_data";
import { useSelector, useDispatch } from "react-redux";
import {setError, setIsError} from "../../../redux/modules/errorSlice";


const CreateEvent = () => {

  const { register, handleSubmit, control } = useForm();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);


  let target_artist_ids = [
    {
      "id": 11,
      "userid": "artist",
      "username": "아티스트1",
      "company_name": "Artist Company",
      "role": "artist"
    }
  ];

  let target_staff_ids = [
    {
      "id": 1,
      "userid": "staff",
      "username": "스태프1",
      "company_name": "Artist Company",
      "role": "staff"
    }
  ];
  let target_fan_ids = [
    {
      "id": 2,
      "userid": "fan1",
      "username": "팬1",
      "company_name": "",
      "role": "fan"
    },
    {
      "id": 3,
      "userid": "fan2",
      "username": "팬2",
      "company_name": "",
      "role": "fan"
    },
    {
      "id": 4,
      "userid": "fan3",
      "username": "팬3",
      "company_name": "",
      "role": "fan"
    },
    {
      "id": 5,
      "userid": "fan4",
      "username": "팬4",
      "company_name": "",
      "role": "fan"
    }
  ];

  const valueMaker = (array) => {
    array.map((el) => {
      el.value = el.username;
      el.label = el.username;
    })
    return array;
  };

  const idArrayMaker = (array) => {
    return array.map((el) => el.id);
  }

  const onSubmit = async (data) => {

    try {
      const response = await eventApi.createEvent({
        name: data.name,
        date: data.date.replace("T", " ")+":00",
        artistIds: idArrayMaker(data.artistIds),
        fanIds: idArrayMaker(data.fanIds),
        staffIds: idArrayMaker(data.staffIds),
        creator: userInfo.id
      });

      if(response.event_data.length > 0) {
        alert("등록 완료!");
      }
    } catch (err){
      dispatch(setError(err));
      dispatch(setIsError(true));
    }


  };

  return (
      <div className={"m-auto w-[1080px] text-center"}>
        <div className="text-[30px] font-bold mt-[90px] mb-[30px]">
          이벤트 등록
        </div>
        <form className={"text-center m-auto w-[500px]"}>
          <Input
              register={register}
              label={"이벤트 이름"}
              name={"name"}
              required={true}
              width={"w-[500px]"}
              height={"h-[44px]"}
              marginBottom={"mb-[20px]"}
              placeholder={"이벤트 이름을 입력하세요"}
              type={"text"}
          />
          <Input
              register={register}
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
                      closeMenuOnSelect={false}
                      components={{ DropdownIndicator }}
                      defaultValue={[]}
                      isMulti
                      options={valueMaker(target_fan_ids)}
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
                      closeMenuOnSelect={false}
                      components={{ DropdownIndicator }}
                      defaultValue={[]}
                      isMulti
                      options={valueMaker(target_artist_ids)}
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
                      closeMenuOnSelect={false}
                      components={{ DropdownIndicator }}
                      defaultValue={[]}
                      isMulti
                      options={valueMaker(target_staff_ids)}
                  />}
          />
          <Button
              width={"w-[150px]"}
              margin={"mt-[55px] mb-[80px]"}
              _onClick={handleSubmit(onSubmit)}
          >
            등록
          </Button>

        </form>
      </div>
  )
}


export default CreateEvent;


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
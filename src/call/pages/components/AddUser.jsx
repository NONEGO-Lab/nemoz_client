import React, { useState, useEffect } from "react";
import { ModalFrameDepth } from "../../../modal/ModalFrame";
import { Button, Input, Select, InputTime } from "../../../element";
import { useForm } from "react-hook-form";
import {eventApi} from "../../../event/data/event_data";
import {useSelector} from "react-redux";

const AddUser = ({ setOnModal }) => {

  let style = "w-[600px] h-[500px] drop-shadow-md";
  const eventId = useSelector((state) => state.event.eventId);

  const { register, handleSubmit } = useForm();
  const [time, setTime] = useState({
    hour: "",
    min: "",
    sec: "",

  });

  const [fanOptionList, setFanOptionList] = useState([]);

  const onSubmit = (data) => {
    //api 추가 되어야 함
    alert('api가 추가 필요');
  }

  const getEventUsers = async () => {

    let page = 1;
    const response = await eventApi.getEventList({ page, eventId });
    const fanList = response.events[0].target_fan_ids;
    console.log(response, '!!!!')
    const fanOptions = fanList.map((fan) => fan.username);
    setFanOptionList(fanOptions);
  }

  const timeOnChangeHandler = (e) => {
    const { name, value } = e.target;
    let time = parseInt(value);

    if(time > 60 || time < 0) {
      return;
    }

    switch(name){
      case "hour":
        setTime((prev) => ({... prev, hour: value.toString()}));
        break
      case "min":
        setTime((prev) => ({... prev, min: value.toString()}));
        break
      case "sec":
        setTime((prev) => ({... prev, sec: value.toString()}));
        break
      default:
    }

  }

  useEffect(()=>{
    getEventUsers();
  },[])


  return (
      <ModalFrameDepth setOnModal={setOnModal} style={style}>
        <div>
          <div
              className="text-[32px] font-bold py-6 px-8">
            참여자 추가하기
          </div>
          <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-10 text-[20px]">
            <Select
                register={register}
                name={"userName"}
                label={"참여자 선택"}
                id={"users"}
                placeholder={"참여자 선택"}
                options={[...fanOptionList]}
                width={"w-[400px]"}
                marginBottom={"mb-[10px]"}
            >
            </Select>
            <Input
                register={register}
                name={"addReason"}
                label={"추가 사유"}
                placeholder={"입력"}
                width={"w-[400px]"}
                marginBottom={"mb-[10px]"}
            />
            <div className="text-gray-400 text-[12px]">추가 시간</div>
            <div className="w-[400px] flex items-center mt-2 border-2 rounded-[6px] border-gray-400 p-[10px]">
              <InputTime
                  _onChange={timeOnChangeHandler}
                  _value={time}
              />
              {/*{*/}
              {/*    ["hour","min","sec"].map((num, idx)=>{*/}
              {/*        return (*/}
              {/*            <div className={"text-[16px] text-gray-500 flex justify-center"}>*/}
              {/*                <input*/}
              {/*                    onChange={timeOnChangeHandler}*/}
              {/*                    name={num}*/}
              {/*                    tabIndex={idx + 1}*/}
              {/*                    type={"number"}*/}
              {/*                    className="outline-none w-[20px]"*/}
              {/*                    value={time[num]}*/}
              {/*                    placeholder={"00"}/>*/}
              {/*                {idx !== 2 && <div>:</div>}*/}
              {/*            </div>*/}
              {/*        )*/}
              {/*    })*/}
              {/*}*/}
            </div>
          </form>
          <div className="absolute bottom-[30px] right-[20px]">
            <Button
                tabIndex={4}
                type={"submit"}
                _onClick={handleSubmit(onSubmit)}
                margin={"mr-[15px]"}
                width={"w-[120px]"}>
              추가하기
            </Button>
            <Button
                width={"w-[120px]"}
                _onClick={setOnModal}>
              취소
            </Button>
          </div>

        </div>
      </ModalFrameDepth>
  )
}

export default AddUser;
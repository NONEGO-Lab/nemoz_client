import React, {useState, useEffect} from "react";
import {ModalFrameDepth} from "../../../modal/ModalFrame";
import {Controller, useForm} from "react-hook-form";
import SelectBox, {components} from "react-select";
import {roomApi} from "../../../room/data/room_data";
import {useDispatch} from "react-redux";
import {addFanModalToggle} from "../../../redux/modules/commonSlice";

const AddUser = ({setOnModal, eventList, eventId, roomId}) => {
    let style = "w-[650px] h-[900px] rounded-[15px] drop-shadow-md p-[45px]";
    const targetFanList = eventList.find(e => e.event_id === eventId).target_fan_ids
    const {register, handleSubmit, control} = useForm();
    const [fanOptionList, setFanOptionList] = useState([]);
    const dispatch = useDispatch()

    const onSubmit = async (data) => {
        const {selectedFan, reservedTime, reason} = data
        const fanId = selectedFan.value
        try {
            const response = await roomApi.addFan({eventId, roomId, fanId, reservedTime, reason})
            if (response) {
                const msg = response.message
                if(msg === 'Fan Added'){
                    alert('팬을 추가하였습니다.')
                    dispatch(addFanModalToggle(false))
                    setOnModal()
                }
            }
        } catch (e) {
            const msg = e.response.data.message
            if (msg === 'Fan Information already existed in Waitings') {
                alert('이미 존재하는 팬입니다.')
                setOnModal()
            }
            console.error(msg)
        }
    }


    useEffect(() => {
        if (eventList.length >= 0) {
            const transformedArray = targetFanList.map(item => ({
                value: item.no,
                label: item.name
            }));
            setFanOptionList(transformedArray)
        }
    }, [])


    return (
        <ModalFrameDepth setOnModal={setOnModal} style={style}>
            <div className={"placeholder:text-[#646464]"}>
          <span
              className="font-bold text-[#444] text-[24px] ">
            Add Fan
          </span>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="text-[20.3px] mt-[60px] text-[#646464]">

                    <Controller
                        name="selectedFan"
                        control={control}
                        render={({field}) =>
                            <SelectBox
                                {...field}
                                options={fanOptionList}
                                styles={customStyles}
                                isSearchable={false}
                                components={{DropdownIndicator, IndicatorSeparator: () => null}}
                                placeholder={"Fan 선택하기"}
                            />
                        }
                    />

                    <input
                        {...register("reservedTime", {
                            required: true
                        })}
                        name={"reservedTime"}
                        type={"number"}
                        placeholder={"추가 할 시간을 입력하세요(초)"}
                        className={"pl-[13.5px] text-[#646464] text-[20.3px] font-medium " +
                            "w-full  border-b-[1.5px] border-[#c7c7c7] pt-[10px] pb-[25px] mb-[35px] " +
                            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none  " +
                            "placeholder-[#646464] placeholder:font-medium placeholder:text-[20.3px]"}
                    />

                    <div
                        className={"w-full h-[185px] border-[1.5px] border-[#c7c7c7] px-[15px] py-[28.5px] mb-[273px]"}>
              <textarea
                  {...register("reason", {
                      required: true
                  })}
                  name={"reason"}
                  className={"w-full min-h-full resize-none placeholder-[#646464] placeholder:font-medium"} placeholder={"추가 사유를 입력하세요"} id="addFanTextArea"/>

                    </div>
                </form>
                <div className="flex justify-between w-full">
                    <button
                        className={"w-[140px] h-[50px] border border-[#c7c7c7] rounded-[10px] text-[#444] flex justify-center items-center cursor-pointer"}
                        type={"submit"}
                        onClick={handleSubmit(onSubmit)}
                    >

                        <div className={"flex items-center"}>
                            <img src={"/images/plusIcon.png"} alt="plusicon" className={"w-[14.5px] h-[14.5px] mr-[5px]"}/>
                            <span>ADD</span>
                        </div>
                    </button>
                    <button
                        className={"w-[140px] h-[50px] border border-[#aaa] rounded-[10px] text-[#444] flex justify-center items-center cursor-pointer"}
                        onClick={setOnModal}
                    >
                        <div className={"flex items-center"}>
                            <img src={"/images/closeIcon.png"} alt="closeicon" className={"w-[14.5px] h-[14.5px] mr-[5px]"}/>
                            <span>CANCEL</span>
                        </div>
                    </button>

                </div>

            </div>
        </ModalFrameDepth>
    )
}

const customStyles = {
    control: (provided) => ({
        ...provided,
        lineHeight: 'normal',
        border: 'none',
        borderBottom: '1.5px solid #c7c7c7',
        paddingBottom: "22.5px",
        boxShadow: '0 !important',
        '&:hover': {
            border: '0 !important'
        },
        marginBottom: '43.5px',
        fontSize:'20.3px',
        color: '#646464',
    }),
    placeholder: (provided) =>({
        ...provided,
        color:'#646464',
        fontWeight:500,
        fontSize: '20.3px'
    })
};

const ArrowDownIcon = () => {
    return <img src="../images/arrowDown.png" alt={"arrow-down"} className={`w-[20px] h-[11px]`}/>;
};

const DropdownIndicator = props => {
    return (
        <components.DropdownIndicator {...props}>
            <ArrowDownIcon/>
        </components.DropdownIndicator>
    );
};

export default AddUser;
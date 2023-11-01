import React, {useState, memo, useCallback, useEffect} from "react";
import {ModalFrame} from "../../modal/ModalFrame";
import {Input, Button, Select} from "../../element";
import {useForm, Controller} from "react-hook-form";
import {roomApi} from "../data/room_data";
import SelectBox, {components} from 'react-select'
import {useSelector} from "react-redux";



const CreateRoom2 = ({setOnModal, getEventListApi, eventList}) => {
    const modalStyle = "w-[650px] min-h-[900px] rounded-[15px] drop-shadow-md";
    const {register, handleSubmit, control, formState: {errors}, setError, onChange} = useForm();
    const [imgUrl, setImgUrl] = useState({
        location: "", mimeType: "", fileName: "",
    });
    // const [time, setTime] = useState(0);

    const [targetFanIds, setTargetFanIds] = useState(eventList.map(e => e.target_fan_ids)[0]);
    const [targetArtistIds, setTargetArtistIds] = useState(eventList.map(e => e.target_artist_ids)[0].name || []);
    const [targetArtistFullInfo, setTargetArtistFullInfo] = useState(eventList.map(e => e.target_artist_ids));
    const [targetStaffIds, setTargetStaffIds] = useState(eventList.map(e => e.target_staff_ids)[0]);
    const [currentEventId, setCurrentEventId] = useState(eventList.map(e => e.event_id)[0])
    const userInfo = useSelector(state => state.user.userInfo)

    const {location, mimeType, fileName} = imgUrl;
    const onSubmit = async (data) => {
        const {selectArtist, roomTitle, time, startDate, fanIds, staffIds} = data;
        let fanIdArray = [];
        fanIds.forEach((fan, idx) => {
            let data = {"fan_id": fan.value, "order": idx + 1};
            fanIdArray.push(data);
        });


        let artistId = targetArtistFullInfo.find((ar) => ar.name === selectArtist)?.no;

        if (artistId === undefined) {
            artistId = targetArtistFullInfo[0].no;
        }

        // let reserved_time = (Number(time.hour) * 60 * 60) + (Number(time.min) * 60) + Number(time.sec)
        let due_dt = startDate.replace("T", " ") + ":00"

        const result = await roomApi.createRoom({
            roomTitle,
            eventId: currentEventId,
            staffIds:staffIds.map(s => s.value),
            artistId,
            fanIdArray,
            reserved_time: Number(time),
            location,
            mimeType,
            due_dt,
            creator:userInfo.id,
        });

        if (result.message === "Room Created") {
            window.alert("방이 만들어졌습니다.");
            setOnModal();
            getEventListApi({userId:userInfo.id});
        }
    }

    const valueMaker = useCallback((array) => array.map(({no: value, name: label, ...rest}) => ({
        label, value, ...rest
    })), [])

    // const timeOnChangeHandler = useCallback((e) => {
    //     const {name, value} = e.target;
    //
    //     let check = /^[0-9]+$/;
    //     if (!check.test(value)) return;
    //
    //     let time = parseInt(value);
    //
    //     if (time > 60 || time < 0) {
    //         return;
    //     }
    //
    //     switch (name) {
    //         case "hour":
    //             setTime((prev) => ({...prev, hour: value.toString()}));
    //             break
    //         case "min":
    //             setTime((prev) => ({...prev, min: value.toString()}));
    //             break
    //         case "sec":
    //             setTime((prev) => ({...prev, sec: value.toString()}));
    //             break
    //         default:
    //     }
    //
    // }, [time])


    const onChangeFile = async (e) => {
        let file = e.target.files[0]
        const response = await roomApi.uploadImage(currentEventId, file);
        setImgUrl({
            fileName: file.name, location: response.data.location, mimeType: response.data.mimetype
        });
    }


    return (<ModalFrame setOnModal={setOnModal} style={modalStyle}>
        <div className={"p-[60px]"}>
            {/*Title*/}
            <div className="flex justify-between">
                <div className="text-[24px] font-medium text-[#444]">
                    방 만들기
                </div>
                <div onClick={() => setOnModal(false)}
                     className={"w-[20px] min-h-[20px] flex items-center cursor-pointer"}>
                    <img src={"../images/closeIcon.png"} alt='close-icon'/>
                </div>
            </div>

            <form className="mt-[57px]">
                {/*Select Event*/}
                <div
                    className={`flex items-center justify-between border-b-[1.5px] border-b-[#c7c7c7] min-h-[44px] mb-[40px] pb-[20px]`}>
                    <label htmlFor={"roomTitle"}
                           className=" flex items-center text-[20px] text-[#646464] font-medium">
                        이벤트 선택
                    </label>
                    <select
                        {...register('roomTitle', {
                            required: true
                        })}
                        onChange={(e) => {
                            const target = e.target.value
                            const targetEventId = eventList.find(e => e.event_name === target)?.event_id
                            setCurrentEventId(targetEventId)
                            setTargetFanIds(eventList.find(e => e.event_name === target)?.target_fan_ids);
                            setTargetArtistIds(eventList.find(e => e.event_name === target)?.target_artist_ids.map(a => a.name));
                            setTargetArtistFullInfo(eventList.find(e =>e.event_name === target).target_artist_ids)
                            setTargetStaffIds(eventList.find(e => e.event_name === target)?.target_staff_ids);
                        }}
                        className={`bg-white text-[23px] flex items-center text-[#646464] `}
                        id={"roomTitle"}
                        placeholder={"이벤트 선택"}
                    >
                        {eventList.map(e => e.event_name).map((value, idx) => {
                            return (<option className={"bg-white text-center"} key={idx} value={value}>
                                {value}
                            </option>)
                        })}
                    </select>
                </div>


                {/*Select Artist*/}
                <Select
                    register={register}
                    name={'selectArtist'}
                    label={"아티스트 선택"}
                    options={targetArtistIds}
                    items={'items-center'}
                    justify={"justify-between"}
                    width={"w-[25%]"}
                    fontSize={"text-[23px]"}
                    mb={"mb-[40px]"}
                    pb={"pb-[20px]"}
                />

                {/*영상통화 시간 선택*/}
                <div
                    className={`flex items-center justify-between border-b-[1.5px] border-b-[#c7c7c7] min-h-[44px] mb-[40px] pb-[20px]`}>
                    <label htmlFor={"time"} className=" flex items-center text-[20px] text-[#646464] font-medium">
                        영상통화 시간 선택
                    </label>
                    <div>
                        <input
                            {...register('time')}
                            className={`bg-white text-[23px] text-[#646464] w-[100px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            name={"time"}
                            type={"number"}
                        >
                        </input>
                    </div>
                </div>

                {/* 시작 일시 */}
                <Input
                    register={register}
                    title={"시작 일시"}
                    name={"startDate"}
                    required={true}
                    width={"w-[100%]"}
                    height={"min-h-[44px]"}
                    marginBottom={"mb-[40px]"}
                    placeholder={"시작 일시"}
                    type={"datetime-local"}
                />

                {/* 파일 추가 */}
                <Input
                    register={register}
                    title={"파일 추가"}
                    name={"file"}
                    required={true}
                    width={"w-[100%]"}
                    height={"min-h-[44px]"}
                    marginBottom={"mb-[40px]"}
                    fileName={fileName && fileName}
                    onChange={onChangeFile}
                    type={"file"}
                />

                {/*multi select가 가능한 스탭 목록*/}
                <div className={`flex w-[100%] mb-[40px] justify-between  border-b-2 border-b-[#c7c7c7] pb-[20px]`}>
                    <label htmlFor={"staffList"}
                           className="text-[#646464] text-[20px] font-medium flex items-center">
                        스탭 등록
                    </label>
                    <Controller
                        name="staffIds"
                        control={control}
                        render={({field}) =>
                            <SelectBox
                                {...field}
                                styles={customStyles}
                                width="100%"
                                height="44px"
                                closeMenuOnSelect={false}
                                isSearchable={false}
                                components={{DropdownIndicator, IndicatorSeparator: () => null }}
                                placeholder={"Staff 등록"}
                                isMulti
                                options={valueMaker(targetStaffIds)}
                        />}
                    />
                </div>

                {/*multi select가 가능한 팬 목록*/}
                <div className={`flex w-[100%] mb-[40px] justify-between  border-b-2 border-b-[#c7c7c7] pb-[20px]`}>
                    <label htmlFor={"staffList"}
                           className="text-[#646464] text-[20px] font-medium flex items-center">
                        팬 등록
                    </label>
                    <Controller
                        name="fanIds"
                        control={control}
                        render={({field}) => <SelectBox
                            {...field}
                            styles={customStyles}
                            width="100%"
                            height="44px"
                            closeMenuOnSelect={false}
                            components={{DropdownIndicator, IndicatorSeparator: () => null}}
                            isSearchable={false}
                            placeholder={"Fan 등록"}
                            isMulti
                            options={valueMaker(targetFanIds)}
                        />

                        }
                    />
                </div>

                <Button
                    type={"submit"}
                    _onClick={handleSubmit(onSubmit)}
                    bgColor={"bg-[#01dfe0]"}
                >
                    <div className={"mx-[241px] my-[21px] min-h[24.5px] text-[26px] text-white font-medium"}>
                        확인
                    </div>
                </Button>

            </form>

        </div>
    </ModalFrame>);
};

export default memo(CreateRoom2);

const customStyles = {
    menu: (provided, state) => ({
        ...provided, width: "400px", border: 'none', padding: 20, display: "flex", borderRadius: "18px",

    }),

    control: (_, {selectProps: {}}) => ({
        width: "100%",
        height: "44px",
        borderRadius: "7px",
        display:'flex'
        // padding: 2,
    }),

    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return {...provided, opacity, transition};
    },

    multiValue: () => ({
        borderRadius: "18px",
        background: '#c7c7c7',
        width: "110px",
        color: '#FFF',
        display: 'flex',
        justifyContent: "center",
        marginRight: "15px"
    }), multiValueLabel: () => ({
        textSize: "20px", margin: "9px 0", fontWeight: "bold"
    })
}

const ArrowDownIcon = () => {
    return <img src="../images/nemozPlusIcon.png" alt={"arrow-down"} className={`w-[20px] h-[20px]`}/>;
};

const DropdownIndicator = (props) => {
    return (<components.DropdownIndicator {...props}>
            <ArrowDownIcon/>
        </components.DropdownIndicator>

    )
};

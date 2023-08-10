import React, {useState, memo, useCallback, useEffect} from "react";
import {ModalFrame} from "../../modal/ModalFrame";
import {Input, Button, Select, InputTime} from "../../element";
import {useForm, Controller} from "react-hook-form";
import {roomApi} from "../data/room_data";
import SelectBox, {components, DropdownIndicatorProps} from 'react-select'
import {eventApi} from "../../event/data/event_data";
import {useSelector} from "react-redux";


const CreateRoom = ({setOnModal, getRoomListApi}) => {

    let style = "w-[650px] h-[900px] rounded-[15px] drop-shadow-md";
    const eventId = useSelector((state) => state.event.eventId);
    const {register, handleSubmit, control} = useForm();
    const [imgUrl, setImgUrl] = useState({
        location: "",
        mimeType: "",
        fileName: "",
    });
    const [time, setTime] = useState({
        hour: "",
        min: "",
        sec: "",

    });

    const [targetFanIds, setTargetFanIds] = useState([]);
    const [targetArtistIds, setTargetArtistIds] = useState([]);
    const [targetStaffIds, setTargetStaffIds] = useState([]);

    const getEventUsers = async () => {
        let page = 1;
        const response = await eventApi.getEventDetail({page, eventId});
        setTargetFanIds(response.target_fan_ids);
        setTargetArtistIds(response.target_artist_ids);
        setTargetStaffIds(response.target_staff_ids);
    }

    const createRoomForm = [
        {label: "방 제목", name: "roomTitle", placeholder: "방 이름을 입력하세요"},
        {
            label: "아티스트", name: "artistName", placeholder: "아티스트 선택", type: "select",
            options: targetArtistIds.map((artist) => artist.username)
        },
        {label: "영상통화 시간 선택", name: "callTime", placeholder: "1:00 분", type: "timeInput"},
        {label: "시작 일시", name: "startDate", placeholder: "2022-08-26-19:00", type: "datetime-local"},
        {label: "대기 화면", name: "file", placeholder: "파일 추가", type: "file"}
    ]

    const {location, mimeType, fileName} = imgUrl;

    const onSubmit = async (data) => {
        const {artistName, roomTitle, startDate, fanIds, staffIds} = data;

        let fanIdArray = [];
        fanIds.forEach((fan, idx) => {
            let data = {"fan_id": fan.id, "order": idx + 1};
            fanIdArray.push(data);
        });


        let artistId = targetArtistIds.find((ar) => ar.username === artistName)?.id;

        if (artistId === undefined) {
            artistId = targetArtistIds[0].id;
        }

        let reserved_time = (Number(time.hour) * 60 * 60) + (Number(time.min) * 60) + Number(time.sec)
        let due_dt = startDate.replace("T", " ") + ":00"

        const result = await roomApi.createRoom({
            roomTitle, eventId, staffIds, artistId, fanIdArray,
            reserved_time, location, mimeType, due_dt
        });

        if (result === "Room Created") {
            window.alert("방이 만들어졌습니다.");
            setOnModal();
            getRoomListApi();
        }
    }


    const valueMaker = (array) => {
        array.map((el) => {
            el.value = el.username;
            el.label = el.username;
        })
        return array;
    }


    const timeOnChangeHandler = useCallback((e) => {
        const {name, value} = e.target;

        let check = /^[0-9]+$/;
        if (!check.test(value)) return;

        let time = parseInt(value);

        if (time > 60 || time < 0) {
            return;
        }

        switch (name) {
            case "hour":
                setTime((prev) => ({...prev, hour: value.toString()}));
                break
            case "min":
                setTime((prev) => ({...prev, min: value.toString()}));
                break
            case "sec":
                setTime((prev) => ({...prev, sec: value.toString()}));
                break
            default:
        }

    }, [time])


    const onChangeFile = async (e) => {
        let file = e.target.files[0]
        const response = await roomApi.uploadImage(eventId, file);
        setImgUrl({
            fileName: file.name,
            location: response.location,
            mimeType: response.mimetype
        });
    }

    useEffect(() => {
        getEventUsers();
    }, [])


    return (
        <ModalFrame setOnModal={setOnModal} style={style}>
            <div className="p-[60px]">
                {/*Title*/}
                <div className="flex justify-between">
                    <div className="text-[24px] font-medium text-[#444]">
                        방 만들기
                    </div>
                    <div onClick={() => setOnModal(false)} className={"w-[20px] min-h-[20px] flex items-center"}>
                        <img src={"../images/closeIcon.png"}/>
                    </div>
                </div>
                {/* Form */}
                <form className="mt-[57px]">
                    {
                        createRoomForm.map((roomInfo, idx) => {
                            if (roomInfo.type === "select") {
                                return (
                                    <Select
                                        key={idx}
                                        register={register}
                                        name={roomInfo.name}
                                        label={roomInfo.label}
                                        placeholder={roomInfo.placeholder}
                                        options={roomInfo.options}
                                        width={"w-[100%]"}
                                        height={"min-h-[44px]"}
                                        marginBottom={"mb-[10px]"}
                                    />
                                )
                            } else if (roomInfo.type === "timeInput") {
                                return (
                                    <div key={idx}>
                                        <div className={"mt-[10px] text-gray-400 text-[12px]"}>{roomInfo.label}</div>
                                        <div className="w-[100%] flex items-center mt-2 mb-[20px]
                                        border-2 rounded-[6px] border-gray-400 p-[10px]">
                                            <InputTime _onChange={timeOnChangeHandler} _value={time}/>
                                        </div>
                                    </div>
                                )
                            } else if (roomInfo.type === "file") {
                                return (
                                    <div key={idx}>
                                        <Input
                                            register={register}
                                            key={roomInfo.name}
                                            label={roomInfo.label}
                                            name={roomInfo.name}
                                            required={true}
                                            width={"w-[100%]"}
                                            height={"h-[44px]"}
                                            marginBottom={"mb-[20px]"}
                                            placeholder={roomInfo.placeholder}
                                            type={roomInfo.type}
                                            fileName={fileName && fileName}
                                            onChange={onChangeFile}
                                        />
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={idx}>
                                        <Input
                                            register={register}
                                            key={roomInfo.name}
                                            label={roomInfo.label}
                                            name={roomInfo.name}
                                            required={true}
                                            width={"w-[100%]"}
                                            height={"h-[44px]"}
                                            marginBottom={"mb-[20px]"}
                                            placeholder={roomInfo.placeholder}
                                            type={roomInfo.type}
                                        />
                                    </div>
                                )
                            }

                        })
                    }

                    {/*multi select가 가능한 스탭 목록*/}
                    <label htmlFor={"fanList"} className="text-gray-400 text-[12px] mb-[10px]">
                        스탭 등록
                    </label>
                    <Controller
                        name="staffIds"
                        control={control}
                        render={({field}) =>
                            <SelectBox
                                {...field}
                                styles={customStyles}
                                closeMenuOnSelect={false}
                                components={{DropdownIndicator}}
                                defaultValue={[]}
                                isMulti
                                options={valueMaker(targetStaffIds)}
                            />}
                    />
                    {/*multi select가 가능한 팬 목록*/}
                    <div className={`flex flex-col items-start w-[100%] justify-center mt-[25px]`}>
                        <label htmlFor={"fanList"} className="text-gray-400 text-[12px] mb-[10px]">
                            팬 등록
                        </label>
                        <Controller
                            name="fanIds"
                            control={control}
                            render={({field}) =>
                                <SelectBox
                                    {...field}
                                    styles={customStyles}
                                    width="100%"
                                    height="44px"
                                    closeMenuOnSelect={false}
                                    components={{DropdownIndicator}}
                                    defaultValue={[]}
                                    isMulti
                                    options={valueMaker(targetFanIds)}
                                />}
                        />
                    </div>

                    <div className="flex justify-end w-[100%] mt-[50px]">
                        <Button
                            _onClick={() => setOnModal(false)}
                            margin={"mr-4"} width={"w-[100px]"}>취소</Button>
                        <Button
                            type={"submit"}
                            _onClick={handleSubmit(onSubmit)}
                            width={"w-[100px]"}>
                            저장
                        </Button>
                    </div>
                </form>
            </div>
        </ModalFrame>
    )


}

export default memo(CreateRoom);


const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        border: '1px solid gray',
        padding: 20,
        display: "flex"
    }),

    control: (_, {selectProps: {}}) => ({
        width: "100%",
        height: "44px",
        borderRadius: "7px",
        border: '1px solid rgb(156, 163, 175, 1)',
        padding: 2,
    }),

    indicatorsContainer: () => ({
        display: "none"
    }),

    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return {...provided, opacity, transition};
    }
}

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>

        </components.DropdownIndicator>
    );
};

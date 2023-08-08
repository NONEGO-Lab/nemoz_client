import React, {useState, memo, useCallback, useEffect} from "react";
import {ModalFrame} from "../../modal/ModalFrame";
import {Input, Button, Select, InputTime} from "../../element";
import {useForm, Controller} from "react-hook-form";
import {roomApi} from "../data/room_data";
import SelectBox, {components} from 'react-select'
import {eventApi} from "../../event/data/event_data";
import {useSelector} from "react-redux";


const CreateRoom2 = ({setOnModal, getRoomListApi}) => {
    const modalStyle = "w-[650px] h-[900px] rounded-[15px] drop-shadow-md";
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
        setTargetArtistIds(response?.target_artist_ids);
        setTargetStaffIds(response.target_staff_ids);
    }

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

    const {location, mimeType, fileName} = imgUrl;

    return (
        <ModalFrame setOnModal={setOnModal} style={modalStyle}>
            <div className={"p-[60px]"}>
                {/*Title*/}
                <div className="flex justify-between">
                    <div className="text-[24px] font-medium text-[#444]">
                        방 만들기
                    </div>
                    <div onClick={() => setOnModal(false)}
                         className={"w-[20px] min-h-[20px] flex items-center cursor-pointer"}>
                        <img src={"../images/closeIcon.png"}/>
                    </div>
                </div>

                <form className="mt-[57px]">
                    {/* RoomTitle*/}
                    <Input
                        register={register}
                        title={"방 이름을 입력하세요"}
                        name={"roomTitle"}
                        required={true}
                        width={"w-[100%]"}
                        height={"min-h-[44px]"}
                        marginBottom={"mb-[40px]"}
                        // placeholder={"방 이름을 입력하세요"}
                        inputWidth ={"w-[25%]"}
                        defaultValue={0}
                        inputStyle={"text-medium"}
                    />

                    {/*Select Artist*/}
                    <Select
                        register={register}
                        name={'selectArtist'}
                        label={"아티스트 선택"}
                        options={targetArtistIds.map((artist) => artist.username)}
                        items={'items-center'}
                        justify={"justify-between"}
                        width={"w-[25%]"}
                        fontSize={"text-[23px]"}
                        mb={"mb-[40px]"}
                    />

                    {/*영상통화 시간 선택*/}
                    <Select
                        register={register}
                        name={'selectArtist'}
                        label={"영상통화 시간 선택"}
                        // options={targetArtistIds.map((artist) => artist.username)}
                        items={'items-center'}
                        justify={"justify-between"}
                        width={"w-[25%]"}
                        fontSize={"text-[23px]"}
                        mb={"mb-[40px]"}
                        isTime={true}
                    />

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
                        name={"startDate"}
                        required={true}
                        width={"w-[100%]"}
                        height={"min-h-[44px]"}
                        marginBottom={"mb-[40px]"}
                        placeholder={"시작 일시"}
                        fileName={fileName && fileName}
                        onChange={onChangeFile}
                        type={"file"}
                    />

                    {/*multi select가 가능한 스탭 목록*/}
                    <div className={`flex w-[100%] mb-[40px] justify-between  border-b-2 border-b-[#c7c7c7]`}>
                    <label htmlFor={"staffList"} className="text-[#646464] text-[20px] font-medium">
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
                    </div>
                </form>

            </div>
        </ModalFrame>
    );
};

export default memo(CreateRoom2);

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        border: 'none',
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
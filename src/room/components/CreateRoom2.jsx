import React, {useState, memo, useCallback, useEffect} from "react";
import {ModalFrame} from "../../modal/ModalFrame";
import {Input, Button, Select, InputTime} from "../../element";
import {useForm, Controller} from "react-hook-form";
import {roomApi} from "../data/room_data";
import SelectBox, {components, DropdownIndicatorProps} from 'react-select'
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
                    <div onClick={() => setOnModal(false)} className={"w-[20px] min-h-[20px] flex items-center"}>
                        <img src={"../images/closeIcon.png"}/>
                    </div>
                </div>

                <form className="mt-[57px]">
                {/* RoomTitle*/}
                    <Input
                        register={register}
                        label={"LABEL"}
                        name={"roomTitle"}
                        required={true}
                        width={"w-[100%]"}
                        height={"min-h-[44px]"}
                        marginBottom={"mb-[44px]"}
                        placeholder={"방 이름을 입력하세요"}
                        defaultValue = {0}
                    />
                    {/*Select Artist*/}
                    <Select
                        register={register}
                        name={'selectArtist'}
                        label={"아티스트 선택"}
                        // placeholder={roomInfo.placeholder}
                        options={targetArtistIds.map((artist) => artist.username)}
                        // width={"w-[100%]"}
                        defaultValue={"아티스트 선택"}
                    />
                </form>

            </div>
        </ModalFrame>
    );
};

export default CreateRoom2;

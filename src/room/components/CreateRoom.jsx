import React, {useState, memo, useCallback} from "react";
import {ModalFrame} from "../../modal/ModalFrame";
import {Input, Button, Select} from "../../element";
import {useForm, Controller} from "react-hook-form";
import {roomApi} from "../data/room_data";
import SelectBox, {components} from 'react-select'
import {useSelector} from "react-redux";




const CreateRoom = ({setOnModal, getEventListApi, eventList}) => {
    const modalStyle = "w-[650px] h-[900px] rounded-[15px] drop-shadow-md";
    const {register, handleSubmit, control} = useForm();
    const [imgUrl, setImgUrl] = useState({
        location: "", mimeType: "", fileName: "",
    });

    const [targetFanIds, setTargetFanIds] = useState(eventList.map(e => e.target_fan_ids)[0]);
    const [targetArtistFullInfo, setTargetArtistFullInfo] = useState(eventList.map(e => e.target_artist_ids));
    const [targetArtistIds, setTargetArtistIds] = useState(eventList.map(e => e.target_artist_ids)[0]?.map(artist => artist.name));
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

        let artistId = targetArtistFullInfo.flat().find((ar) => ar.name === selectArtist)?.no;

        if (artistId === undefined) {
            artistId = targetArtistFullInfo[0].no;
        }

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
            <div className="flex justify-between mb-[56.5px]">
                <div className="text-[24px] font-medium text-[#444]">
                    방 만들기
                </div>
                <div onClick={() => setOnModal(false)}
                     className={"w-[20px] flex items-center cursor-pointer"}>
                    <img src={"/images/closeIcon.png"} alt='close-icon'/>
                </div>
            </div>

            <form>
                {/*Select Event*/}
                <div
                    className={`flex items-center justify-between  h-[18.5px]`}>
                    <label htmlFor={"roomTitle"}
                           className=" flex items-center text-[20.3px] text-[#444] font-medium pl-[10.5px]">
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
                        className={`bg-white text-[20.3px] flex items-center text-[#444] text-ellipsis w-[250px] overflow-hidden whitespace-nowrap appearance-none bg-arrow-down bg-no-repeat bg-15 bg-right pr-[15px]`}
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
                <div className={"w-full h-[1.5px] bg-[#c7c7c7] mt-[28px] mb-[44px] mx-0"}/>

                {/*Select Artist*/}
                <Select
                    register={register}
                    name={'selectArtist'}
                    label={"아티스트 선택"}
                    options={targetArtistIds}
                    items={'items-center'}
                    justify={"justify-between"}
                    width={"w-[25%]"}
                    fontSize={"text-[20.3px]"}
                    border={"none"}
                    style={"overflow-hidden whitespace-nowrap appearance-none bg-arrow-down bg-no-repeat bg-15 bg-right pr-[15px] "}
                />
                <div className={"w-full h-[1.5px] bg-[#c7c7c7] mt-[28px] mb-[44px] mx-0"}/>

                {/*영상통화 시간 선택*/}
                <div
                    className={`flex items-center justify-between  h-[18.5px]`}>
                    <label htmlFor={"time"} className=" flex items-center text-[20.3px] text-[#444] font-medium pl-[10.5px]">
                        영상통화 시간 선택
                    </label>
                    <div>
                        <input
                            {...register('time')}
                            className={`bg-white text-[20.3px] text-[#444] w-[100px] text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            name={"time"}
                            type={"number"}
                        >
                        </input>
                    </div>
                </div>
                <div className={"w-full h-[1.5px] bg-[#c7c7c7] mt-[28px] mb-[44px] mx-0"}/>

                {/* 시작 일시 */}
                <Input
                    register={register}
                    title={"시작 일시"}
                    name={"startDate"}
                    required={true}
                    width={"w-[100%]"}
                    placeholder={"시작 일시"}
                    type={"datetime-local"}
                    inputStyle={"text-[#444]"}
                />
                <div className={"w-full h-[1.5px] bg-[#c7c7c7] mt-[28px] mb-[44px] mx-0"}/>

                {/* 파일 추가 */}
                <Input
                    register={register}
                    title={"파일 추가"}
                    name={"file"}
                    required={true}
                    width={"w-[100%]"}
                    // marginBottom={"mb-[43px]"}
                    fileName={fileName && fileName}
                    onChange={onChangeFile}
                    type={"file"}
                />
                <div className={"w-full h-[1.5px] bg-[#c7c7c7] mt-[28px] mb-[44px] mx-0"}/>

                {/*multi select가 가능한 스탭 목록*/}
                <div className={`flex w-[100%] justify-between  h-[18.5px] items-center`}>
                    <label htmlFor={"staffList"}
                           className="text-[#444] text-[20.3px] font-medium flex items-center whitespace-nowrap pl-[10.5px]">
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
                                height="33px"
                                closeMenuOnSelect={false}
                                isSearchable={false}
                                components={{DropdownIndicator, IndicatorSeparator: () => null }}
                                placeholder={"Staff 등록"}
                                isMulti
                                isClearable={false}
                                options={valueMaker(targetStaffIds)}
                        />}
                    />
                </div>
                <div className={"w-full h-[1.5px] bg-[#c7c7c7] mt-[28px] mb-[44px] mx-0"}/>

                {/*multi select가 가능한 팬 목록*/}
                <div className={`flex w-[100%] justify-between  h-[18.5px] items-center`}>
                    <label htmlFor={"staffList"}
                           className="text-[#444] text-[20.3px] font-medium flex items-center whitespace-nowrap mr-[100px] pl-[10.5px] ">
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
                            closeMenuOnSelect={false}
                            components={{DropdownIndicator, IndicatorSeparator: () => null}}
                            isSearchable={false}
                            placeholder={"Fan 등록"}
                            isMulti
                            options={valueMaker(targetFanIds)}
                            isClearable={false}
                        />

                        }
                    />
                </div>
                <div className={"w-full h-[1.5px] bg-[#c7c7c7] mt-[28px] mb-[44px] mx-0"}/>
                <Button
                    type={"submit"}
                    _onClick={handleSubmit(onSubmit)}
                    bgColor={"bg-[#01dfe0]"}
                    width={"w-full"}
                    height={"h-[66.5px]"}
                    style={"flex justify-center items-center"}
                >
                    <div className={"text-[26.3px] text-white font-medium flex justify-center items-center"}>
                        확인
                    </div>
                </Button>

            </form>

        </div>
    </ModalFrame>);
};

export default memo(CreateRoom);

const customStyles = {
    menu: (provided, state) => ({
        ...provided, width: "auto", border: 'none', padding: 20, display: "flex", borderRadius: "18px"

    }),

    control: (_, {selectProps: {}}) => ({
        // width: "100%",
        // height: "33px",
        borderRadius: "7px",
        display:'flex',
        // flexDirection:'row',
        // padding: 2,
        justifyContent: 'space-between',
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        return {...provided, opacity, transition};
    },

    multiValue: () => ({
        borderRadius: "18px",
        background: '#c7c7c7',
        color: '#FFF',
        display: 'flex',
        justifyContent: "center",
        marginRight: "4.5px",
        padding:'0 10px',
        marginBottom:'5px',
        alignItems: 'center',
        minWidth:'100px',
        height:'36px',
    }),
    multiValueLabel: () => ({
        fontSize: "20.3px",  fontWeight: "bold",
    }),
    valueContainer:()=>({
        display:'flex',
        // justifyContent: 'flex-end',
        alignItems:'center',
        overflowX: 'scroll',
        maxWidth:'300px',
    })
}

const ArrowDownIcon = () => {
    return <img src="/images/nemozPlusIcon.png" alt={"arrow-down"} className={`w-[15px] h-[15px]`}/>;
};

const DropdownIndicator = (props) => {
    return (<components.DropdownIndicator {...props}>
            <ArrowDownIcon/>
        </components.DropdownIndicator>

    )
};

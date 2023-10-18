import React, {useCallback, useEffect, useState} from "react";
import Header from "./Header";
import {Button} from "../element";
import {useDispatch, useSelector} from "react-redux";
import {addEventList, setEventIds} from "../redux/modules/eventSlice";
import {eventApi} from "../event/data/event_data";
import {useNavigate} from "react-router-dom";

export const Layout = ({
                           children,
                           title,
                           buttonText,
                           _onClick,
                           _endClick,
                           endText,


                       }) => {

    return (
        <div className="w-[100%] m-[0 auto]">
            <Header/>
            <div className="">
                <div className="flex justify-between">
                    <ContainerHeader title={title} buttonText={buttonText} _onClick={_onClick} _endClick={_endClick}
                                     endText={endText}
                                     />

                </div>
                {children}
            </div>
        </div>
    );
};


export const SizeLayout = ({children, width, height, color, flex, justifyCenter, rounded, isVideo, isWaitingRoom}) => {
    return (
        <div
            className={`m-auto ${isVideo || isWaitingRoom ? "" : "mt-[230px]"} ${width} ${height} ${color} ${flex} ${justifyCenter ? 'justify-center' : ''} ${rounded}`}>
            {children}
        </div>
    );
}

export const VideoLayout2 = ({children, title, buttonText, _onClick, _endClick}) => {
    return (
        <div className="w-[1080px] m-auto">
            <Header/>
            <div className="w-[100%] flex">
                <div className="bg-sky-100 w-[75%] h-[700px]">
                    <div className="flex justify-between mb-8">
                        <ContainerHeader title={title} buttonText={buttonText} _onClick={_onClick}
                                         _endClick={_endClick}/>
                    </div>
                    {children}
                </div>
                <div className="bg-white w-[25%] h-[700px] border-gray-200 border-2">
                    <SideBar/>
                </div>
            </div>
        </div>
    );
};

export const VideoLayout = ({children, title, buttonText, _onClick, endText, _endClick, role}) => {
    return (
        <div className="bg-sky-100 w-[75%]">
            <div className="flex justify-between mb-2">
                <ContainerHeader title={title} buttonText={buttonText} _onClick={_onClick}
                                 _endClick={_endClick} endText={endText} role={role}/>
            </div>
            {children}
        </div>
    )
};

export const SideBar = ({children}) => {
    return (
        <div className="bg-white w-[25%] h-[700px] border-gray-200 border-2 pt-[20px]">
            {children}
        </div>
    )
}

export const ContainerHeader = ({
                                    title,
                                    buttonText,
                                    _onClick,
                                    _endClick,
                                    endText,
                                    role
                                }) => {
    const currentLocation=(location) => window.location.pathname.split('/')[1] === location
    return (

        <div className="w-[100%] flex justify-between items-center px-[100px] py-[44px]">
            <div className="flex items-center font-medium">
                {currentLocation('roomlist') &&
                    <div className={'w-[33px] ml-[11px]'}>
                        <img alt='room-icon' src="../images/roomIcon.png"/>
                    </div>}
                {currentLocation('userlist') &&
                    <div className={'w-[33px] ml-[11px]'}>
                        <img alt='participants-icon' src="../images/participantsIcon.png"/>
                    </div>}
                <div className="text-[25px] ml-[15px]">
                    {title}
                </div>

                <EventListFilter/>

            </div>
            {
                role !== "fan" &&
                <div>
                    {
                        buttonText &&
                        <Button
                            _onClick={_onClick}
                            width={"w-[100px]"}
                            height={"h-[46px]"}
                            createRoom={true}
                            textColor={`${currentLocation('roomlist') ? "text-[#444]" : ''}`}
                        >
                            {buttonText}
                        </Button>
                    }
                    {
                        endText &&
                        <div>
                            <Button
                                _onClick={_endClick}
                                margin={"ml-4"}
                                width={"w-[100px]"}
                                height={"h-[46px]"}
                                bgColor={"bg-white"}>
                                {endText}
                            </Button>
                        </div>
                    }
                </div>
            }
        </div>
    )
}
const EventListFilter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const eventId = localStorage.getItem("eventId");
    const eventList = useSelector(state => state.event.eventList)
    const allEventIds = eventList?.map(e => e.event_id)
    const currentEventName = eventList?.find(e => e.event_id === Number(eventId))?.event_name || '전체'
    const userInfo = useSelector((state) => state.user.userInfo);
    const navigate = useNavigate();
    const clickLi = useCallback(
        (target) => {
            dispatch(setEventIds({event_id: target}))
            if(localStorage.getItem("eventId")){
                localStorage.setItem("eventId",target)
            }
            setIsOpen(!isOpen)
        },
        [isOpen],
    );

    useEffect(() => {
        const getEventListApi = async (userId) => {
            //팬일 경우 바로 대기화면으로
            if (userInfo.role === "fan") {
                navigate("/waitcall");
            }else{
                try {
                    const eventList = await eventApi.getEventList({userId})
                    dispatch(addEventList({eventList}))
                    const eventIds = eventList.map(e => e.event_id)
                    dispatch(setEventIds({event_id: eventIds}))
                    if(!localStorage.getItem("eventId")){
                        localStorage.setItem("eventId",eventIds)
                    }
                } catch (err) {
                    console.error(err)
                }
            }

        }

        function exractUserId (role){
            if(role === 'staff'){
                return userInfo.staffNo
            }
            else if(role === 'artist'){
                return userInfo.id
            }
            else{
                console.log('Dummy Id')
                return userInfo.id
            }
        }
        // getEventListApi({userId: 10200})
        getEventListApi({userId: exractUserId(userInfo.role)})


    }, [eventId])

    return (
        <div className={"w-[278px] ml-[45px] "}>
            <div className={"flex justify-between items-center border-b-[#e0e0e0] border-b-[1px] pb-[10px] "}>
                <div className={"font-medium text-[17.5px]"}>{currentEventName}</div>
                <img className={"w-[13.5px] h-[7.5px] cursor-pointer z-5"} src="../images/arrowDown.png"
                     alt={'arrowdown-icon'} onClick={() => setIsOpen(!isOpen)}/>
            </div>
            {isOpen && <div className={"w-[278px] fixed bg-[#e9e9e9] text-[17.5px]"}>
                <li className={"mx-[5px] list-none cursor-pointer"} onClick={() => clickLi(allEventIds)}>전체</li>
                {eventList.map((e, i) => <li className={"mx-[5px] list-none cursor-pointer"}
                                             onClick={() => clickLi(e.event_id)} key={i}>{e.event_name}</li>)}
            </div>}
        </div>
    )
}





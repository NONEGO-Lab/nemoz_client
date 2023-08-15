import React from "react";
import Header from "./Header";
import {Button} from "../element";

export const Layout = ({children, title, buttonText, _onClick, _endClick, endText, isRoomList, isParticipantsList}) => {

    return (
        <div className="w-[100%] m-[0 auto]">
            <Header/>
            <div className="">
                <div className="flex justify-between">
                    <ContainerHeader title={title} buttonText={buttonText} _onClick={_onClick} _endClick={_endClick}
                                     endText={endText} isRoomList={isRoomList} isParticipantsList={isParticipantsList}/>
                </div>
                {children}
            </div>
        </div>
    );
};


export const SizeLayout = ({children, width, height, color, flex, justifyCenter, rounded}) => {
    return (
        <div
            className={`m-auto mt-[230px] ${width} ${height} ${color} ${flex} ${justifyCenter ? 'justify-center' : ''} ${rounded}`}>
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

export const ContainerHeader = ({title, buttonText, _onClick, _endClick, endText, role, isRoomList, isParticipantsList}) => {

    return (
        <div className="w-[100%] flex justify-between items-center px-[100px] py-[44px]">
            <div className="flex items-center font-medium">
                {isRoomList &&
                    <div className={'w-[33px] ml-[11px]'}>
                        <img alt='room-icon' src="../images/roomIcon.png"/>
                    </div>}
                {isParticipantsList &&
                    <div className={'w-[33px] ml-[11px]'}>
                        <img alt='participants-icon' src="../images/participantsIcon.png"/>
                    </div>}
                <div className="text-[25px] ml-[15px]">
                    {title}
                </div>
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
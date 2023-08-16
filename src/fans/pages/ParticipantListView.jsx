import React from "react";
import {Button} from "../../element";
import {Layout} from "../../shared/Layout";
import {ParticipantController as controller} from "../controller/participantController";
import FanDetail from "./components/FanDetail";

const ParticipantListView = () => {

    const {
        attendeeList,
        movePage,
        roomArray,
        isOpenFanDetail,
        currentPage,
        connectToTest,
        setIsOpenFanDetail,
        setCurrentFanId,
        currentFanId,
        setOnModal
    } = controller();

    return (<Layout title={"참가자 목록"} isParticipantsList={true}>
            {/*table 뷰*/}
            <div>
                <div
                    className="w-[100%] text-[16px] text-[#444444] border-b-[#e0e0e0] border-b-2 px-[100px]">
                    <span className="w-[195px] inline-block">Fan</span>
                    <span className="w-[630px] inline-block">Status</span>
                    <span className="w-[90px] inline-block">Test</span>
                </div>

            {/* User List */}
                <div className="overflow-y-auto">
                    {attendeeList.map((user, idx) => {
                        return <User key={idx} user={user} setCurrentFanId={setCurrentFanId}
                                     setIsOpenFanDetail={setIsOpenFanDetail} connectToTest={connectToTest} bgColor={idx %2 === 0 ?"":"bg-[#e9e9e9]"}/>
                    })}
                </div>
            </div>

            {/* Page */}
            <div className={"w-[100%] text-[15px] pt-[20px] flex justify-center items-center"}>
                {/*<span onClick={() => movePage(currentPage - 1)}*/}
                {/*      className="cursor-pointer mr-2"> {"<"} </span>*/}
                {roomArray.map((num, index) => {
                    return (

                        <span key={index} onClick={() => movePage(num)}
                              className={`w-[35px] h-[35px] cursor-pointer rounded-full  ml-[20px] flex items-center justify-center
                                          ${currentPage === num ? "bg-[#01dfe0]" : "bg-white"}
                                          `}>
                                        {num}
                                    </span>

                    )
                })}
                {/*<div onClick={() => movePage(currentPage + 1)}>*/}
                {/*  <span className="cursor-pointer mr-2">다음</span>*/}
                {/*  <span className="cursor-pointer"> {">"} </span>*/}
                {/*</div>*/}
            </div>

            {/* Modal */}
            {isOpenFanDetail && <FanDetail currentFanId={currentFanId} setOnModal={setOnModal}/>}
        </Layout>)
}

export default ParticipantListView;


const User = ({user, setIsOpenFanDetail, setCurrentFanId, connectToTest, bgColor}) => {
    const status = user.status
    return (<div className={`flex items-center min-h-[70px] ${bgColor} px-[100px]`}>
            <div className="flex ">
                <div className="w-[195px]">
                    {user.fan_name}
                </div>

                <div className="w-[630px]">
                    <span className={"text-[#444] font-bold"}>{status.orders}/5</span>
                    <span className={"text-[#01dfe0] ml-[20px] mr-[11px]"}>◀</span>
                    <span>{status.artist_name} 진행 중</span>
                    {/*<span>카리나 (에스파) 3집 미니앨범’Aespa World’ 영상 통화 진행 중</span>*/}
                </div>

                <div className="w-[90px]">
                    {user.is_tested ? "O" : "X"}
                </div>
            </div>

            <div className="flex flex-start">
                <button
                    onClick={() => {
                        setCurrentFanId(user.fan_id);
                        setIsOpenFanDetail(true);
                    }}
                    className="w-[110px] ml-[90px] mr-[30px] rounded-[15px] border-[1px] border-[#aaa] text-[#444]"
                    >
                    Fan Info {">"}
                </button>
                <button
                    onClick={() => connectToTest(user)}
                    className={`w-[100px] rounded-[15px] border-[1px] border-[#aaa] text-[#444] ${user.is_tested &&"opacity-30"}`}
                    disabled={user.is_tested}
                    >
                    Test Call
                </button>

            </div>
        </div>)
}
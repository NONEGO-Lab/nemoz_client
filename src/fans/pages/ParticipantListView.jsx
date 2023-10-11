import React from "react";
import {Layout} from "../../shared/Layout";
import {ParticipantController as controller} from "../controller/participantController";
import FanDetail from "./components/FanDetail";
import DeviceSetting from "test/pages/DeviceSetting";

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
        currentFanEventId,
        setCurrentFanEventId,
        setOnModal,
        openDeviceSetting,
        setOpenDeviceSetting,
        closeDeviceSetting
    } = controller();

    return (<Layout title={"참가자 목록"} isParticipantsList={true}>
        {/*table 뷰*/}
        <div>
            <div
                className="w-[100%] text-[16px] text-[#444444] border-b-[#e0e0e0] border-b-2 px-[100px] pb-[14px]">
                <span className="w-[115px] inline-block">Fan</span>
                <span className="w-[630px] inline-block">Status</span>
                <span className="w-[90px] inline-block">Test</span>
            </div>

            {/* User List */}
            <div>
                {attendeeList.map((user, idx) => {
                    return <User key={idx} user={user} setCurrentFanId={setCurrentFanId} setCurrentFanEventId={setCurrentFanEventId}
                                 setOpenDeviceSetting={setOpenDeviceSetting}
                                 setIsOpenFanDetail={setIsOpenFanDetail} connectToTest={connectToTest}
                                 bgColor={idx % 2 === 0 ? "" : "bg-[#e9e9e9]"}/>
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
        {isOpenFanDetail && <FanDetail currentFanId={currentFanId} setOnModal={setOnModal} currentFanEventId={currentFanEventId}/>}
        {openDeviceSetting && <DeviceSetting closeDeviceSetting={closeDeviceSetting}/>}
    </Layout>)
}

export default ParticipantListView;


const User = ({user, setIsOpenFanDetail, setOpenDeviceSetting, setCurrentFanId, setCurrentFanEventId, connectToTest, bgColor}) => {
    const status = user.status
    return (
        <div className={`flex items-center min-h-[70px] ${bgColor} px-[100px]`}>
            <div className="flex items-center">
                <div className="w-[115px]">
                    {user.fan_name}
                </div>

                <div className="w-[630px]">
                    <span className={"text-[#444] font-bold"}>{status.orders}/5</span>
                    <span className={"text-[#01dfe0] ml-[20px] mr-[11px]"}>◀</span>
                    {/* <span>{status.artist_name} 진행 중</span> */}
                    <span>카리나 (에스파) 3집 미니앨범’Aespa World’ 영상 통화 진행 중</span>
                </div>
                {/* 
                is_tested 0 테스트전
                is_tested 1 성공
                is_tested 2 실패
                */}
                <div className="w-[90px] ml-[10px]">
                    {user.is_tested === 0 &&
                        <img className="w-[14px] h-[2px]" src="../images/testBefore.png" alt='test-before'/>}
                    {user.is_tested === 1 &&
                        <img className="w-[17px] h-[17px]" src="../images/testSuccess.png" alt='test-success'/>}
                    {user.is_tested === 2 &&
                        <img className="w-[17px] h-[17px]" src="../images/testFail.png" alt='test-fail'/>}
                </div>
            </div>

            <div>
                <button
                    onClick={() => {
                        setCurrentFanEventId(user.event_id)
                        setCurrentFanId(user.fan_id);
                        setIsOpenFanDetail(true);
                    }}
                    className="w-[110px] ml-[90px] mr-[30px] rounded-[15px] border-[1px] border-[#aaa] text-[#444]"
                >
                    Fan Info {">"}
                </button>
            </div>
            <div>
                <button
                    // onClick={() => {
                    //     setOpenDeviceSetting(true)
                    // }}
                    onClick={() => connectToTest(user)}
                    className={`w-[100px] rounded-[15px] border-[1px] border-[#aaa] text-[#444] ${user.is_tested && "opacity-30"}`}
                    disabled={user.is_tested}
                >
                    Test Call
                </button>

            </div>
        </div>)
}
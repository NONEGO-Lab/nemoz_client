import React from "react";
import {Layout} from "../../shared/Layout";
import {ParticipantController as controller} from "../controller/participantController";
import FanDetail from "./components/FanDetail";
import DeviceSetting from "test/pages/DeviceSetting";

const ParticipantListView = () => {

    const {
        attendeeList,
        movePage,
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
        closeDeviceSetting,
        totalPage
    } = controller();
    const page = [...new Array(totalPage)].map((_, i) => i + 1) || []
    return (<Layout title={"참가자 목록"} isParticipantsList={true}>
        {/*table 뷰*/}
        <div>
            <div
                className="w-[100vw] text-[16px] text-[#444444] border-b-[#e0e0e0] border-b-2 px-[100px] pb-[14px]">
                <span className="w-[24.5px] inline-block mr-[114px]">Fan</span>
                <span className="w-[26.5px] inline-block mr-[628.5px]">Status</span>
                <span className="w-[11.5px] inline-block text-center">Test</span>
            </div>

            {/* User List */}
            <div>
                {attendeeList.map((user, idx) => {
                    return <User key={idx} user={user} setCurrentFanId={setCurrentFanId}
                                 setCurrentFanEventId={setCurrentFanEventId}
                                 setOpenDeviceSetting={setOpenDeviceSetting}
                                 setIsOpenFanDetail={setIsOpenFanDetail} connectToTest={connectToTest}
                                 totalFanCnt={attendeeList.length}
                                 bgColor={idx % 2 === 0 ? "" : "bg-[#e9e9e9]"}/>
                })}
            </div>
        </div>

        {/* Page */}
        <div className={"w-[100%] text-[15px] pt-[20px] flex justify-center items-center"}>
            {/*<span onClick={() => movePage(currentPage - 1)}*/}
            {/*      className="cursor-pointer mr-2"> {"<"} </span>*/}
            {page.map((num, index) => {
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
        {isOpenFanDetail &&
            <FanDetail currentFanId={currentFanId} setOnModal={setOnModal} eventId={currentFanEventId}/>}
        {openDeviceSetting && <DeviceSetting closeDeviceSetting={closeDeviceSetting}/>}
    </Layout>)
}

export default ParticipantListView;


const User = ({
                  user,
                  setIsOpenFanDetail,
                  setCurrentFanId,
                  setCurrentFanEventId,
                  connectToTest,
                  bgColor,
                  totalFanCnt
              }) => {
    const status = user.status
    return (
        <div className={`flex items-center min-h-[70px] ${bgColor} px-[100px]`}>
            <div className="flex items-center">
                <div className="w-[51.5px] text-[19px] mr-[89px] text-ellipsis whitespace-nowrap">
                    {user.fan_name}
                </div>

                <span
                    className={"text-[#444] font-bold text-[18px] w-[26.5px] mr-[19.5px]"}>{user.done_meet}/{user.done_meet + user.remain_meet}</span>

                <span className={"text-[#01dfe0] text-[13px] mr-[11px]"}>◀</span>

                <span className={"w-[446px] mr-[146.5px] text-ellipsis whitespace-nowrap "}>{user.status.room_name}</span>


                <div className="flex justify-center mr-[90px]">
                    {user.is_tested === 0 &&
                        <img className="w-[14px] h-[2px]" src="/images/testBefore.png" alt='test-before'/>}
                    {user.is_tested === 1 &&
                        <img className="w-[17px] h-[17px]" src="/images/testSuccess.png" alt='test-success'/>}
                    {user.is_tested === 2 &&
                        <img className="w-[17px] h-[17px]" src="/images/testFail.png" alt='test-fail'/>}
                </div>
            </div>

            <div>
                <button
                    onClick={() => {
                        setCurrentFanEventId(user.event_id)
                        setCurrentFanId(user.fan_id);
                        setIsOpenFanDetail(true);
                    }}
                    className="w-[106px] h-[30px] mr-[30px] rounded-[15px] border-[1px] border-[#aaa] text-[#444] flex justify-center items-center"
                >
                    <div>Fan Info</div>
                    <img src={"/images/arrowRight.png"} alt={"arrowRight"} className={`w-[7px] h-[11px] ml-[10px]`}/>
                </button>
            </div>
            <div>
                <button
                    onClick={() => connectToTest(user)}
                    className={`w-[106px] h-[30px] rounded-[15px] border-[1px] border-[#aaa] text-[#444] ${(user.is_tested || (status.orders < 0)) && "opacity-30"} flex justify-center items-center`}
                    disabled={user.is_tested || (status.orders < 0)}
                >
                    <div>Test Call</div>
                    <img src={"/images/arrowRight.png"} alt={"arrowRight"} className={`w-[7px] h-[11px] ml-[10px]`}/>
                </button>

            </div>
        </div>)
}
import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {Button} from "../../element";
import {attendeeApi} from "../../fans/data/attendee_data";
import {testApi} from "../../test/data/call_test_data";
import {clearTestSession} from "../../redux/modules/testSlice";
import {sock} from "../../socket/config";


const ConnectControl2 = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fanInfo = useSelector((state) => state.test.fanInfo);
    const userInfo = useSelector((state) => state.user.userInfo);
    const sessionInfo = useSelector((state) => state.test.sessionInfo);
    const eventId = useSelector((state) => state.event.eventId);


    const finishTest = async () => {

        const response = await testApi.testEnd(sessionInfo);

        // 종료되면 role에 따라 해산
        if (response) {
            dispatch(clearTestSession());
            navigate("/userlist");
            let roomNum = `${eventId}_test_${fanInfo.fan_id}`;
            sock.emit("leaveRoom", roomNum, userInfo, navigate)
        }
    }

    const successConnect = async (e) => {
        //attendee/test
        e.stopPropagation()
        let fanId = fanInfo.fan_id;
        attendeeApi.testFan({eventId, fanId}).then((res) => {
            if (res === "Test result Updated") {
                sock.emit("testSuccess", fanInfo);
                finishTest();
            }
        })
    };

    const failConnect = () => {
        //socket -> push 알람
        sock.emit("testFail", fanInfo);
        // test/end
        finishTest();
    };

    return (
        <div
            className={`flex justify-center z-10 w-[650px] absolute top-[600px] `}>
            <button
                onClick={successConnect}
                className='w-[180px] min-h-[50px] rounded-[25px] bg-white flex items-center justify-center cursor-pointer mr-[35px]'>
                <div className='text-[#02c5cb] text-[19px] font-medium'>연결 성공</div>
            </button>
            <button
                onClick={failConnect}
                className='w-[180px] min-h-[50px] rounded-[25px] bg-[#ff483a] flex items-center justify-center cursor-pointer'>
                <span className='text-white text-[19px] font-medium'>연결 실패</span>

            </button>
        </div>
    )

};


export default ConnectControl2;
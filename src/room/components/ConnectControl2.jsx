import React from "react";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {attendeeApi} from "../../fans/data/attendee_data";
import {testApi} from "../../test/data/call_test_data";
import {clearTestSession} from "../../redux/modules/testSlice";
import {sock} from "../../socket/config";


const ConnectControl2 = ({setToggleNext, setIsSuccess}) => {

    const fanInfo = useSelector((state) => state.test.fanInfo);
    const eventId = useSelector((state) => state.event.eventId);

    // const finishTest = async () => {
    //     const response = await testApi.testEnd(sessionInfo.meet_name);
    //
    //     // 종료되면 role에 따라 해산
    //     if (response) {
    //         dispatch(clearTestSession());
    //         navigate("/userlist");
    //         let roomNum = `${eventId}_test_${fanInfo.fan_id}`;
    //         sock.emit("leaveRoom", roomNum, userInfo, navigate)
    //     }
    // }

    const successConnect = async () => {
        let fanId = fanInfo.fan_id;
        attendeeApi.testFan(eventId, fanId, 1).then((res) => {
            if (res.message === "Test result Updated") {
                sock.emit("testSuccess", fanInfo, eventId);
                setToggleNext(true)
                setIsSuccess('success')
            }
        })
    };

    const failConnect = () => {
        let fanId = fanInfo.fan_id;
        attendeeApi.testFan(eventId, fanId, 2).then((res) => {
            if (res.message === "Test result Updated") {
                sock.emit("testFail", fanInfo, eventId);
                setToggleNext(true)
                setIsSuccess('fail')
            }
        })
    };

    return (
        <div
            className={`flex justify-center z-10 w-[650px] absolute mt-[247.9px] `}>
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
import React from 'react'
import {disconnectSession} from "../../../redux/modules/videoSlice";
import {clearSessionInfo} from "../../../redux/modules/commonSlice";
import {useVideo} from "../../controller/hooks/useVideo";
import {sock} from "../../../socket/config";
import {testApi} from "../../../test/data/call_test_data";
import {attendeeApi} from "../../../fans/data/attendee_data";
import {addTestFanInfo} from "../../../redux/modules/testSlice";


const TestCallUtil = ({
                          publisherAudio,
                          publisherVideo,
                          muteHandler,
                          role,
                          quitTest,
                          toggletNext,
                          fanInfo,
                          session,
                          navigate,
                          isSuccess,
                          setIsSuccess,
                          dispatch,
                          eventId,
                          createJoinSession,
                          userInfo
                      }) => {

    const nextTestCallConnect = async () => {

        if(isSuccess==='success') {
            sock.emit("testSuccess", fanInfo, eventId);
        }
        if(isSuccess==='fail'){
            sock.emit("testFail", fanInfo, eventId);
        }

        const response = await testApi.testEnd(session.meet_name);

        if(response){
            setIsSuccess(null)
            const fanList = await attendeeApi.getAttendeeList(eventId, 1)
            if(fanList){
                const currentFanIndex = fanList.fan_lists.findIndex( f => f.fan_id === fanInfo.fan_id)
                const nextFanInfo = fanList.fan_lists[currentFanIndex+1]
                console.log(nextFanInfo, 'next_fan_id')
                if(!!nextFanInfo){
                    createJoinSession().then((sessionInfo) => {
                        let data = {meetName: sessionInfo.meet_name, fanId: nextFanInfo.fan_id}
                        sock.emit("joinTestSession", data);
                        let roomNum = `${fanInfo.event_id}_test_${nextFanInfo.fan_id}`;
                        dispatch(addTestFanInfo(nextFanInfo))
                        sock.emit("joinRoom", roomNum, userInfo);
                    })
                    navigate(`/test/${eventId}_${nextFanInfo.fan_id}`)
                }else{
                    alert('모든 참가자와 테스트가 완료되었습니다.')
                    navigate('/roomlist')
                }
            }

        }else{
            console.error('이게.. 아닌데..')
        }
    };

    return (
        <div className={"flex justify-center items-center flex-row mt-[153px] mx-[110px]"}>
            {/* 캠 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={() => muteHandler("video", publisherVideo)}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {publisherVideo ? <img src="../images/callOutCameraOn.png" alt="cam-on" /> : <img src="../images/callOutCameraOff.png" alt="cam-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`CAM`}</div>

                </div>
            </div>
            {/* 마이크 토글 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px] mr-[30px]"} onClick={() => muteHandler("audio", publisherAudio)}>
                <div className={"w-[75px] h-[75px] cursor-pointer"}>
                    {publisherAudio ? <img src="../images/callOutMicOn.png" alt="mic-on" /> : <img src="../images/callOutMicOff.png" alt="mic-off" />}
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`MIC`}</div>

                </div>
            </div>
            {/* 다음 사람 */}
            {(role === 'staff') && <div className={"flex flex-col text-[8px] items-center mr-[30px] "}>
                <div className={`w-[75px] cursor-pointer`} >
                    {toggletNext ? <img src="../images/callOutNext.png" alt="next" onClick={nextTestCallConnect}/> :
                        <img src="../images/callOutNextOff.png" alt="next"/>}
                </div>
                <span className={"mt-[20px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    {`NEXT`}
                </span>
            </div>}

            {/* 방 나가기 */}
            <div className={"flex flex-col text-[8px] items-center w-[75px]"}>
                <div className={"w-[75px] cursor-pointer"} onClick={()=>quitTest()}>
                    <img src="../images/callOutQuit.png" alt="close"/>
                </div>
                <div className={"mt-[10px] flex flex-col items-center text-[#848484] text-[12px]"}>
                    <div>{`QUIT`}</div>
                </div>
            </div>




        </div>
    )
}

export default TestCallUtil
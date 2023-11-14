// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { Button } from "../../element";
// import { attendeeApi } from "../../fans/data/attendee_data";
// import { testApi } from "../../test/data/call_test_data";
// import { clearTestSession } from "../../redux/modules/testSlice";
// import { sock } from "../../socket/config";
//
//
//
// const ConnectControl = () => {
//
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const fanInfo = useSelector((state) => state.test.fanInfo);
//   const userInfo = useSelector((state) => state.user.userInfo);
//   const sessionInfo = useSelector((state) => state.test.sessionInfo);
//   const [curFanInfo, setCurFanInfo] = useState({});
//   const eventId = useSelector((state) => state.event.eventId);
//
//
//   const getFanDetail = async () => {
//
//     const detail = await attendeeApi.getFanDetail(fanInfo.fan_id);
//     setCurFanInfo(detail);
//   }
//
//   const { age, fan_name, letter, sex } = curFanInfo;
//
//
//   const finishTest = async () => {
//     const response = await testApi.testEnd(sessionInfo.meetName);
//
//     // 종료되면 role에 따라 해산
//     if(response) {
//       dispatch(clearTestSession());
//       navigate("/userlist");
//       let roomNum = `${eventId}_test_${fanInfo.fan_id}`;
//       sock.emit("leaveRoom", roomNum, userInfo, navigate)
//     }
//   }
//
//   const successConnect = async () => {
//     //attendee/test
//     let fanId = fanInfo.fan_id;
//     attendeeApi.testFan({ eventId, fanId}).then((res) => {
//       if(res === "Test result Updated") {
//         sock.emit("testSuccess", fanInfo);
//         finishTest();
//       }
//     })
//   };
//
//   const failConnect = () => {
//     //socket -> push 알람
//     sock.emit("testFail", fanInfo);
//     // test/end
//     finishTest();
//   };
//
//   useEffect(()=>{
//     getFanDetail();
//   },[])
//
//   return(
//       <>
//         <div className={"ml-4"}/>
//         <div className="items-center my-4 border-b border-black">
//           <div className="m-4">팬정보</div>
//           <div className="m-6">이름: {fan_name} </div>
//           <div className="m-6">성별: {sex}</div>
//           <div className="m-6">나이: {age}</div>
//           <div className="m-6">팬레터: {letter}</div>
//         </div>
//         <div className="flex flex-col items-center">
//           <Button
//               _onClick={successConnect}
//               margin={"my-[20px]"}
//               width={"w-[180px]"}
//           >
//             연결 성공
//           </Button>
//           <Button
//               _onClick={failConnect}
//               borderColor={"border-red-600"}
//               color={"text-red-600"}
//               width={"w-[180px]"}
//           >
//             연결 실패
//           </Button>
//         </div>
//       </>
//
//   )
//
// };
//
//
// export default ConnectControl;

/**
 * @deprecated
 */
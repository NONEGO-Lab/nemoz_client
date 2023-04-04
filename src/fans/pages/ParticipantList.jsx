import React, { useState, useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../shared/Header";
import { Button, Input } from "../../element";
import { Layout } from "../../shared/Layout";
import { attendeeApi } from "../data/attendee_data";
import FanInfo from "../pages/FanInfo";
import { sock } from "../../socket/config";
import { addTestFanInfo, clearTestSession } from "../../redux/modules/testSlice";
// import {setError, setIsError} from "../redux/modules/errorSlice";

const ParticipantList = () => {
  //fan or artist만 볼 수 있는 뷰

  const attendeeList2 = [
    {
      "fan_id": 16,
      "fan_name": "테스트 팬1",
      "sex": "남",
      "age": 18,
      "is_tested": 0,
      "remain_meet": 26,
      "done_meet": 0,
      "status": {
        "artist_id": null,
        "artist_name": null,
        "progress": "진행중",
        "orders": 0
      }
    },
    {
      "fan_id": 6,
      "fan_name": "테스트 팬2",
      "sex": "여",
      "age": 20,
      "is_tested": 0,
      "remain_meet": 26,
      "done_meet": 0,
      "status": {
        "artist_id": 5,
        "artist_name": "아티스트2",
        "progress": "대기중",
        "orders": 1
      }
    },
    {
      "fan_id": 7,
      "fan_name": "테스트 팬3",
      "sex": "남",
      "age": 25,
      "is_tested": 0,
      "remain_meet": 26,
      "done_meet": 0,
      "status": {
        "artist_id": 5,
        "artist_name": "아티스트2",
        "progress": "대기중",
        "orders": 1
      }
    },
    {
      "fan_id": 8,
      "fan_name": "테스트 팬4",
      "sex": "여",
      "age": 17,
      "is_tested": 0,
      "remain_meet": 26,
      "done_meet": 0,
      "status": {
        "artist_id": 5,
        "artist_name": "아티스트2",
        "progress": "대기중",
        "orders": 1
      }
    },
  ]

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [attendeeList, setAttendeeList] = useState(attendeeList2);
  const [isOpenFanDetail, setIsOpenFanDetail] = useState(false);
  const [currentFanId, setCurrentFanId] = useState();


  const sessionInfo = useSelector((state) => state.test.sessionInfo);
  const session = useSelector((state) => state.test.session);
  const connectInfo = useSelector((state) => state.test.connectInfo);
  const publisher = useSelector((state) => state.test.publisher);


  const roomArray = [...new Array(10)].map((_, i) => i + 1);
  const eventId = useSelector((state) => state.event.eventId);

  const connectToTest = (user) => {
    dispatch(addTestFanInfo(user))
    if(localStorage.getItem("isSetDevice") === "true"){
      navigate(`/test/${user.fan_id}`);
    } else {
      navigate("/devicetest");
    }
  };


  const getAttendeeListApi = async (page) => {
    try {
      const result = await attendeeApi.getAttendeeList(eventId, page);
      setAttendeeList(result.fan_lists);
    } catch (err) {
      // dispatch(setError(err));
      // dispatch(setIsError(true));
    }
  }

  const setOnModal = () => {
    setIsOpenFanDetail(false);
    setCurrentFanId();
  }

  useEffect(()=>{
    getAttendeeListApi(1);
    dispatch(clearTestSession());
  },[])

  const movePage = async (num) => {

    if(num === 0 || num === 11) {
      return;
    }

    setCurrentPage(num);
    await getAttendeeListApi(num);
  }

  return (
      <Layout title={"참여자 목록"}>
        {/*table 뷰*/}
        <div className="bg-white h-[500px]">
          <div className="flex items-center w-[100%] bg-gray-100 h-[50px] px-[20px] font-bold">
            <div className="w-[160px]">참여자 이름</div>
            <div className="w-[220px]">연결 테스트 여부</div>
            <div className="w-[300px]">진행 현황</div>
          </div>

          <div className="overflow-y-auto h-[450px]">
            {
              attendeeList.map((user) => {
                return <User key={user.fan_id} user={user} setCurrentFanId={setCurrentFanId}
                             setIsOpenFanDetail={setIsOpenFanDetail} connectToTest={connectToTest}/>
              })
            }
          </div>

        </div>

        <div className={"flex justify-end absolute bottom-4 right-4 text-xl text-gray-600"}>
          <span onClick={() => movePage(currentPage - 1)} className="cursor-pointer mr-2"> {"<"} </span>
          {
            roomArray.map((num, index) => {
              return(
                  <div key={num} className={`pr-4`}>
                                <span onClick={() => movePage(num)}
                                      className={`cursor-pointer text-center ${currentPage === num && "bg-blue-600 px-2 py-1 text-white"}`}>
                                    {num}
                                </span>
                  </div>
              )
            })
          }
          <span onClick={() => movePage(currentPage + 1)}
                className="cursor-pointer"> {">"} </span>
        </div>
        { isOpenFanDetail && <FanInfo currentFanId={currentFanId} setOnModal={setOnModal}/> }
      </Layout>
  )
}

export default ParticipantList;



const User = ({user, setIsOpenFanDetail, setCurrentFanId, connectToTest}) => {
  const status = user.status
  return (
      <div className="flex items-center mt-2 mb-4 px-[20px]">
        <div className="flex w-[780px]">
          <div className="w-[160px]">
            {user.fan_name}
          </div>
          <div className="w-[220px]">
            { user.is_tested ? "테스트 완료" : "테스트 미완료" }
          </div>
          <div className="w-[300px]">
            {status.orders} / 5 -  {status.artist_name} 진행 중
          </div>
        </div>

        <div className="w-[360px] flex flex-start">
          <Button
              _onClick={() => {
                setCurrentFanId(user.fan_id);
                setIsOpenFanDetail(true);
              }}
              width={"w-[100px]"} margin={"mr-[30px]"}>
            정보 보기
          </Button>
          <Button
              _onClick={() => connectToTest(user)}
              disabled={user.is_tested}
              width={"w-[150px]"}>
            연결 테스트 하기
          </Button>
        </div>
      </div>
  )
}
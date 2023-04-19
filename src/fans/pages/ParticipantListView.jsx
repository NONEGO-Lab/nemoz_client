import React from "react";
import { Button } from "../../element";
import { Layout } from "../../shared/Layout";
import { ParticipantController as controller } from "../controller/participantController";
import FanDetail from "./components/FanDetail";

const ParticipantListView = () => {

  const { attendeeList, movePage, roomArray, isOpenFanDetail, currentPage,
    connectToTest, setIsOpenFanDetail, setCurrentFanId, currentFanId, setOnModal } = controller();

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
        { isOpenFanDetail && <FanDetail currentFanId={currentFanId} setOnModal={setOnModal}/> }
      </Layout>
  )
}

export default ParticipantListView;



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
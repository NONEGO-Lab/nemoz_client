import React from "react";
import Header from "../../shared/Header";
import { EventListController as controller } from "../controller/eventListController";


const EventListView = () => {

  const { eventList, goToUpdatePage, goToStartEvent,
    page, setPage, roomArray } = controller();


  return (
      <div className={"m-auto w-[1080px] text-center"}>
        <Header/>
        <div className="text-[30px] font-bold mt-[80px] mb-[50px]">
          이벤트 목록
        </div>

        <table className={"table-auto h-auto break-all align-middle"}>
          <thead className={"bg-gray-200 h-[30px] px-4"}>
          <tr className={"flex"}>
            <th className={"w-[30px]"}>Id</th>
            <th className={"w-[150px]"}>이름</th>
            <th className={"w-[100px]"}>아티스트</th>
            <th className={"w-[100px]"}>생성한 사람</th>
            <th className={"w-[200px]"}>팬목록</th>
            <th className={"w-[100px]"}>스탭 목록</th>
            <th className={"w-[150px]"}>생성일자</th>
            <th className={"w-[150px]"}>수정일자</th>
            <th className={"w-[50px]"}>수정</th>
            <th className={"w-[50px]"}>입장</th>
          </tr>
          </thead>
          <tbody className={"px-4 items-center"}>
          {
            eventList?.map((event, idx) => {
              return (
                  <tr key={idx} className={"w-[1080px] items-center flex"}>
                    <td className={"w-[30px] min-h-[40px] align-middle"}>{event.event_id}</td>
                    <td className={"w-[150px] min-h-[40px] align-middle"}>{event.event_name}</td>
                    <td className={"w-[100px] min-h-[40px] align-middle"}>
                      {
                        event.target_artist_ids.map((artist) => {
                          return artist.username
                        })
                      }
                    </td>
                    <td className={"w-[100px] min-h-[40px] align-middle"}>
                      {event.creator_info[0].username}
                    </td>
                    <td className={"w-[200px] min-h-[40px] align-middle"}>
                      {
                        event.target_fan_ids.map((fan) => {
                          return fan.username + " "
                        })
                      }
                    </td>
                    <td className={"w-[100px] min-h-[40px] align-middle"}>
                      {
                        event.target_staff_ids.map((staff) => {
                          return staff.username
                        })
                      }
                    </td>
                    <td className={"w-[150px] text-[14px] min-h-[40px] align-middle"}>{event.create_dt.replace("T", " ").slice(0, -5)}</td>
                    <td className={"w-[150px] text-[14px] min-h-[40px] align-middle"}>{event.update_dt.replace("T", " ").slice(0, -5)}</td>
                    <td onClick={() => goToUpdatePage(event)}
                        className={"align-middle w-[50px] cursor-pointer font-bold"}>수정</td>
                    <td onClick={() => goToStartEvent(event)}
                        className={"align-middle w-[50px] cursor-pointer font-bold text-red-500"}>
                      입장</td>
                  </tr>
              )
            })
          }
          </tbody>
        </table>
        <div className={"flex justify-end text-xl text-gray-600 mt-[30px]"}>
          <span className="cursor-pointer mr-2"> {"<"} </span>
          {
            roomArray?.map((num, index) => {
              return(
                  <div key={index} className={`pr-4`}>
                                    <span onClick={() => setPage(num)}
                                          className={`cursor-pointer text-center ${page === num && "bg-blue-600 px-2 py-1 text-white"}`}>
                                        {num}
                                    </span>
                  </div>
              )
            })
          }
          <span className={"mr-2 cursor-pointer"}>다음</span>
          <span className="cursor-pointer"> {">"} </span>
        </div>
      </div>
  )

};


export default EventListView;
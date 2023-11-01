import { instance } from "../../shared/config";


export const attendeeApi = {

  getAttendeeList: async (eventId, page) => {
    if(Array.isArray(eventId)){eventId = eventId.join()
    }
    const data = await instance.get("/attendee/list", { params: { event_id: eventId, page_size: 20, current_page: page } });
    return data.data.data;
  },

  getFanDetail: async (fanId, eventId) => {
    const data = await instance.get("/attendee/detail", { params: { fan_id: fanId, event_id:eventId } });
    return data.data.data;
  },

  testFan: async (eventId, fanId, isTested) => {
    const data = await instance.get("/attendee/test", { params:
          {
            event_id: eventId,
            fan_id: fanId,
            is_tested: isTested,
          }
    });
    return data.data;
  },

  //경고
  warnFan: async (id) => {
    const data = await instance.get("/attendee/warn", { params: { conn_id: id } });
    return data.data;
  },

  //강퇴
  banFan: async ({id, userId}) => {
    console.log(
        '진짜나가라'
    )
    const data = await instance.get("/attendee/ban", { params : {
      conn_id: id,
      userid: userId
    }});
    const ddd = data.data.data
    return {
      fan_data: {...ddd.fan_data},
      conn_data: {...ddd.conn_data[0]}
    };
  },

  waitFan: async (eventId, fanId) => {
    const data = await instance.get("/attendee/wait", { params:
          {
            event_id: eventId,
            fan_id: fanId
          }
    });
    return data.data;
  }
}
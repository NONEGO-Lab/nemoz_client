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
    return data.data;
  },

  testFan: async (eventId, fanId) => {
    const data = await instance.get("/attendee/test", { params:
          {
            event_id: eventId,
            fan_id: fanId,
            is_tested: 1,
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
    const data = await instance.get("/attendee/ban", { params : {
      conn_id: id,
      userid: userId
    }});
    return {
      fan_data: {...data.data.fan_data[0]},
      conn_data: {...data.data.conn_data[0]}
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
import {instance} from "../../shared/config";
import {event_detail} from "../../model/event/event_model";

export const eventApi = {
  getEventList: async ({page, eventId}) => {
    const data = await instance.get("/event/list", {
      params: {
        page_size: 20,
        current_page: page,
        event_id: eventId
      }
    });
      /// Fixme: 🟨 모델 활용을 이렇게 하는건가요?
      const result = [];
      data.data.response_data.events.map((event) => {
        let tmpEvent = {
          ...event_detail,
          event_id: event.event_id,
          event_name: event.event_name,
          target_staff_ids: event.target_staff_ids,
          target_artist_ids: event.target_artist_ids,
          target_fan_ids: event.target_fan_ids,
          creator_info: event.creator_info,
          create_dt: event.create_dt,
          update_dt: event.update_dt
        }
        result.push(tmpEvent);
      });

      return result;
  },


  getEventDetail: async ({page, eventId}) => {
    const data = await instance.get("/event/list", {
      params: {
        page: page, event_id: eventId
      }});

    let result;
    data.data.response_data.events.map((event) => {
      result = {
        ...event_detail,
        event_id: event.event_id,
        event_name: event.event_name,
        target_staff_ids: event.target_staff_ids,
        target_artist_ids: event.target_artist_ids,
        target_fan_ids: event.target_fan_ids,
        due_dt: event.due_dt,
      }
    });

    return result;
  },

  createEvent: async ({ name, date, fanIds, staffIds, artistIds, creator }) => {
    let req = {
      event_name: name,
      target_artist_ids: artistIds,
      target_staff_ids: staffIds,
      target_fan_ids: fanIds,
      creator: 1,
      due_dt: date
    };
    const data = await instance.post("/event/register", req);
    const eventData = data.data;
    return {
      id: eventData.id,
      eventName: eventData.event_name,
      artistIds: [...eventData.target_artist_ids],
      staffIds: [...eventData.target.staff_ids],
      fanIds: [...eventData.target_fan_ids]
    };
  },

  updateEvent: async (request) => {
    const data = await instance.post("/event/update", request);
    return data.data.event_data.length > 0;
  }



}
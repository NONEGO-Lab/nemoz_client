import {instance} from "../../shared/apiConfig";


export const eventApi = {
  getEventList: async ({page, eventId}) => {
    const data = await instance.get("/event/list", { params:
          { page_size: 20, current_page: page, event_id: eventId }});

    return {
      events: data.data.events
    };
  },


  getEventDetail: async ({page, eventId}) => {
    const data = await instance.get("/event/list", { params: {
        page: page, event_id: eventId
      }});
    return data.data;
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

  updateEvent: async ({id, eventName, artistIds, staffIds, fanIds, creator, dueDt}) => {
    let req = {
      id: id,
      event_name: eventName,
      target_artist_ids: artistIds,
      target_staff_ids: staffIds,
      target_fan_ids: fanIds,
      creator: creator,
      due_dt: dueDt
    };
    const data = await instance.post("/event/update", req);
    return data.data;
  }



}
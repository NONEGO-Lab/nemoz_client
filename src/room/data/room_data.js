import { instance } from "../../shared/config";


export const roomApi = {

  getRoomList: async (event_id, page) => {
    const data = await instance.get("/room/list", { params: { event_id : event_id, page_size: 20, current_page: page } });
    return data.data;
  },

  endRoom: async (roomId) => {
    const data = await instance.get("/room/end", { params : { room_id: roomId } });
    return data.data;
  },

  createRoom: async ({ roomTitle, eventId, staffIds, artistId, fanIdArray,
                       reserved_time, location, mimeType, due_dt }) => {
    let req = {
      room_name: roomTitle,
      event_id: eventId,
      artist_id: artistId,
      // staff_ids: staffIds,
      staff_ids: 24,
      fan_ids: fanIdArray,
      creator: 1,
      reserved_time: reserved_time,
      due_dt: due_dt,
      location: location,
      mimetype: mimeType
    }
    const data = await instance.post("/room/create", req);
    return data.data
  },

  uploadImage: async (eventId, file) => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("event_id", eventId);

    const data = await instance.post("/room/uploadscreen", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data.data;
  },

  getListOrder: async ({eventId, roomId}) => {
    const data = await instance.get("/room/listorder",
        { params: { event_id : eventId, room_id: roomId } });

    return data.data
  },

  updateListOrder: async (eventId, roomId, fanIds) => {
    let req = {
      event_id: eventId,
      room_id: roomId,
      fan_ids: fanIds
    };
    const data = await instance.post("/room/reorder", req);
    return data.data;
  },

}
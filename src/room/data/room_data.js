import { instance } from "../../shared/config";
import {create_room} from "../../model/room/room_model";


export const roomApi = {

  getRoomList: async (event_id, page) => {
    if(Array.isArray(event_id)){event_id = event_id.join()
    }
    const data = await instance.get("/room/list", { params: { event_id : event_id, page_size: 10, current_page: page } });
    return data.data;
  },

  endRoom: async (roomId) => {
    const data = await instance.get("/room/end", { params : { room_id: roomId } });
    return data.data.message === "Room Ended";
  },

  createRoom: async ({ roomTitle, eventId, staffIds, artistId, fanIdArray,creator,
                       reserved_time, location, mimeType, due_dt }) => {
    const request = {
      ...create_room,
      room_name: roomTitle,
      event_id: eventId,
      artist_id: artistId,
      // staff_ids: staffIds,
      staff_ids: staffIds,
      fan_ids: fanIdArray,
      creator: creator,
      reserved_time: reserved_time,
      due_dt: due_dt,
      location: location,
      mimetype: mimeType
    }
    const data = await instance.post("/room/create", request);
    return data.data
  },

  uploadImage: async (eventId, file) => {
    let formData = new FormData();
    formData.append("event_id", eventId);
    formData.append("file", file);
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
    // const tmpFans = Array.from({ length: 30 }, (_, index) => ({ fan_id:10200+index,fan_name:`fan${index+1}`,orders: index+1,status:index%2 === 0 ? 'in progress':'waiting' }));
    // return tmpFans
    return data.data.data.fan_orders

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
  addFan: async ({eventId, roomId, fanId, reservedTime, reason}) =>{
    const req = {event_id:eventId, room_id:roomId, fan_id:fanId, reserved_time: Number(reservedTime), reason:reason}
    const data = await instance.post("/room/addfan", req)
    return data.data

  }

}
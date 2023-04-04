import { instance } from "../../shared/config";


export const meetApi = {
  createMeet: async ({ eventId, roomId, artistId, staffIds, isReCreated }) => {
    let req = {
      event_id: eventId,
      room_id: roomId,
      artist_id: artistId,
      staff_ids: staffIds,
      is_recreated: isReCreated
    }
    const data = await instance.post("/meet/create", req);
    return data.data;
  },

  joinMeet: async ({eventId, roomId, meetId, meetName, id, userId, userName, role}) => {
    let req = {
      event_id: eventId,
      room_id: roomId,
      meet_id: meetId,
      meet_name: meetName,
      id: id,
      userid: userId,
      username: userName,
      role: role
    };
    const data = await instance.post("/meet/join", req);
    return data.data;

  },

  leaveMeet: async ({ id, role, type, meetName, connectionId, connectionName, time }) => {
    let req = {
      user_info: {
        id: id.toString(),
        role: role,
      },
      type: type ? type : "leave",
      meet_name: meetName,
      connection_id: connectionId,
      connection_name: connectionName,
      progress_time: time
    }
    const data = await instance.post("/meet/leave", req);
    return data.data;

  },

  endMeet: async ({ meetId, meetName, roomId, eventId, fanId }) => {
    let req = {
      meet_id: meetId,
      meet_name: meetName,
      room_id: roomId,
      event_id: eventId,
      fan_id: fanId
    }
    const data = await instance.post("/meet/end",req);
    return data.data;
  },

  addHistoryMeet: async (meetId, content) => {
    let req = {
      meet_id: meetId,
      type: "reaction",
      content: content
      //love_ico
    }
    const data = await instance.post("/meet/history", req);
    return data.data;
  }


}


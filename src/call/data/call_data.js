import { instance } from "../../shared/config";
import {session_info, connection_info} from "../../model/call/call_model";


export const meetApi = {
  createMeet: async (request) => {
    const data = await instance.post("/meet/create", request);
    return {
      ...session_info,
      meet_id: data.data.data.meet_id,
      meet_name: data.data.data.meet_name,
    }
  },

  joinMeet: async (request) => {
    const data = await instance.post("/meet/join", request);
    return {
      ...connection_info,
      meet_id: data.data.data.id,
      connection_id: data.data.data.response.connectionId,
      token: data.data.data.response.token
    }

  },

  leaveMeet: async (request) => {
    const data = await instance.post("/meet/leave", request);
    return data.data.message === "Meet Leaved";

  },

  endMeet: async (request) => {
    const data = await instance.post("/meet/end", request);
    return data.data.message === 'Meet Ended';
  },


  addHistoryMeet: async (meetId, content, userId) => {
    let req = {
      meet_id: meetId,
      type: "reaction",
      content: content,
      user_id: userId
    }
    const data = await instance.post("/meet/history", req);
    return data.data;
  }


}


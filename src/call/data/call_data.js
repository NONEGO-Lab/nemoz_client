import { instance } from "../../shared/config";
import {session_info, connection_info} from "../../model/call/call_model";


export const meetApi = {
  createMeet: async (request) => {
    const data = await instance.post("/meet/create", request);
    return {
      ...session_info,
      meet_id: data.data.meet_id,
      meet_name: data.data.meet_name,
    }
  },

  joinMeet: async (request) => {
    const data = await instance.post("/meet/join", request);

    return {
      ...connection_info,
      meet_id: data.data.id,
      connection_id: data.data.response.connectionId,
      token: data.data.response.token
    }

  },

  leaveMeet: async (request) => {
    const data = await instance.post("/meet/leave", request);
    return data.data === "LEAVED";

  },

  endMeet: async (request) => {
    const data = await instance.post("/meet/end", request);
    return data.data === 'Meet Ended';
  },


  // Todo: reaction data로 옮겨야 함
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


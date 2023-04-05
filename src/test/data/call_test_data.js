import {instance} from "../../shared/config";


export const testApi = {

  testCreate: async () => {
    const data = await instance.post("/test/create", {});
    return data.data.sessionId;
  },

  testJoin: async ({ meetName, userId }) => {
    let req = {
      meet_name: meetName,
      userid: userId
    };

    const data = await instance.post("/test/join", req);
    return {
      id: data.data.id,
      token: data.data.token
    };
  },

  testLeave: async (request) => {
    const data = await instance.post("/test/leave", request);
    return data.data === 'LEAVED';
  },

  testEnd: async (meetName) => {
    let req = {
      meet_name: meetName
    }
    const data = await instance.post("/test/end", req);
    return data.data === 'Meet Ended';
  }
}
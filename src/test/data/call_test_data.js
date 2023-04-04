import {instance} from "../../shared/config";


export const testApi = {

  testCreate: async () => {
    const data = await instance.post("/test/create", {});
    return data.data;
  },

  testJoin: async ({ meetName, userId }) => {
    let req = {
      meet_name: meetName,
      userid: userId
    };

    const data = await instance.post("/test/join", req);
    return data.data;
  },

  testLeave: async ({ meetName, connectionName }) => {
    let req = {
      meet_name: meetName,
      connection_name: connectionName
    };

    const data = await instance.post("/test/leave", req);
    return data.data;
  },

  testEnd: async (meetName) => {
    const data = await instance.post("/test/end", { meet_name: meetName });
    return data.data;
  }
}
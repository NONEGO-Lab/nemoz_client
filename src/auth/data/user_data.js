import { instance } from "../../shared/config";
import {user_auth, user_common} from "../../model/user/common";


export const userApi = {

  login: async (userInfo) => {
    const data = await instance.post("/user/auth", userInfo);
    return {
      ...user_auth,
      company_name: data.data.company,
      id: data.data.id,
      role: data.data.role,
      user_id: data.data.userid,
      username: data.data.username,
      token: data.data.token
    };
  },

  register: async (userInfo) => {
    const data = await instance.post("/user/register", userInfo);
    return data.data === "Created";
  },

  isLogin: async () => {
    const data = await instance.get("/user/check/auth", {});

    const userData = data.data;
    const tmpUserData = {
      ...user_common,
      company_name: userData.company_name,
      id: userData.id,
      role: userData.role,
      userId: userData.userid,
      username: userData.username
    }

    if(userData.role === 'fan') {
      tmpUserData['isCallTested'] = userData.is_tested !== 0;
    }

    return tmpUserData;
  }

}
import { instance } from "../../shared/config";
import { user_common } from "../../model/user/common";


export const userApi = {

  login: async (userInfo) => {
    const data = await instance.post("/user/auth", userInfo);
    return {
      ...user_common,
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
    return {
      ...user_common,
      company: data.data.company,
      id: data.data.id,
      role: data.data.role,
      userId: data.data.userid,
      username: data.data.username,
      isCallTested: data.data.is_tested !== 0,
    };

  }

}
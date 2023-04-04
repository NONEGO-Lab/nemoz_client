import { instance } from "../../shared/config";


export const userApi = {

  login: async (userInfo) => {
    const data = await instance.post("/user/auth", userInfo);
    return data.data;
  },

  register: async (userInfo) => {
    const data = await instance.post("/user/register", userInfo);
    return data;
  },

  isLogin: async () => {
    const data = await instance.get("/user/check/auth", {});
    return data.data;

  }

}
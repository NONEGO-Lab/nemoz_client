import { instance } from "../../shared/config";
import {user_auth, user_common} from "../../model/user/common";
import {ERROR_CONSTANTS} from "../../shared/constants/ERRORS";


export const userApi = {

  login: async (userInfo) => {
    const data = await instance.post("/user/auth", userInfo);
    if(data.data.code === 2000){
      return {
        ...user_auth,
        // company_name: data.data.company,
        // id: data.data.id,
        // role: data.data.role,
        // user_id: data.data.userid,
        // username: data.data.username,
        // token: data.data.token
        expiredAt: data.data.expiredAt,
        memberNo: data.data.memberNo,
        adminNo: data.data.adminNo,
        accessToken: data.data.accessToken,
        type: data.data.type,
      };
    }else{
      const error = new Error(`{"code":"${data.data.code}", "errMsg":"${ERROR_CONSTANTS[data.data.code] || "에러가 발생했습니다."}"}`)
      throw error
    }

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
      username: userData.username,
      expiredAt: userData.expiredAt,
      memberNo: userData.memberNo,
      adminNo: userData.adminNo,
      accessToken: userData.accessToken,
      type: userData.type,
    }

    if(userData.role === 'fan') {
      tmpUserData['isCallTested'] = userData.is_tested !== 0;
    }

    return tmpUserData;
  }

}
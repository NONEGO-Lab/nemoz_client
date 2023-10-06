import {instance} from "../../shared/config";
import {user_auth, user_common} from "../../model/user/common";
import {ERROR_CONSTANTS} from "../../shared/constants/ERRORS";


export const userApi = {

    login: async (userInfo) => {
        const data = await instance.post("/user/auth", userInfo);
        console.log(data.data.data.code)
        // const userData = data.data.data
        if (data.data.data.code === 2000) {
            const userData = data.data.data;
            return {
                ...user_auth,
                // company_name: data.data.company,
                // id: data.data.id,
                role: userData.role,
                // user_id: data.data.userid,
                // username: data.data.username,
                // token: data.data.token
                expiredAt: userData.expiredAt,
                memberNo: userData.memberNo,
                staffNo: userData.staffNo,
                staffName: userData.staffName,
                artistNo: userData.artistNo,
                artistName: userData.artistName,
                accessToken: userData.accessToken,
                type: userData.type,
            };
        } else {
            const error = new Error(`{"code":"${data.data.code}", "errMsg":"${ERROR_CONSTANTS[data.data.code] || "알 수 없는 에러가 발생했습니다."}"}`)
            throw error
        }

    },
    register: async (userInfo) => {
        const data = await instance.post("/user/register", userInfo);
        return data.data === "Created";
    },

    isLogin: async () => {
        const data = await instance.get("/user/check/auth", {});

        const userData = data.data.data;
        console.log(userData, 'login Chcek')
        const tmpUserData = {
            ...user_common,
            company_name: userData.company_name,
            id: userData.id,
            role: userData.role,
            userId: userData.userid,
            username: userData.username,
            expiredAt: userData.expiredAt,
            memberNo: userData.memberNo,
            staffNo: userData.staffNo,
            staffName: userData.staffName,
            artistNo: userData.artistNo,
            artistName: userData.artistName,
            accessToken: userData.accessToken,
            type: userData.type,
        }

        if (userData.role === 'fan') {
            tmpUserData['isCallTested'] = userData.is_tested !== 0;
        }

        return tmpUserData;
    }

}
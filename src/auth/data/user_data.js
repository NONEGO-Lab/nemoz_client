import {instance} from "../../shared/config";
import {user_auth, user_common} from "../../model/user/common";
import {ERROR_CONSTANTS} from "../../shared/constants/ERRORS";
import {sock} from "../../socket/config";


export const userApi = {

    login: async (userInfo) => {
        const data = await instance.post("/user/auth", userInfo);
        if (data.data.data.code === 2000) {
            const userData = data.data.data;
            return {
                ...user_auth,
                role: userData.role,
                expiredAt: userData.expiredAt,
                memberNo: userData.memberNo,
                staffNo: userData.staffNo,
                staffName: userData.staffName,
                artistNo: userData.artistNo,
                artistName: userData.artistName,
                accessToken: userData.accessToken,
                adminNo: userData.adminNo,
                type: userData.type,
            };
        } else {
            const errorData = data.data.data;
            const error = new Error(`{"code":"${errorData.code}", "errMsg":"${ERROR_CONSTANTS[errorData.code] || "알 수 없는 에러가 발생했습니다."}"}`)
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
        const tmpUserData = {
            ...user_common,
            company_name: userData.company_name,
            id: userData.id||userData.memberNo||userData.artistNo||userData.staffNo,
            role: userData.role,
            userId: userData.userid,
            username: userData.memberName || userData.artistName || userData.staffName || '이름없음',
            expiredAt: userData.expiredAt,
            memberNo: userData.memberNo,
            staffNo: userData.staffNo,
            staffName: userData.staffName,
            artistNo: userData.artistNo,
            artistName: userData.artistName,
            accessToken: userData.accessToken,
            type: userData.type,
        }

        if (userData.role === 'member') {
            tmpUserData['isCallTested'] = userData.is_tested !== 0;
            if(!sock.connect().connected && sessionStorage.getItem('auth')){
                sock.emit('join', userData.memberNo)
            }
        }

        return tmpUserData;
    }

}
import {login_request, sign_up_info} from "../../model/auth/auth_model";
import {loginUser} from "../../redux/modules/userSlice";
import {sock} from "../../socket/config";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {userApi} from "../data/user_data";


export const AuthController = (setError, setValue, setShowPwdError) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const regex = new RegExp(emailRegex);
    const loginOnSubmit = (data) => {
        let userInfo = {
            ...login_request,
            userid: data.id,
            password: data.password,
            member: regex.test(data.id) ? 'member' : 'admin'
        }

        dispatch(loginUser(userInfo)).then((result) => {
            if (result.error) {
                const err = JSON.parse(result.payload)
                if(Number(err.code)=== 1004||Number(err.code)=== 1006){
                    setError('id', {message: err.errMsg})
                    setValue('id',`${err.errMsg}`)
                }
                if(Number(err.code)=== 1005 || Number(err.code)=== 1007){
                    setShowPwdError(true)
                    setError('password', {message: err.errMsg})
                    setValue('password',`${err.errMsg}`)
                }

                return
            }
            if (!sock.connected) {
                sock.connect();
            }
            sock.emit("join", result.payload.memberNo || result.payload.adminNo);
            result.payload.memberNo ? navigate("/waitcall") : navigate("/roomlist");

        })


    }

    const signUpOnSubmit = (data) => {
        const userInfo = {
            ...sign_up_info,
            user_id: data.id,
            username: data.username,
            company_name: data.company_name,
            password: data.password,
            role: data.role
        };

        userApi.register(userInfo).then((result) => {
            if (result) {
                navigate("/");
            } else {
                alert("회원가입 실패입니다");
            }
        })
    }


    return {
        loginOnSubmit,
        signUpOnSubmit
    }
}
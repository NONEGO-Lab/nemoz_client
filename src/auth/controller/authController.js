import {login_request, sign_up_info} from "../../model/auth/auth_model";
import {loginUser} from "../../redux/modules/userSlice";
import {sock} from "../../socket/config";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {userApi} from "../data/user_data";


export const AuthController = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const loginOnSubmit = (data) => {

    let userInfo = {
      ...login_request,
      userid: data.id,
      password: data.password,
    }

    dispatch(loginUser(userInfo)).then((result) => {
      if(result.error) {
        alert(`${result.payload.errMsg}`);
        return
      }
      if(!sock.connected) {
        sock.connect();
      }
      sock.emit("join", result.payload.username);
      navigate("/eventlist");

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
      if(result){
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
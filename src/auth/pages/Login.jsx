import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../shared/Header";
import { Button, Input } from "../../element";
import { SizeLayout } from "../../shared/Layout";
import { useForm } from "react-hook-form";
import { loginUser } from "../../redux/modules/userSlice";
import { sock } from "../../socket/config";
import { login_request } from "../../model/auth/auth_model";

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();


  const onSubmit = (data) => {

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
      // result.payload.role === "fan" ? navigate("/waitcall") : navigate("/roomlist");

    })
  }

  return (
      <SizeLayout>
        <Header/>
        <div>
          <div className="text-center text-[30px] mb-[30px] mt-[90px]">
            로그인
          </div>
          <form
              className="text-center m-auto w-[300px]">
            <Input
                register={register}
                label="아이디"
                name={"id"}
                width={"w-[300px]"}
                height={"h-[44px]"}
                marginBottom={"mb-[20px]"}
                placeholder={"입력..."}
                required={true}
            />
            <Input
                register={register}
                label="비밀번호"
                name={"password"}
                width={"w-[300px]"}
                height={"h-[44px]"}
                marginBottom={"mb-[30px]"}
                placeholder={"입력..."}
                required={true}
                type={"password"}
            />
            <Button _onClick={handleSubmit(onSubmit)}
                    width={"w-[300px]"}>
              로그인
            </Button>
          </form>
        </div>
      </SizeLayout>
  )
};

export default Login;

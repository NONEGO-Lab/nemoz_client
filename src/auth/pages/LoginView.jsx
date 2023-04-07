import React from "react";
import Header from "../../shared/Header";
import { Button, Input } from "../../element";
import { SizeLayout } from "../../shared/Layout";
import { useForm } from "react-hook-form";
import { AuthController as controller } from "../controller/authController";

const LoginView = () => {

  const { loginOnSubmit }  = controller();
  const { register, handleSubmit } = useForm();

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
            <Button _onClick={handleSubmit(loginOnSubmit)}
                    width={"w-[300px]"}>
              로그인
            </Button>
          </form>
        </div>
      </SizeLayout>
  )
};

export default LoginView;

import React from "react";
import { Button, Input } from "../../element";
import { SizeLayout } from "../../shared/Layout";
import { useForm } from "react-hook-form";
import { AuthController as controller } from "../controller/authController";

const LoginView = () => {

  const { loginOnSubmit }  = controller();
  const { register, handleSubmit, formState: { errors } } = useForm();
  console.log(errors, '????')
  return (
      <SizeLayout width={'w-[649.5px]'} height={'h-[565px]'} color={'bg-white'} flex={'flex'} justifyCenter={true} rounded={'rounded-[15px]'}>
        <div className="mt-[71px]">
          <div className="w-[251.5px] h-[44px] m-auto">
          <img src="../images/nemozCallLogo.png" alt="logo" />
          </div>
          <form
              className="text-center mt-[93.5px] w-[502px] h">
            <Input
                register={register}
                name={"id"}
                width={"w-[502px]"}
                height={"h-[44px]"}
                marginBottom={"mb-[55px]"}
                placeholder={"User ID"}
                required={true}
                errors={errors}
            />
            <Input
                register={register}
                name={"password"}
                width={"w-[502px]"}
                height={"h-[44px]"}
                marginBottom={"mb-[60px]"}
                placeholder={"Password"}
                required={true}
                type={"password"}
            />
            <Button _onClick={handleSubmit(loginOnSubmit)}
                    width={"w-[502px]"}
                    height={"min-h-[75px]"}
                    bgColor={"bg-[#848484]"}
                    borderColor={"border-none"}
                    color={"text-[#fff]"}
                    style={"text-[26px] rounded-[10px] hover:bg-[#01dfe0]"}

            >
              로그인
            </Button>
          </form>
        </div>
      </SizeLayout>
  )
};

export default LoginView;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "../../shared/Header";
import { Button, Input, Select } from "../../element";
import { SizeLayout } from "../../shared/Layout";
import { userApi } from "../data/user_data";
import { sign_up_info } from "../../model/auth/auth_model";
import { sign_up_item } from "./form";


const SignUp = () => {

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();


  const onSubmit = (data) => {
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

  return (
      <SizeLayout>
        <Header/>
        <div className="w-[100%] m-auto">
          <div className="text-center text-[26px] mb-[30px] mt-[90px]">
            회원가입
          </div>
          <div>
            <form
                className="m-auto w-[100%] flex flex-col items-center">
              {
                sign_up_item.map((form) => {
                  return <Input
                      type={(form.name === "password" || form.name === "passwordCheck") && "password"}
                      key={form.name}
                      register={register}
                      label={form.label}
                      name={form.name}
                      required={true}
                      width={"w-[300px]"}
                      height={"h-[44px]"}
                      marginBottom={"mb-[20px]"}
                      placeholder={"입력..."}
                  />
                })
              }
              {
                <Select
                    register={register}
                    name={"role"}
                    label={"권한"}
                    placeholder={"Fan"}
                    options={["fan", "artist", "staff"]}
                    width={"w-[300px]"}
                    height={"h-[44px]"}
                    marginBottom={"mb-[40px]"}
                />
              }
              <Button _onClick={handleSubmit(onSubmit)}
                      width={"w-[300px]"}>
                회원가입
              </Button>
            </form>
          </div>

        </div>
      </SizeLayout>

  )
};

export default SignUp;

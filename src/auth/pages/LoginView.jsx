import React, {useState} from "react";
import {Button} from "../../element";
import {SizeLayout} from "../../shared/Layout";
import {useForm} from "react-hook-form";
import {AuthController as controller} from "../controller/authController";

const LoginView = () => {
    const [showPwdError, setShowPwdError] = useState(false);
    const {register, handleSubmit, formState: {errors}, setError, setValue,watch,} = useForm();
    const {loginOnSubmit} = controller(setError, setValue, setShowPwdError);
    const watchId= watch('id')
    const watchPwd = watch('password')

    return (
        <SizeLayout width={'w-[650px]'} height={'h-[565px]'} color={'bg-white'} flex={'flex'} justifyCenter={true}
                    rounded={'rounded-[15px]'}>
            <div className="mt-[71px]">
                <div className="w-[252px] h-[44px] m-auto">
                    <img src="/images/nemozCallLogo.png" alt="logo"/>
                </div>
                <form
                    className="text-center mt-[94px] w-[502px]"
                    onSubmit={handleSubmit(loginOnSubmit)}
                >
                    <input
                        {...register("id")}
                        className={`text-sm outline-none w-[502px] h-[44px] text-[20px] ${errors?.id && 'text-[#01dfe0]'} mb-[55px] flex justify-between items-center border-b-2 border-b-[#c7c7c7] `}
                        placeholder={"User ID"}
                        type={"text"}
                        onFocus={() => setValue("id", '')}
                    />
                    <input
                        {...register("password")}
                        className={`text-sm outline-none w-[502px] h-[44px] text-[20px] ${errors?.password && 'text-[#01dfe0]'} mb-[55px] flex justify-between items-center border-b-2 border-b-[#c7c7c7] `}
                        placeholder={"Password"}
                        type={showPwdError ? "text" : "password"}
                        onFocus={() => {
                            setShowPwdError(false);
                            setValue("password", '')
                        }}
                    />
                    <Button _onClick={handleSubmit(loginOnSubmit)}
                            width={"w-[502px]"}
                            height={"min-h-[75px]"}
                            bgColor={`${(watchId && watchPwd) ?"bg-[#01dfe0]" :"bg-[#848484]"}`}
                            borderColor={"border-none"}
                            textColor={"text-[#fff]"}
                            type={"submit"}
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

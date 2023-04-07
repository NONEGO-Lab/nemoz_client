import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginCheck } from "../redux/modules/userSlice";
import LoginView from "../auth/pages/LoginView";


export const Auth = ({ children }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(null);

  useEffect(()=> {

    dispatch(loginCheck()).then((response) => {
      if(response.meta.requestStatus === "fulfilled") {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        alert("로그인한 유저만 접근 가능합니다.");
        navigate("/", { replace: true });
      }
    })

  }, [])


  if(isAuth === null) {
    return (
        <div className="mt-[40%] text-center text-lg">
          로딩중...
        </div>
    )
  }

  return (
      <>
        {
          isAuth ? children : <LoginView/>
        }
      </>
  )
}
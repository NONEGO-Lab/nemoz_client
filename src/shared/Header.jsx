import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disconnectSession, videoReset } from "../redux/modules/videoSlice";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../redux/modules/userSlice";
import { useVideo } from "../call/controller/hooks/useVideo";
import { sock } from "../socket/config";
import { clearSessionInfo } from "../redux/modules/commonSlice";
import { AdminProvider } from "../provider";


const Header = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginPage = window.location.pathname === "/" ||
      window.location.pathname === "/signup";

  const userInfo = useSelector((state) => state.user.userInfo);
  const session = useSelector((state) => state.video.session);
  const { leaveSession } = useVideo();


  return(
      <div className="flex justify-between items-center bg-main_theme border-b-2 border-header_under">
        <div
            onClick={() => {
              if(session) {
                if(window.confirm("정말 페이지를 나가시겠습니까? 페이지를 나가면 영상통화가 종료됩니다")){
                  dispatch(disconnectSession());
                  dispatch(clearSessionInfo());
                  leaveSession();
                  navigate("/")
                }
              } else {
                navigate("/");
              }

            }}
            className="text-[32px] font-bold cursor-pointer">
          네모즈랩
        </div>
        <div className={`${loginPage ? "hidden" : "flex"} justify-between text-xl`}>
          <AdminProvider>
            <div
                onClick={() => navigate("/roomlist")}
                className="cursor-pointer font-bold text-blue-600 mr-4">
              방목록
            </div>
            <div
                onClick={() => navigate("/userlist")}
                className="cursor-pointer font-bold text-blue-600 mr-4">
              참가자 목록
            </div>
            <div
                onClick={() => navigate("/eventlist")}
                className="cursor-pointer text-black-600 mr-4">
              이벤트 목록
            </div>
          </AdminProvider>

          <div className="cursor-pointer mr-4">{userInfo.username} 님</div>
          <div
              onClick={() => {
                dispatch(logout());
                dispatch(videoReset());
                dispatch(disconnectSession());
                dispatch(clearSessionInfo());
                leaveSession();
                sock.disconnect();
                sock.offAny();
                navigate("/");
              }}
              className="cursor-pointer text-blue-600">로그아웃</div>
        </div>
      </div>
  )

};


export default memo(Header);
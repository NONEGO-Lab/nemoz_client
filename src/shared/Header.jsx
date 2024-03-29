import React, {memo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {disconnectSession, videoReset} from "../redux/modules/videoSlice";
import {useNavigate} from "react-router-dom";
import {logout} from "../redux/modules/userSlice";
import {useVideo} from "../call/controller/hooks/useVideo";
import {sock} from "../socket/config";
import {clearSessionInfo} from "../redux/modules/commonSlice";
import {clearLocalStorage} from "../utils";


const Header = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginPage = window.location.pathname === "/" ||
        window.location.pathname === "/signup";
    const userInfo = useSelector((state) => state.user.userInfo);
    const session = useSelector((state) => state.video.session);
    const {leaveSession} = useVideo();
    const currentLocation = () => window.location.pathname.split('/')[1]
    const isFan = userInfo.role === 'member'
    const routeByRole=() => isFan ? navigate('/waitcall'): navigate('/roomlist')
    return (
        <div
            className="flex items-center justify-between bg-main_theme border-b-2 border-b-[#e0e0e0] border-header_under min-h-[55px] px-[40px] text-[#444444] ">
            <div className="w-[590px] flex justify-between items-center">
                <div
                    onClick={() => {
                        if (session) {
                            if (window.confirm("정말 페이지를 나가시겠습니까? 페이지를 나가면 영상통화가 종료됩니다")) {
                                dispatch(disconnectSession());
                                dispatch(clearSessionInfo());
                                leaveSession();
                                routeByRole()
                            }
                        } else {
                            routeByRole()
                        }

                    }}
                    className="cursor-pointer w-[115px] ">
                    <img src="/images/headerLogo.png" alt='header logo'/>
                </div>

                <div className={`${loginPage ? "hidden" : "flex"} text-[18px] `}>
                    {!isFan && <>
                        {/*방목록*/}
                        <div onClick={() => navigate("/roomlist")}
                             className={'flex items-center cursor-pointer hover:font-bold'}>
                            {currentLocation() !== 'userlist' &&
                                <div className={'w-[6px] h-[6px] bg-[#01dfe0] rounded-full'}/>}
                            <div className={'w-[25px] h-[22px] ml-[11px]'}>
                                <img alt='room-icon' src="/images/roomIcon.png"/>
                            </div>
                            <div className={` ml-[10px] ${currentLocation() !== 'userlist' ? 'font-bold' : ''}`}>
                                방목록
                            </div>
                            <div>

                            </div>
                        </div>

                        {/*참가자 목록*/}
                        <div onClick={() => navigate("/userlist")}
                             className={'flex items-center ml-[56px] cursor-pointer hover:font-bold'}>
                            {currentLocation() === 'userlist' &&
                                <div className={'w-[6px] h-[6px] bg-[#01dfe0] rounded-full'}/>}
                            <div className={'w-[29.5px] h-[18.5px] ml-[11px]'}>
                                <img alt='room-icon' src="/images/participantsIcon.png"/>
                            </div>
                            <div
                                className={`ml-[10px] ${currentLocation() === 'userlist' ? 'font-bold' : ''}`}>
                                참가자 목록
                            </div>
                            <div>

                            </div>
                        </div>
                    </>}

                </div>
            </div>
            <div className="flex items-center">
                <div className="w-[25px] h-[25px] rounded-full bg-white flex justify-center items-center">
                    {isFan && <img src="/images/profileIcon.png" alt={'userImage'}/>}
                    {userInfo.role==='staff' && <img src="/images/staffIcon.png" alt={'staffIcon'} className={'w-[18px]'}/>}
                    {userInfo.role==='artist' && <img src="/images/starIcon.png" alt={'starIcon'} className={'w-[18px]'}/>}
                </div>
                <div className="cursor-pointer mr-[10px] ml-[7px] text-[18px]">{userInfo.username}</div>
                <div
                    onClick={() => {
                        dispatch(logout());
                        dispatch(videoReset());
                        dispatch(disconnectSession());
                        dispatch(clearSessionInfo());
                        clearLocalStorage()
                        leaveSession();
                        sock.disconnect();
                        sock.offAny();
                        navigate("/");
                    }}
                    className="w-[72px] cursor-pointer">
                    <img src="/images/logoutIcon.png" alt={"logout"}/>
                </div>
            </div>
        </div>
    )

};


export default memo(Header);
import React from 'react';
import Header from "../../../shared/Header";
import VideoArea from "./VideoArea";
import {SizeLayout} from "../../../shared/Layout";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createBrowserHistory} from "history";
import {useReaction} from "../../../reaction/controller/useReaction";
import {useVideo} from "../../controller/hooks/useVideo";
import {CallController as controller} from "../../controller/callController";
import MainCallUtil from "./MainCallUtil";
import StaffVideoArea from "./StaffVideoArea";

const VideoContainer2 = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const history = createBrowserHistory();


    const fanInfo = useSelector((state) => state.test.fanInfo);
    const eventName = useSelector(state => state.event.eventName)
    const subscribedArtistInfo = useSelector(state => state.video.subscribedArtistInfo)
    const subscribedFanInfo = useSelector(state => state.video.subscribedFanInfo)

    const { videoMuteHandler, audioMuteHandler, subscribers,
        publisher, publisherAudio, publisherVideo, routeToFanList } = useVideo();
    const { roomInfo, leftTimeRef, toastList,
        endRoom, outRoom, showTime, staffNoticeList, userInfo, setIsOpenWaitingModal, currentFan,
        setCurrentFan, setIsOpenAddUser, fanDetailOpenHandler, isOpenAddUser, isOpenFanDetail,
        waitingFanInfo, setIsOpenFanDetail, isOpenLeftTime, toBack, isOpenWaitingModal
    } = controller();
    const {getChatFromSocket} = useReaction();

    const {artist_name} = roomInfo
    const isStaff = userInfo.role === 'staff'

    return (
        <SizeLayout isVideo={true} width={'w-[1366px]'} height={'min-h-[1024px]'}>
            <Header/>
            <div className={"bg-main_theme flex flex-col justify-center"}>
                <div className={"flex justify-center pt-[100px] text-[23px] text-[#444] font-[500] mb-[80px]"}>
        <span>
        <img className='w-[30px] h-[30px]' src="../images/roomIcon.png" alt="room-icon"/>
        </span>
                    <span className='ml-[10px]'>{eventName}</span>
                </div>

                <div className='flex justify-center mb-[-30px]'>
                    <span
                        className='w-[125px] h-[30px] rounded-[15px] border-[1.5px] border-[#444] text-[16px] text-[#444] flex items-center justify-center'>
                        <div>Test Call</div>
                        <div className='w-[8px] h-[8px] rounded-full bg-[#02c5cb] ml-[6px]'/>
                    </span>
                </div>

                {isStaff?
                    <StaffVideoArea
                        subscribedArtistInfo={subscribedArtistInfo}
                        subscribedFanInfo={subscribedFanInfo}
                        artistName = {artist_name}
                        fanInfo={currentFan}
                        roomInfo={roomInfo}

                    />

                    :

                    <VideoArea
                        userInfo={userInfo}
                        fanInfo={currentFan}
                        publisher={publisher}
                        subscriber={subscribers[0]}
                        subscribedArtistInfo={subscribedArtistInfo}
                        subscribedFanInfo={subscribedFanInfo}
                        publisherVideo={audioMuteHandler}
                        publisherAudio={videoMuteHandler}
                        roomInfo = {roomInfo}
                        artistName={artist_name}
                    />
                }


                {/*
                    <div className={"bg-pink-600 h-[40%] flex justify-center items-center"}>
                        <ReactionButton />
                    </div> */}

                {/* 기능 Component */}
                <MainCallUtil
                    audioMuteHandler={audioMuteHandler}
                    videoMuteHandler={videoMuteHandler}
                    quitTest={false}
                    role={userInfo.role}
                    dispatch={dispatch}
                    navigate={navigate}
                    currentFan={currentFan}
                    setCurrentFan={setCurrentFan}
                    subscribers={subscribers}
                    routeToFanList={routeToFanList}
                    endRoom={endRoom}
                    outRoom={outRoom}
                />

            </div>
        </SizeLayout>
    );
};

export default VideoContainer2;
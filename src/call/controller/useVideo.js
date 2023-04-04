import React from "react";
import {OpenVidu} from "openvidu-browser";
import {useDispatch, useSelector} from "react-redux";
import { addPublisher, addSession, addSubscribers, clearSession,
  deleteSubscribers, addVideoDevices, addAudioDevices,
  mutePublisherAudio, mutePublisherVideo
} from "../../redux/modules/videoSlice";
import { useNavigate } from "react-router-dom";
import { meetApi } from "../data/call_data";
import { addSessionInfo, addConnectionInfo, clearSessionInfo,
  addCurrentFanName } from "../../redux/modules/commonSlice";
import {setError, setIsError} from "../../redux/modules/errorSlice";
import {clearTestSession} from "../../redux/modules/testSlice";

export const useVideo = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);

  const roomInfo = useSelector((state) => state.common.roomInfo);
  const sessionInfo = useSelector((state) => state.common.sessionInfo);
  const connectionInfo = useSelector((state) => state.common.connectionInfo);

  const publisher = useSelector((state) => state.video.publisher);
  const session = useSelector((state) => state.video.session);
  const publisherAudio = useSelector((state) => state.video.publisherAudio);
  const publisherVideo = useSelector((state) => state.video.publisherVideo);

  const eventId = useSelector((state) => state.event.eventId);


  const createSession = async (roomId, isReCreated) => {
    let artistId = roomInfo.artist_id;
    let staffIds = [roomInfo.staffs[0].staff_id]
    // isReCreated 값 받아오기
    const response = await meetApi.createMeet({
      eventId, roomId, artistId, staffIds, isReCreated });
    return response;

  }

  const createToken = async ({ roomId, sessionInfo }) => {
    let meetId = sessionInfo.meetId;
    let meetName = sessionInfo.meetName;
    let id = userInfo.id;
    let userId = userInfo.userId;
    let userName = userInfo.username;
    let role = userInfo.role;

    try {
      const response = await meetApi.joinMeet({
        eventId, roomId, meetId, meetName, id, userId, userName, role });

      dispatch(addConnectionInfo(response));
      return response.response.token;
    } catch (err) {
      if(err.response.status === 304) {
        //create session으로 새로 session 만들어준다.
        return null;
      }

      // dispatch(setError(err));
      // dispatch(setIsError(true));
    }
  }

  const msgBeforeOut = async () => {
    //leave 처리
    try {
      const response = await meetApi.leaveMeet({
        id: userInfo.id,
        role: userInfo.role,
        type: "leave",
        meetName: sessionInfo.meetName,
        connectionId: connectionInfo.id,
        connectionName: connectionInfo.response.connectionId,
        progress_time: 100
      });

      if(response === "LEAVED") {
        dispatch(clearSessionInfo());
        leaveSession();
        navigate(-1, { replace: true });
      }
    } catch (err){
      dispatch(setError(err));
      dispatch(setIsError(true));
    }

  }



  // 제일 처음에 session 만드는 역할(staff, artist)
  const joinSession = async (roomId, isReCreated) => {
    let OV = new OpenVidu();
    let _session = OV.initSession()

    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addSession(_session));

    const sessionData = await createSession(roomId, isReCreated);

    let sessionInfo = {
      meetId: sessionData.meet_id,
      meetName: sessionData.meet_name
    };
    dispatch(addSessionInfo(sessionInfo));

    const token = await createToken({ roomId, sessionInfo });
    await connectSession(token, _session, OV);

    return sessionInfo;

  }

  const onlyJoin = async () => {
    let OV = new OpenVidu();
    let _session = OV.initSession();

    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addSession(_session));

    let sessionInfo = {
      meetId: roomInfo.meet_id,
      meetName: roomInfo.meet_name
    }

    dispatch(addSessionInfo(sessionInfo));

    const result = await createToken({ roomId: roomInfo.room_id, sessionInfo });

    if(result !== null) {
      await connectSession(result, _session, OV);
      return sessionInfo;
    } else {
      // 기존의 meet 이 유효하지 않아 새로 만들어줘야한다.
      let roomId = roomInfo.room_id;
      const sessionData = await createSession(roomId, true);

      let sessionInfo = {
        meetId: sessionData.meet_id,
        meetName: sessionData.meet_name
      };

      dispatch(addSessionInfo(sessionInfo));

      const token = await createToken({ roomId, sessionInfo });
      await connectSession(token, _session, OV);

      return sessionInfo;
    }

  }

  const newJoinMeet = async (newSessionInfo) => {
    let OV = new OpenVidu();
    let _session = OV.initSession();

    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addSession(_session));

    let sessionInfo = {
      meetId: newSessionInfo.meetId,
      meetName: newSessionInfo.meetName
    }
    dispatch(addSessionInfo(sessionInfo));

    const token = await createToken({ roomId: roomInfo.room_id, sessionInfo });
    await connectSession(token, _session, OV);

    return sessionInfo;
  }


  // fan이 조인할 때,
  const fanJoinSession = async ({ roomId, sessionInfo }) => {

    let OV = new OpenVidu();
    let _session = OV.initSession();

    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addSession(_session));

    await createToken({ roomId, sessionInfo })
        .then((token) => connectSession(token, _session, OV))
        .catch((error) =>
            console.log('There was an error connecting to the session2:', error, error.message)
        );

    return sessionInfo;

  }


  const connectSession = async (token, _session, OV) => {
    _session.connect(token, userInfo)
        .then(() => connectWebCam(_session, OV))
        .catch((error) => {
          console.log('There was an error connecting to the session1:', error.code, error.message)
        })
  }

  const connectWebCam = async (_session, OV) => {

    let publisher = await OV.initPublisherAsync(undefined, {
      audioSource: undefined, // The source of audio. If undefined default microphone
      videoSource: undefined, // The source of video. If undefined default webcam
      publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
      publishVideo: true, // Whether you want to start publishing with your video enabled or not
      resolution: '640x480', // The resolution of your video
      frameRate: 30, // The frame rate of your video
      insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
      mirror: false, // Whether to mirror your local video or not
    });

    publisher["role"] = userInfo.role;
    publisher.on("accessAllowed",() => {
      _session.publish(publisher).then( async () => {

        dispatch(addPublisher(publisher));
        dispatch(addSession(_session))

        let devices = await OV.getDevices();

        let videoDevices = devices.filter((device) => device.kind === "videoinput");
        let audioDevices = devices.filter((device) => device.kind === "audioinput");

        dispatch(addVideoDevices(videoDevices));
        dispatch(addAudioDevices(audioDevices));


      })
    })
  }


  const leaveSession = () => {
    dispatch(clearSession());
    localStorage.removeItem("audioId");
    localStorage.removeItem("videoId");
  };


  const subscribeToStreamCreated = (_session) => {
    _session.on('streamCreated', (event) => {
      let newUserData = JSON.parse(event.stream.connection.data.split("%/%")[0]);

      let subscriber = _session.subscribe(event.stream, undefined);
      subscriber["role"] = newUserData['role'];
      subscriber["id"] = newUserData['id']
      subscriber["username"] = newUserData['username'];
      dispatch(addSubscribers(subscriber));
    });
  }

  const subscribeToStreamDestroyed = (_session) => {
    _session.on('streamDestroyed', (event) => {
      dispatch(deleteSubscribers(event.stream.streamManager.stream.streamId));
    });
  }

  //mute 관련 함수

  const audioMuteHandler = () => {
    if(publisherAudio) {
      publisher.publishAudio(false);
      dispatch(mutePublisherAudio(false));
    } else {
      publisher.publishAudio(true);
      dispatch(mutePublisherAudio(true));
    }
  }

  const videoMuteHandler = () => {
    if(publisherVideo) {
      publisher.publishVideo(false);
      dispatch(mutePublisherVideo(false));

    } else{
      publisher.publishVideo(true);
      dispatch(mutePublisherVideo(true));
    }
  }

  const onbeforeunload = () => {
    if(session){
      session.disconnect();
      dispatch(clearSession());
    }
  }


  return {
    joinSession,
    onlyJoin,
    newJoinMeet,
    leaveSession,
    audioMuteHandler,
    videoMuteHandler,
    createSession,
    fanJoinSession,
    msgBeforeOut,
    onbeforeunload
  }
};


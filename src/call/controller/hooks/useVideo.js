import React from "react";
import {OpenVidu} from "openvidu-browser";
import {useDispatch, useSelector} from "react-redux";
import {
  addAudioDevices,
  addPublisher,
  addSession,
  addSubscribers,
  addVideoDevices,
  clearSession,
  deleteSubscribers,
  disconnectSession,
  isFanLoading,
  mutePublisherAudio,
  mutePublisherVideo, subscribedArtistInfo, subscribedFanInfo
} from "../../../redux/modules/videoSlice";
import {useNavigate} from "react-router-dom";
import {meetApi} from "../../data/call_data";
import {addConnectionInfo, addSessionInfo, clearSessionInfo} from "../../../redux/modules/commonSlice";
import {setError, setIsError} from "../../../redux/modules/errorSlice";
import {create_token, session_create, leave_meet} from "../../../model/call/call_model";

export const useVideo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);

  const roomInfo = useSelector((state) => state.common.roomInfo);
  const sessionInfo = useSelector((state) => state.common.sessionInfo);
  const connectionInfo = useSelector((state) => state.common.connectionInfo);

  const publisher = useSelector((state) => state.video.publisher);
  const subscribers = useSelector((state) => state.video.subscribers);
  const session = useSelector((state) => state.video.session);
  const publisherAudio = useSelector((state) => state.video.publisherAudio);
  const publisherVideo = useSelector((state) => state.video.publisherVideo);

  const eventId = useSelector((state) => state.event.eventId);
  const currentEventId = useSelector((state) => state.event.currentEventId);



  const createSession = async (roomId, isReCreated) => {
    const request = {
      ...session_create,
      event_id: currentEventId,
      room_id: roomId,
      artist_id: roomInfo.artist_id,
      staff_ids: [Number(roomInfo.staffs) || Number(roomInfo.staffs[0].staff_id)],
      is_recreated: isReCreated
    }
    return await meetApi.createMeet(request);

  }

  const createToken = async ({ roomId, sessionInfo }) => {
    let request = {
      ...create_token,
      event_id: currentEventId,
      room_id: roomId,
      meet_id: sessionInfo.meetId,
      meet_name: sessionInfo.meetName,
      id: userInfo.id,
      // userid: userInfo.userId,
      userid: userInfo.username,
      role: userInfo.role
    }

    try {
      const response = await meetApi.joinMeet(request);
      dispatch(addConnectionInfo(response));
      return response.token;
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
    try {
      const request = {
        ...leave_meet,
        user_info: {
          id: userInfo.id.toString(),
          role: userInfo.role,
        },
        type: 'leave',
        meet_name: sessionInfo.meetName,
        connection_id: connectionInfo.meet_id,
        connection_name: connectionInfo.connection_id,
        progress_time: 100
      }
      const response = await meetApi.leaveMeet(request);

      if(response) {
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
    OV.enableProdMode();
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
    OV.enableProdMode()
    let _session = OV.initSession();

    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addSession(_session));

    let sessionInfo = {
      meetId: roomInfo.meet_id,
      meetName: roomInfo.meet_name
    }
    console.log('onlyJoin', sessionInfo)
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
      console.log('noResult onlyJoin', sessionInfo)
      dispatch(addSessionInfo(sessionInfo));

      const token = await createToken({ roomId, sessionInfo });
      await connectSession(token, _session, OV);

      return sessionInfo;
    }

  }

  const newJoinMeet = async (newSessionInfo) => {
    let OV = new OpenVidu();
    let _session = OV.initSession();
    OV.enableProdMode()
    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addSession(_session));

    let sessionInfo = {
      meetId: newSessionInfo.meetId,
      meetName: newSessionInfo.meetName
    }
    console.log('newJoinMeet', sessionInfo)
    dispatch(addSessionInfo(sessionInfo));

    const token = await createToken({ roomId: roomInfo.room_id, sessionInfo });
    await connectSession(token, _session, OV);

    return sessionInfo;
  }


  // fan이 조인할 때,
  const fanJoinSession = async ({ roomId, sessionInfo }) => {
    console.log('FAN IS JOIN')
    let OV = new OpenVidu();
    let _session = OV.initSession();
    OV.enableProdMode()
    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);
    console.log(_session)
    console.log(sessionInfo)
    dispatch(addSessionInfo(sessionInfo));
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
      resolution: '1280x720', // The resolution of your video
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

      if(subscriber.role === 'fan' || subscriber.role==='member'){
        dispatch(subscribedFanInfo(subscriber))
      }
      else if(subscriber.role === 'artist'){
        dispatch(subscribedArtistInfo(subscriber))
      }
      dispatch(addSubscribers(subscriber))
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
    publisher,
    subscribers,
    subscribedFanInfo,
    subscribedArtistInfo,
    publisherAudio,
    publisherVideo,
    audioMuteHandler,
    videoMuteHandler,
    onlyJoin,
    leaveSession,
    fanJoinSession,
    msgBeforeOut,
    joinSession,
    onbeforeunload,
    newJoinMeet,
    currentEventId
  }
};


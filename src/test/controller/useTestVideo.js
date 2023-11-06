import React from "react";
import {OpenVidu} from "openvidu-browser";
import {useDispatch, useSelector} from "react-redux";
import {
  addConnectInfo,
  addTestPublisher,
  addTestSession,
  addTestSessionInfo,
  addTestSubscriber,
  clearTestSession,
  mutePublisherAudio,
  mutePublisherVideo
} from "../../redux/modules/testSlice";
import {useNavigate} from "react-router-dom";
import {testApi} from "../data/call_test_data";
import {addAudioDevices, addVideoDevices} from "../../redux/modules/videoSlice";
import {setError, setIsError} from "../../redux/modules/errorSlice";

export const useTestVideo = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  const sessionInfo = useSelector((state) => state.test.sessionInfo);
  const connectInfo = useSelector((state) => state.test.connectInfo);
  const session = useSelector((state) => state.test.session);
  const publisher = useSelector((state) => state.test.publisher);

  let OV;

  const createTestSession = async () => {
    try {
      return await testApi.testCreate();
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  }

  const createTestToken = async (meetName) => {
    let userId = userInfo.id.toString();
    try {
      const response = await testApi.testJoin({
        meetName, userId, username:userInfo.username
      });

      dispatch(addConnectInfo(response.id))
      return response.token;
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  }

  const msgBeforeOut = async () => {
    try {
      let request = {
        meet_name: sessionInfo.meet_name,
        connection_name: connectInfo
      }
      const response = await testApi.testLeave(request);

      if(response) {
        dispatch(clearTestSession());
        session.disconnect();
        OV = null;
        navigate(-1, { replace: true });
      }
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }
  }


  //제일 처음에 session 만드는 역할(staff, artist)
  const createJoinSession = async () => {
    OV = new OpenVidu();
    OV.enableProdMode();
    let _session = OV.initSession()

    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addTestSession(_session));

    const sessionId = await createTestSession();


    let sessionData = {
      meet_name: sessionId
    };
    dispatch(addTestSessionInfo(sessionData));

    const token = await createTestToken(sessionId);
    await connectSession(token, _session, OV);

    return sessionData;

  }

  const joinTestSession = async () => {
    let OV = new OpenVidu();
    let _session = OV.initSession();
    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addTestSession(_session));

    const token = await createTestToken(sessionInfo.meetName);
    await connectSession(token, _session, OV);
  }


  const connectSession = async (token, _session, OV) => {
    _session.connect(token, userInfo)
        .then(() => connectWebCam(_session, OV))
        .catch((error) => {
          alert('There was an error connecting to the session1:', error.message);
          console.error('There was an error connecting to the session1:', error.code, error.message)
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
        dispatch(addTestPublisher(publisher));
        dispatch(addTestSession(_session));

        let devices = await OV.getDevices();

        let videoDevices = devices.filter((device) =>
            device.kind === "videoinput");
        let audioDevices = devices.filter((device) =>
            device.kind === "audioinput");

        dispatch(addVideoDevices(videoDevices));
        dispatch(addAudioDevices(audioDevices));
      })
    })
  }

  const subscribeToStreamCreated = (_session) => {
    _session.on('streamCreated', (event) => {
      let newUserData = JSON.parse(event.stream.connection.data.split("%/%")[0]);
      let subscriber = _session.subscribe(event.stream, undefined);
      subscriber["role"] = newUserData['role'];
      subscriber["id"] = newUserData['id']
      subscriber["username"] = newUserData['username'];
      dispatch(addTestSubscriber(subscriber));
    });
  }

  const subscribeToStreamDestroyed = (_session) => {
    _session.on('streamDestroyed', (event) => {
      if(userInfo.role === "fan" || userInfo.role ==="member") {
        navigate("/waitcall", { replace: true });
      } else {

      }
      dispatch(addTestSubscriber(undefined));
    });
  }


  const muteHandler = (type, currentState) => {
    //type = audio, video, currentState = true, false
    switch (type) {
      case "audio":
        publisher.publishAudio(!currentState);
        dispatch(mutePublisherAudio(!currentState));
        break;
      case "video":
        publisher.publishVideo(!currentState);
        dispatch(mutePublisherVideo(!currentState));
        break;

    }

  }


  const onbeforeunload = async () => {
    if(session){
      session.disconnect();
      OV = null;
      dispatch(clearTestSession());
    }
  }




  return {
    createJoinSession,
    msgBeforeOut,
    joinTestSession,
    muteHandler,
    onbeforeunload,
  }
};


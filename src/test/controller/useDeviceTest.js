import React, {useEffect, useState} from "react";
import {OpenVidu} from "openvidu-browser";
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { addAudioDevice, addVideoDevice, clearDeviceSession, addDeviceSessionInfo,
  addDeviceSession, addDevicePublisher, addAudioOutputDevices } from "../../redux/modules/deviceSlice";
import {testApi} from "../data/call_test_data";

export const useDeviceTest = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const sessionInfo = useSelector((state) => state.device.sessionInfo);


  // 나가기 전에 세션 관련 리덕스 정보 삭제
  const msgBeforeOut = () => {
    dispatch(clearDeviceSession());
  }

  //새로고침시 세션 관련 리덕스 정보 삭제
  const onbeforeunload = (e) => {
    e.preventDefault();
    msgBeforeOut();
    e.returnValue = "";

  };

  //뒤로가기시 리덕스 삭제
  const preventBrowserBack = () => {
    msgBeforeOut();
    navigate(-1, { replace: true });
  };


  //meet create
  const createTestSession = async () => {
    const response = await testApi.testCreate();
    return response;

  }

  //meet join
  const createTestToken = async (meetName) => {
    let userId = userInfo.id.toString();
    const response = await testApi.testJoin({ meetName, userId });
    return response.token;

  }

  // meet create -> meet join
  const createJoinSession = async () => {

    let OV = new OpenVidu();
    let _session = OV.initSession()

    subscribeToStreamCreated(_session);
    subscribeToStreamDestroyed(_session);

    dispatch(addDeviceSession(_session));

    //meet-create
    const serverSessionData = await createTestSession();

    let sessionData = {
      meetName: serverSessionData
    };

    dispatch(addDeviceSessionInfo(sessionData));

    const token = await createTestToken(serverSessionData);
    await connectSession(token, _session, OV);

    return sessionData;

  }

  const connectSession = async (token, _session, OV) => {
    _session.connect(token)
        .then(() => connectWebCam(_session, OV))
        .catch((error) => {
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

        dispatch(addDevicePublisher(publisher));
        dispatch(addDeviceSession(_session));

        let devices = await OV.getDevices();
        let videoDevices = devices.filter((device) =>
            device.kind === "videoinput");
        let audioDevices = devices.filter((device) =>
            device.kind === "audioinput");

        dispatch(addAudioDevice(audioDevices));
        dispatch(addVideoDevice(videoDevices));
      }).catch((e) => console.error(`SOMETHING WRONG WITH CONNECTED DEVICE`, e))
    })
  }

  const subscribeToStreamCreated = (_session) => {
    _session.on('streamCreated', (event) => {
    });
  }

  const subscribeToStreamDestroyed = (_session) => {
    _session.on('streamDestroyed', (event) => {
      // if(userInfo.role === "fan") {
      //     navigate("/waitcall", { replace: true });
      // }
    });
  }

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
          dispatch(addAudioOutputDevices(audioOutputDevices))
        })
        .catch(error => {
          console.error('Error enumerating audio output devices: ', error);
        });
  }, []);

  return {
    createJoinSession,
    onbeforeunload,
    preventBrowserBack,
  }
};


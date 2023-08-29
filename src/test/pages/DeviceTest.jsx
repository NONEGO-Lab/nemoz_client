import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeviceSet from "../../video/pages/DeviceSet";
import { SizeLayout, VideoLayout, SideBar } from "../../shared/Layout";
import Header from "../../shared/Header";
import { useDeviceTest } from "../controller/useDeviceTest";
import Video from "../../video/pages/Video";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../element";
import { useMediaQuery } from "react-responsive";
import { testApi } from "../data/call_test_data";
import { clearDeviceSession } from "../../redux/modules/deviceSlice";
import {setError, setIsError} from "../../redux/modules/errorSlice";

const DeviceTest = () => {

  const isMobile = useMediaQuery ({
    query : "(max-width: 600px)"
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { createJoinSession } = useDeviceTest();
  const publisher = useSelector((state) => state.device.publisher);
  const sessionInfo = useSelector((state) => state.device.sessionInfo);
  const userInfo = useSelector((state) => state.user.userInfo);
  const fanInfo = useSelector((state) => state.test.fanInfo);
  const videoDevices = useSelector((state) => state.device.videoDevices);
  const audioDevices = useSelector((state) => state.device.audioDevices);


  const endMeet = async () => {
    try {
      const response = await testApi.testEnd(sessionInfo.meetName);
      if(response) {
        dispatch(clearDeviceSession());
      } else {
        alert("미팅이 종료되지 않았습니다.");
      }
    } catch (err) {
      dispatch(setError(err));
      dispatch(setIsError(true));
    }

  }

  const outRoom = async () => {
    if(window.confirm("정말 나가시겠습니까?")){
      await endMeet();
      navigate(-1);

    }
  }

  const setDefaultDevice = () => {
    if(!localStorage.getItem("audioId")) {
      localStorage.setItem("audioId", audioDevices[0].deviceId);
    }
    if(!localStorage.getItem("videoId")) {
      localStorage.setItem("videoId", videoDevices[0].deviceId);
    }
  }

  const setDeviceHandler = async () => {
    //완료 버튼을 누르면, 장비 체크 여부 확인을 하고 연결 테스트 화면으로 넘어간다.
    setDefaultDevice();

    if(userInfo.role !== "fan") {
      localStorage.setItem("isSetDevice", "true");
      await endMeet();
      navigate(`/test/${fanInfo.fan_id}`);

    } else {
      await endMeet();
      navigate(`/test/${userInfo.id}`);


    }
  }

  useEffect(()=>{
    //meet start를 해준다. 완료할때 /meet end 를 해준다.
    createJoinSession().then((sessionInfo) => {

    })

  },[])


  if(!isMobile){
    return (
        //웹 일때 !
        <SizeLayout>
          <Header/>
          <div className="flex">
            <VideoLayout title={"A그룹 아티스트 A방"} buttonText={"나가기"} _onClick={outRoom}>
              <div className="w-[calc(100%-40px)] m-auto bg-white px-[20px]">
                <div className="flex space-between h-[480px] pt-[30px]">
                  <div className={"w-[350px] h-[350px] h-auto mr-4 flex"}>
                    {publisher !== undefined &&
                        <Video streamManager={publisher}/>}
                  </div>

                  <div className={"w-[50%] relative"}>
                    <DeviceSet/>
                    <Button
                        _onClick={setDeviceHandler}
                        width={"w-[120px]"}
                        style={"absolute right-0 bottom-6"}>
                      완료
                    </Button>
                  </div>
                </div>
              </div>
              <div
                  className="relative m-auto h-[90px] px-[20px] w-[calc(100%-40px)]
                                        bg-white border-black border-t pt-6"/>
            </VideoLayout>
            <SideBar/>
          </div>
        </SizeLayout>

    )
  } else {
    return (
        <div className="w-[100%] h-[100vh] px-[20px] pt-[40px] py-[20px] bg-gray-200">
          <div>
            {
                publisher !== undefined &&
                <Video streamManager={publisher}/>
            }
          </div>
          <DeviceSet/>
          <Button
              _onClick={setDeviceHandler}
              width={"w-[280px]"}
              color={"bg-white"}
              margin={"mt-[80px] mb-[30px] m-auto flex justify-center"}>
            완료
          </Button>
        </div>
    )
  }


};

export default DeviceTest;
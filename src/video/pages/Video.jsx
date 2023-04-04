import React, { useRef, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";


const Video = ({ streamManager }) => {

  const videoRef = useRef();

  useEffect(() => {

    if(streamManager.stream && !!videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }

  },[streamManager]);


  return (
      <Fragment>

        {
            streamManager !== undefined &&
            <video
                className={`object-contain h-[100%]`}
                autoPlay
                ref={videoRef}
            />

        }

      </Fragment>
  )


};

export default Video;
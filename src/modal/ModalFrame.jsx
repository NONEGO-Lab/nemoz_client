import React from 'react';
import {ModalPortal, ModalPortal2Depth} from './ModalPortal';


export const ModalFrame = ({ children, style }) => {
  return (
      <ModalPortal>
        <div className={"w-[100vw] h-[100vh] fixed top-0 left-0 bg-black opacity-70"}/>
        <div
            className={`absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-40 bg-white
                 ${style}`}>
          <div>
            {children}
          </div>
        </div>
      </ModalPortal>
  );
};



export const ModalFrameDepth = ({ children, style }) => {
  return (
      <ModalPortal2Depth>
        <div
            className={`absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-50 bg-white
                 ${style}`}>
          <div>
            {children}
          </div>
        </div>
      </ModalPortal2Depth>
  )
}
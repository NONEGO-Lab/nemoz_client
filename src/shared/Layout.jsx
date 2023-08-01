import React from "react";
import Header from "./Header";
import {Button} from "../element";

export const Layout = ({ children, title, buttonText, _onClick, _endClick, endText }) => {

  return (
      <div className="w-[1080px] m-auto">
        <Header/>
        <div className="bg-sky-100 h-[700px] p-[20px] relative">
          <div className="flex justify-between mb-8">
            <ContainerHeader title={title} buttonText={buttonText} _onClick={_onClick} _endClick={_endClick} endText={endText}/>
          </div>
          {children}
        </div>
      </div>
  );
};



export const SizeLayout = ({children, width, height,color, flex, justifyCenter, rounded}) => {
  return (
      <div className={`m-auto ${width} ${height} ${color} ${flex} ${justifyCenter?'justify-center':''} ${rounded}`}>
        {children}
      </div>
  );
}

export const VideoLayout2 = ({ children, title, buttonText, _onClick, _endClick }) => {
  return (
      <div className="w-[1080px] m-auto">
        <Header/>
        <div className="w-[100%] flex">
          <div className="bg-sky-100 w-[75%] h-[700px]">
            <div className="flex justify-between mb-8">
              <ContainerHeader title={title} buttonText={buttonText} _onClick={_onClick} _endClick={_endClick}/>
            </div>
            {children}
          </div>
          <div className="bg-white w-[25%] h-[700px] border-gray-200 border-2">
            <SideBar/>
          </div>
        </div>
      </div>
  );
};

export const VideoLayout = ({ children, title, buttonText, _onClick, endText, _endClick, role }) => {
  return (
      <div className="bg-sky-100 w-[75%] h-[700px]">
        <div className="flex justify-between mb-2">
          <ContainerHeader title={title} buttonText={buttonText} _onClick={_onClick}
                           _endClick={_endClick} endText={endText} role={role}/>
        </div>
        {children}
      </div>
  )
};

export const SideBar = ({children}) => {
  return (
      <div className="bg-white w-[25%] h-[700px] border-gray-200 border-2 pt-[20px]">
        {children}
      </div>
  )
}

export const ContainerHeader = ({title, buttonText, _onClick, _endClick, endText, role}) => {

  return (
      <div className="w-[100%] flex justify-between items-center h-[80px] px-[20px]">
        <div className="text-[28px]">
          {title}
        </div>
        {
            role !== "fan" &&
            <div>
              {
                  buttonText &&
                  <Button
                      _onClick={_onClick}
                      width={"w-[100px]"}
                      height={"h-[46px]"}
                      bgColor={"bg-white"}>
                    {buttonText}
                  </Button>
              }
              {
                  endText &&
                  <Button
                      _onClick={_endClick}
                      margin={"ml-4"}
                      width={"w-[100px]"}
                      height={"h-[46px]"}
                      bgColor={"bg-white"}>
                    {endText}
                  </Button>
              }
            </div>
        }
      </div>
  )
}
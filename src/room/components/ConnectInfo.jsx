import React from "react";


const ConnectInfo = ({ staffNoticeList }) => {

  return (
      <div className="text-[14px] text-gray-500 h-[50px] overflow-auto w-[290px]">
        {
          staffNoticeList.map((notice, idx) => {
            return <div key={idx}>{notice.msg}</div>
          })
        }
      </div>
  )
};

export default ConnectInfo;
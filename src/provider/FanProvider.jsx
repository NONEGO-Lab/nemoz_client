import React from "react";
import { useSelector } from "react-redux";


const FanProvider = ({ children }) => {

  const role = useSelector((state) => state.user.userInfo.role);

  return (
      <React.Fragment>
        {
          role === 'fan' ?
            <div>
              {children}
            </div>
          :
            null
        }
      </React.Fragment>
  )
}
export default FanProvider;
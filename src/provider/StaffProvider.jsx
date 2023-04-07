import React from "react";
import { useSelector } from "react-redux";


const StaffProvider = ({ children }) => {

  const role = useSelector((state) => state.user.userInfo.role);

  return (
      <React.Fragment>
        {
          role === 'staff' ?
              <div>
                {children}
              </div>
              :
              null
        }
      </React.Fragment>
  )
}
export default StaffProvider;
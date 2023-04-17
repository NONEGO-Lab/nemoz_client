import React, { Fragment } from "react";
import { useSelector } from "react-redux";


const StaffProvider = ({ children }) => {

  const role = useSelector((state) => state.user.userInfo.role);

  if (role === 'staff')
    return <Fragment>{children}</Fragment>
}

export default StaffProvider;
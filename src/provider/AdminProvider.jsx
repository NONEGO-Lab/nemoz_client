import React, { Fragment } from "react";
import { useSelector } from "react-redux";


const AdminProvider = ({ children }) => {

  const role = useSelector((state) => state.user.userInfo.role);

  if(role !== 'fan')
    return <Fragment>{children}</Fragment>
}
export default AdminProvider;
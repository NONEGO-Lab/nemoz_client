import React, { Fragment } from "react";
import { useSelector } from "react-redux";


const StaffProvider = ( {role, children }) => {



  if (role === 'staff')
    return <Fragment>{children}</Fragment>
}

export default StaffProvider;
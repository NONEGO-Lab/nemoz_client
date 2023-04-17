import React, { Fragment } from "react";
import { useSelector } from "react-redux";


const ArtistProvider = ({ children }) => {

  const role = useSelector((state) => state.user.userInfo.role);

  if(role === 'artist')
  return <Fragment>{children}</Fragment>

}
export default ArtistProvider;
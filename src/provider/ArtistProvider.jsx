import React, { Fragment } from "react";
import { useSelector } from "react-redux";


const ArtistProvider = ( {role,  children }) => {


  if(role === 'artist')
  return <Fragment>{children}</Fragment>

}
export default ArtistProvider;
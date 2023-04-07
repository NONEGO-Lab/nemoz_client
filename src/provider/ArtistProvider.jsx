import React from "react";
import { useSelector } from "react-redux";


const ArtistProvider = ({ children }) => {

  const role = useSelector((state) => state.user.userInfo.role);

  return (
      <React.Fragment>
        {
          role === 'artist' ?
              <div>
                {children}
              </div>
              :
              null
        }
      </React.Fragment>
  )
}
export default ArtistProvider;
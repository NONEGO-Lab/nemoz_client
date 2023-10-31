import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  eventId: null,
  roomInfo: {},
  sessionInfo: {},
  connectionInfo: {},
  addFanModalToggle:null
}


export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    addRoomInfo: (state, action) => {
      state.roomInfo = action.payload;
    },
    addSessionInfo: (state, action) => {
      state.sessionInfo = {...state.sessionInfo, ...action.payload};
    },
    addConnectionInfo: (state, action) => {
      state.connectionInfo = action.payload;
    },
    clearSessionInfo: (state, action) => {
      state.sessionInfo = {};
      state.roomInfo = {};
    },
    addFanModalToggle: (state, action) => {
      state.addFanModalToggle = action.payload;
    },
    commonReset: () => initialState
  }
});

export const { clearSessionInfo, addRoomInfo, addSessionInfo,
  addConnectionInfo, commonReset, addFanModalToggle } = commonSlice.actions

export default commonSlice.reducer
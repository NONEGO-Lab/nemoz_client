import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sessionInfo: {},
  publisher: undefined,
  session: undefined,
  audioDevices: [],
  videoDevices: [],
}


export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    addDeviceSessionInfo: (state, action) => {
      state.sessionInfo = action.payload;
    },
    addDevicePublisher: (state, action) => {
      state.publisher = action.payload;
    },
    addDeviceSession: (state, action) => {
      state.session = action.payload;
    },
    clearDeviceSession: (state, action) => {
      state.sessionInfo = {};
      state.publisher = undefined;
      state.session = undefined;
    },
    addAudioDevice: (state, action) => {
      state.audioDevices = action.payload;
    },
    addVideoDevice: (state, action) => {
      state.videoDevices = action.payload;
    }
  }
});

export const { addDeviceSessionInfo, addDevicePublisher, addDeviceSession,
  clearDeviceSession, addAudioDevice, addVideoDevice } = deviceSlice.actions

export default deviceSlice.reducer
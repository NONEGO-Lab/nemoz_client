import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sessionInfo: {},
  publisher: undefined,
  session: undefined,
  audioDevices: [],
  videoDevices: [],
  audioOutputDevices:[],
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
    },
    addAudioOutputDevices: (state, action) => {
      state.audioOutputDevices = action.payload.map(audioOutpt =>({label: audioOutpt.label, deviceId: audioOutpt.deviceId}) )
    },
  }
});

export const { addDeviceSessionInfo, addDevicePublisher, addDeviceSession,
  clearDeviceSession, addAudioDevice, addVideoDevice, addAudioOutputDevices } = deviceSlice.actions

export default deviceSlice.reducer
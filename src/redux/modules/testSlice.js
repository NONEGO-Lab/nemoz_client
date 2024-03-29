import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  sessionInfo: {},
  fanInfo: {},
  connectInfo: "",
  publisher: undefined,
  subscriber: undefined,
  session: undefined,
  publisherAudio: true,
  publisherVideo: true,
  subscriberAudio: true,
  subscriberVideo: true,
  publisherLoading: true,
  subscriberLoading: true,
  toggleDeviceSetting: false,
}


export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    addTestSessionInfo: (state, action) => {
      state.sessionInfo = action.payload;
    },
    addConnectInfo: (state, action) => {
      state.connectInfo = action.payload;
    },
    addTestFanInfo: (state, action) => {
      state.fanInfo = action.payload;
    },
    addTestPublisher: (state, action) => {
      state.publisher = action.payload;
      state.subscriberLoading = false
    },
    addTestSubscriber: (state, action) => {
      state.subscriber = action.payload;
      state.publisherLoading = false
    },
    addTestSession: (state, action) => {
      state.session = action.payload;
    },
    toggleDeviceSettingModal : (state, action) =>{
      state.toggleDeviceSetting = action.payload
    },
    mutePublisherAudio: (state, action) => {
      state.publisherAudio = action.payload;
    },
    mutePublisherVideo: (state, action) => {
      state.publisherVideo = action.payload;
    },
    muteSubscriberAudio: (state, action) => {
      state.publisherAudio = action.payload;
    },
    muteSubscriberVideo: (state, action) => {
      state.publisherVideo = action.payload;
    },
    clearTestSession: () => initialState,
  }
});

export const { addTestSessionInfo, addConnectInfo, addTestFanInfo, clearTestSession, addTestPublisher,
  addTestSubscriber, addTestSession, mutePublisherAudio, mutePublisherVideo, toggleDeviceSettingModal } = testSlice.actions

export default testSlice.reducer
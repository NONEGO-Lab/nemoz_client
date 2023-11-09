import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  subscribers: [],
  publisher: undefined,
  session: undefined,
  videoDevices: ["비디오 장비 없음"],
  audioDevices: ["오디오 장비 없음"],
  isConnectTestComplete: false,
  isCallFinished: false,
  publisherAudio: true,
  publisherVideo: true,
  timer: 0,
  subscribedFanInfo: undefined,
  subscribedArtistInfo: undefined,
  isFanLoading: false,
  isArtistLoading: true,
  rotateFanScreen:false,
}


export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    addPublisher: (state, action) => {
      state.publisher = action.payload;
    },
    addSession: (state, action) => {
      state.session = action.payload
    },
    addSubscribers: (state, action) => {
      if(state.subscribers.length <= 1) {
        state.subscribers = [...state.subscribers, action.payload]
      }
    },
    subscribedFanInfo:(state, action) =>{
      state.subscribedFanInfo = action.payload
    },
    subscribedArtistInfo:(state, action) =>{
      state.subscribedArtistInfo = action.payload
    },
    isArtistLoading:(state, action) =>{
      state.isArtistLoading = action.payload
    },
    deleteSubscribers: (state, action) => {
      state.subscribers = state.subscribers.filter((sub) => sub.stream.streamId !== action.payload);
    },
    addVideoDevices: (state, action) => {
      state.videoDevices = action.payload
    },
    addAudioDevices: (state, action) => {
      state.audioDevices = action.payload;
    },
    mutePublisherAudio: (state, action) => {
      state.publisherAudio = action.payload;
    },
    mutePublisherVideo: (state, action) => {
      state.publisherVideo = action.payload;
    },
    disconnectSession: (state, action) => {
      state.session && state.session.disconnect();
    },
    clearSession: (state, action) => {
      state.publisher = undefined;
      state.session = undefined;
      state.subscribers = [];
      state.sessionId = "";
      state.videoDevices = [];
      state.audioDevices = [];
    },

    //timer가 여기에 오는게 맞는지?
    addTimer: (state, action) => {
      state.timer = action.payload;
    },

    // 이 두개의 상태값을 합칠 수 있을 것 같다. fan의 연결테스트 전, 후, 영상통화 끝났을 때
    setIsCallFinished: (state, action) => {
      state.isCallFinished = true;
    },

    setConnectTest: (state, action) => {
      state.isConnectTestComplete = true;
    },
    toggleRotateFan:(state, action)=>{
      state.rotateFanScreen = action.payload
    },

    videoReset: () => initialState,
  }
});

export const { addPublisher, addSession, addSubscribers, clearSession, addTimer, videoReset,
  mutePublisherAudio, mutePublisherVideo, deleteSubscribers, addVideoDevices,
  addAudioDevices, setConnectTest, disconnectSession, setIsCallFinished,
  subscribedFanInfo,
  subscribedArtistInfo,isFanLoading,isArtistLoading, addAudioOutputDevices, toggleRotateFan } = videoSlice.actions

export default videoSlice.reducer
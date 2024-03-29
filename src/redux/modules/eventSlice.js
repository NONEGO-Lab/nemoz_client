import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  eventName: "",
  eventId: null,
  fanIds: [],
  artistIds: [],
  staffIds: [],
  creatorInfo: {},
  eventList : null,
  currentEventId:null,
}


export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEventInfo: (state, action) => {
      state.eventName = action.payload.event_name||action.payload.title;
      // state.eventId = action.payload.event_id;
      state.fanIds = action.payload.target_fan_ids;
      state.artistIds = action.payload.target_artist_ids;
      state.staffIds = action.payload.target_staff_ids;
      state.creatorInfo = action.payload.creator_info[0];
    },
    setEventIds: (state, action) =>{
      state.eventId = action.payload.event_id;
    },
    currentEvent: (state, action) =>{
      state.currentEventId = action.payload
    },
    addEventList: (state, action) =>{
      state.eventList = action.payload.eventList
    },
    addEventName: (state, action) =>{
      state.eventName = action.payload
    },
  }
});

export const { addEventInfo, setEventIds, addEventList, currentEvent , addEventName} = eventSlice.actions

export default eventSlice.reducer
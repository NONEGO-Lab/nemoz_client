import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  eventName: "",
  eventId: null,
  fanIds: [],
  artistIds: [],
  staffIds: [],
  creatorInfo: {}
}


export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    addEventInfo: (state, action) => {
      state.eventName = action.payload.event_name;
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

      state.currentEventId = action.payload.event_id
    }
  }
});

export const { addEventInfo, setEventIds } = eventSlice.actions

export default eventSlice.reducer
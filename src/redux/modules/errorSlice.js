import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  error: null,
  isError: false
}


export const errorSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsError: (state, action) => {
      state.isError = action.payload;
    },
  }
});

export const { setError, setIsError } = errorSlice.actions

export default errorSlice.reducer
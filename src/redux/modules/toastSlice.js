import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

const initialState = {
  toastList: [],
  count: 0,
}

const wait = (delay) => new Promise ((resolve) => {
  setTimeout(resolve, delay);
  clearTimeout(resolve);
});

export const deleteToastAfter3s = createAsyncThunk(
    'toast/delete',
    async (id, thunkAPI) => {
      try {
        await wait(3000);
        return thunkAPI.fulfillWithValue(id);
      } catch (err) {
        return thunkAPI.rejectWithValue(err);
      }
    }
);

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      if(state.toastList.find((toast) => toast.id === action.payload) === undefined) {
        state.toastList = [...state.toastList, action.payload];
      }

    },
    deleteToast: (state, action) => {
      state.toastList = state.toastList.filter((toast) => toast.id !== action.payload);
    },
    clearToast: (state, action) => {
      state.toastList = [];
    }
  },
  extraReducers: {
    [deleteToastAfter3s.fulfilled]: (state, action) => {
      state.toastList = state.toastList.filter((toast) => toast.id !== action.payload);
    }
  }
});

export const { addToast, deleteToast, clearToast } = toastSlice.actions

export default toastSlice.reducer
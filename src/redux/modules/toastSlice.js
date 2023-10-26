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
      state.toastList = [...state.toastList, action.payload];
    },
    removeToast:(state, action) =>{
      state.toastList = state.toastList.filter((toast) => toast.msg.unique_id !== action.payload);
    },
    deleteToast: (state, action) => {
      state.toastList = state.toastList.slice(1)
    },
    clearToast: (state, action) => {
      state.toastList = [];
    }
  },
  extraReducers: {
    [deleteToastAfter3s.fulfilled]: (state, action) => {
      // state.toastList = state.toastList.filter((toast) => toast.id !== action.payload);
      state.toastList = state.toastList.slice(1)
    }
  }
});

export const { addToast, deleteToast, clearToast , removeToast} = toastSlice.actions

export default toastSlice.reducer
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from "../../auth/data/user_data";
import {user_common} from "../../model/user/common";


const initialState = {
  userInfo: {...user_common},
  error: null,
  isLogin: false
}


export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (userInfo, thunkAPI) => {
      try {
        const response = await userApi.login(userInfo);
        return thunkAPI.fulfillWithValue(response);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
      }
    }
);


export const loginCheck = createAsyncThunk(
    "user/loginCheck",
    async ( _ ,thunkAPI) => {
      try {
        const response = await userApi.isLogin();
        return thunkAPI.fulfillWithValue(response);
      } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
      }
    }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.userInfo = {};
      localStorage.removeItem("auth");
      sessionStorage.clear()
      state.isLogin = false;
    },
    updateUserTestValue: (state, action) => {
      state.userInfo = { ...state.userInfo, isCallTested: true }
    }
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      // localStorage.setItem("auth", action.payload.accessToken);
      sessionStorage.setItem("auth", action.payload.accessToken)
      delete action.payload.accessToken;
      state.userInfo = action.payload;

    },
    [loginUser.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [loginCheck.fulfilled]: (state, action) => {
      if(action.payload.errMsg) {
        state.error = action.payload.errMsg;
        return;
      }

      state.userInfo = action.payload;
      state.isLogin = true;
    },
    [loginCheck.rejected]: (state, action) => {
      state.error = action.payload.errMsg;
    }

  }
});

export const { logout } = userSlice.actions

export default userSlice.reducer

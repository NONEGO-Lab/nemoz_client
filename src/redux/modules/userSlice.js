import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from "../../auth/data/user_data";


const initialState = {
  userInfo: {
    company: "",
    id: undefined,
    role: undefined,
    userId: undefined,
    username: "",
    isCallTested: false
  },
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
        return thunkAPI.rejectWithValue(err.response.data);
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
      state.isLogin = false;
    },
    updateUserTestValue: (state, action) => {
      state.userInfo = {...state.userInfo, isCallTested: true}
    }
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      let userInfo = {
        company: action.payload.company,
        id: action.payload.id,
        role: action.payload.role,
        userId: action.payload.userid,
        username: action.payload.username
      }
      state.userInfo = userInfo;
      localStorage.setItem("auth", action.payload.token);
    },
    [loginUser.rejected]: (state, action) => {
      state.error = action.payload.errMsg;
    },
    [loginCheck.fulfilled]: (state, action) => {
      if(action.payload.errMsg) {
        state.error = action.payload.errMsg;
        return;
      }
      let userInfo = {
        company: action.payload.company_name,
        id: action.payload.id,
        role: action.payload.role,
        userId: action.payload.userid,
        username: action.payload.username,
        isCallTested: action.payload.is_tested !== 0,
      }
      state.userInfo = userInfo;
      state.isLogin = true;
    },
    [loginCheck.rejected]: (state, action) => {
      state.error = action.payload.errMsg;
    }

  }
});

export const { logout } = userSlice.actions

export default userSlice.reducer

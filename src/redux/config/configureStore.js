import { configureStore } from '@reduxjs/toolkit';
import user from "../modules/userSlice";
import video from "../modules/videoSlice";
import toast from "../modules/toastSlice";
import common from "../modules/commonSlice";
import test from "../modules/testSlice";
import device from "../modules/deviceSlice";
import error from "../modules/errorSlice";
import event from "../modules/eventSlice";


export const store = configureStore({
  reducer: {
    user,
    video,
    toast,
    common,
    test,
    device,
    error,
    event
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
  devTools: process.env.NODE_ENV !== "production"
});
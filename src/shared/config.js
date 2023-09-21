import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_NEMOZ_API_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Headers": "*",
  },
})

instance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("auth");
  if(accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if(error.response.status === 401) {
    console.log("response 401 error");
  }
  return Promise.reject(error);
});
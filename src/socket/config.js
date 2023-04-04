import { io } from "socket.io-client";

const socketUrl = process.env.REACT_APP_NEMOZ_SOCK_URL;

export const sock = io(socketUrl);
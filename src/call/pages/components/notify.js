// import {toast} from "react-toastify";
//
//
// export const notify = (info, type) => {
//
//   switch (type) {
//     case "leave":
//       return  toast(`${info}님이 나가셨습니다.`);
//     case "time":
//       console.log('time', info)
//       return toast.custom((t) =>
//           <div className={"bg-red w-[200px] h-[200px]"}>
//             통화가 {info}초 {t}남았습니다.
//           </div>);
//     case "warn":
//       return toast(info)
//     case "in":
//       return toast(`${info}님이 연결되었습니다.`);
//     default:
//   }
// }
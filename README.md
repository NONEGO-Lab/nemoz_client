# Nemoz Lab
​
​
## 배포방법
- 로컬에서 프론트 확인 방법
  ​
  ​
1. 패키지 설치
   ```yarn install ```
   ​
   +) 별도 전달한 .env를 프로젝트 루트 경로 (package.json 위치와 동일한 위치)에 넣을 것
2. 실행
   ```yarn start```
   ​
3. 배포방법
   ```yarn build```
   ​
   이후 build 폴더 내 빌드 결과물을 정적 호스팅한 s3로 업로드
   ​
## 폴더구조

### `call`
팬-아티스트 영상통화(테스트 포함)

### `video`
비디오 화면

### `room`
만들어진 영상 통화 방

### `event`
이벤트 관리

### `fans`
참여자 목록

### `auth`
로그인, 회원가입
​
```nemoz_pts
├── public
└── src
    ├── App.js
    ├── auth
    │    ├── controller
    │    │    └── authController.js 
    │    ├── data
    │    │    └── user_data.js (로그인 API 관련)
    │    └── pages
    │          └── LoginView.jsx (로그인 뷰)
    ├── call (영상통화 관련 폴더)
    │    ├── controller
    │    │   ├── callController.js 
    │    │   └── hooks
    │    │       ├── useInterval.jsx 
    │    │       ├── useMobileView.js
    │    │       └── useVideo.js
    │    ├── data
    │    │   └── call_data.js
    │    └── pages
    │        ├── TmpVideoContainer.jsx (테스트 영상 통화 뷰)
    │        ├── VideoContainer.jsx (메인 영상 통화 뷰)
    │        └── components
    │            ├── AddUser.jsx
    │            ├── MainCallUtil.jsx
    │            ├── Settingbar.jsx
    │            ├── StaffVideoArea.jsx
    │            ├── TestCallUtil.jsx
    │            ├── TestVideoArea.jsx
    │            ├── Timer.jsx
    │            ├── VideoArea.jsx
    │            ├── VideoContainer2.jsx
    │            ├── WaitingList.jsx
    │            └── index.js
    ├── common
    │    ├── InnerCircleText.jsx
    │    └── imoticon_path.js
    ├── element
    │    ├── Button.jsx
    │    ├── DeviceSelect.jsx
    │    ├── Input.jsx
    │    ├── InputTime.jsx
    │    ├── Select.jsx
    │    └── index.js
    ├── event
    │    ├── controller
    │    │   └── eventListController.js
    │    ├── data
    │    │   └── event_data.js
    │    └── pages
    │        ├── EventListView.jsx
    │        └── components
    ├── fans
    │    ├── controller
    │    │   ├── participantController.js
    │    │   └── waitRoomController.js
    │    ├── data
    │    │   └── attendee_data.js
    │    └── pages
    │        ├── ParticipantListView.jsx
    │        ├── WaitingRoom.jsx
    │        └── components
    │            ├── FanDetail.jsx
    │            ├── FanInfo.jsx
    │            ├── MobileHeader.jsx
    │            └── WaitingMents.jsx
    ├── index.css
    ├── index.js
    ├── modal
    │    ├── ModalFrame.jsx
    │    └── ModalPortal.jsx
    ├── model
    │    ├── auth
    │    │   └── auth_model.js
    │    ├── call
    │    │   └── call_model.js
    │    ├── event
    │    │   └── event_model.js
    │    ├── reaction
    │    │   └── reaction_model.js
    │    ├── room
    │    │   └── room_model.js
    │    ├── test
    │    │   └── call_test_model.js
    │    ├── user
    │    │   ├── common.js
    │    │   └── user_detail
    │    │       ├── artist.js
    │    │       ├── fan.js
    │    │       └── staff.js
    │    └── video
    │        └── video_model.js
    ├── provider
    │    ├── AdminProvider.jsx
    │    ├── ArtistProvider.jsx
    │    ├── FanProvider.jsx
    │    ├── StaffProvider.jsx
    │    └── index.js
    ├── reaction
    │    ├── controller
    │    │   └── useReaction.js
    │    └── pages
    │        └── components
    │            ├── ReactionBoard.jsx
    │            ├── ToastMessage.jsx
    │            └── index.js
    ├── redux
    │    ├── config
    │    │   └── configureStore.js
    │    └── modules
    │        ├── commonSlice.js
    │        ├── deviceSlice.js
    │        ├── errorSlice.js
    │        ├── eventSlice.js
    │        ├── testSlice.js
    │        ├── toastSlice.js
    │        ├── userSlice.js
    │        └── videoSlice.js
    ├── room
    │    ├── components
    │    │   ├── CallControl.jsx
    │    │   ├── ConnectControl.jsx
    │    │   ├── ConnectControl2.jsx
    │    │   ├── ConnectInfo.jsx
    │    │   └── CreateRoom.jsx
    │    ├── controller
    │    │   └── roomListController.js
    │    ├── data
    │    │   └── room_data.js
    │    └── pages
    │        └── RoomListView.jsx
    ├── shared
    │    ├── Auth.jsx
    │    ├── DropDown.jsx
    │    ├── ErrorBoundary.jsx
    │    ├── ErrorFallback.jsx
    │    ├── Header.jsx
    │    ├── Layout.jsx
    │    ├── MobileHeader.jsx
    │    ├── MobilePopup.jsx
    │    ├── MobileToast.jsx
    │    ├── Toast.jsx
    │    ├── config.js
    │    ├── constants
    │    │   └── ERRORS.js
    │    ├── controller
    │    └── router
    │        └── Router.jsx
    ├── socket
    │    ├── config.js
    │    ├── events
    │    │   ├── fan_event.js
    │    │   ├── test_event.js
    │    │   └── video_event.js
    │    └── useSocket.js
    ├── static
    │    └── image
    │        └── dots.png
    ├── test
    │    ├── controller
    │    │   ├── useDeviceTest.js
    │    │   └── useTestVideo.js
    │    ├── data
    │    │   └── call_test_data.js
    │    └── pages
    │        ├── DeviceSetting.jsx
    │        ├── DeviceTest.jsx
    │        └── MobileDeviceSetting.jsx
    ├── utils
    │    ├── convert.js
    │    └── index.js
    └── video
        └── pages
            ├── DeviceSet.jsx
            ├── Video.jsx
            ├── Video2.jsx
            └── VideoForMobile.jsx
```
​
-   각 image와 icons은 public/images 폴더에서 관리합니다.

## Router
​
> Root Router
​
-   로그인 뷰를 제외한 모든 path에 접근하기 위해서는 로그인을 해야만 합니다.
    ​
```Router.jsx
//Router.jsx
<ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginView/>}/>
            <Route path="/devicetest" element={<Auth><DeviceTest/></Auth>}/>
            ...
            <Route path="/test/:id" element={<Auth><TmpVideoContainer/></Auth>}/>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
```
```Router.jsx
//Auth.jsx
  useEffect(()=> {
    dispatch(loginCheck()).then((response) => {
      if(response.meta.requestStatus === "fulfilled") {
        setIsAuth(true);
      } else {
        setIsAuth(false);
        alert("로그인한 유저만 접근 가능합니다.");
        navigate("/", { replace: true });
      }
    })
  }, [])
  ...
```
​
<br/>
​
> PublicRouter
​
```
<Switch>
    <Route path="/login" exact component={Login} />
</Switch>
```
​
<br/>
​
## 전역 상태 관리
​
[Redux-Toolkit](https://redux-toolkit.js.org/)
​
-   redux-toolkit 사용
-   공통으로 사용되는 데이터는 commonSlice에서 관리합니다.
-   각 파일명에 해당하는 전역데이터를 관리합니다.

    ​
```
redux
  ├── config
  │       └── configureStore.js
  └── modules
          ├── commonSlice.js
          ├── deviceSlice.js
          ├── errorSlice.js
          ├── eventSlice.js
          ├── testSlice.js
          ├── toastSlice.js
          ├── userSlice.js
          └── videoSlice.js
```
​
<br/>
​
## 스타일
​
[tailwindcss docs](https://tailwindcss.com/)
​
-   styles 폴더 내에서 관리
-   tailwindcss or css 사용
-   기본적으로 각 엘리먼트에 바로 tailwindcss 사용
    ​
    <br/>
    ​
## API
​
```
path
├── data
        └── path_data.js
```
​
-   각 기능별 data 디렉토리 안에 위치해있습니다.
-   기본적으로 기능_data.js 파일을 사용합니다.
-   api 요청은 해당 컴포넌트 or Router 컴포넌트에서 async await 구문을 이용합니다.
-   axios 기본설정은 shared/instance 에 있습니다.
    ​
    <br/>
    ​
## API 요청, 전역상태관리 라이브러리에 저장
​
1. api 요청 함수생성
   ​
```
//api/sth_data.js
​
export const example = {
    getData: () => axios.get('url')
}
```
​
2. 컨트롤러에서 api 불러오기
   ​
```
//MyController.jsx
export {exampleAPI} from "../data/example_data"
​
const  myController = async () => {
    try{
        const response = await exampleAPI.sthFunc(request);
        if(response){
            ...
        }
    }catch{
    }
   return{
    myController
   } 
```
​
3. redux store 생성
   ​
```
//redux/module
import { createSlice } from '@reduxjs/toolkit'
​
const initial_state = {
    result:[]
}
​
export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
  }
});
```
​
4. example store에 저장 및 호출
   ​
```
//MyController.jsx
import {exampleAPI} from "../data/example_data"
import {useDispatch, useSelector} from "react-redux";
​
const  myController = async () => {
    const exampleRedux = useSelector((state) => state.exampleRedux.example);
    import {sth} from "../../redux/modules/exampleSlice";
    try{
        const response = await exampleAPI.sthFunc(request);
        if(response){
            ...
            dispatch(sth(response))
        }
    }catch{
    }
   return{
    myController
   } 
```
​
<br/>
​
## 에러처리
​
> 컴포넌트 에러
​
ErrorBoundary로 처리 <br/>
providers/App.js 파일 확인해주세요.
​
<br/>
​
> api 에러
​
axios.interceptors 로 처리 <br/>

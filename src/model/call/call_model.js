
export const session_info = {
  meet_id: null,
  meet_name: null
}


export const connection_info = {
  meet_id: null,
  connection_id: null,
  token: null,
}


export const session_create = {
  event_id: null,
  room_id: null,
  artist_id: null,
  staff_ids: null,
  is_recreated: null
}

export const create_token = {
  event_id: null,
  room_id: null,
  meet_id: null,
  meet_name: null,
  id: null,
  userid: null,
  username: null,
  role: null
}

export const leave_meet = {
  user_info: {
    id: null,
    role: null,
  },
  type: 'leave',
  meet_name: null,
  connection_id: null,
  connection_name: null,
  progress_time: null
}

export const end_meet = {
  meet_id: null,
  meet_name: null,
  room_id: null,
  event_id: null,
  fan_id: null
}



// Todo: 추후에는 함수로 바꿔야 함

// export const session_create2 = (p1, p2, p3) => {

  // if(p1 === null) return;
  // try / catch
  // model_error를 만들어 준다.
// }




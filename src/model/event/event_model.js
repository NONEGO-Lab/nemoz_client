import { user_common } from "../user/common";


// 🔶 전역 정보
export const event_info = {
  event_id: null,
  event_staff_ids: [],
  event_fan_ids: [],
  event_artist_ids: []
};


// 🔶request
export const get_event_params = {
  page_size: 20,
  current_page: 1,
  event_id: null
}

export const req_event_detail = {
  page: null,
  event_id: null
}

export const create_event = {
  id: null,
  event_name: null,
  target_artist_ids: [],
  target_staff_ids: [],
  target_fan_ids: [],
  creator: null,
  due_dt: null
}


// 🔶response

const res_event_detail = {
  event_id: null,
  event_name: null,
  target_artist_ids: [
    {
      ...user_common
    }
  ],
  target_fan_ids: [
    {
      ...user_common
    }
  ],
  creator_info: {
    ...user_common
  },
  create_dt: null,
  update_dt: null
}

















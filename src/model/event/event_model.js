import { user_common } from "../user/common";


// Fixme: id가 event_id로 오면 event_detail 하나로만 쓸 수 있음.
export const event_req = {
  id: null,
  event_name: null,
  target_artist_ids: [],
  target_staff_ids: [],
  target_fan_ids: [],
  creator: null,
  due_dt: null
}

export const event_detail = {
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
  update_dt: null,
  due_dt: null,
}

















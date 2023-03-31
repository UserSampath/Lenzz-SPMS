import {
  TIMELINE_LIST_REQUEST,
  TIMELINE_LIST_SUCCESS,
  TIMELINE_LIST_FAIL,
} from "../constants/timeLineContants";
import axios from "axios";

export const listTimelines = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TIMELINE_LIST_REQUEST,
    });
  } catch (error) {}
};

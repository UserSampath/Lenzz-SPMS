import { combineReducers } from "redux";
import listsReducer from "./listsAndCardReducer";

export default combineReducers({
  lists: listsReducer
});

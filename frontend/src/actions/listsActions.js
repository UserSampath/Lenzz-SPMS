import { CONSTANTS } from "../actions";

export const addList = (title,_id) => {
  return {
    type: CONSTANTS.ADD_LIST,
    payload: { title,_id}
  };
};

export const initialValue = (data) => {
  return {
    type: CONSTANTS.INITIAL_VALUE,
    payload: data
  };
};

export const deleteList = (listId) => {
  return {
    type: CONSTANTS.DELETE_LIST,
    payload: {listId }
  };
}

export const renameList = (data) => {
  return {
    type: CONSTANTS.RENAME_LIST,
    payload: { data }
  };
}


export const sort = (
  droppableIdStart,
  droppableIdEnd,
  droppableIndexStart,
  droppableIndexEnd,
  draggableId,
  type
) => {
  return {
    type: CONSTANTS.DRAG_HAPPENED,
    payload: {
      droppableIdStart,
      droppableIdEnd,
      droppableIndexStart,
      droppableIndexEnd,
      draggableId,
      type
    }
  };
};

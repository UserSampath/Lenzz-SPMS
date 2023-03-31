import { CONSTANTS } from "../actions";

export const addCard = (data) => {
  return {
    type: CONSTANTS.ADD_CARD,
    payload: { data },
  };
};

export const deleteAttachment = (data) => {
  return {
    type: CONSTANTS.DELETE_ATTACHMENT,
    payload: { data },
  };
};

export const deleteCard = (_id, listId) => {
  return {
    type: CONSTANTS.DELETE_CARD,
    payload: { _id, listId },
  };
};

export const updateOneTask = (data) => {
  return {
    type: CONSTANTS.UPDATE_ONE_TASK,
    payload: { data },
  };
};

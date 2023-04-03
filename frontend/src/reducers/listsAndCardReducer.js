import { CONSTANTS } from "../actions";
import axios from "axios";

const initialState = [];
const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.ADD_LIST:
      const newList = {
        title: action.payload.title,
        cards: [],
        _id: action.payload._id,
      };
      return [...state, newList];
    case CONSTANTS.ADD_CARD: {
      const {
        _id,
        progressStage_id,
        name,
        flag,
        assign,
        reporter,
        link,
        startDate,
        endDate,
        description,
        files,

      } = action.payload.data;
      const newCard = {
        _id,
        name,
        flag,
        assign,
        reporter,
        link,
        startDate,
        endDate,
        description,
        files

      };
      const newState = state.map(list => {
        if (list._id === progressStage_id) {
          return {
            ...list,
            cards: [...list.cards, newCard]
          };
        } else {
          return list;
        }
      });
      return newState;
    }
    case CONSTANTS.DELETE_CARD: {
      const idInfo = {
        _id: action.payload._id,
        listId: action.payload.listId
      }
      const newState = state.map(list => {
        if (list._id === idInfo.listId) {
          return {
            ...list,
            cards: list.cards.filter(card => card._id !== idInfo._id)
          };
        } else {
          return list;
        }
      });
      return newState;
    }

    case CONSTANTS.DELETE_ATTACHMENT: {
      const { listId, cardId, attachmentId } = action.payload.data;
      const newState = state.map((list) => {
        if (list._id === listId) {
          return {
            ...list,
            cards: list.cards.map((card) => {
              if (card._id === cardId) {
                return {
                  ...card,
                  files: card.files.filter((file) => file._id !== attachmentId)
                };
              }
              return card;
            })
          };
        }
        return list;
      });
      return newState
    }


    case CONSTANTS.DELETE_LIST: {
      const listId = action.payload.listId;
      const newState = state.filter(list => list._id !== listId);
      return newState;
    }
    case CONSTANTS.RENAME_LIST: {
      const { listId, listTitle } = action.payload.data;
      const newState = state.map(list => {
        if (list._id === listId) {
          list.title = listTitle;
        }
        return list;
      })
      return newState;
    }

    case CONSTANTS.INITIAL_VALUE: {
      return action.payload;
    }

    case CONSTANTS.UPDATE_ONE_TASK: {
      const {
        _id,
        progressStage_id,
        name,
        flag,
        assign,
        reporter,
        link,
        startDate,
        endDate,
        description,
        files
      } = action.payload.data;
      const newState = state.map(list => {
        if (list._id === progressStage_id) {
          const updatedCards = list.cards.map(card => {
            if (card._id === _id) {
              return {
                ...card,
                name,
                flag,
                assign,
                reporter,
                link,
                startDate,
                endDate,
                description,
                files
              }
            } else {
              return card;
            }

          });
          return {
            ...list,
            cards: updatedCards,
          };
        } else {
          return list;
        }
      });
      return newState;
    }

    case CONSTANTS.DRAG_HAPPENED:
      const {
        droppableIdStart,
        droppableIdEnd,
        droppableIndexEnd,
        droppableIndexStart,
        // draggableId,
        type
      } = action.payload;
      const newState = [...state];
      console.log(type);
      if (type === "list") {
        const list = newState.splice(droppableIndexStart, 1);
        newState.splice(droppableIndexEnd, 0, ...list);
        const temp2 = { droppableIndexStart, droppableIndexEnd }
        const fetchTasks = async () => {
          await axios.put("http://localhost:4000/moveList", temp2).then(res => {
          }).catch(err => { console.log(err) })
        }
        fetchTasks();
        return newState;
      }
      //  same list
      if (droppableIdStart === droppableIdEnd) {
        const list = state.find(list => droppableIdStart === list._id);
        const card = list.cards.splice(droppableIndexStart, 1);
        list.cards.splice(droppableIndexEnd, 0, ...card);

        const temp = { droppableIndexStart, droppableIndexEnd, list }
        const fetchTasks = async () => {
          await axios.put("http://localhost:4000/moveCardSameList", temp).then(res => {
          }).catch(err => { console.log(err) })
        }
        fetchTasks();
      }

      // other list
      if (droppableIdStart !== droppableIdEnd) {
        // find the list drag happened
        const listStart = state.find(list => droppableIdStart === list._id);
        // pull out the card from this list
        const card = listStart.cards.splice(droppableIndexStart, 1);
        // find the list where drag ended
        const listEnd = state.find(list => droppableIdEnd === list._id);
        // put the card in the new list
        listEnd.cards.splice(droppableIndexEnd, 0, ...card);
        const temp3 = { droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd, cardId: card[0]._id, }
        const fetchTasks = async () => {
          await axios.put("http://localhost:4000/moveCardsAcrossStages", temp3).then(res => {
          }).catch(err => { console.log(err) })
        }
        fetchTasks();
      }
      return newState;
    default:
      return state;
  }
};

export default listsReducer;

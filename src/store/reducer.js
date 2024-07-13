import { SET_BOARD_NUMBERS, UPDATE_BOARD_NUMBER, SET_INITIALIZED, SET_CORRECT_BUTTON_STATUS, SET_RANDOM_BUTTON_STATUS, SWITCH_VIEWS, SET_CORRECT_ROW } from './action-types';

const initialState = {
  boardNumbersObj: [],
  initialized: 'true',
  correctButtonDisabled: true,
  randomButtonDisabled: true,
  currentView: 'view1',
  correctRow: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BOARD_NUMBERS:
      return {
        ...state,
        boardNumbersObj: action.payload,
      };
    case UPDATE_BOARD_NUMBER:
      return {
        ...state,
        boardNumbersObj: state.boardNumbersObj.map(obj =>
          obj.number === action.payload.number
            ? { ...obj, ...action.payload.updates }
            : obj
        ),
      };
    case SET_INITIALIZED:
      return {
        ...state,
        initialized: state.initialized == 'true',
      };
    case SET_CORRECT_BUTTON_STATUS:
      return {
        ...state,
        correctButtonStatus: action.payload,
      };
    case SET_RANDOM_BUTTON_STATUS:
      return {
        ...state,
        randomButtonStatus: action.payload,
      };
    case SWITCH_VIEWS:
      return {
        ...state,
        currentView: state.currentView === 'view1' ? 'view2' : 'view1',
      };
    case SET_CORRECT_ROW:
      return {
        ...state,
        correctRow: action.payload,
      };

    default:
      return state;
  }
};

export default rootReducer;
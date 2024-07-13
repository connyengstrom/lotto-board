import { SET_BOARD_NUMBERS, UPDATE_BOARD_NUMBER, SET_INITIALIZED, SET_CORRECT_BUTTON_STATUS, SET_RANDOM_BUTTON_STATUS, SWITCH_VIEWS, SET_CORRECT_ROW } from './action-types';

export const setBoardNumbers = (boardNumbers) => ({
  type: SET_BOARD_NUMBERS,
  payload: boardNumbers,
});

export const setInitialized = () => ({
  type: SET_INITIALIZED,
});

export const updateBoardNumber = (number, updates) => ({
  type: UPDATE_BOARD_NUMBER,
  payload: { number, updates },
});


export const setCorrectButtonStatus = (status) => ({
  type: SET_CORRECT_BUTTON_STATUS,
  payload: status,
});

export const setRandomButtonStatus = (status) => ({
  type: SET_RANDOM_BUTTON_STATUS,
  payload: status,
});

export const switchViews = () => ({
  type: SWITCH_VIEWS,
});

export const setCorrectRow = (correctRow) => ({
  type: SET_CORRECT_ROW,
  payload: correctRow,
});
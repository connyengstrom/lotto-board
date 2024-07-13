import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoardNumbers, updateBoardNumber, setCorrectButtonStatus, setRandomButtonStatus, switchViews, setCorrectRow, setInitialized } from "../store/actions";
import Board from '../components/Board';
import ChosenRow from '../components/ChosenRow';


//Get the amount of chosen numbers
const getChosenNumbersArray = (boardNumbersObj) => {
  const chosenNumbersArray = boardNumbersObj
    .filter(item => item.chosen)
    .map(item => item.number);

  return chosenNumbersArray;
};

//Our main component that shows everything in the app
export const Main = () => {
  //Use dispatch for redux states
  const dispatch = useDispatch();
  
  /* Set up selectors for the different states
  We have states that keep track of all the different numbers on the board,
  if the buttons should be disabled or enabled, and to save the array with the correct numbers */
  const boardNumbersObj = useSelector(state => state.boardNumbersObj);
  const initialized = useSelector(state => state.initialized);
  const correctButtonStatus = useSelector(state => state.correctButtonStatus);
  const randomButtonStatus = useSelector(state => state.randomButtonStatus);
  const currentView = useSelector(state => state.currentView);
  const correctRow = useSelector(state => state.correctRow);

  //Initial setup for the app, where the board object is created with the numbers 1-50 and shuffled.
  useEffect(() => {
    //Get an array with numbers 1-50
    const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

    //Randomise the positions of the numbers in the array
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    /* Create an object where we initialise the status for all the numbers on the board.
    We set chosen and manuallyChosen to false */
    const initialBoardNumbers = numbers.map(num => ({
      number: num,
      chosen: false,
      manuallyChosen: false
    }));

    //Set the state of the board object from our temporary object
    dispatch(setBoardNumbers(initialBoardNumbers));
    dispatch(setInitialized(true));

  }, []);


  /* Once boardNumbersObj has been initialized with numbers 1-50, do dom manipulation and display the numbers on the elements,
  and give them event handlers on click */
  useEffect(() => {
    if (boardNumbersObj.length > 0) {
      const boardFields = document.querySelectorAll('.board-number');
      boardFields.forEach((div, index) => {
        const boardNumberObj = boardNumbersObj[index];
        div.textContent = boardNumberObj.number;

        div.onclick = () => handleClick(boardNumberObj, div);
      });
    }
  }, [initialized, boardNumbersObj]);

  /* Whenever the value in boardNumbersObj changes, update the chosen numbers row, and check if we should enable or disable buttons */
  useEffect(() => {
    //Update the users chosen row with the picked number
    setChosenNumbersRow();
    //Set the status
    enableDisableButtons();
  }, [boardNumbersObj, setChosenNumbersRow]);

  /* Handle logic for enabling / disabling buttons */
  const enableDisableButtons = () => {

    //Get the amount of chosen numbers
    let chosenNumbersAmount = getChosenNumbersArray(boardNumbersObj).length;
    if (chosenNumbersAmount == 10) {
      dispatch(setCorrectButtonStatus(false)); //If we have 10 chosen numbers, allow user to correct
    } else {
      dispatch(setCorrectButtonStatus(true));
    }

    //Get the amount of manually chosen numbers
    let manuallyChosenNumbersAmount = getManuallyChosenNumbersArray().length;
    const button = document.querySelector('button');
    if (manuallyChosenNumbersAmount == 10) {
      dispatch(setRandomButtonStatus(true)); //If we have 10 manually chosen numbers, disable the random button
    } else {
      dispatch(setRandomButtonStatus(false));
    }
  };



  //Get the amount of manually chosen numbers
  const getManuallyChosenNumbersArray = useCallback(() => {
    const manuallyChosenNumbersArray = boardNumbersObj
      .filter(item => item.manuallyChosen)
      .map(item => item.number);

    return manuallyChosenNumbersArray;
  }, [boardNumbersObj]);

  const handleClick = useCallback((boardNumberObj, div) => {
    // Get the current count of chosen numbers
    const chosenCount = boardNumbersObj.filter(obj => obj.chosen).length;
  
    // If the current number is not chosen and the chosen count is already 10, prevent further selection
    if (!boardNumberObj.chosen && chosenCount >= 10) {
      console.log("You can only choose up to 10 numbers.");
      return; // Exit function
    }
  
    /* Temporary object. Toggle between chosen to select/deselect. 
    manuallyChosen should be set to the same as chosen, as it is always manually chosen if clicked */
    const updatedStatus = {
      chosen: !boardNumberObj.chosen,
      manuallyChosen: !boardNumberObj.chosen,
    };
  
    // Toggle the css styles for visible effect
    if (updatedStatus.chosen) {
      div.classList.add('active-number-on-board');
    } else {
      div.classList.remove('active-number-on-board');
      div.classList.remove('active-number-on-board-random');
    }
  
    // Update the state of the object
    dispatch(updateBoardNumber(boardNumberObj.number, updatedStatus));
  }, [dispatch, boardNumbersObj]);
  

  //Sort an array, used in the bottom row the with numbers the user have selected
  const sortArray = (array) => {
    return array.sort((a, b) => a - b);
  };

  //Function to set the users chosen row every time boardNumbersObj is updated
  const setChosenNumbersRow = useCallback(() => {
    //Select all the elements
    const chosenNumbersDivs = document.querySelectorAll('.row-number');

    //Get an array of all the chosen numbers
    let tempArrayChosenNumbers = getChosenNumbersArray(boardNumbersObj);
    //Sort the array in consecutive order
    tempArrayChosenNumbers = sortArray(tempArrayChosenNumbers);

    /* Loop through all the .row-number elements. Check if we have a number at the tempArrayChosenNumbers[index].
    If we do, set the textContent of the element to the number, otherwise, set it to '' */
    chosenNumbersDivs.forEach((div, index) => {
      div.textContent = tempArrayChosenNumbers[index] !== undefined ? tempArrayChosenNumbers[index] : '';
    });
  }, [boardNumbersObj, getChosenNumbersArray]);

  //Function that returns a random number between 1-50
  const getRandomNumber = () => {
    let randomNumber;

    //Get an array with all the numbers that have been manually chosen
    const manuallyChosenNumbers = boardNumbersObj
      .filter(item => item.manuallyChosen)
      .map(item => item.number);

    //Loop and get a new random number until we find a number that is not already manually chosen
    do {
      randomNumber = Math.floor(Math.random() * 49) + 1;
      console.log("randomNumber: " + randomNumber);
    } while (manuallyChosenNumbers.includes(randomNumber));
  
    //When we find a number that has not been manually chosen already, return it
    return randomNumber;
  };


  /* This function runs every time the user pushes the "Slumpa nummer"-button.
  It basically resets the object, as in removing all the numbers that have been randomly selected before.
  It keeps the numbers that have been manually selected.
  */
  const updateChosenStatus = () => {
    const updatedBoardNumbersObj = boardNumbersObj.map(item => {
      if (item.chosen === true && item.manuallyChosen === false) {
        const divs = document.querySelectorAll('.board-number');
        const div = Array.from(divs).find(div => div.textContent.trim() === String(item.number));
        
        if (div) {
          div.classList.remove('active-number-on-board');
          div.classList.remove('active-number-on-board-random');
        }
  
        return { ...item, chosen: false };
      }
      return item;
    });
  
    return updatedBoardNumbersObj;
  };

  /* Function to pick random numbers when the user pushes the "Slumpa nummer"-button.

  */
  const pickRandomNumbers = () => {

    //Figure out how many random numbers we should create
    let numbersToGenerate = 10;
    let manuallyChosenNumbersAmount = getManuallyChosenNumbersArray().length;
    numbersToGenerate = numbersToGenerate - manuallyChosenNumbersAmount;
  
    //Create a new object, only keeping the manually chosen numbers, and removing earlier randomly chosen numbers.
    let fullObj = updateChosenStatus();
  

    let generatedCount = 0;
    //Run a loop until we have created as many random numbers as we need
    while (generatedCount < numbersToGenerate) {

      //Get a random number
      let randomNumber = getRandomNumber();

      //Get the index of the random number in our object
      const index = fullObj.findIndex(item => item.number === randomNumber);
    
      //If the random number is not already chosen
      if (index !== -1 && !fullObj[index].manuallyChosen && !fullObj[index].chosen) {
        //Set it to chosen
        fullObj[index].chosen = true;

        //Up our count for the loop
        generatedCount++;
    
        //Find the element where the textContent is the same as our generated number
        const divs = document.querySelectorAll('.board-number');
        const div = Array.from(divs).find(div => div.textContent.trim() === String(fullObj[index].number));
    
        //And give it our style
        if (div) {
          div.classList.add('active-number-on-board-random');
        }
      }
    }
  
    //Set state with the updated object
    dispatch(setBoardNumbers(fullObj));
  };

  //Function that runs when the user pushes the Rätta nummer-button
  const initCheckCorrect = () => {
    //Start by fetching the correct row
    fetchCorrectRow()
      .then(data => {
        console.log(data);
        dispatch(setCorrectRow(data)); // Save the correct row array in a state
        dispatch(switchViews()); // Since we got our correct row array. Change the view to show it
      })
      .catch(error => {
        console.error('Error in initCheckCorrect:', error);
      });
  };

  //Fetch the correct row from our backend
  const fetchCorrectRow = () => {
    return fetch('/api/correctrow')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); //Return the correct row as a json object
      })
      .then(data => data.correctRow)
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };

  //This function simply adds a class with green background to the winning numbers after the view is changed
  //The view changes when the users clicks "Rätta mina nummer"-button
  const processCorrectRow = useCallback((correctRow) => {
    const rowDivs = document.querySelectorAll('.row-number');
  
    correctRow.forEach(number => {
      const rowDiv = Array.from(rowDivs).find(div => div.textContent.trim() === String(number));
      if (rowDiv) {
        rowDiv.classList.add('row-number-correct');
        rowDiv.classList.remove('grey-dot');
      }
    });
  
    // Also display the winning numbers
    displayCorrectNumbers(correctRow);
  }, []); // Add dependencies if needed
  
  // Run processCorrectRow() when the view changes, which it does when the user clicks the "Rätta mina nummer"-button
  useEffect(() => {
    if (currentView === 'view2') {
      processCorrectRow(correctRow); // Pass correctRow here
    }
  }, [currentView, correctRow, processCorrectRow]);


  //This function manipulates the dom to put the winning numbers in the element with .correct-numbers
  function displayCorrectNumbers(correctRow) {
    //Get the div
    const correctNumbersDiv = document.querySelector(".correct-numbers");
    
    //Add the numbers to textContent
    correctNumbersDiv.textContent = (correctRow.join(' '));

    //Also change the H1 to "Vinnande rad:"
    const h1 = document.querySelector("h1");
    h1.textContent = "Winning row:";
  }
  
  return (
    <div className="main">
      <h1>Pick numbers</h1>

      {/* view1 is the first view with the board */}
      {/* The view changes when the user pushes the "Rätta mina nummer"-button and the fetch has succesfully been pulled */}
      {currentView === "view1" ? (
      <>
      {/* The board */}
      <Board />
      
      {/* The buttons with "Slumpa nummer" and "Rätta mina nummer" */}
      <div className="board-buttons">
        <button disabled={randomButtonStatus} className={`btn ${randomButtonStatus ? "disabled-btn" : ""}`} onClick={() => pickRandomNumbers()}>Randomize numbers</button>
        <button disabled={correctButtonStatus} className={`btn ${correctButtonStatus ? "disabled-btn" : ""}`} onClick={() => initCheckCorrect()}>Correct numbers</button>
        {/* <button className="btn" onClick={() => logStuff()}>log</button> */}
      </div>
      </>
      
      /* view2 is the view with the winning numbers */
      ) : currentView == "view2" ? (
      
      <div className="correct-numbers-wrapper">
        <div className="correct-numbers"></div>
      </div>
      ) : (null) }
      
      
      <ChosenRow />
    </div>
  );
};
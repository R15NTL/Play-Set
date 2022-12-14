/** @format */

var setCards = [];

var endOfGame = false;

var hint = [];
var hintButtonTimer = 0;
var hintTimer;

var usedCardCounter = 0;
var virtualSetTable = [];
var linesCurrentlyOnTable = 0;

function createSetCards() {
  /*
    THE SET CARDS WILL BE INCREMENTED IN THIS ORDER:

    color; 1: red 2: green 3: purple
    quantity; 1 2 3
    shape; 1: oval 2: diamond 3: snake
    shading; 1: solid 2: empty 3: shaded

    */

  for (var i = 0; i <= 80; i++) {
    if (i == 0) {
      setCards[0] = {
        arrId: 0,
        cardId: 0,
        color: "red",
        quantityOfItems: 1,
        shape: "oval",
        shading: "solid",
      };

      continue;
    }

    setCards[i] = {
      arrId: i,
      cardId: i,
      color: null,
      quantityOfItems: 1,
      shape: null,
      shading: null,
    };
    switch (setCards[i - 1].color) {
      case "red":
        setCards[i].color = "green";
        setCards[i].quantityOfItems = setCards[i - 1].quantityOfItems;
        setCards[i].shape = setCards[i - 1].shape;
        setCards[i].shading = setCards[i - 1].shading;
        break;
      case "green":
        setCards[i].color = "purple";
        setCards[i].quantityOfItems = setCards[i - 1].quantityOfItems;
        setCards[i].shape = setCards[i - 1].shape;
        setCards[i].shading = setCards[i - 1].shading;
        break;
      case "purple":
        setCards[i].color = "red";
        setCards[i].quantityOfItems = setCards[i - 1].quantityOfItems;
        setCards[i].quantityOfItems++;
        setCards[i].shading = setCards[i - 1].shading;
        setCards[i].shape = setCards[i - 1].shape;
        //WHEN COLOR REACHES PURPLE, QUANTITY IS INCREMENTED.
        if (setCards[i].quantityOfItems === 4) {
          setCards[i].quantityOfItems = 1;
          //WHEN QUANTITY REACHES 3, SHAPE IS INCREMENTED.
          switch (setCards[i - 1].shape) {
            case "oval":
              setCards[i].shape = "diamond";
              break;
            case "diamond":
              setCards[i].shape = "snake";
              break;
            case "snake":
              setCards[i].shape = "oval";
              //WHEN SHAPE REACHES SNAKE, SHADING IS INCREMENTED
              switch (setCards[i - 1].shading) {
                case "solid":
                  setCards[i].shading = "empty";
                  break;
                case "empty":
                  setCards[i].shading = "shaded";
                  break;
                case "shaded":
                  console.log("Error: Too Many Cards");
                  break;
                default:
                  setCards[i].shading = "error";
              }
              break;
            default:
              setCards[i].shape = "error";
          }
        }

        break;
      default:
        setCards[i].color = "error";
    }
  }
}

function shuffleCards() {
  var currentCard;
  var randomCardId;

  for (var i = 0; i <= 80; i++) {
    currentCard = setCards[i];
    randomCardId = Math.floor(Math.random() * 81);

    setCards[i] = setCards[randomCardId];
    setCards[i].arrId = i;

    setCards[randomCardId] = currentCard;
    setCards[randomCardId].arrId = randomCardId;
  }
  endOfGame = false;
  createVirtualSetTable();
  renderSetTable();
}

function isThisASet(cardId1, cardId2, cardId3) {
  if (
    (setCards[cardId1].color == setCards[cardId2].color &&
      setCards[cardId2].color == setCards[cardId3].color) ||
    (setCards[cardId1].color !== setCards[cardId2].color &&
      setCards[cardId1].color !== setCards[cardId3].color &&
      setCards[cardId2].color !== setCards[cardId3].color)
  ) {
    if (
      (setCards[cardId1].quantityOfItems == setCards[cardId2].quantityOfItems &&
        setCards[cardId2].quantityOfItems ==
          setCards[cardId3].quantityOfItems) ||
      (setCards[cardId1].quantityOfItems !==
        setCards[cardId2].quantityOfItems &&
        setCards[cardId1].quantityOfItems !==
          setCards[cardId3].quantityOfItems &&
        setCards[cardId2].quantityOfItems !== setCards[cardId3].quantityOfItems)
    ) {
      if (
        (setCards[cardId1].shape == setCards[cardId2].shape &&
          setCards[cardId2].shape == setCards[cardId3].shape) ||
        (setCards[cardId1].shape !== setCards[cardId2].shape &&
          setCards[cardId1].shape !== setCards[cardId3].shape &&
          setCards[cardId2].shape !== setCards[cardId3].shape)
      ) {
        if (
          (setCards[cardId1].shading == setCards[cardId2].shading &&
            setCards[cardId2].shading == setCards[cardId3].shading) ||
          (setCards[cardId1].shading !== setCards[cardId2].shading &&
            setCards[cardId1].shading !== setCards[cardId3].shading &&
            setCards[cardId2].shading !== setCards[cardId3].shading)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

// SET TABLE

function createVirtualSetTable() {
  virtualSetTable = [];
  usedCardCounter = 0;
  endOfGame = false;
  linesCurrentlyOnTable = 0;
  for (i = 0; i < 4; i++) {
    virtualSetTable[i] = createSetTableLine();
  }

  checkForSetsOrAddLine();
  startTimer();

  console.log("Number Of Table Rows: " + virtualSetTable.length);
  console.log("Number Of Sets On Table: " + calculateNumberOfSetsOnTable());
}

function createSetTableLine() {
  if (usedCardCounter == 81) {
    return;
  }

  usedCardCounter = usedCardCounter + 3;
  linesCurrentlyOnTable++;

  var col = [];
  col[0] = setCards[usedCardCounter - 3];
  col[1] = setCards[usedCardCounter - 2];
  col[2] = setCards[usedCardCounter - 1];

  return col;
}

function consoleFindSet(
  rowNumCardA,
  colNumCardA,
  rowNumCardB,
  colNumCardB,
  rowNumCardC,
  colNumCardC
) {
  if (
    isThisASet(
      virtualSetTable[rowNumCardA][colNumCardA].arrId,
      virtualSetTable[rowNumCardB][colNumCardB].arrId,
      virtualSetTable[rowNumCardC][colNumCardC].arrId
    ) == true
  ) {
    /*NEW CARDS;
    newCards[0]
    newCards[1]
    newCards[2]*/

    if (usedCardCounter == 81 && calculateNumberOfSetsOnTable == 0) {
      endGame();
      return;
    }

    if (virtualSetTable.length == 4 && usedCardCounter < 81) {
      var newCards = createSetTableLine();
      // THE BELOW LINE IS NECESSARY BECAUSE THE FUNCTION: createSetTableLine; ++ linesCurrentlyOnTable
      linesCurrentlyOnTable--;

      virtualSetTable[rowNumCardA][colNumCardA] = newCards[0];
      virtualSetTable[rowNumCardB][colNumCardB] = newCards[1];
      virtualSetTable[rowNumCardC][colNumCardC] = newCards[2];
    } else {
      virtualSetTable[rowNumCardA][colNumCardA] = "waiting";
      virtualSetTable[rowNumCardB][colNumCardB] = "waiting";
      virtualSetTable[rowNumCardC][colNumCardC] = "waiting";

      //NOT NEEDED
      if (virtualSetTable.length == 0) {
        endGame();
        return;
      }
      //FIND WAITING CARDS AND REPLACE WITH CARDS FROM ARRAY LINE 4 (5TH LINE DOWN)

      // FIND AND REPLACE WAITING CARDS

      var waitingCardsNotOnLastRow = [];

      if (rowNumCardA != virtualSetTable.length - 1) {
        waitingCardsNotOnLastRow[waitingCardsNotOnLastRow.length] = {
          row: rowNumCardA,
          col: colNumCardA,
        };
      }

      if (rowNumCardB != virtualSetTable.length - 1) {
        waitingCardsNotOnLastRow[waitingCardsNotOnLastRow.length] = {
          row: rowNumCardB,
          col: colNumCardB,
        };
      }

      if (rowNumCardC != virtualSetTable.length - 1) {
        waitingCardsNotOnLastRow[waitingCardsNotOnLastRow.length] = {
          row: rowNumCardC,
          col: colNumCardC,
        };
      }

      //TESTING
      //console.log(waitingCardsNotOnLastRow);

      for (var cols = 0; cols <= 2; cols++) {
        if (
          virtualSetTable[virtualSetTable.length - 1][cols] != "waiting" &&
          waitingCardsNotOnLastRow.length != 0
        ) {
          virtualSetTable[
            waitingCardsNotOnLastRow[waitingCardsNotOnLastRow.length - 1].row
          ][waitingCardsNotOnLastRow[waitingCardsNotOnLastRow.length - 1].col] =
            virtualSetTable[virtualSetTable.length - 1][cols];

          waitingCardsNotOnLastRow.length--;
        }
      }

      virtualSetTable.length--;
      linesCurrentlyOnTable--;
    }

    if (usedCardCounter == 81 && calculateNumberOfSetsOnTable == 0) {
      endGame();
      return;
    }

    checkForSetsOrAddLine();
    renderSetTable();
    return true;
  } else {
    return false;
  }
}

//THIS LOOKS FOR SETS IN virtualSetTable USING BRUTE FORCE

function calculateNumberOfSetsOnTable() {
  var setCounter = 0;
  var checkCard1;
  var checkCard2;
  var checkCard3;
  // THE BELOW row#, col# CORRESPONDS TO THE checkCard# IT WILL BE HOLDING.
  //CHECKCARD 1
  var col1 = 0;
  for (row1 = 0; row1 < virtualSetTable.length; row1++) {
    for (;;) {
      checkCard1 = virtualSetTable[row1][col1];
      //NOW THE PROGRAM WILL RULE OUT THIS CARD BY CHECKING IT AGAINST EVERY OTHER CARD THAT IS NOT YET RULED OUT.
      //CHECKCARD 2
      var col2 = col1 + 1;
      var col2EndOfLineSkippedToNextLine = false;
      for (row2 = row1; row2 < virtualSetTable.length; row2++) {
        if (col1 >= 2 && col2EndOfLineSkippedToNextLine == false) {
          col2 = 0;
          col2EndOfLineSkippedToNextLine = true;
          continue;
        }
        //INCREMENT COLUMN;
        for (;;) {
          checkCard2 = virtualSetTable[row2][col2];
          //NOW THE PROGRAM WILL RULE OUT THIS CARD BY CHECKING IT AGAINST EVERY OTHER CARD THAT IS NOT YET RULED OUT.
          //CHECKCARD 3
          var col3 = col2 + 1;
          var col3EndOfLineSkippedToNextLine = false;
          for (row3 = row2; row3 < virtualSetTable.length; row3++) {
            if (col2 >= 2 && col3EndOfLineSkippedToNextLine == false) {
              col3 = 0;
              col3EndOfLineSkippedToNextLine = true;
              continue;
            }
            //''
            //INCREMENT COLUMN;
            for (;;) {
              checkCard3 = virtualSetTable[row3][col3];
              /*
              //THIS IS TO OUTPUT THE CARD THE PROGRAM IS CHECKING TO THE CONSOLE, DELETE IF NECESSARY.
              console.log(
                "Checked card; row:" +
                  row1 +
                  ", col:" +
                  col1 +
                  ", VS row:" +
                  row2 +
                  ", col:" +
                  col2 +
                  ", VS row:" +
                  row3 +
                  ", col:" +
                  col3 +
                  "."
              );
              */
              if (
                isThisASet(
                  checkCard1.arrId,
                  checkCard2.arrId,
                  checkCard3.arrId
                ) == true
              ) {
                setCounter++;

                hint[0] = { row: row1, col: col1 };
                hint[1] = { row: row2, col: col2 };
                hint[2] = { row: row3, col: col3 };

                /*
                //FOR TESTING: WHEN A SET IS FOUND, THIS OUTPUTS THE arrid AND THE POSITION OF THE SET TO THE CONSOLE.
                console.log(
                  "card 1: " +
                    checkCard1.arrId +
                    ", card 2: " +
                    checkCard2.arrId +
                    ", card 3: " +
                    checkCard3.arrId +
                    ". consoleFindSet(" +
                    row1 +
                    "," +
                    col1 +
                    "," +
                    row2 +
                    "," +
                    col2 +
                    "," +
                    row3 +
                    "," +
                    col3 +
                    ")"
                );
                //*/
              }
              col3++;
              if (col3 > 2) {
                col3 = 0;
                break;
              }
            }
          }
          col2++;
          if (col2 > 2) {
            col2 = 0;
            break;
          }
        }
      }
      col1++;
      if (col1 > 2) {
        col1 = 0;
        break;
      }
    }
  }

  return setCounter;
}

function checkForSetsOrAddLine() {
  if (calculateNumberOfSetsOnTable() == 0) {
    if (usedCardCounter == 81) {
      endGame();
      return;
    }

    virtualSetTable[virtualSetTable.length] = createSetTableLine();
    console.log("added a line");
    console.log(virtualSetTable);
    if (calculateNumberOfSetsOnTable() == 0) {
      if (usedCardCounter == 81) {
        endGame();
        return;
      }

      virtualSetTable[virtualSetTable.length] = createSetTableLine();
      console.log("added a second line");
      console.log("usedCardCounter: " + usedCardCounter);
      console.log(virtualSetTable);

      if (calculateNumberOfSetsOnTable() == 0) {
        console.log("Error, can't add another line");
        console.log("usedCardCounter: " + usedCardCounter);
        console.log(virtualSetTable);

        endGame();
      }
    }
  }
}

// RENDER CARDS SECTION

//onclick="cardWasClicked(${x},0)

function renderSetTable() {
  var setContainer = document.getElementById("setCardsContainer");
  var rowsToAdd = "";
  var setCardImg;
  var cardCounter = document.getElementById("cardCounter");

  if (endOfGame) {
    return;
  }

  for (var x = 0; x < virtualSetTable.length; x++) {
    rowsToAdd += `
    <div class="rowOfCards">
      <div onclick="cardWasClicked(${x},0)" class="setCard">
         ${addCardAImgs()}
      </div>
      <div onclick="cardWasClicked(${x},1)" class="setCard">
        ${addCardBImgs()}
      </div>
      <div onclick="cardWasClicked(${x},2)" class="setCard">
        ${addCardCImgs()}
      </div>
    </div>
    `;

    function addCardAImgs() {
      var thisCard = "";
      for (var q = 1; q <= virtualSetTable[x][0].quantityOfItems; q++) {
        thisCard += `
        <img 
        class="${virtualSetTable[x][0].color}Card setCardImg"
        src="images/setcards/${virtualSetTable[x][0].shading}_${virtualSetTable[x][0].shape}.png"
        alt="${virtualSetTable[x][0].shading}_${virtualSetTable[x][0].shape}"
      />
        `;
      }
      return thisCard;
    }

    function addCardBImgs() {
      var thisCard = "";
      for (var q = 1; q <= virtualSetTable[x][1].quantityOfItems; q++) {
        thisCard += `
        <img
        class="${virtualSetTable[x][1].color}Card setCardImg"
        src="images/setcards/${virtualSetTable[x][1].shading}_${virtualSetTable[x][1].shape}.png"
        alt="${virtualSetTable[x][1].shading}_${virtualSetTable[x][1].shape}"
      />
        `;
      }
      return thisCard;
    }

    function addCardCImgs() {
      var thisCard = "";
      for (var q = 1; q <= virtualSetTable[x][2].quantityOfItems; q++) {
        thisCard += `
        <img
        class="${virtualSetTable[x][2].color}Card setCardImg"
        src="images/setcards/${virtualSetTable[x][2].shading}_${virtualSetTable[x][2].shape}.png"
        alt="${virtualSetTable[x][2].shading}_${virtualSetTable[x][2].shape}"
      />
        `;
      }
      return thisCard;
    }
  }

  let removeHintButton = document.getElementById("hintContainer");
  removeHintButton.innerHTML = ``;
  hintButtonTimer = 0;

  clearInterval(hintTimer);

  hintTimer = setInterval(function () {
    hintButtonTimer++;
    if (hintButtonTimer === 60 && !endOfGame) {
      showHintButton();
      clearInterval(hintTimer);
    }
  }, 1000);

  cardCounter.innerText = `:${81 - usedCardCounter}`;
  setContainer.innerHTML = `${rowsToAdd}`;
}

function cardWasClicked(rowPos, colPos) {
  // CARDS IN setCardHTMLList ARE STORED IN AN ARRAY, E.G. 0 TO 11.
  var setCardHTMLList = document.getElementsByClassName("setCard");
  var thisClickedCardListConverter = rowPos * 3 + colPos;
  var clickedCardHTMLList = document.getElementsByClassName("cardIsClicked");
  var currentClickedPos = [];

  function getRowNumber(listPos) {
    var out = 0;
    out = Math.floor(listPos / 3);
    return out;
  }

  function getColNumber(listPos) {
    var column = 0;
    column = listPos / 3 - Math.floor(listPos / 3);
    if (column == 0) {
      return column;
    } else if (column < 0.4) {
      return 1;
    } else {
      return 2;
    }
  }

  if (
    setCardHTMLList[thisClickedCardListConverter] == clickedCardHTMLList[0] ||
    setCardHTMLList[thisClickedCardListConverter] == clickedCardHTMLList[1] ||
    setCardHTMLList[thisClickedCardListConverter] == clickedCardHTMLList[2]
  ) {
    setCardHTMLList[thisClickedCardListConverter].classList.remove(
      "cardIsClicked"
    );
  } else {
    if (clickedCardHTMLList.length == 3) {
      return;
    }
    setCardHTMLList[thisClickedCardListConverter].classList.add(
      "cardIsClicked"
    );
    if (clickedCardHTMLList.length == 3) {
      for (var x = 0; x < setCardHTMLList.length; x++) {
        if (
          setCardHTMLList[x] == clickedCardHTMLList[0] ||
          setCardHTMLList[x] == clickedCardHTMLList[1] ||
          setCardHTMLList[x] == clickedCardHTMLList[2]
        ) {
          currentClickedPos[currentClickedPos.length] = {
            row: getRowNumber(x),
            col: getColNumber(x),
          };
        }
      }
      //ADD currentClickedPos[] IS A SET ()
      consoleFindSet(
        currentClickedPos[0].row,
        currentClickedPos[0].col,
        currentClickedPos[1].row,
        currentClickedPos[1].col,
        currentClickedPos[2].row,
        currentClickedPos[2].col
      );
    }
  }

  //alert("number of clicked cards is: " + clickedCardHTMLList.length);
}

//TIMER

function startTimer() {
  var timerElement = document.getElementById("timer");

  var elapsedTime = -1;

  function updateTimer() {
    elapsedTime++;

    var currentMinute = Math.floor(elapsedTime / 60);
    var currentSecond = elapsedTime % 60;

    var minuteString = currentMinute.toString().padStart(2, "0");
    var secondString = currentSecond.toString().padStart(2, "0");

    timerElement.innerText = minuteString + ":" + secondString;

    if (!endOfGame) {
      setTimeout(updateTimer, 1000);
    } else {
      timerElement.innerText = "";
    }
  }

  updateTimer();
}

//END GAME
function endGame() {
  var setCardsContainer = document.getElementById("setCardsContainer");
  var endGameTime = `${document.getElementById("timer").innerText}`;
  var previousBestTime = localStorage.getItem("bestTimeV3");
  var bestTimeElement = "";

  const clearCardCounter = (document.getElementById("cardCounter").innerHTML =
    "");

  if (updateBestTime(endGameTime)) {
    bestTimeElement = `
        <div class="newBestTime">New Best time!</div>
      `;
    if (previousBestTime != null) {
      bestTimeElement += `<div class="bestTime">Previous Best Time: ${previousBestTime}
      <div id=bestTimeDate> ${localStorage.getItem("bestTimeDate")}</div>
      </div>
      `;
    }
  } else {
    bestTimeElement = `<div class="bestTime">Best Time: ${previousBestTime}
    <div id=bestTimeDate> ${localStorage.getItem("bestTimeDate")}</div>
    </div> 
    `;
  }

  if (localStorage.getItem("bestTimeV2")) {
    bestTimeElement += `
    <p id=resetMessage>Unfortunately, due to technical difficulties your previous best time was reset.</p>
    `;
    localStorage.removeItem("bestTimeV2");
  }

  setCardsContainer.innerHTML = `
  <div class="endOfGame">
  <p class="endFoundAll">Found All Sets!</p>
  <div id="endOfGameTime">Time: ${endGameTime}</div>
  <div>${bestTimeElement}</div>
  <button onclick="shuffleCards()" class="newGameButton">New Game</button>
  </div>
  `;

  clearInterval(hintTimer);
  endOfGame = true;
}

function resetBestTime() {
  localStorage.removeItem("bestTimeV3");
}

function updateBestTime(currentTime) {
  var bestTime;

  const currentMinutes = parseFloat(currentTime.split(":")[0]);
  const currentSeconds = parseFloat(currentTime.split(":")[1]);

  if (localStorage.getItem("bestTimeV3")) {
    bestTime = localStorage.getItem("bestTimeV3");
  } else {
    bestTime = `9999:99`;
  }

  const bestMinutes = parseFloat(bestTime.split(":")[0]);
  const bestSeconds = parseFloat(bestTime.split(":")[1]);

  console.log(
    "currentMinutes: " +
      currentMinutes +
      " currentSeconds: " +
      currentSeconds +
      " bestMinutes: " +
      bestMinutes +
      " bestSeconds: " +
      bestSeconds
  );

  if (
    currentMinutes < bestMinutes ||
    (currentMinutes == bestMinutes && currentSeconds < bestSeconds)
  ) {
    localStorage.setItem("bestTimeV3", currentTime);

    localStorage.setItem(
      "bestTimeDate",
      `${new Date().getDate()}.${
        new Date().getMonth() + 1
      }.${new Date().getFullYear()}`
    );
    return true;
  } else {
    return false;
  }
}

//HINTS

function showHintButton() {
  var hintButtonContainer = document.getElementById("hintContainer");
  hintButtonContainer.innerHTML = `
  <button onclick="showHint()" id="hintButton">Hint</button>`;
}

function showHint() {
  var setCardHTMLList = document.getElementsByClassName("setCard");

  let removeHintButton = document.getElementById("hintContainer");
  removeHintButton.innerHTML = ``;

  for (var card = 0; card <= 2; card++) {
    setCardHTMLList[hint[card].row * 3 + hint[card].col].classList.add(
      "hintCard"
    );
  }
}

// SETCARDS ARRAY TESTING

function returnSpecificCard(arrId) {
  var x =
    "Card ID: " +
    setCards[arrId].cardId +
    ", Quantity Of Items " +
    setCards[arrId].quantityOfItems +
    ", Color " +
    setCards[arrId].color +
    ", Shape " +
    setCards[arrId].shape +
    ", Shading " +
    setCards[arrId].shading;
  return x;
}

function testCards() {
  var test = {
    color: { red: 0, green: 0, purple: 0 },
    quantityOfItems: { 1: 0, 2: 0, 3: 0 },
    shape: { oval: 0, diamond: 0, snake: 0 },
    Shading: { solid: 0, empty: 0, shaded: 0 },
  };
  for (i = 0; i <= 80; i++) {
    test.color[setCards[i].color]++;
    test.quantityOfItems[setCards[i].quantityOfItems]++;
    test.shape[setCards[i].shape]++;
    test.Shading[setCards[i].shading]++;
  }

  return test;
}

function shuffleCardsUntilLineAdded() {
  while (virtualSetTable.length == 4) {
    shuffleCards();
  }
}

function janet(games) {
  var numberOfGamesPlayed = 0;

  for (var janetGames = 0; janetGames < games; janetGames++) {
    if (janetGames != 0) {
      shuffleCards();
    }
    while (endOfGame == false) {
      consoleFindSet(
        hint[0].row,
        hint[0].col,
        hint[1].row,
        hint[1].col,
        hint[2].row,
        hint[2].col
      );
      console.log("set found: ");
      console.log("used cards: " + usedCardCounter);
    }
    numberOfGamesPlayed++;
    console.log("END OF GAME");
  }
  console.log("number of games played: " + numberOfGamesPlayed);
}

// MAIN CODE SECTION

createSetCards();
console.log("Set Cards Created");

shuffleCards();

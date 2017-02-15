//Constants and settings
const boardSize = 10;
const toWin = 5;
const maxDepth = 5;
const computerValue = 1;
const humanValue = -1;
const enabledValue = 0;
const restrictedValue = 2;

//Global variables
var gameOver = false;
var board = [];
var lastMoveX;
var lastMoveY;

//Set up the game after the page has been loaded
$(document).ready(function() {

  //Initialize board
  for (var x = 0; x < boardSize; x++) {
    board[x] = [];
    for (var y = 0; y < boardSize; y++) {
      $("#board .status").after('<div class="square" data-x = "' + x + '" data-y = "' + y + '" onclick="makeMove(this)"></div>');
    }
  }
  reset();
});

//Reset everything to original values
function reset() {

  //Reset board values
  for (var x = 0; x < boardSize; x++) {
    for (var y = 0; y < boardSize; y++) {
      board[x][y] = restrictedValue;
      $("#board").find("[data-x='" + x + "']").filter("[data-y='" + y + "']").html("");
    }
  }

  //Add an AI starting point in the middle of the board
  board[boardSize / 2][boardSize / 2] = enabledValue;

  //Reset other values
  gameOver = false;
  $(".status").text("");
}

//Handle the user's move input
function makeMove(square) {
  if (!gameOver) {

    //Get square coordinates
    var x = $(square).data("x");
    var y = $(square).data("y");

    //Check whether the square is empty
    if (board[x][y] == enabledValue || board[x][y] == restrictedValue) {
      //Make a move
      board[x][y] = humanValue;
      enableSquares(board, x, y);
      lastMoveX = x;
      lastMoveY = y;
      $(square).html("<i class='fa fa-times'></i>");

      //Check for gameOver scenarios and call computer move handler
      if (checkWin(board, humanValue, x, y)) {
        gameOver = true;
        $(".status").text("You win!!!");
      } else if (isFull(board)) {
        gameOver = true;
        $(".status").text("Draw");
      } else {
        computerMove();
      }
    }
  }
}

//Enable squares for AI evaluation around given coordinates
function enableSquares(boardState, x, y) {
  if (x + 1 < boardSize) {
    if (y + 1 < boardSize && boardState[x + 1][y + 1] == restrictedValue) {
      boardState[x + 1][y + 1] = enabledValue;
    }
    if (boardState[x + 1][y] == restrictedValue) {
      boardState[x + 1][y] = enabledValue;
    }
    if (y - 1 >= 0 && boardState[x + 1][y - 1] == restrictedValue) {
      boardState[x + 1][y - 1] = enabledValue;
    }
  }
  if (y + 1 < boardSize && boardState[x][y + 1] == restrictedValue) {
    boardState[x][y + 1] = enabledValue;
  }
  if (boardState[x][y - 1] == restrictedValue) {
    boardState[x][y - 1] = enabledValue;
  }
  if (x - 1 >= 0) {
    if (y + 1 < boardSize && boardState[x - 1][y + 1] == restrictedValue) {
      boardState[x - 1][y + 1] = enabledValue;
    }
    if (boardState[x - 1][y] == restrictedValue) {
      boardState[x - 1][y] = enabledValue;
    }
    if (y - 1 >= 0 && boardState[x - 1][y - 1] == restrictedValue) {
      boardState[x - 1][y - 1] = enabledValue;
    }
  }
}

//Check whether a given move has caused a winning scenario on a specified board
function checkWin(boardState, playerValue, lastX, lastY) {

  //Counters for all possible winning directions
  var countH = 0;
  var countV = 0;
  var countD1 = 0;
  var countD2 = 0;

  //Iterate through a range of values aroung the given coordinates
  for (var i = 1 - toWin; i < toWin; i++) {

    //horizontal
    if (lastX + i >= 0 && lastX + i < boardSize) {
      if (boardState[lastX + i][lastY] == playerValue) {
        countH++;
        if (countH == toWin) {
          return true;
        }
      } else {
        countH = 0;
      }
    }

    //vertical
    if (lastY + i >= 0 && lastY + i < boardSize) {
      if (boardState[lastX][lastY + i] == playerValue) {
        countV++;
        if (countV == toWin) {
          return true;
        }
      } else {
        countV = 0;
      }

      //diagonal no. 1 with positive slate
      if (lastX + i >= 0 && lastX + i < boardSize) {
        if (boardState[lastX + i][lastY + i] == playerValue) {
          countD1++;
          if (countD1 == toWin) {
            return true;
          }
        } else {
          countD1 = 0;
        }
      }

      //diagonal no. 2 with negative slate
      if (lastX - i >= 0 && lastX - i < boardSize) {
        if (boardState[lastX - i][lastY + i] == playerValue) {
          countD2++;
          if (countD2 == toWin) {
            return true;
          }
        } else {
          countD2 = 0;
        }
      }
    }
  }

  //Default value if no winning direction has triggered a win
  return false;
}

//Check whether a given board is full
function isFull(boardState) {
  for (x = 0; x < boardSize; x++) {
    for (y = 0; y < boardSize; y++) {

      //The board is not full if at least one square is not occupied
      if (boardState[x][y] == enabledValue || boardState[x][y] == restrictedValue) {
        return false;
      }
    }
  }

  //Default value if no empty square is found
  return true;
}

//Computer move handler
function computerMove() {

  //Call the AI
  MiniMaxAB(board, 0, computerValue, lastMoveX, lastMoveY);

  //Check for winning scenario
  if (checkWin(board, computerValue, lastMoveX, lastMoveY)) {
    gameOver = true;
    $(".status").text("You lost...");
  } else if (isFull(board)) {
    gameOver = true;
    $(".status").text("Draw");
  }
}

//AI algorithm - MiniMax with Alpha-Beta pruning
//There are separate functions for child nodes, MinAB and MaxAB
function MiniMaxAB(boardState, depth, playerValue, lastX, lastY) {

  //Initialize variables
  var a = -100;
  var b = 100;
  var value;
  var bestX;
  var bestY;
  var x;
  var y;
  var i;
  var j;

  //Evaluate the situation
  evaluation : {

    //Iterate through the board
    for(x = 0; x < boardSize; x++) {
      for (y = 0; y < boardSize; y++) {

        //Check whether the square is up for consideration
        if (boardState[x][y] == enabledValue) {

          //Create a new board and make a move
          var boardSubState = [];
          for (i = 0; i < boardSize; i++) {
            boardSubState[i] = [];
            for (j = 0; j < boardSize; j++) {
              boardSubState[i][j] = boardState[i][j];
            }
          }
          boardSubState[x][y] = 1;
          enableSquares(boardSubState, x, y);

          //Get the value of the new board
          value = MinAB(boardSubState, depth + 1, a, b, x, y);

          //Cutoff situation - shouldnt happen in the root
          if (value >= b) {
            bestX = x;
            bestY = y;
            break evaluation;
          }

          //New best value acquired
          if (value > a) {
            a = value;
            bestX = x;
            bestY = y;
          }
        }
      }
    }
  }

  //Make the best move
  boardState[bestX][bestY] = computerValue;
  enableSquares(boardState, bestX, bestY);
  lastMoveX = bestX;
  lastMoveY = bestY;
  $("#board").find("[data-x='" + bestX + "']").filter("[data-y='" + bestY + "']").html("<i class='fa fa-circle'></i>");
  console.log(a);
}

//Max node function for MiniMax with Alpha-Beta pruning
function MaxAB(boardState, depth, a, b, lastX, lastY) {

  //Check for win situation or a leaf node
  if (checkWin(boardState, -1, lastX, lastY)) {
    return -10 + depth;
  }
  if (depth == maxDepth) {
    return 0;
  }

  //Initialize variables
  var value;
  var bestX;
  var bestY;
  var x;
  var y;
  var i;
  var j;

  //Iterate through the board
  for (x = 0; x < boardSize; x++) {
    for (y = 0; y < boardSize; y++) {

      //Check whether the square is up for consideration
      if (boardState[x][y] == enabledValue) {

        //Create a new board and make a move
        var boardSubState = [];
        for (i = 0; i < boardSize; i++) {
          boardSubState[i] = [];
          for (j = 0; j < boardSize; j++) {
            boardSubState[i][j] = boardState[i][j];
          }
        }
        boardSubState[x][y] = 1;
        enableSquares(boardSubState, x, y);

        //Get the value of the new board
        value = MinAB(boardSubState, depth + 1, a, b, x, y);

        //Cutoff situation
        if (value >= b) {
          return b;
        }

        //New best value acquired
        if (value > a) {
          a = value;
        }
      }
    }
  }
  return a;
}

//Min node function for MiniMax with Alpha-Beta pruning
function MinAB(boardState, depth, a, b, lastX, lastY) {

  //Check for win situation or a leaf node
  if (checkWin(boardState, 1, lastX, lastY)) {
    return 10 - depth;
  }
  if (depth == maxDepth) {
    return 0;
  }

  //Initialize variables
  var value;
  var bestX;
  var bestY;
  var x;
  var y;
  var i;
  var j;

  //Iterate through the board
  for (x = 0; x < boardSize; x++) {
    for (y = 0; y < boardSize; y++) {

      //Check whether the square is up for consideration
      if (boardState[x][y] == enabledValue) {

        //Create a new board and make a move
        var boardSubState = [];
        for (i = 0; i < boardSize; i++) {
          boardSubState[i] = [];
          for (j = 0; j < boardSize; j++) {
            boardSubState[i][j] = boardState[i][j];
          }
        }
        boardSubState[x][y] = -1;
        enableSquares(boardSubState, x, y);

        //Get the value of the new board
        value = MaxAB(boardSubState, depth + 1, a, b, x, y);

        //Cutoff situation
        if (value <= a) {
          return a;
        }

        //New best value acquired
        if (value < b) {
          b = value;
        }
      }
    }
  }
  return b;
}

const boardSize = 15;
const toWin = 5;
const computerValue = 1;
const humanValue = -1;

var gameOver = false;
var board = [];

$(document).ready(function() {
  for(var x=0; x < boardSize; x++){
    board[x] = [];
    for(var y=0; y < boardSize; y++){
      $("#board .status").after('<div class="square" data-x = "' + x + '" data-y = "' + y + '" onclick="makeMove(this)"></div>')
      board[x][y] = 0;
    }
  }
});

function reset(){
  for(var x=0; x < boardSize; x++){
    for(var y=0; y < boardSize; y++){
      board[x][y] = 0;
      $("#board").find(data-x = x).find(data-y = y).html("");
    }
  }
  gameOver = false;
  $(".status").text("");
}

function makeMove(square){
  if (!gameOver){
    var x = $(square).data("x");
    var y = $(square).data("y");
    if (board[x][y] == 0){
      board[x][y] = humanValue;
      $(square).html("<i class='fa fa-times'></i>");
      if(checkWin(board, humanValue)){
        gameOver = true;
        $(".status").text("You win!!!");
      } else if(isFull(board)){
        gameOver = true;
        $(".status").text("Draw");
      } else {
        computerMove();
      }
    }
  }
}

function checkWin(boardState, playerValue){
  //horizontal
  var count = 0;
  var x;
  var y;
  for(x=0; x < boardSize; x++){
    for(y=0; y < boardSize; y++){
      if (board[x][y] == playerValue){
        count++;
        if (count == toWin){
          return true;
        }
      } else {
        count = 0;
      }
    }
  }
  //vertical
  count = 0;
  for(y=0; y < boardSize; y++){
    for(x=0; x < boardSize; x++){
      if (board[x][y] == playerValue){
        count++;
        if (count == toWin){
          return true;
        }
      } else {
        count = 0;
      }
    }
  }
  //diagonal
  count = 0;
  x=boardSize-toWin;
  y=0;
  while(x >= 0){
    while(x < boardSize && y < boardSize){
      if (board[x][y] == playerValue){
        count++;
        if (count == toWin){
          return true;
        }
      } else {
        count = 0;
      }
      x++;
      y++;
    }
    
  }


    for(y < boardSize; y++){
      if (board[x][y] == playerValue){
        count++;
        if (count == 5){
          return true;
        }
      } else {
        count = 0;
      }
    }
  }


  for (var i = 0; i < 8; i++){
    var winning = true
    for (var j = 0; j < 3; j++){
      if (boardState[winningSituations[i][j]] != playerValue){
        winning = false
      }
    }
    if (winning){
      return true;
    }
  }
  return false;
}

function isFull(boardState){
  for (var i = 0; i < 9; i++){
    if (boardState[i] == 0){
      return false
    }
  }
  return true;
}

function computerMove(){
  AI(board, 0, computerValue);
  if(checkWin(board, computerValue)){
    gameOver = true;
    $(".status").text("You lost...");
  } else if(isFull(board)){
    gameOver = true;
    $(".status").text("Draw");
  }
}

function AI(boardState, depth, playerValue){
  if(checkWin(boardState, -playerValue)) {
    return - 10 + depth;
  }
  if(isFull(boardState)){
    return 0;
  }

  var max = -10;
  var value;
  var index;

  for (var i = 0; i < 9; i++){
    if (boardState[i] == 0){
      var boardSubState = boardState.slice();
      boardSubState[i] = playerValue;
      value = -AI(boardSubState, depth + 1, -playerValue);
      if (value > max){
        max = value;
        index = i;
      }
    }
  }
  if(depth == 0){
    boardState[index] = computerValue;
    $(".square").eq(index).html("<i class='fa fa-circle-o'></i>");
    console.log(max);
  }
  return max;
}

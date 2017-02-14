const boardSize = 15;
const toWin = 4;
const computerValue = 1;
const humanValue = -1;

var gameOver = false;
var board = [];
var globalLastX;
var globalLastY;

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
      $("#board").find("[data-x='"+ x + "']").filter("[data-y='" + y + "']").html("");
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
      globalLastX = x;
      globalLastY = y;
      $(square).html("<i class='fa fa-times'></i>");
      if(checkWin(board, humanValue, x, y)){
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

function checkWin(boardState, playerValue, lastX, lastY){
  var countH = 0;
  var countV = 0;
  var countD1 = 0;
  var countD2 = 0;

  for(var i = 1-toWin; i < toWin; i++){
    if(boardState[lastX+i][lastY] == playerValue){
      countH ++;
      if (countH == toWin){
        return true;
      }
    } else {
      countH = 0;
    }
    if(boardState[lastX][lastY+i] == playerValue){
      countV ++;
      if (countV == toWin){
        return true;
      }
    } else {
      countV = 0;
    }
    if(boardState[lastX+i][lastY+i] == playerValue){
      countD1 ++;
      if (countD1 == toWin){
        return true;
      }
    } else {
      countD1 = 0;
    }
    if(boardState[lastX-i][lastY+i] == playerValue){
      countD2 ++;
      if (countD2 == toWin){
        return true;
      }
    } else {
      countD2 = 0;
    }
  }
  return false;
}

function isFull(boardState){
  for(x=0; x < boardSize; x++){
    for(y=0; y < boardSize; y++){
      if (board[x][y] == 0){
        return false;
      }
    }
  }
  return true;
}

function computerMove(){
  AI(board, 0, computerValue, globalLastX, globalLastY);
  if(checkWin(board, computerValue, globalLastX, globalLastY)){
    gameOver = true;
    $(".status").text("You lost...");
  } else if(isFull(board)){
    gameOver = true;
    $(".status").text("Draw");
  }
}

function AI(boardState, depth, playerValue, lastX, lastY){
  if(checkWin(boardState, -playerValue, lastX, lastY)) {
    return - 10 + depth;
  }
  if(isFull(boardState) || depth > 3){
    return 0;
  }
  var max = -10;
  var value;
  var indexX;
  var indexY;
  var x;
  var y;
  var i;
  var j;

  for(x=4; x < boardSize-3; x++){
    for(y=4; y < boardSize-3; y++){
      if (boardState[x][y] == 0){
        var boardSubState = [];
        for(i=0; i < boardSize; i++){
          boardSubState[i] = [];
          for(j=0; j < boardSize; j++){
            boardSubState[i][j] = boardState[i][j];
          }
        }
        boardSubState[x][y] = playerValue;
        value = -AI(boardSubState, depth + 1, -playerValue, x, y);
        if (value > max){
          max = value;
          indexX = x;
          indexY = y;
        }
      }
    }
  }

  if(depth == 0){
    boardState[indexX][indexY] = computerValue;
    globalLastX = indexX;
    globalLastY = indexY;
    $("#board").find("[data-x='"+ indexX + "']").filter("[data-y='" + indexY + "']").html("<i class='fa fa-circle'></i>");
    console.log(max);
  }
  return max;
}

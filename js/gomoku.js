const boardSize = 10;
const toWin = 5;
const computerValue = 1;
const humanValue = -1;

var gameOver = false;
var board = [];
var globalLastX;
var globalLastY;
var moves = 0;

$(document).ready(function() {
  for(var x=0; x < boardSize; x++){
    board[x] = [];
    for(var y=0; y < boardSize; y++){
      $("#board .status").after('<div class="square" data-x = "' + x + '" data-y = "' + y + '" onclick="makeMove(this)"></div>')
      board[x][y] = 2;
    }
  }
  board[boardSize/2][boardSize/2] = 0;
});

function reset(){
  for(var x=0; x < boardSize; x++){
    for(var y=0; y < boardSize; y++){
      board[x][y] = 2;
      $("#board").find("[data-x='"+ x + "']").filter("[data-y='" + y + "']").html("");
    }
  }
  board[boardSize/2][boardSize/2] = 0;
  moves = 0;
  gameOver = false;
  $(".status").text("");
}

function makeMove(square){
  if (!gameOver){
    var x = $(square).data("x");
    var y = $(square).data("y");
    if (board[x][y] == 0 || board[x][y] == 2){
      board[x][y] = humanValue;
      enableSquares(board, x, y);
      moves++;
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

function enableSquares(boardState, x, y){
  if(x+1 < boardSize){
    if (y+1 < boardSize && boardState[x+1][y+1] == 2){
      boardState[x+1][y+1] = 0;
    }
    if (boardState[x+1][y] == 2){
      boardState[x+1][y] = 0;
    }
    if (y-1 >= 0 && boardState[x+1][y-1] == 2){
      boardState[x+1][y-1] = 0;
    }
  }
  if (y+1 < boardSize && boardState[x][y+1] == 2){
    boardState[x][y+1] = 0;
  }
  if (boardState[x][y-1] == 2){
    boardState[x][y-1] = 0;
  }
  if(x-1 >= 0){
    if (y+1 < boardSize && boardState[x-1][y+1] == 2){
      boardState[x-1][y+1] = 0;
    }
    if (boardState[x-1][y] == 2){
      boardState[x-1][y] = 0;
    }
    if (y-1 >= 0 && boardState[x-1][y-1] == 2){
      boardState[x-1][y-1] = 0;
    }
  }
}

function checkWin(boardState, playerValue, lastX, lastY){
  var countH = 0;
  var countV = 0;
  var countD1 = 0;
  var countD2 = 0;

  for(var i = 1-toWin; i < toWin; i++){
    //horizontal
    if (lastX+i >= 0 && lastX+i < boardSize){
      if(boardState[lastX+i][lastY] == playerValue){
        countH ++;
        if (countH == toWin){
          return true;
        }
      } else {
        countH = 0;
      }
    }
    //vertical
    if (lastY+i >= 0 && lastY+i < boardSize){
      if(boardState[lastX][lastY+i] == playerValue){
        countV ++;
        if (countV == toWin){
          return true;
        }
      } else {
        countV = 0;
      }
      //diagonal 1 and 2
      if (lastX+i >= 0 && lastX+i < boardSize){
        if(boardState[lastX+i][lastY+i] == playerValue){
          countD1 ++;
          if (countD1 == toWin){
            return true;
          }
        } else {
          countD1 = 0;
        }
      }
      if (lastX-i >= 0 && lastX-i < boardSize){
        if(boardState[lastX-i][lastY+i] == playerValue){
          countD2 ++;
          if (countD2 == toWin){
            return true;
          }
        } else {
          countD2 = 0;
        }
      }
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
  MiniMaxAB(board, 0, computerValue, globalLastX, globalLastY);
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

  for(x=0; x < boardSize; x++){
    for(y=0; y < boardSize; y++){
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

function MiniMaxAB (boardState, depth, playerValue, lastX, lastY){
  var a = -100;
  var b = 100
  var max;
  var value;
  var indexX;
  var indexY;
  var x;
  var y;
  var i;
  var j;
  evaluation:{
    for(x=0; x < boardSize; x++){
      for(y=0; y < boardSize; y++){
        if (boardState[x][y] == 0){
          var boardSubState = [];
          for(i=0; i < boardSize; i++){
            boardSubState[i] = [];
            for(j=0; j < boardSize; j++){
              boardSubState[i][j] = boardState[i][j];
            }
          }
          boardSubState[x][y] = 1;
          enableSquares(boardSubState, x, y);
          value = MinAB(boardSubState, depth + 1, a, b, x, y);
          if (value >= b){
            indexX = x;
            indexY = y;
            break evaluation;
          }
          if (value > a){
            a = value;
            indexX = x;
            indexY = y;
          }
        }
      }
    }
  }
  boardState[indexX][indexY] = computerValue;
  enableSquares(boardState, indexX, indexY);
  moves++;
  globalLastX = indexX;
  globalLastY = indexY;
  $("#board").find("[data-x='"+ indexX + "']").filter("[data-y='" + indexY + "']").html("<i class='fa fa-circle'></i>");
  console.log(a);
}

function MaxAB(boardState, depth, a, b, lastX, lastY){
  if(checkWin(boardState, -1, lastX, lastY)) {
    return -10+depth;
  }
  if (depth == 5){
    return 0;
  }
  var value;
  var indexX;
  var indexY;
  var x;
  var y;
  var i;
  var j;
  for(x=0; x < boardSize; x++){
    for(y=0; y < boardSize; y++){
      if (boardState[x][y] == 0){
        var boardSubState = [];
        for(i=0; i < boardSize; i++){
          boardSubState[i] = [];
          for(j=0; j < boardSize; j++){
            boardSubState[i][j] = boardState[i][j];
          }
        }
        boardSubState[x][y] = 1;
        enableSquares(boardSubState, x, y);
        value = MinAB(boardSubState, depth + 1, a, b, x, y);
        if (value >= b){
          return b;
        }
        if (value > a){
          a = value;
        }
      }
    }
  }
  return a;
}

function MinAB(boardState, depth, a, b, lastX, lastY){
  if(checkWin(boardState, 1, lastX, lastY)) {
    return 10-depth;
  }
  if (depth == 5){
    return 0;
  }
  var value;
  var indexX;
  var indexY;
  var x;
  var y;
  var i;
  var j;
  for(x=0; x < boardSize; x++){
    for(y=0; y < boardSize; y++){
      if (boardState[x][y] == 0){
        var boardSubState = [];
        for(i=0; i < boardSize; i++){
          boardSubState[i] = [];
          for(j=0; j < boardSize; j++){
            boardSubState[i][j] = boardState[i][j];
          }
        }
        boardSubState[x][y] = -1;
        enableSquares(boardSubState, x, y);
        value = MaxAB(boardSubState, depth + 1, a, b, x, y);
        if (value <= a){
          return a;
        }
        if (value < b){
          b = value;
        }
      }
    }
  }
  return b;
}

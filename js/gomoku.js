const boardSize = 30;
const toWin = 3;
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
    } else {
      countH = 0;
    }
    if(boardState[lastX][lastY+i] == playerValue){
      countV ++;
    } else {
      countV = 0;
    }
    if(boardState[lastX+i][lastY+i] == playerValue){
      countD1 ++;
    } else {
      countD1 = 0;
    }
    if(boardState[lastX-i][lastY+i] == playerValue){
      countD2 ++;
    } else {
      countD2 = 0;
    }
  }
  if (countH == toWin || countV == toWin || countD1 == toWin || countD2 == toWin){
    return true;
  }
  return false;
}

function naiveCheckWin(boardState, playerValue){
  //horizontal
  var count = 0;
  var x;
  var y;
  var i;
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
  //positive diagonal
  count = 0;
  for(x=0; x < boardSize; x++){
    for(y=0; y < boardSize; y++){
      if (board[x][y] == playerValue){
        count++;
        for(i = 1; i < toWin; i++){
          if(x+i < boardSize && y+i < boardSize && board[x+i][y+i] == playerValue){
            count++;
          } else {
            count = 0;
            break;
          }
        }
        if (count == toWin){
          return true;
        }
      }
    }
  }
  //negative diagonal
  count = 0;
  for(x=0; x < boardSize; x++){
    for(y=0; y < boardSize; y++){
      if (board[x][y] == playerValue){
        count++;
        for(i = 1; i < toWin; i++){
          if(x-i >= 0 && y+i < boardSize && board[x-i][y+i] == playerValue){
            count++;
          } else {
            count = 0;
            break;
          }
        }
        if (count == toWin){
          return true;
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
  if(isFull(boardState) || depth > 2){
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

  for(x=lastX-2; x < lastX+2; x++){
    for(y=lastY-2; y < lastY+2; y++){
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

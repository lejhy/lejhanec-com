var squares = $(".square");
var buttons = $(".button");

var board = [0,0,0,0,0,0,0,0,0];
var winningSituations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [6,4,2],
  [0,3,6],
  [1,4,7],
  [2,5,8]
];

gameOver = false;
const computerValue = 1;
const humanValue = -1;

function reset(){
  for (var i = 0; i < 9; i++){
    board[i] = 0;
    $(".square").eq(i).html("");
  }
  gameOver = false;
  $(".status").text("");
}

function makeMove(square){
  if (!gameOver){
    var index = $(square).data("index");
    if (board[index] == 0){
      board[index] = humanValue;
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

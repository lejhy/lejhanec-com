var canvas;
var canvasContext;

var ballX;
var ballY;
var ballSpeedX = 10;
var ballSpeedY = 2;

var playerPaddleY;
var computerPaddleY;

var playerScore = 0;
var computerScore = 0;
var showingMenuScreen = true;
var showingWinScreen = false;
var computerSpeed = 2;
var ballYFactor = 0.35;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BORDER_WIDTH = 10;
const BALL_RADIUS = 5;
const SUB_UPDATES = 2;

$(document).ready(function() {
  canvas = document.getElementById("arcadeCanvas");
  canvas.height = window.innerHeight-5;
  canvas.width = window.innerWidth-5;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  computerPaddleY = canvas.height/2;
  playerPaddleY = canvas.height/2;
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 60;
  setInterval(render, 1000/framesPerSecond);
  setInterval(update, (1000/framesPerSecond)/SUB_UPDATES);
  canvas.addEventListener("mousemove", function(event){
    var mousePos = getMousePos(event);
    playerPaddleY = mousePos.y-(PADDLE_HEIGHT/2);
  });
  canvas.addEventListener("touchmove", function(event){
    var mousePos = getTouchPos(event);
    playerPaddleY = mousePos.y-(PADDLE_HEIGHT/2);
  });
  canvas.addEventListener("click", handleMouseClick);
});

function getMousePos(event){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = event.clientX - rect.left - root.scrollLeft;
  var mouseY = event.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function getTouchPos(event){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  event.preventDefault();
  var mouseX = event.changedTouches[0].clientX - rect.left - root.scrollLeft;
  var mouseY = event.changedTouches[0].clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick(event){
  if (showingWinScreen){
    playerScore = 0;
    computerScore = 0;
    showingWinScreen = false;
  }
  if (showingMenuScreen){
    var mousePos = getMousePos(event);
    //hard
    if(mousePos.x > canvas.width/2-25 && mousePos.x < canvas.width/2+15 && mousePos.y > canvas.height/2-65 && mousePos.y < canvas.height/2-40){
      computerSpeed = 40;
      ballSpeedX = 20;
      ballYFactor = 1;
      showingMenuScreen = false;
    } else if(mousePos.x > canvas.width/2-32 && mousePos.x < canvas.width/2+22 && mousePos.y > canvas.height/2-115 && mousePos.y < canvas.height/2-90){
      computerSpeed = 20;
      ballSpeedX = 20;
      ballYFactor = 0.7;
      showingMenuScreen = false;
    } else if(mousePos.x > canvas.width/2-25 && mousePos.x < canvas.width/2+15 && mousePos.y > canvas.height/2-175 && mousePos.y < canvas.height/2-140){
      computerSpeed = 10;
      ballSpeedX = 10;
      ballYFactor = 0.35;
      showingMenuScreen = false;
    }
  }
}

function render(){
  //background
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0,0,canvas.width,canvas.height);
  canvasContext.fillStyle = "White";
  if (showingMenuScreen == true){
    canvasContext.fillText("Select difficulty", canvas.width/2-35, canvas.height/2-200);
    canvasContext.fillText("Easy", canvas.width/2-15, canvas.height/2-150);
    canvasContext.fillText("Medium", canvas.width/2-22, canvas.height/2-100);
    canvasContext.fillText("Hard", canvas.width/2-15, canvas.height/2-50);
    if (showingWinScreen == true){
      if (playerScore > computerScore){
        canvasContext.fillText("Player Wins!!!", canvas.width/2-33, canvas.height/2-300);
      } else {
        canvasContext.fillText("Computer Wins!!!", canvas.width/2-38, canvas.height/2-300);
      }
    }
    return;
  }
  //player paddle
  canvasContext.fillRect(BORDER_WIDTH,playerPaddleY,10,100);
  //computer paddle
  canvasContext.fillRect(canvas.width-PADDLE_WIDTH-BORDER_WIDTH,computerPaddleY,10,100);
  //dividers
  for(var i = 10; i < canvas.height+40; i+=40){
    canvasContext.fillRect(canvas.width/2-1,i,2,20);
  }
  //ball
  renderBall(ballX, ballY, BALL_RADIUS, "white");
  //score
  canvasContext.fillText(playerScore,100,100);
  canvasContext.fillText(computerScore, canvas.width - 100,100);
}

function renderBall(coordinateX, coordinateY, radius, color){
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(coordinateX, coordinateY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function update(){
  if (ballX-BALL_RADIUS <= BORDER_WIDTH+PADDLE_WIDTH){
    if(ballY+BALL_RADIUS > playerPaddleY && ballY-BALL_RADIUS < playerPaddleY+PADDLE_HEIGHT){
      ballSpeedX *= -1;
      var deltaY = ballY - (playerPaddleY+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY*ballYFactor;
    } else if (ballX-BALL_RADIUS <= BORDER_WIDTH){
      ballSpeedX *= -1;
      computerScore++;
      ballReset();
    }
  } else if (ballX+BALL_RADIUS >= canvas.width-BORDER_WIDTH-PADDLE_WIDTH){
    if(ballY+BALL_RADIUS > computerPaddleY && ballY-BALL_RADIUS < computerPaddleY+PADDLE_HEIGHT){
      ballSpeedX *= -1;
      var deltaY = ballY - (computerPaddleY+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY*ballYFactor;
    } else if (ballX+BALL_RADIUS >= canvas.width-BORDER_WIDTH){
      ballSpeedX *= -1;
      playerScore++;
      ballReset();
    }
  }
  if (ballY+BALL_RADIUS >= canvas.height || ballY-BALL_RADIUS <= 0){
    ballSpeedY *= -1;
  }
  computerMovement();
  ballX += ballSpeedX/SUB_UPDATES;
  ballY += ballSpeedY/SUB_UPDATES;
}

function ballReset(){
  if (playerScore >= 3 || computerScore >= 3){
    showingWinScreen = true;
    showingMenuScreen = true;
    ballSpeedX = 0;
  }
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedY = 0;
}

function computerMovement(){
  var computerPaddleYCenter = computerPaddleY+PADDLE_HEIGHT/2;
  if(computerPaddleYCenter < ballY){
    if(computerPaddleYCenter + computerSpeed/SUB_UPDATES < ballY){
      computerPaddleY += computerSpeed/SUB_UPDATES;
    } else {
      computerPaddleY = ballY-PADDLE_HEIGHT/2;
    }
  } else if (computerPaddleYCenter > ballY){
    if(computerPaddleYCenter - computerSpeed/SUB_UPDATES > ballY){
      computerPaddleY -= computerSpeed/SUB_UPDATES;
    } else {
      computerPaddleY = ballY-PADDLE_HEIGHT/2;
    }
  }
}

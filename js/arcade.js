var canvas;
var canvasContext;

var ballX = 400;
var ballY = 300;
var ballSpeedX = 10;
var ballSpeedY = 2;

var playerPaddleY;
var computerPaddleY = 250;

var playerScore = 0;
var computerScore = 0;
var showingWinScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BORDER_WIDTH = 10;
const BALL_RADIUS = 5;

$(document).ready(function() {
  canvas = document.getElementById("arcadeCanvas");
  canvas.height = window.innerHeight-5;
  canvas.width = window.innerWidth-5;
  canvasContext = canvas.getContext("2d");
  var framesPerSecond = 60;
  setInterval(function(){
    update();
    render();
  }, 1000/framesPerSecond);
  canvas.addEventListener("mousemove", function(event){
    var mousePos = getMousePos(event);
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

function handleMouseClick(event){
  if (showingWinScreen){
    playerScore = 0;
    computerScore = 0;
    showingWinScreen = false;
  }
}

function render(){
  //background
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0,0,canvas.width,canvas.height);
  canvasContext.fillStyle = "White";
  if (showingWinScreen == true){
    if (playerScore > computerScore){
      canvasContext.fillText("Player Wins!!!", canvas.width/2-30, canvas.height/2-200);
    } else {
      canvasContext.fillText("Computer Wins!!!", canvas.width/2-35, canvas.height/2-200);
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
      ballSpeedY = deltaY*0.35
    } else if (ballX-BALL_RADIUS <= BORDER_WIDTH){
      ballSpeedX *= -1;
      computerScore++;
      ballReset();
    }
  } else if (ballX+BALL_RADIUS >= canvas.width-BORDER_WIDTH-PADDLE_WIDTH){
    if(ballY+BALL_RADIUS > computerPaddleY && ballY-BALL_RADIUS < computerPaddleY+PADDLE_HEIGHT){
      ballSpeedX *= -1;
      var deltaY = ballY - (computerPaddleY+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY*0.35
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
  ballX += ballSpeedX;
  ballY += ballSpeedY;
}

function ballReset(){
  if (playerScore >= 3 || computerScore >= 3){
    showingWinScreen = true;
  }
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedY = 0;
}

function computerMovement(){
  var computerPaddleYCenter = computerPaddleY+PADDLE_HEIGHT/2;
  if(computerPaddleYCenter < ballY){
    computerPaddleY += 2;
  } else {
    computerPaddleY -= 2;
  }
}

var appControl = {
  var
}


var empty = 0;
var orange = 1;
var blue = 2;
var purple = 3;
var pink = 4;
var yellow = 5;
var red = 6;
var green = 7;
var brown = 8;
var gameBoard = [
  [orange, blue, purple, pink, yellow, red, green, brown],
  [red, orange, pink, green, blue, yellow, brown, purple],
  [green, pink, orange, red, purple, brown, yellow, blue],
  [pink, purple, blue, orange, brown, green, red, yellow],
  [yellow, red, green, brown, orange, blue, purple, pink],
  [blue, yellow, brown, purple, red, orange, pink, green],
  [purple, brown, yellow, blue, green, pink, orange, red],
  [brown, green, red, yellow, pink, purple, blue, orange]
];

var player1 = [
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [brown, green, red, yellow, pink, purple, blue, orange]
]

var player2 = [
  [orange, blue, purple, pink, yellow, red, green, brown],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
]

var appControl =

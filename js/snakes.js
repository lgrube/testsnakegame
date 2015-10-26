/*
  luke grube
  javascript file for snake
  personal project
*/

/*----------------create variable------------------*/
var canvas = new Object({}); //creates a new object called canvas
var mainSnake; //create the variable mainSnake
var Food; //creates the variable goodFood
//var badFood; //creates the variable badFood
/*----end create variable--*/

/*----------------------canvas elements---------------*/

//creates the document called canvas which will create everything
canvas.element = document.getElementById('canvas');
canvas.context = canvas.element.getContext('2d');

//setting the canvas width to what the html file states
canvas.width = canvas.element.getAttribute('width');

//setting the canvas height to what the html file states
canvas.height = canvas.element.getAttribute('height');

//setts the size of the snake by using cell blocks
//have to make sure canvas size can support cell width or it will be to big and wont run correctly
canvas.cellWidth = 15;
/*-----------------end canvas elements----------------*/

/*-------------drawing the canvas--------------*/
canvas.redraw = function(mainColor, outlineColor) {
  //creates the canvas colors
  //mainColor is the main game window
  mainColor = mainColor || 'black',

  //outlineColor outlines the main window
  outlineColor = outlineColor || 'black';
  this.paint(0, 0, mainColor, outlineColor, this.width, this.height);

};
/*-----------end drawing canvas-----------------*/

/*------------giving the canvas its color-------*/
canvas.paint = function(x, y, mainColor, outlineColor, width, height) {
  //setting the width of the canvas to whatever its been declared at
  width = width || this.cellWidth,

  //setting the height of the canvas to what its been declared
  height = height || this.cellWidth,

  //sets the fill in color
  mainColor = mainColor || 'red',

  //sets the outline color
  outlineColor = outlineColor || 'black';

  //sets the context of fillStyle equal to whatever color we declared in canvas redraw
  this.context.fillStyle = mainColor;

  //fills the rectangle by multiplying x and y with cellwidth
  this.context.fillRect(x * canvas.cellWidth, y * canvas.cellWidth, width, height);

  //sets teh context of outline style with outlinecolor
  this.context.strokeStyle = outlineColor;

  //sets the rectangle with the outline
  this.context.strokeRect(x * canvas.cellWidth, y * canvas.cellWidth, width, height);
};
/*-------------end canvas color--------------*/

/*---------------colored text----------------*/
canvas.paintText = function(text, x, y) {
  //controls where the text is according to the x axis
  x = x || 10,

  //controls where the text is according to the y axis
  y = y || 15;

  //fills in the text with these coordinates
  this.context.fillText(text, x, y);
};
/*----------------end colored text-----------*/

/*-------------create the canvas---------*/

//calls the redraw function to create the canvas
canvas.redraw();
/*--------------end creating the canvas------*/

/*-------create that actual snake-----------*/
function Snake(length, bodyColor, outlineColor, startingPosition) {
  this.length = length;
  this.bodyColor = bodyColor;
  this.outlineColor = outlineColor;
  this.array = [];
  this.direction = 'right'; //set direction it will go to begin with
  this.nd = []; //the next direction it will be going
  this.nx;//controls next x position

  this.ny;//controls next y position
  startingPosition = startingPosition;

  //creates the starting point of the snake
  this.create = function() {
    for (var i = this.length - 1; i >= 0; i--) {
      this.array.push({x: startingPosition.x + i, y: startingPosition.y});
    }
  };

  this.create();
}

/*-----------end of actual snake class------------------*/

/*----------controls the functionality of snake moving-------*/
Snake.prototype.move = function() {
  if (this.nd.length) {
    this.direction = this.nd.shift();
  }

  this.nx = this.array[0].x;
  this.ny = this.array[0].y;
  var tail;
  switch (this.direction) {
    case 'right':
      this.nx++;
      break;
    case 'left':
      this.nx--;
      break;
    case 'up':
      this.ny--;
      break;
    case 'down':
      this.ny++;
      break;
  }

  if (this.outsideBounds() || this.colliding()) {
    game.over();
    return;
  }

  if (this.eatingFood()) {
    game.score++;
    tail = {x: this.nx, y: this.ny};
    food = new Food();
  } else {
    tail = this.array.pop();
    tail.x = this.nx;
    tail.y = this.ny;
  }

  this.array.unshift(tail);
  this.paint();
};
/*---------end of controlling snake------------*/

Snake.prototype.paint = function() {
  canvas.redraw();
  for (var i = 0; i < this.array.length; i++) {
    var j = this.array[i];
    canvas.paint(j.x, j.y, this.bodyColor, this.outlineColor);
  }
};

Snake.prototype.outsideBounds = function() {
  if (this.nx <= -1 || this.nx === canvas.width / canvas.cellWidth || this.ny <= -1 || this.ny === canvas.height / canvas.cellWidth) {
    return true;
  }

  return false;
};

Snake.prototype.eatingFood = function() {
  if (this.nx === food.x && this.ny === food.y) {
    return true;
  }

  return false;
};

Snake.prototype.colliding = function(x, y) {
  x = x || this.nx;
  y = y || this.ny;
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].x === x && this.array[i].y === y) {
      return true;
    }
  }

  return false;
};

function Food() {
  this.generateCoords = function() {
    this.x = Math.round(Math.random() * (canvas.width - canvas.cellWidth) / canvas.cellWidth);
    this.y = Math.round(Math.random() * (canvas.height - canvas.cellWidth) / canvas.cellWidth);
    this.checkCollision();
  };

  this.checkCollision = function() {
    if (mainSnake.colliding(this.x, this.y)) {
      this.generateCoords();
    }
  };

  this.draw = function() {
    canvas.paint(this.x, this.y, 'limegreen');
  };

  this.generateCoords();
  this.checkCollision();
  this.draw();
}

var game = new Object({});
game.fps = 20;
game.score = 0;
game.scoreText = 'Blocks eaten: ';
game.drawScore = function() {
  canvas.paintText(this.scoreText + this.score);
};

game.runLoop = function() {
  setTimeout(function() {
    requestAnimationFrame(game.runLoop);
    mainSnake.move();
    if (typeof food.draw != 'undefined') {
      food.draw();
    }

    game.drawScore();
  }, 1000 / game.fps);
};

game.start = function() {
  mainSnake = new Snake(5, 'red', 'yellow', {x: 10, y: 10});
  food = new Food();
  game.score = 0;
};

game.over = function() {
  window.location.href = "deadsnake.html";
};

game.start();
game.runLoop();

document.onkeydown = function(e) {
  if (typeof mainSnake !== 'undefined') {
    // Cross browser keycode detection
    var key = (e.keyCode ? e.keyCode : e.which);
    var td;
    if (mainSnake.nd.length) {
      td = mainSnake.nd[mainSnake.nd.length - 1];
    } else {
      td = mainSnake.direction;
    }

    if (key == "37" && mainSnake.direction != 'right') {
      mainSnake.nd.push('left');
    } else if (key == "38" && mainSnake.direction != 'down') {
      mainSnake.nd.push('up');
    } else if (key == "39" && mainSnake.direction != 'left') {
      mainSnake.nd.push('right');
    } else if (key == "40" && mainSnake.direction != 'up') {
      mainSnake.nd.push('down');
    }
  }
};

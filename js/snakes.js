/*
  luke grube
  javascript file for snake
  personal project
*/

/*----------------create variable------------------*/
var canvas = new Object({}); //creates a new object called canvas
var mainSnake; //create the variable mainSnake
var goodFood; //creates the variable goodFood
var badFood; //creates the variable badFood
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
canvas.cellWidth = 10;
/*-----------------end canvas elements----------------*/

/*-------------drawing the canvas--------------*/
canvas.redraw = function(mainColor, outlineColor) {
  //creates the canvas colors
  //mainColor is the main game window
  mainColor = mainColor || 'orangered',

  //outlineColor outlines the main window
  outlineColor = outlineColor || 'darkgreen';
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
  mainColor = mainColor || 'purple',

  //sets the outline color
  outlineColor = outlineColor || 'pink';

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
  var x = x || 5;

  //controls where the text is according to the y axis
  var y = y || 15;

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
  this.create = function() {
    for (var i = this.length - 1; i >= 0; i--) {
      this.array.push({x: startingPosition.x + i, y: startingPosition.y});
    }
  };

  this.create();
}

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
    food = new GoodFood();
  } else {
    var tail = this.array.pop();
    tail.x = this.nx;
    tail.y = this.ny;
  }

  this.array.unshift(tail);
  this.paint();
};

Snake.prototype.paint = function() {
  canvas.redraw();
  for (var i = 0; i < this.array.length; i++) {
    var j = this.array[i];
    canvas.paint(j.x, j.y, this.bodyColor, this.outlineColor);
  }
};

/*
  luke grube
  javascript file for snake
  personal project
*/

/*----------------create variable------------------*/
var canvas = new Object({}); //creates a new object called canvas
var mainSnake; //create the variable mainSnake
var Food; //creates the variable goodFood
var GoodFood2;
var BadFood; //creates the variable badFood
var BadFood2;
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
  mainColor = mainColor || 'black',

  //sets the outline color
  outlineColor = outlineColor || 'red';

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
  x = 10;

  //controls where the text is according to the y axis
  y = 15;

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

  //test to see if your pushing right left up or down and give nx or ny plus or minus
  this.nx = this.array[0].x;
  this.ny = this.array[0].y;
  var tail;
  switch (this.direction) {//testing directions
    case 'right':
      this.nx++;//adds one to nx for moving right one direction
      break;
    case 'left':
      this.nx--;//subtracts one to nx for moving left one direction
      break;
    case 'up':
      this.ny--;//subtracts one to ny for moving up one direction
      break;
    case 'down':
      this.ny++;//adds one to ny for moving down one direction
      break;
  }

  //testing to see if you are out of bounds or have collided with something and then quiting the game
  if (this.outsideBounds() || this.colliding()) {
    game.over();
    return;
  }

  //these next three if statements control if you gain or loss blocks when eating a specific food
  if (this.eatingFood()) {
    game.score++; //adds one to game score
    tail = {x: this.nx, y: this.ny}; //sets tail equal to nx and ny
    food = new Food(); //creates new food in a new location
    badfood = new BadFood(); //creates new badfood in a new location
    badfood2 = new BadFood2(); //creates new badfood in a new location
  } else {
    tail = this.array.pop();
    tail.x = this.nx; //if nothing is added or subtracted set tail x and y back to normal
    tail.y = this.ny;
  }

  if (this.eatingBadFood()) {
    game.score--; //subtracts one from game score
    tail = {x: this.nx, y: this.ny}; //sets tail equal to nx and ny
    badfood = new BadFood(); //creates new badfood in a new location
    badfood2 = new BadFood2(); //creates new badfood in a new location
    food = new Food(); //creates new food in a new location
    head = this.array.pop(); //pops one block off
    if (head === this.array[0]) { //test to see if no blocks are left over
      game.over();
    }
  } else {
    tail.x = this.nx; //if nothing is added or subtracted set tail x and y back to normal
    tail.y = this.ny;
  }

  if (this.eatingBadFood2()) {
    game.score = game.score - 3; //if this block is eaten subtract 3
    tail = {x: this.nx, y: this.ny}; //sets tail equal to nx and ny
    badfood2 = new BadFood2(); //creates new badfood in a new location
    badfood = new BadFood(); //creates new badfood in a new location
    food = new Food(); //creates new food in a new location
    head = this.array.pop(); //pops the head three times to remove 3 blocks
    head = this.array.pop();
    head = this.array.pop();
    if (head === this.array[2]) { //test to see if array holding the snake can support losing 3
      game.over();
    }
  } else {
    tail.x = this.nx; //if nothing is added or subtracted set tail x and y back to normal
    tail.y = this.ny;
  }

  this.array.unshift(tail);
  this.paint();
};
/*---------end of controlling snake------------*/

Snake.prototype.paint = function() {
  canvas.redraw(); //draws the canvas
  for (var i = 0; i < this.array.length; i++) {
    var j = this.array[i];
    canvas.paint(j.x, j.y, this.bodyColor, this.outlineColor); //sets the colors
  }
}; // end of paint

Snake.prototype.outsideBounds = function() {
  //checking to see if you went outside the canvas limits
  if (this.nx <= -1 || this.nx === canvas.width / canvas.cellWidth || this.ny <= -1 || this.ny === canvas.height / canvas.cellWidth) {
    return true;
  }

  return false;
};

Snake.prototype.eatingFood = function() {
  //test to see if you hit the location where this block of food is
  if (this.nx === food.x && this.ny === food.y) {
    return true;
  }

  return false;
}; // end of eatingFood

Snake.prototype.eatingBadFood = function() {
  //test to see if you hit the location where this block of food is
  if (this.nx === badfood.x && this.ny === badfood.y) {
    return true;
  }

  return false;
}; // end of eatingBadFood

Snake.prototype.eatingBadFood2 = function() {
  //test to see if you hit the location where this block of food is
  if (this.nx === badfood2.x && this.ny === badfood2.y) {
    return true;
  }

  return false;
}; // end of eatingBadFood2

Snake.prototype.colliding = function(x, y) {
  x = x || this.nx;
  y = y || this.ny;

  //checking to see if you hit something
  for (var i = 0; i < this.array.length; i++) {
    if (this.array[i].x === x && this.array[i].y === y) {
      return true;
    }
  }

  return false;
}; // end of colliding

function Food() {
  this.generateCoords = function() {
    //generates random locations for food
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
} //end of Food

function BadFood() {
  //generates random locations for food
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
    canvas.paint(this.x, this.y, 'purple');
  };

  this.generateCoords();
  this.checkCollision();
  this.draw();
} // end of BadFood

function BadFood2() {
  //generates random locations to place the food
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
    canvas.paint(this.x, this.y, 'purple');
  };

  this.generateCoords();
  this.checkCollision();
  this.draw();
} // end of BadFood2

var game = new Object({});
game.fps = 25; //speed of snake
game.score = 0; //initale set of score
game.scoreText = 'Blocks eaten: '; //gives score its text
game.drawScore = function() {
  canvas.paintText(this.scoreText + this.score); //paints the score and gives it text
}; //end of drawscore

game.runLoop = function() {
  setTimeout(function() {
    requestAnimationFrame(game.runLoop);
    mainSnake.move(); //starts the snake.move function

    //test to see if bad food has been created
    if (typeof badfood.draw != 'undefined') {
      badfood.draw();
    }

    // test to see if badfood has been created
    if (typeof badfood2.draw != 'undefined') {
      badfood2.draw();
    }

    // test to see if food has been created
    if (typeof food.draw != 'undefined') {
      food.draw();
    } //end of if

    game.drawScore(); //paints and creates the score keeper
  }, 1000 / game.fps); //controls snakes frame per second
}; // end of game.runloop

game.start = function() {
  mainSnake = new Snake(5, 'red', 'yellow', {x: 10, y: 10}); // creating a new snake with the colors and starting point
  food = new Food(); //creates food at the start of the game
  badfood = new BadFood(); //create badfood at the start of the game
  badfood2 = new BadFood2(); //creates badfood at the start of the game
  game.score = 0; //sets game score to 0 at each new game
}; //end of game.start

//game over function which takes you to deadsnake.html
game.over = function() {
  window.location.href = 'deadsnake.html';
}; //end of game.over

game.start(); //starts the game
game.runLoop(); //starts to loop

document.onkeydown = function(e) {
  if (typeof mainSnake !== 'undefined') {
    // used to catch the arrow keys on different browsers, only tested on chrome though
    var key = (e.keyCode ? e.keyCode : e.which);
    var td;
    if (mainSnake.nd.length) {
      td = mainSnake.nd[mainSnake.nd.length - 1];
    } else {
      td = mainSnake.direction;
    } //end of else

    //watches the arrow key strokes to catch the direction needed to go
    if (key == '37' && mainSnake.direction != 'right') {
      mainSnake.nd.push('left');
    } else if (key == '38' && mainSnake.direction != 'down') {
      mainSnake.nd.push('up');
    } else if (key == '39' && mainSnake.direction != 'left') {
      mainSnake.nd.push('right');
    } else if (key == '40' && mainSnake.direction != 'up') {
      mainSnake.nd.push('down');
    } // end of last else if
  } // en of first if
}; //end of on key

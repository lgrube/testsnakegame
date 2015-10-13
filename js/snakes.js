/*
  luke grube
  javascript file for snake
  personal project
*/

/*----------------create variable------------------*/
var canvas = new Object(); //creates a new object called canvas
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

/*----------------end colored text-----------*/

/*-------------create the canvas---------*/

//calls the redraw function to create the canvas
canvas.redraw();

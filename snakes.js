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
canvas.redraw = function(fillColor, strokeColor) {
  //creates the canvas colors
  fillColor = fillColor || 'orangered',
  strokeColor = strokeColor || 'black';

  this.paint(0,0, fillColor, strokeColor, this.width, this.height);
};
/*-----------end drawing canvas-----------------*/

/*------------giving the canvas its color-------*/
canvas.paint = function(x,y, fillColor, strokeColor, width, height){
  width = width ||this.cellWidth,
  height = height || this.cellWidth,
  fillColor = fillColor || 'purple',
  strokeColor = strokeColor || 'pink';

  this.context.fillStyle = fillColor;
  this.context.fillRect(x*canvas.cellWidth, y*canvas.cellWidth, width, height);
  this.context.strokeStyle = strokeColor;
  this.context.strokeRect(x*canvas.cellWidth, y*canvas.cellWidth, width, height);
};
/*-------------end canvas color--------------*/

/*---------------colored text----------------*/

/*----------------end colored text-----------*/

/*-------------create the canvas---------*/
canvas.redraw();

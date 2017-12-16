var layout = document.getElementById('layout');

var cli = document.getElementById('cli');
var inputBox = document.getElementById('cli-text');
var queryFill = document.getElementById('query-fill');

var input;
var oldInput;

var cursorX;
var cursorY;

var gridSize = 50;
var gridSizeLimit = 24;

var inEdit = false;

var dotSize = 0.5;
var dotR = 0;
var dotG = 0;
var dotB = 0;
var dotA = 1;

var emptyFill = [
"create",
"grid",
"theme",
"post",
"destroy"
];

var createFill = [
"feed",
"post",
"notifier",

"chat",
"profile",
"stats",

"trends",
"recommends",
"moments",

"search",
"empty"
];

var gridFill = [
"size",
"padding",
"radius"
];

var themeFill = [
"text",
"background",
"window",
"highlight"
];

var colorFill = [
"#HEXCOL"
];

var numberFill = [
"_number_"
];

function fitToContainer() {
	grid.style.width = '100%';
	grid.style.height = '100%';
	grid.width = grid.offsetWidth;
	grid.height = grid.offsetHeight;
}

document.onmousemove = function (event) {
	cursorX = event.pageX;
	cursorY = event.pageY;
}

inputBox.onpaste = function(e) {
	e.preventDefault();
}

cli.onclick = function() {
	inputBox.focus();
}

function cliHandle(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		inputBox.value = null;

		if (input.toLowerCase().startsWith("create")) {
			var type = input.substring(6, input.length).trim();
			createWindow(type);
		} else if (input.toLowerCase().startsWith("grid size ")) {
			var newGrid = parseInt(input.substring(10, input.length).trim());
			if (newGrid > gridSizeLimit) resizeGrid(newGrid);
		} else if (input.toLowerCase().startsWith("grid padding ")) {
			var newPadding = parseInt(input.substring(13, input.length).trim());
			if (newPadding >= 0) updatePadding(newPadding);
		} else if (input.toLowerCase().startsWith("grid radius ")) {
			var newRadius = parseInt(input.substring(12, input.length).trim());
			if (newRadius >= 0) updateRadius(newRadius);
		} else if (input.toLowerCase().startsWith("destroy")) {
			destroyWindow();
		}
	}	
}

window.addEventListener("resize", function() {
	fitToContainer();
	drawDots();
});

window.addEventListener("DOMContentLoaded", function () {
	setup();
});

function setup() {
	fitToContainer();
	drawDots();
	window.requestAnimationFrame(loop);
}

function loop() {
	input = inputBox.value;

	resizeInput();

	if (oldInput == input) {

	} else {
		if (input == '') {
			setQueryFill(emptyFill);
		} else if (input == 'create ') {
			setQueryFill(createFill);
		} else if (input == 'grid ') {
			setQueryFill(gridFill);
		} else if (input == 'theme ') {
			setQueryFill(themeFill);
		} else if (input == 'theme text ' || input == 'theme background ' || input == 'theme highlight ' || input == 'theme window ') {
			setQueryFill(colorFill);
		} else if (input == 'grid size ' || input == 'grid padding ' || input == 'grid radius ') {
			setQueryFill(numberFill);
		} else queryFill.innerHTML = '';

		oldInput = input;
	}

	window.requestAnimationFrame(loop);
}

function resizeInput() {
	var len;
	if (input.length == 0) len = 70;
	else len = (input.length) * 8;
	inputBox.style.width = len;
}

function setQueryFill(fills) {
	var text = fills[0];
	for (var i = 1; i < fills.length; i++) {
		text += ' ' + fills[i];
	}
	queryFill.innerHTML = text;
}
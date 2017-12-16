var windows = [];
var windowCount = 0;
var pickedWindowDiv;
var lastWindowDiv;
var pickedUp = false;
var resizing = false;
var resizeGrabSize = 20;

function createWindow(type) {
	
	switch (type) {
		case 'empty':
			createEmpty();
			break;

		case 'feed':
			createFeed();
			break;
	}
}

function destroyWindow() {
	layout.removeChild(lastWindowDiv);
}

function updatePadding(newPadding) {
	for (var i = 0; i < windows.length; i++) {
		windows[i].style.padding = newPadding + 'px';
	}
}

function updateRadius(newRadius) {
	for (var i = 0; i < windows.length; i++) {
		windows[i].style.borderRadius = newRadius + 'px';
	}
}

function mouseDown(e) {
	var div = e.target;
	lastWindowDiv = div;
	x_pos = e.clientX - div.offsetLeft;
	y_pos = e.clientY - div.offsetTop;
	window.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
	if (!pickedUp) {
		pickedWindowDiv = e.target;
		pickedUp = true;
	}

	var divXOffset = parseInt(pickedWindowDiv.style.left);
	var divWidth = pickedWindowDiv.clientWidth;
	var divYOffset = parseInt(pickedWindowDiv.style.top);
	var divHeight = pickedWindowDiv.clientHeight;

	if (e.clientX < divXOffset + divWidth && e.clientX > divXOffset + divWidth - resizeGrabSize && e.clientY < divYOffset + divHeight && e.clientY > divYOffset + divHeight - resizeGrabSize || resizing == true) {
		resizing = true;
		pickedWindowDiv.style.width = Math.floor((e.clientX - divXOffset + resizeGrabSize) / gridSize) * gridSize + 'px';
		pickedWindowDiv.style.height = Math.floor((e.clientY - divYOffset + resizeGrabSize) / gridSize) * gridSize + 'px';
	} else if (!resizing) {
		pickedWindowDiv.style.top = Math.floor((e.clientY - y_pos) / gridSize) * gridSize + 'px';
		pickedWindowDiv.style.left = Math.floor((e.clientX - x_pos) / gridSize) * gridSize + 'px';
	}
}

function mouseUp() {
	pickedUp = false;
	pickedWindowDiv = null;
	resizing = false;
	window.removeEventListener('mousemove', divMove, true);
}

window.addEventListener('mouseup', mouseUp, false);

function createEmpty() {
	var win = document.createElement('div');
	win.className = "window";
	win.addEventListener('mousedown', mouseDown, false);

	layout.append(win);
	windows.push(win);
	windowCount++;
}

function createFeed() {
	var win = document.createElement('div');
	win.className = "window";
	win.id = "feedline";
	win.addEventListener('mousedown', mouseDown, false);

	layout.append(win);
	windows.push(win);
	windowCount++;

	loadProfile();
}
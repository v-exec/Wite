var grid = document.getElementById('grid');
var ctx = grid.getContext('2d');

function drawDot(x, y) {
	ctx.beginPath();
	ctx.arc(x, y, dotSize, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fillStyle = "rgba("+dotR+", "+dotG+", "+dotB+", "+dotA+")";
	ctx.fill();
}

function drawDots() {
	ctx.clearRect(0, 0, grid.width, grid.height);

	for (var i = -gridSize; i <= grid.width + gridSize; i += gridSize) {
		for (var j = -gridSize; j <= grid.height + gridSize; j += gridSize) {
			drawDot(i, j);
		}
	}
}

function resizeGrid(newSize) {
	gridSize = newSize;

	for (var i = 0; i < windows.length; i++) {
		windows[i].style.left = Math.floor(parseInt(windows[i].style.left) / gridSize) * gridSize + 'px';
		windows[i].style.top = Math.floor(parseInt(windows[i].style.top) / gridSize) * gridSize + 'px';
		
		var divXOffset = parseInt(windows[i].style.left + windows[i].clientWidth);
		var divYOffset = parseInt(windows[i].style.top + windows[i].clientHeight);

		windows[i].style.width = Math.floor(windows[i].clientWidth / gridSize) * gridSize + 'px';
		windows[i].style.height = Math.floor(windows[i].clientHeight / gridSize) * gridSize + 'px';
	}

	drawDots();

	window.requestAnimationFrame(loop);
}
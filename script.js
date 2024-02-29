var gridHeight = 400;
var gridWidth = 600;

var cellSize = 10;
var cellsPerRow = gridWidth / cellSize;
var cellsPerColumn = gridHeight / cellSize;

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var matrix;

function initializeMatrix() {
  console.log(1231231);
  matrix = new Array(cellsPerRow).fill(0);

  for (var [columnIndex, column] of matrix.entries()) {
    var row = new Array(cellsPerColumn).fill(0);
    matrix[columnIndex] = row;
  }

  printMatrix();
}

initializeMatrix();

function printMatrix() {
  for (var [rowIndex, row] of matrix.entries()) {
    for (var [colIndex, cell] of row.entries()) {
      const x = rowIndex * cellSize;
      const y = colIndex * cellSize;

      context.beginPath();
      context.rect(x, y, cellSize, cellSize);

      if (cell) {
        context.fillStyle = "blue";
      } else {
        context.fillStyle = "white";
      }

      context.fillRect(x, y, cellSize, cellSize);
      context.strokeStyle = "#ccc";
      context.stroke();
    }
  }
}

function checkSides(x, y) {
  var localNeighbors = 0;
  if (matrix[x]) {
    if (matrix[x][y - 1]) {
      localNeighbors++;
    }

    if (matrix[x][y]) {
      localNeighbors++;
    }

    if (matrix[x][y + 1]) {
      localNeighbors++;
    }
  }

  return localNeighbors;
}

function checkNeighbors(x, y) {
  var totalNeighbors = 0;

  totalNeighbors += checkSides(x - 1, y);
  totalNeighbors += checkSides(x, y);
  totalNeighbors += checkSides(x + 1, y);

  if (matrix[x][y]) {
    totalNeighbors--;
  }

  return totalNeighbors;
}

function process() {
  const newMatrix = matrix.map(function (row) {
    return row.slice();
  });

  for (var [rowIndex, row] of matrix.entries()) {
    for (var [colIndex, cell] of row.entries()) {
      const totalNeighbors = checkNeighbors(rowIndex, colIndex);

      if (cell && totalNeighbors <= 1) {
        newMatrix[rowIndex][colIndex] = 0;
      }

      if (cell && totalNeighbors >= 4) {
        newMatrix[rowIndex][colIndex] = 0;
      }

      if (!cell && totalNeighbors === 3) {
        newMatrix[rowIndex][colIndex] = 1;
      }
    }
  }

  matrix = newMatrix;
}

var interval;

function start() {
  interval = setInterval(function () {
    printMatrix();
    process();
  }, 100);
}

function stop() {
  clearInterval(interval);
}

canvas.addEventListener("click", function (event) {
  var x = Math.floor(event.offsetX / cellSize);
  var y = Math.floor(event.offsetY / cellSize);

  matrix[x][y] = !matrix[x][y];
  printMatrix();
});

canvas.addEventListener("mousedown", function () {
  canvas.addEventListener("mousemove", handleDraw);
});

function handleDraw(event) {
  var x = Math.floor(event.offsetX / cellSize);
  var y = Math.floor(event.offsetY / cellSize);

  matrix[x][y] = 1;
  printMatrix();
}

canvas.addEventListener("mouseup", function () {
  canvas.removeEventListener("mousemove", handleDraw);
});

function selectShape(shape) {
  window[shape].forEach((row, rowIndex) =>
    row.forEach((cell, columnIndex) => {
      matrix[rowIndex][columnIndex] = cell;
    })
  );

  printMatrix();
}

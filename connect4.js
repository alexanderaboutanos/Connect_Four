/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++){
    board.push([])
    for (let j = 0; j < WIDTH; j ++){
      board[i].push(null)
    };
  };
};

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board")

  // create a new table row for the top of the board, add an id, add an eventListener
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // add cells within the top table row to match the width, add ids, attach the cells into the row.
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // now that we've created the special case first row, we must create the rest of the HTML board...
  // add rows and cells within each row, with corresponding ids
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let y = 0;
  for (let i = (HEIGHT-1); i >= 0; i--){

    // check if top cell is filled, if so, return null
    if (board[0][x] !== null){
      return y = null;
    };

    // find topmost empty cell, return that height
    if (board[i][x] === null){
      return y = i; 
    };
  };
  return y
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div, add a class of player#, and insert it into correct table cell
  let newDiv = document.createElement("div");
  newDiv.classList.add("piece", `p${currPlayer}`);
  let targetTd = document.getElementById(`${y}-${x}`);
  targetTd.append(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table, and update in-memory board
  placeInTable(y, x);
  board[y].splice(x, 1, currPlayer);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie --> if all cells in board are filled call endGame 
  let isEntireBoardFilled = board.every((row) => {row.every((cellVal) => cellVal !== null)})
  if (isEntireBoardFilled){endGame("Tie!")}

  // switch players --> currPlayer 1 <-> 2 
  currPlayer === 1 ? currPlayer += 1 : currPlayer -= 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // iterate through each cell, setting variables equal to 4 nested arrays. for each set of nested arrays, check to see if all cells match the current player.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

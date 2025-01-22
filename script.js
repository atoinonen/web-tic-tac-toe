const gameboard = function(){
    let board = [[undefined,undefined,undefined],[undefined,undefined,undefined],[undefined,undefined,undefined]];

    function checkLine(line){
        if(line.every((mark) => mark === "x")) {
            return [true, "x"];
        }
        if(line.every((mark) => mark === "o")) {
            return [true, "o"];
        }
        return [false, undefined];
    }

    function checkWin(){
        let won;
        let winner;

        for (let row = 0; row < 2; row++){
            [won, winner] = checkLine(board[row]);
            if (won) return [true, winner];
        }

        for (let col = 0; col < 2; col++){
            let boardCol = [board[0][col], board[1][col], board[2][col]];
            [won, winner] = checkLine(boardCol);
            if (won) return [true, winner];
        }

        [won, winner] = checkLine([board[0][0],board[1][1],board[2][2]]);
        if (won) return [true, winner];
        [won, winner] = checkLine([board[2][0],board[1][1],board[0][2]]);
        if (won) return [true, winner];

        return [false, undefined];
    }

    function checkTie(){
        if(board.flat().includes(undefined)) return false;
        const [won, _] = checkWin()
        return !won;
    }

    function place_(isX, row, col){
        mark = isX ? "x" : "o";
        if (board[row][col] !== undefined){
            throw "Coordinates already populated"; 
        }
        board[row][col] = mark;
        return;
    }

    function placeX(row, col){
        return place_(true, row, col);
    }

    function placeO(row, col){
        return place_(false, row, col);
    }

    function getBoard(){
        return board;
    }

    return {placeX, placeO, getBoard, checkWin, checkTie};
}();

const game = function(){
    let player1Turn = true;

    function placeMark(row, col){
        if(player1Turn){
            gameboard.placeO(row, col);
        }else{
            gameboard.placeX(row, col);
        }
        player1Turn = !player1Turn;

        let won, winner;

        [won, winner] = gameboard.checkWin();
        if (won){
            return {won, tie:false, winner};
        }
        return {won:false, tie:gameboard.checkTie(), winner:undefined};
    }

    getBoard = gameboard.getBoard;

    return {placeMark, getBoard};
}();


function drawGameboard(){
    var gameOver = false;
    const gameboard = document.getElementById("gameboard");
    let color = "rgb(230, 103, 103)";
    let othercolor = "rgb(194, 44, 44)"
    for (let row = 0; row <= 2; row++){
        for (let col = 0; col <= 2; col++){
            const square = document.createElement("div");
            square.id = row.toString() + col.toString();
            square.addEventListener("click", () => {
                if (gameOver) return;
                const {won, tie, winner} = game.placeMark(row, col);
                drawMarks();
                if (tie || won) gameOver = true;
                if (won) console.log(winner + " won!");
                if (tie) console.log("Tie!");
            });
            square.style.backgroundColor = color;
            [color, othercolor] = [othercolor, color];
            gameboard.appendChild(square);
        }
    }
}

function drawMarks(){
    const gameboard = game.getBoard()
    for (let row = 0; row <= 2; row++){
        for (let col = 0; col <= 2; col++){
            const mark = gameboard[row][col];
            const square = document.getElementById(row.toString() + col.toString());
            if (mark === "x"){
                square.textContent = "X";
            }
            if (mark === "o"){
                square.textContent = "O";
            }
        }
    }
}

drawGameboard();
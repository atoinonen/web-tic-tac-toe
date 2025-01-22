const gameboard = function () {
    let board = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]];

    function checkLine(line) {
        if (line.every((mark) => mark === "x")) {
            return [true, "x"];
        }
        if (line.every((mark) => mark === "o")) {
            return [true, "o"];
        }
        return [false, undefined];
    }

    function checkWin() {
        let won;
        let winner;

        for (let row = 0; row < 2; row++) {
            [won, winner] = checkLine(board[row]);
            if (won) return [true, winner];
        }

        for (let col = 0; col < 2; col++) {
            let boardCol = [board[0][col], board[1][col], board[2][col]];
            [won, winner] = checkLine(boardCol);
            if (won) return [true, winner];
        }

        [won, winner] = checkLine([board[0][0], board[1][1], board[2][2]]);
        if (won) return [true, winner];
        [won, winner] = checkLine([board[2][0], board[1][1], board[0][2]]);
        if (won) return [true, winner];

        return [false, undefined];
    }

    function checkTie() {
        if (board.flat().includes(undefined)) return false;
        const [won, _] = checkWin()
        return !won;
    }

    function place_(isX, row, col) {
        mark = isX ? "x" : "o";
        if (board[row][col] !== undefined) {
            throw "Coordinates already populated";
        }
        board[row][col] = mark;
        return;
    }

    function placeX(row, col) {
        return place_(true, row, col);
    }

    function placeO(row, col) {
        return place_(false, row, col);
    }

    function getBoard() {
        return board;
    }

    function clearBoard() {
        board = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]];
    }

    return { placeX, placeO, getBoard, checkWin, checkTie, clearBoard };
}();

const game = function () {
    let player1Turn = true;

    function placeMark(row, col) {
        if (player1Turn) {
            gameboard.placeO(row, col);
        } else {
            gameboard.placeX(row, col);
        }
        player1Turn = !player1Turn;

        let won, winner;

        [won, winner] = gameboard.checkWin();
        if (won) {
            return { won, tie: false, winner };
        }
        return { won: false, tie: gameboard.checkTie(), winner: undefined };
    }

    function whoseTurn() {
        if (player1Turn) {
            return "o";
        }
        return "x";
    }

    getBoard = gameboard.getBoard;
    clearBoard = gameboard.clearBoard

    return { placeMark, whoseTurn, getBoard, clearBoard };
}();

const ui = function () {
    let gameOver = false;
    let oPoints = 0;
    let xPoints = 0;
    let ties = 0;

    const player1Points = document.createElement("p");
    const tiePoints = document.createElement("p");
    const player2Points = document.createElement("p");

    function drawGameboard() {
        const gameboard = document.getElementById("gameboard");
        let color = "rgb(230, 103, 103)";
        let othercolor = "rgb(194, 44, 44)"
        for (let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                const square = document.createElement("div");
                square.id = row.toString() + col.toString();
                square.addEventListener("click", () => {
                    if (gameOver) return;
                    const { won, tie, winner } = game.placeMark(row, col);
                    drawMarks();
                    if (tie || won) gameOver = true;
                    if (tie) {
                        console.log("Tie!");
                        ties += 1;
                        tiePoints.textContent = ties.toString();
                    }
                    if (won) {
                        console.log(winner + " won!");
                        if (winner === "o") {
                            oPoints += 1;
                            player1Points.textContent = oPoints.toString();
                        }
                        if (winner === "x") {
                            xPoints += 1;
                            player2Points.textContent = xPoints.toString();
                        }
                    }
                });
                square.style.backgroundColor = color;
                [color, othercolor] = [othercolor, color];
                gameboard.appendChild(square);
            }
        }
    }

    function drawMarks() {
        const gameboard = game.getBoard()
        for (let row = 0; row <= 2; row++) {
            for (let col = 0; col <= 2; col++) {
                const mark = gameboard[row][col];
                const square = document.getElementById(row.toString() + col.toString());
                if (mark === "x") {
                    square.textContent = "X";
                }
                if (mark === "o") {
                    square.textContent = "O";
                }
                if (mark === undefined) {
                    square.textContent = "";
                }
            }
        }
    }

    function drawHud() {
        drawGameboard();
        const hud = document.getElementById("hud");

        const newGameButton = document.createElement("button");
        newGameButton.textContent = "New Game";
        newGameButton.addEventListener("click", newGame);
        hud.appendChild(newGameButton);

        const pointBoard = document.createElement("div");
        pointBoard.id = "point-board";
        hud.appendChild(pointBoard);

        const player1Name = document.createElement("p");
        player1Name.textContent = "Player O";
        player1Name.contentEditable = true;
        pointBoard.appendChild(player1Name);

        const tieName = document.createElement("p");
        tieName.textContent = "Ties";
        pointBoard.appendChild(tieName);

        const player2Name = document.createElement("p");
        player2Name.textContent = "Player X";
        player2Name.contentEditable = true;
        pointBoard.appendChild(player2Name);


        player1Points.textContent = oPoints.toString();
        pointBoard.appendChild(player1Points);


        tiePoints.textContent = ties.toString();
        pointBoard.appendChild(tiePoints);


        player2Points.textContent = xPoints.toString();
        pointBoard.appendChild(player2Points);
    }

    function newGame() {
        game.clearBoard();
        gameOver = false;
        drawMarks();
    }

    return { drawHud };
}();

ui.drawHud();
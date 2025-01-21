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
            if (won) return true;
        }

        for (let col = 0; col < 2; col++){
            let boardCol = [board[0][col], board[1][col], board[2][col]];
            [won, winner] = checkLine(boardCol);
            if (won) return true;
        }

        [won, winner] = checkLine([board[0][0],board[1][1],board[2][2]]);
        if (won) return true;
        [won, winner] = checkLine([board[2][0],board[1][1],board[0][2]]);
        if (won) return true;

        return false;
    }

    function place_(isX, row, col){
        mark = isX ? "x" : "o";
        if (board[row][col] !== undefined){
            throw "Coordinates already populated"; 
        }
        board[row][col] = mark;
        return checkWin();
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

    return {placeX, placeO, getBoard};
}();
// p5js dom manipulation
let canvas;
let socket;
let grid;
let dom;

let maxShipsCount;
let shipsCount;
let gameSetupInProgress;
let gameInProgress;
let playerId;
let otherGameData;
let winner = '';

function setup() {
    canvas = {
        width: window.innerWidth * 0.85,
        height: window.innerHeight * 0.85
    };

    otherGameData = [];

    winner = 'A';

    gameSetupInProgress = false;
    gameInProgress = false;

    socket= io.connect('http://192.168.0.102:3000/');

    createCanvas(canvas.width, canvas.height);
    background(33);

    dom = new DOM();
    dom.initialize();

    socket.on('clientConnected', 
    // On receiving client count data
    function(data) {
        gameSetupInProgress = true;
        gameInProgress = false;

        playerId = data.playerId;
        grid = new Grid(data.rows, data.columns);

        initializeScreen();

        shipsCount = 0;
        maxShipsCount = data.maxShips;
    }
    );

    if(socket.connected && grid == undefined) {
        socket.emit('requestConnection', true);
    }

    socket.on('beginPlaying',
    // Once all clients are done setting up their layouts, the server would send a signal allowing the game to progres
    function(data) {
        console.log('Got the go ahead from the server. Let the massacre begin');
        gameInProgress = true;
    }
    );

    socket.on('otherGameData',
    function(data) {
        combineData(otherGameData, data);
    }
    );

    socket.on('clickData',
    // On receiving click data from the server, highlight the cell based on the nature of the cell
    function(data) {
        console.log('received click data from server');
        grid.attack(data.row, data.column);

        if(grid.isGameOver()) {
            socket.emit('gameOver', true);
        }
    }
    );

    socket.on('winner',
    function(data) {
        gameInProgress = false;
        winner = data;
        
    }
    )
}

function draw() {
    // Do nothing
    let message = '';
    if(!gameInProgress && !gameSetupInProgress) {
        message = 'Waiting for other players to submit';
    }
    if(gameInProgress) {
        message = 'Begin Playing!';
    }
    else if(gameSetupInProgress) {
        message = 'Setup Phase';
    }
    else if(winner != 'A') {
        message = 'Winner ' + winner + '\n Game Over';
    }

    textSize(15);
    strokeWeight(1);
    noFill();
    text(message, canvas.width * 0.35, canvas.height - 60);
}

// When mouse button is clicked inside the canvas, treat it as selecting a particular cell in the grid. Emit the same data to the server
function mouseClicked() {
    // Only consider clicks within the bounds of the canvas
    if(
       (shipsCount <= maxShipsCount) &&
       (gameSetupInProgress || gameInProgress) && 
       (mouseX >= 0 && mouseX <= (grid.columns * grid.width) ) && 
       (mouseY >= 0 && mouseY <= (grid.rows * grid.height) )
      ) {
        let row = floor(mouseY / grid.height);
        let column = floor(mouseX / grid.width);
        var data = {
            row: row,
            column: column
        };
    
        if(gameInProgress) {
            grid.defaultHighlight(row, column);
            if(hasShip(row, column)) {
                grid.attackShip(row, column);
            }
            else {
                grid.emptyCell(row, column);
            }
            socket.emit('clickData', data); 
        }
        else {
            shipsCount++;
            grid.addShip(row, column);
        }
    }
}

function initializeScreen() {
    background(33);

    grid.initializeGrid();

    grid.data.forEach(function(item, index) {
        otherGameData.push(0);
    });

    textSize(15);
    strokeWeight(1);
    noFill();
    text('Player ' + playerId, canvas.width * 0.35, canvas.height - 20);
}

function combineData(localData, serverData) {
    serverData.forEach(function(item, index) {
        localData[index] = localData[index] + serverData[index];
    });
}

function hasShip(row, column) {
    let index = grid.getIndex(row, column);
    return otherGameData[index] > 0;
}
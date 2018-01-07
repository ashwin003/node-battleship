// Using expressjs
var express = require('express');

// Create the app
var app = express();

// Set up the server
var server = app.listen(process.env.PORT || 3000, '192.168.0.102', listen);

// Callback to let us know that the server has started
function listen() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server started and listening at http://' + host + ':' + port);
}

// Global variables for the game
let gameInProgress = false; // Used to block new clients from joining once the game has begun
let gameSetupDone = false;  // have the clients set up their boards
let clients = [];
let lostGamers = [];
let doneSettingUp = [];

app.use(express.static('public'));

// Websockets
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
io.sockets.on('connection', connected);
function connected(socket) {

    socket.on('clickData', function(data) {
        console.log('Received click data from ' + socket.id + ' at location (' + data.row + ', ' + data.column + ')');
        socket.broadcast.emit('clickData', data);
    });

    socket.on('gameData', function(data) {
        console.log('Received game data from ' + socket.id + ' having ' + data.length + ' entries and ' + sum(data) + ' points');

        gameInProgress = true;

        doneSettingUp.push(socket.id);

        socket.broadcast.emit('otherGameData', data);

        if(doneSettingUp.length == clients.length) {
            console.log('All players set, let the game begin!');

            socket.broadcast.emit('beginPlaying', true);
            socket.emit('beginPlaying', true);
        }
    });

    // Once a client sends a gameover signal, remove it from the list of active players and add them to lost players. Once all but one players are eliminated, the server declares the winner
    socket.on('gameOver', function(data) {
        remove(clients, socket.id);
        lostGamers.push(socket.id);
        if(clients.length == 1) {
            socket.broadcast.emit('winner', clients[0]);
            socket.emit('winner', clients[0]);
        }
    });

    if (!gameInProgress) {       // If the game is not in progress
        clients.push(socket.id); // Add new client to the game

        console.log('New client # ' + socket.id);
        console.log('Number of clients ' + clients.length);

        var data = {
            playerId: socket.id,
            rows: 6,
            columns: 6,
            maxShips: 6
        };

        socket.emit('clientConnected', data); // Broadcast the client count to the client
    }

    socket.on('requestConnection',
    function(data) {
        socket.emit('clientConnected', data); // Broadcast the client count to the client
    }
    )

    // Handle disconnecting clients
    socket.on('disconnect', function() {
        console.log('Client # ' + socket.id + ' disconnected');
        remove(clients, socket.id);
        remove(doneSettingUp, socket.id);
        console.log('Number of clients ' + clients.length);
    });
}

// Remove an element from the array, if it exists
function remove(array, element) {
    var index = array.indexOf(element);

    if(index > -1) {
        array.splice(index, 1);
    }
}

function sum(array) {
    return array.reduce(function(total, num) {
        return total + num;
    });
}
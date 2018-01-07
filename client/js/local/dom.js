// All non-p5js dom manipulation done here
var controlsContainer;

var completedSetupButton;
var resetButton;

function DOM() {
    this.initializeContainers = function() {
        controlsContainer = document.createElement('div');
        controlsContainer.setAttribute('id', 'control-container');
        document.getElementsByTagName('body')[0].appendChild(controlsContainer);
    }

    this.initializeButtons = function() {
        completedSetupButton = document.createElement('button');
        completedSetupButton.setAttribute('class', 'setupComplete');
        completedSetupButton.setAttribute('value', 'Complete Setup');
        completedSetupButton.innerText = 'Submit Layout';
        completedSetupButton.addEventListener('click', submitLayout);
        document.getElementById('control-container').appendChild(completedSetupButton);

        // TODO: Add a "Reset" button to clear all highlighted cells
        resetButton = document.createElement('button');
        resetButton.setAttribute('class', 'resetButton');
        resetButton.setAttribute('value', 'Reset Layout');
        resetButton.innerText = 'Reset Layout';
        resetButton.addEventListener('click', resetLayout);
        document.getElementById('control-container').appendChild(resetButton);
    }

    this.initialize = function() {
        this.initializeContainers();
        this.initializeButtons();
    }
}

function submitLayout() {
    gameSetupInProgress = false;
    socket.emit('gameData', grid.data);
}

function resetLayout() {
    gameSetupInProgress = true;
    gameInProgress = false;
    clear();
    initializeScreen();
}
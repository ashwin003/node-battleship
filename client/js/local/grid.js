function Grid(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.width = canvas.width / columns;
    this.height = canvas.height / (rows + 1);
    this.borderSize = 2;

    this.emptyCellClickedColor = 'rgba(244, 67, 54, 0.5)';
    this.shipCellClickedColor = 'rgba(171, 71, 188, 0.5)';
    this.ownShipColor = 'rgba(0, 230, 118, 0.5)';
    this.addShipColor = 'rgba(0, 229, 255, 0.5)';
    this.data = [];

    // Draw the initial empty grid with the specified number of rows and columns
    this.initializeGrid = function() {
        noFill();
        strokeWeight(this.borderSize);
        stroke(200);
        this.data.splice(0, this.data.length);

        for(var column = 0; column < this.columns; column++) {
            for(var row = 0; row < this.rows; row++) {
                this.data.push(0);
                rect(column * this.width, row * this.height, this.width, this.height);
            }
        }
    }

    // Highlight the clicked cell
    this.highlight = function(rowNumber, columnNumber, highlightType) {
        var color = this.emptyCellClickedColor;
        switch(highlightType) {
            case 'empty':
            color = this.emptyCellClickedColor;
            break;
            case 'ownShip':
            color = this.ownShipColor;
            break;
            case 'otherShip':
            color = this.shipCellClickedColor;
            break;
            case 'addShip':
            color = this.addShipColor;
            break;
            default:
            color = '33';
        }

        fill(color);
        noStroke();
        rect(columnNumber * this.width + this.borderSize, rowNumber * this.height +  + this.borderSize, this.width - (2 * this.borderSize), this.height - (2 * this.borderSize));   
    }

    // Add a ship to the specified cell
    this.addShip = function(rowNumber, columnNumber) {
        this.highlight(rowNumber, columnNumber, 'addShip');
        this.data[this.getIndex(rowNumber, columnNumber)]++;
    }

    // Attack the ship placed at the specified cell
    this.attackShip = function(rowNumber, columnNumber) {
        this.highlight(rowNumber, columnNumber, 'otherShip');
        this.data[this.getIndex(rowNumber, columnNumber)] = this.data[this.getIndex(rowNumber, columnNumber)] -1;
    }

    // Indicate that an empty cell has been clicked on
    this.emptyCell = function(rowNumber, columnNumber) {
        this.highlight(rowNumber, columnNumber, 'empty');
    }

    // Default highlighting for the cell
    this.defaultHighlight = function(rowNumber, columnNumber) {
        this.highlight(rowNumber, columnNumber, 'default');
    }

    // Attack the specifed cell
    this.attack = function(rowNumber, columnNumber) {
        let index = this.getIndex(rowNumber, columnNumber);
        let value = this.data[index];
        
        this.defaultHighlight(rowNumber, columnNumber);

        if(value > 0) {
            this.attackShip(rowNumber, columnNumber);
        }
        else {
            this.emptyCell(rowNumber, columnNumber);
        }
    }

    // If the total score points goes to zero, "GAME OVER!!!"
    this.isGameOver = function() {
        return this.getTotalPoints() == 0;
    }

    // Return the index of the array in which click data is stored
    this.getIndex = function(row, column) {
        return (row * this.columns) + column;
    }

    // Gets the total points added to the board so far
    this.getTotalPoints = function() {
        return this.data.reduce(function(total, num) {
            return total + num;
        });
    }
}
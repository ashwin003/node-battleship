Planned flow
1. Players connect to the node server
2. Once more than 1 players have connected, server starts the game and initiates "Setup Phase"
3. Setup Phase
    Game allocates equal number of ships to each player
    They are given a 6x6 grid to arrange the ships as they please
    Once done, players hit the "Done" button
    Game moves on to the next phase (Game) once all players are done
4. Game
    Server broadcasts the grid setup of all players to each other
    Players receive this, and store in their localStorage
    Players can only see their own ship positions
    From then on, game logic is done client-side
    Clicking on a cell with a ship will explode the said ship
    Clicks are sent to the server to sync with other players
    Exploded empty cells and exploded ships are highlighted differently
    Once all ships of a player are eliminated, that person quits being a player and is delgated to being an observer (can only observe, not interact)
    Once all but one player are eliminated, the winner is declared to all

==============================================================================================================
Thoughts for the current version
1. Maybe decide on a fixed number of players instead of being a free-for-all, or
2. Setting an alpha-player who can decide when to start the game, thereby disallowing more players from joining
3. Change the server address to suit your needs

==============================================================================================================
Path to future versions
1. Ships occupying multiple cells
2. Ships with varying "strengths" (number of hits it can take before exploding)
3. Players can align the ships as they desire (vertical/horizontal)
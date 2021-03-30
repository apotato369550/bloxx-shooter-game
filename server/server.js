const io = require("socket.io")();
const { gameLoop, addPlayer, getUpdatedVelocity, initializeGame, getProjectileAngle, addProjectile } = require("./game");
const { FRAME_RATE } = require("./constants");
const { makeID } = require("./utils");

const rooms = {};
const state = {};

// IT FUCKING WORKS LET'S GOOOOOO

io.on("connection", client => {
    
    // create handle onclick function for all players
    // receive click event
    client.on("click", handleClick);
    client.on("keydown", handleKeyDown);
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);

    function handleJoinGame(gameCode){

        const room = io.sockets.adapter.rooms[gameCode];

        let allUsers;
        if(room){
            allUsers = room.sockets;
        }

        let clients;
        if(allUsers){
            clients = Object.keys(allUsers).length;
        }
        
        // for some reason, this does not work??
        // work on this
        // add condition for empty gameCode
        if(clients == 0 || !gameCode){
            client.emit("unknownGame");
            return;
        } else if(clients > 4){
            client.emit("tooManyPlayers");
            return;
        }

        rooms[client.id] = gameCode;

        addPlayer(state[gameCode]);
        client.join(gameCode);
        client.number = state[gameCode].players.length;
        console.log(client.number);

        // this works now
        let dimensions = {
            width: state[gameCode].width,
            height: state[gameCode].height
        }

        let game = {
            playerNumber: client.number,
            dimensions: dimensions
        }

        console.log(game);
        client.emit("initialize", JSON.stringify(game));
    }

    function handleNewGame(dimensions){
        // handle receiving canvas dimensions and set state's canvas dimentions 

        let roomName = makeID(5);
        rooms[client.id] = roomName;
        console.log(roomName);
        client.emit("gameCode", roomName);

        // the dimensions when making gamestate is undefined
        // why??
        // figure this shit out i'm tired as fuck
        console.log(dimensions);
        state[roomName] = initializeGame(JSON.parse(dimensions));

        addPlayer(state[roomName]);
        client.join(roomName);
        client.number = state[roomName].players.length;
        console.log(client.number);

        let game = {
            playerNumber: client.number,
            dimensions: JSON.parse(dimensions)
        }
        // i forgot to add something here...?
        client.emit("initialize", JSON.stringify(game));

        startGameInterval(roomName);
    }

    function handleKeyDown(keys){
        let newKeys = JSON.parse(keys)

        const roomName = rooms[client.id];

        if(!roomName){
            return;
        }

       let player = state[roomName].players[client.number - 1];
       const velocity = getUpdatedVelocity(newKeys, player.velocity);
       if(velocity){
           player.velocity = velocity;
       }

    }

    function handleClick(client){
        // the screen freezes after a I take a shot. Fix it
        let click = JSON.parse(client);
        let playerNumber = click.playerNumber;
        let roomName = click.gameCode;
        let mouseX = click.x;
        let mouseY = click.y;

        let player;
        let angle;
        try{
            player = state[roomName].players[playerNumber - 1];
            angle = getProjectileAngle(mouseX, mouseY, player.x, player.y);
        } catch(e){
            return;
        }

        // player is undefined here for some reason??
        if(angle){
            addProjectile(state[roomName], playerNumber, angle);
        }

    }
});

function startGameInterval(roomName){
    const intervalID = setInterval(() => {
        const game = gameLoop(state[roomName]);

        emitGameState(roomName, state[roomName]);
    }, 1000 / FRAME_RATE)
}

function emitGameState(roomName, state){
    io.sockets.in(roomName).emit("gameState", JSON.stringify(state))
}


io.listen(3000);
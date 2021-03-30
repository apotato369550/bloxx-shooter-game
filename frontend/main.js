
const BACKGROUND_COLOR = "black";
const PLAYER_COLOR = "#ffefc4";
const ALLY_COLOR = "#9f9bcf";
const PROJECTILE_COLOR = "#f5d4d0";
const ALLY_PROJECTILE_COLOR = "#eec7ff";

const socket = io("http://localhost:3000");

socket.on("initialize", handleInitialize);
socket.on("gameState", handleGameState);
socket.on("gameCode", handleGameCode);
socket.on("unknownGame", handleUnknownGame);
socket.on("tooManyPlayers", handleTooManyPlayers);


const gameScreen = document.getElementById("game-screen");
const initialScreen = document.getElementById("initial-screen");
const newGameButton = document.getElementById("new-game-button");
const joinGameButton = document.getElementById("join-game-button");
const roomCodeInput = document.getElementById("room-code-input");



const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

newGameButton.addEventListener("click", newGame);
joinGameButton.addEventListener("click", joinGame);

let keys;
let playerNumber;
let gameActive = false;
let gameCode;

// move these classes to a new file

// there is something wrong here
function newGame(){
    // send canvas dimensions through newgame creation
    let dimensions = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    socket.emit("newGame", JSON.stringify(dimensions));
    initialize();
}

function joinGame(){
    gameCode = roomCodeInput.value;
    socket.emit("joinGame", gameCode);
    initialize();
}

function initialize(){
    initialScreen.style.display = "none";
    gameScreen.style.display = "block";

    
    document.body.style.overflow = 'hidden'; 

    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);


    // change this to keystroke
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);

    document.addEventListener("click", click);

    gameActive = true;
    
    // move this to a paintgame function
    // gameState.players.push(new Player(canvas.width / 2, canvas.height / 2, 30, PLAYER_COLOR, new Vector()));
    
}

function click(event){
    // update
    // profit
    let x = event.clientX;
    let y = event.clientY;
    console.log("x: " + x + " y: " + y);
    console.log(playerNumber);
    console.log(gameCode)
    socket.emit("click", JSON.stringify({x: x, y: y, playerNumber: playerNumber, gameCode: gameCode}));
}

function keydown(event){
    keys = (keys || {});
    keys[event.keyCode] = true;
    // stringify keys here lmao
    socket.emit("keydown", JSON.stringify(keys));

}

function keyup(event){
    keys[event.keyCode] = false;
    stop();
}

function paintgame(state){
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // it worksssssssssss
    // you need to change this loop when adding new players
    state.players.forEach((player, index) => {
        context.beginPath();
        context.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);

        if(index + 1 == playerNumber){
            context.fillStyle = PLAYER_COLOR;
            context.fill();
        } else {
            context.fillStyle = ALLY_COLOR;
            context.fill();
        }
        // test this shit tomorrow
        player.projectiles.forEach((projectile) => {
            context.beginPath();
            context.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2, false);
            if(index + 1 == playerNumber){
                context.fillStyle = PROJECTILE_COLOR;
                context.fill();
            } else {
                context.fillStyle = ALLY_PROJECTILE_COLOR;
                context.fill();
            }
        })
    });

    state.obstacles.forEach(obstacle => {
        context.beginPath();
        context.fillStyle = "white";
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // work on printing the gamecode lmao
    if(gameCode){
        context.font = "30px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.fillText(gameCode, (canvas.width / 2) - 45, (canvas.height / 2) - 30);
    }
}
// create a paintgame function

function handleTooManyPlayers(){
    reset();
    alert("Too many players. Max per room: 4");
}

function handleUnknownGame(){
    reset();
    alert("Unknown Game Code");
}

function handleGameCode(code){
    // print gamecode on the center of the canvas
    // this does not draw
    gameCode = code;
    console.log(gameCode);
}

// test this tomorrow
function handleInitialize(game){

    // for some reason thi width and height is 0?

    // for some reason playernumber
    // it's coz dimensions was still a string
    // this works
    // but the projectiles are wonky,
    // also work on the client

    let data = JSON.parse(game);
    console.log(data);

    // for some reason, when joining, this ain't parsed
    // let dimensions = JSON.parse(data.dimensions);

    canvas.width = data.dimensions.width;
    canvas.height = data.dimensions.height;
    playerNumber = data.playerNumber;
    console.log(canvas.width);
    console.log(canvas.height);
    console.log(playerNumber);
}

function handleGameState(gameState){
    if(!gameActive){ return; }

    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => paintgame(gameState));
}

function reset(){
    playerNumber = null;
    roomCodeInput.value = "";
    initialScreen.style.display = "block";
    gameScreen.style.display = "none";
}
const { GRID_SIZE, FRICTION } = require("./constants.js");
const { Player, Vector, Projectile, Obstacle } = require("./classes.js");
const { PassThrough } = require("stream");
const { PRIORITY_BELOW_NORMAL } = require("constants");

// work on player movement and physics
// work on player add feature

// continue watching video on how to pathfind and create a pathfinding subproject

function initializeGame(dimensions){
    const state = createGameState(dimensions);
    return state;
}

function createObstacles(width, height){
    let obstacleWidth = width / GRID_SIZE;
    let obstacleHeight = height / GRID_SIZE;
    // try refactoring logic for pathfinding
    console.log("Obstacle Width: " + obstacleWidth + " Obstacle Height: " + obstacleHeight);
    let obstacles = [
        // do smth about these
        // WAIT WAIT WAT
        // INITIALIZE A GIT REPO HERE FIRST
        // THEN BRANCH OFF
        // THEN DO SMTH ABOUT IT

        new Obstacle(obstacleWidth * 2, obstacleHeight * 2, obstacleWidth * 6, obstacleHeight),
        new Obstacle(obstacleWidth * 2, obstacleHeight * 18, obstacleWidth * 6, obstacleHeight),
        new Obstacle(obstacleWidth * 13, obstacleHeight * 2, obstacleWidth * 6, obstacleHeight),
        new Obstacle(obstacleWidth * 13, obstacleHeight * 18, obstacleWidth * 6, obstacleHeight),

        new Obstacle(obstacleWidth * 2, obstacleHeight * 2, obstacleWidth, obstacleHeight * 6),
        new Obstacle(obstacleWidth * 2, obstacleHeight * 13, obstacleWidth, obstacleHeight * 6),
        new Obstacle(obstacleWidth * 18, obstacleHeight * 2, obstacleWidth, obstacleHeight * 6),
        new Obstacle(obstacleWidth * 18, obstacleHeight * 13, obstacleWidth, obstacleHeight * 6),

        new Obstacle(obstacleWidth * 5, obstacleHeight * 5, obstacleWidth, obstacleHeight * 7),
        new Obstacle(obstacleWidth * 8, obstacleHeight * 5, obstacleWidth * 7, obstacleHeight),
        new Obstacle(obstacleWidth * 14, obstacleHeight * 8, obstacleWidth, obstacleHeight * 7),
        new Obstacle(obstacleWidth * 5, obstacleHeight * 14, obstacleWidth * 7, obstacleHeight),

        new Obstacle(obstacleWidth * 11, obstacleHeight * 5, obstacleWidth, obstacleHeight * 6),
        new Obstacle(obstacleWidth * 8, obstacleHeight * 9, obstacleWidth, obstacleHeight * 6)

        // this should still work in theory
        /*
        new Obstacle(2, 2, 6, 1, obstacleWidth, obstacleHeight),
        new Obstacle(2, 18, 6, 1, obstacleWidth, obstacleHeight),
        new Obstacle(13, 2, 6, 1, obstacleWidth, obstacleHeight),
        new Obstacle(13, 18, 6, 1, obstacleWidth, obstacleHeight)
        */
    ];

    return obstacles;
}

function createGameState(dimensions){
    return {
        width: dimensions.width,
        height: dimensions.height,
        players: [],
        obstacles: createObstacles(dimensions.width, dimensions.height),
        enemies: []
    };
}

function gameLoop(state){
    if(!state){
        return;
    }

    const players = state.players;

    players.forEach(player => {
        let collide = getCollide(player, state);

        // figure out what to do after thing collides

        if((collide.left && player.velocity.x < 0) || 
        (collide.right && player.velocity.x > 0)){
            player.velocity.x = 0;
        } else {
            player.x += player.velocity.x;
        }

        if((collide.top && player.velocity.y < 0) || 
        (collide.bottom && player.velocity.y > 0)){
            player.velocity.y = 0;
        } else {    
            player.y += player.velocity.y;
        }


        player.velocity.x *= FRICTION;
        player.velocity.y *= FRICTION;
        
        player.projectiles.forEach((projectile, index) => {
            let collide = getCollide(projectile, state);
            if(collide.left || collide.right ||
            collide.top || collide.bottom){
                setTimeout(() => {
                    player.projectiles.splice(index, 1);
                }, 0)
            } else {
                projectile.x += projectile.velocity.x;
                projectile.y += projectile.velocity.y;
            }
        })
    });
}

function getCollide(entity, state){
    let obstacles = state.obstacles;

    // we have collision my friend:)))
    let collide = {
        left: false,
        right: false,
        top: false,
        bottom: false
    }


    if(entity.left < 0){
        collide.left = true;
    }

    if(entity.right > state.width){
        collide.right = true;
    }

    if(entity.top < 0){
        collide.top = true;
    }

    if(entity.bottom > state.height){
        collide.bottom = true;
    }

    obstacles.forEach(obstacle => {

        if((entity.left <= obstacle.right) &&
        (entity.top >= obstacle.top) &&
        (entity.bottom <= obstacle.bottom) && 
        (entity.left >= obstacle.left)
        ){
            collide.left = true;
        } 

        // entity's right hits obstacle
        if((entity.right >= obstacle.left) &&
        (entity.top >= obstacle.top) &&
        (entity.bottom <= obstacle.bottom) &&
        (entity.right <= obstacle.right)
        ){
            collide.right = true;
        }

        // entity's top hits obstacle
        if((entity.top <= obstacle.bottom) &&
        (entity.left >= obstacle.left) &&
        (entity.right <= obstacle.right) &&
        (entity.top >= obstacle.top)){
            collide.top = true;
        }

        if((entity.bottom >= obstacle.top) &&
        (entity.left >= obstacle.left) &&
        (entity.right <= obstacle.right) &&
        (entity.top <= obstacle.top)){
            collide.bottom = true;
        }

        // entity's top hits obstacle
    });

    // returns which sides that are colliding with obstacles
    return collide;
}

function addPlayer(state){
    console.log(state);
    let newPlayer = new Player(state.width / 2, state.height / 2, 12, new Vector());
    state.players.push(newPlayer);
}

function addProjectile(state, playerNumber, angle){
    let player = state.players[playerNumber - 1];
    let velocity = new Vector(Math.cos(angle) * 10, Math.sin(angle) * 10);
    let projectile = new Projectile(player.x, player.y, 3, velocity);
    

    player.projectiles.push(projectile);
}

function addEnemy(){
    // add enemy to edge of the screen
    // figure out how to do pathfinding
    return;
}

// create function that adds/places the canvas' dimensions onto the gamestate

function getUpdatedVelocity(keys, velocity){
    if(keys[37]) { velocity.x -= .35 }
    if(keys[38]) { velocity.y -= .35 }
    if(keys[39]) { velocity.x += .35 }
    if(keys[40]) { velocity.y += .35 }
    

    return velocity;
}

function getProjectileAngle(mouseX, mouseY, playerX, playerY){
    angle = Math.atan2(mouseY - playerY, mouseX - playerX);
    return angle;
}


module.exports = {
    gameLoop,
    addPlayer,
    getUpdatedVelocity,
    initializeGame,
    getProjectileAngle,
    addProjectile,
}

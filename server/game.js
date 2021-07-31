const { GRID_SIZE, FRICTION } = require("./constants.js");
const { Player, Vector, Projectile, Obstacle, Enemy } = require("./classes.js");
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

        // this should still work in theory
        // then work on an enemy class
        
        new Obstacle(2, 2, 6, 1, obstacleWidth, obstacleHeight),
        new Obstacle(2, 18, 6, 1, obstacleWidth, obstacleHeight),
        new Obstacle(13, 2, 6, 1, obstacleWidth, obstacleHeight),
        new Obstacle(13, 18, 6, 1, obstacleWidth, obstacleHeight),

        new Obstacle(2, 2, 1, 6, obstacleWidth, obstacleHeight),
        new Obstacle(2, 13, 1, 6, obstacleWidth, obstacleHeight),
        new Obstacle(18, 2, 1, 6, obstacleWidth, obstacleHeight),
        new Obstacle(18, 13, 1, 6, obstacleWidth, obstacleHeight),

        new Obstacle(5, 5, 1, 7, obstacleWidth, obstacleHeight),
        new Obstacle(8, 5, 7, 1, obstacleWidth, obstacleHeight),
        new Obstacle(14, 8, 1, 7, obstacleWidth, obstacleHeight),
        new Obstacle(5, 14, 7, 1, obstacleWidth, obstacleHeight),

        new Obstacle(11, 5, 1, 6, obstacleWidth, obstacleHeight),
        new Obstacle(8, 9, 1, 6, obstacleWidth, obstacleHeight)
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

    

    state.players.forEach(player => {
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

    const enemies = state.enemies;

    enemies.forEach(enemy => {
        

        // get rid of goal system
        // do what blob game did for the enemies, but include collision for walls
        // do this instead of pathfinding

        // there is something wrong w/ the logic here
        // maybe it's the angled velocity logic??
        // figure this shit out scoob

        /*
        let goalX = enemy.goal % GRID_SIZE;
        let goalY = Math.floor(enemy.goal / GRID_SIZE);

        if(goalX == enemy.getGridX() && goalY == enemy.getGridY()){
            console.log("------------------ GOALL REACHED --------------");
            enemy.goal = enemy.path.pop();
            while(enemy.goal % GRID_SIZE == enemy.getGridX() && Math.floor(enemy.goal / GRID_SIZE) == enemy.getGridY()){
                enemy.goal = enemy.path.pop();
            }
            console.log("New Goal: " + enemy.goal + " Coordinates: (" + enemy.goal % GRID_SIZE + ", " + Math.floor(enemy.goal / GRID_SIZE) + ") ");
            enemy.setAngledVelocity();
            // work without this firstVVV
            // then experiment with it
            // keeps overlapping?
            /*
            enemy.goal = enemy.path.pop();
            enemy.setAngledVelocity();

            // now it's going the other way??
            // analyze dis bullshit tomorrow since my brain is not handling it my guy
        } else {
            console.log("goal not reached:(")
            console.log("goal X " + goalX + " != " + enemy.getGridX() + " goal Y " + goalY + " != " + enemy.getGridY());
        }
        enemy.x += enemy.velocity.x;
        enemy.y += enemy.velocity.y;
        */

        // work on these ideas
        enemy.x += enemy.velocity.x;
        enemy.y += enemy.velocity.y;

        let goalX = enemy.goal % GRID_SIZE;
        let goalY = Math.floor(enemy.goal / GRID_SIZE);

        console.log("Goal X = " + goalX + " Goal Y = " + goalY);
        console.log("Enemy X = " + enemy.getGridX() + " Enemy Y = " + enemy.getGridY());

        if(goalX == enemy.getGridX() && goalY == enemy.getGridY()){
            // pop or unshift??
            console.log("GOAL REACHED LLLLLLLLLLLLLLLLLLLLLLLL");
            enemy.goal = enemy.path.pop();
            enemy.setAngledVelocity();
            // test this later
            // test this tomorrow
            // display goal ehre?
            // enemy x and y don't change
            // the goals are set in reverse order
            // current Current

            // figure out why the values are not updating

        }
        // figure out if this is correct first ^^^
        // do it step by step
    })


    /*
    enemies.forEach((enemy, index) => {
        console.log("Enemy Number: " + (index + 1));
        console.log(enemy);
    });

    // every tick there is a chance of an enemy spawning
    // copy spawn enemies in previous project
    // devise a way/where to put spawn enemeis code

    if(Math.floor(Math.random() * 25 + 1) == 1){
        let obstacleWidth = state.width / GRID_SIZE;
        let obstacleHeight = state.height / GRID_SIZE;

        console.log("an enemy has spawned motherfucker");
        addEnemy(obstacleWidth, obstacleHeight, state);
        console.log(state.enemies)
    }
    */
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
    let newPlayer = new Player(state.width / 2, state.height / 2, 12, new Vector());
    state.players.push(newPlayer);

    // this'll spawn one enemy when the player enters the game
    let obstacleWidth = state.width / GRID_SIZE;
    let obstacleHeight = state.height / GRID_SIZE;

    // it's moving, but not in the right direction
    addEnemy(obstacleWidth, obstacleHeight, state);
    console.log("an enemy has spawned motherfucker. Enemies: " + state.enemies);
}

function addProjectile(state, playerNumber, angle){
    let player = state.players[playerNumber - 1];
    let velocity = new Vector(Math.cos(angle) * 10, Math.sin(angle) * 10);
    let projectile = new Projectile(player.x, player.y, 3, velocity);
    

    player.projectiles.push(projectile);
}

function addEnemy(width, height, state){
    const length = Math.floor(Math.random() * width - 15) + 30;

    let x, y;
    // these only spawn the enemy at the corners

    if(Math.random() < 0.5){
        y = Math.random() < 0.5 ? 20 : 0;
        x = Math.floor(Math.random() * 20) + 1;
    } else {
        x = Math.random() < 0.5 ? 20 : 0;
        y = Math.floor(Math.random() * 20) + 1;
    }

    // give obstacles here as well for the enemy to pathfind

    var enemy = new Enemy(x, y, length, width, height, state.obstacles, state.width, state.height);
    state.enemies.push(enemy);

    // run to see if bugs
    // draw the enemy on the canvas
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
    let angle = Math.atan2(mouseY - playerY, mouseX - playerX);
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

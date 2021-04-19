const { runInThisContext } = require("vm");
const { GRID_SIZE } = require("./constants") 
// the rectangles and shiz are wrong

class Vector{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

// add stuff like friction
// reference pong and previous project
class Player {
    constructor(x, y, radius, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.projectiles = [];
    }
    get left(){
        return this.x - this.radius;
    }
    get right(){
        return this.x + this.radius;
    }
    get top(){
        return this.y - this.radius;
    }
    get bottom(){
        return this.y + this.radius;
    }
}

class Projectile {
    // add top, bottom, left, and right getter methods
    constructor(x, y, radius, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
    }
    get left(){
        return this.x - this.radius;
    }
    get right(){
        return this.x + this.radius;
    }
    get top(){
        return this.y - this.radius;
    }
    get bottom(){
        return this.y + this.radius;
    }
}

// work on this
// make layout a 25x25 block grid
// add left/right getter methods
class Obstacle {
    constructor(x, y, width, height, obstacleWidth, obstacleHeight){
        this.x = x * obstacleWidth; // absolute x
        this.y = y * obstacleHeight; // absolute y
        this.width = width * obstacleWidth;
        this.height = height * obstacleHeight;

        this.gridX = x;
        this.gridY = y;
        this.gridWidth = width;
        this.gridHeight = height;
    }
    get left(){
        return this.x;
    }
    get right(){
        return this.x + this.width;
    }
    get top(){
        return this.y;
    }
    get bottom(){
        return this.y + this.height;
    }
}

class Enemy {
    constructor(x, y, length, gridWidth, gridHeight, obstacles){
        this.x = x * gridWidth;
        this.y = y * gridHeight;
        this.width = length;
        this.height = length;

        this.gridX = x;
        this.gridY = y;

        this.path = this.generatePath(obstacles);
    }


    breadthFirstSearch(){
        // finally work on this
        return true;
    }

    createAdjacencyList(obstacles){
        var totalNodes = GRID_SIZE * GRID_SIZE;
        var adjacencyList = new Array();
        for(var i = 0; i < (GRID_SIZE * GRID_SIZE); i++){
            adjacencyList.push(new Array());
        }
        console.log("List length: " + adjacencyList.length);
        console.log("GridX: " + obstacles[0].gridX + " GridY: " + obstacles[0].gridX);
        console.log("Grid Width: " + obstacles[0].gridWidth + " Grid Height: " + obstacles[0].gridHeight);
        for(var i = 0; i < GRID_SIZE; i++){
            for(var j = 0; j < GRID_SIZE; j++){

                var node = j + (i * GRID_SIZE);
                
                // analyze the text below
                // see if rows and columns are correct
                console.log(node);

                if(this.isObstacle(i, j, obstacles)){
                    // console.log("obstacle");
                    continue;
                }
                
                // console.log("Row: " + i + " Column: " + j);
                
                // IT WORKSSSSS
                // move on to the next phase
                if(i > 0){
                    if(!this.isObstacle(i - 1, j, obstacles)){
                        console.log("push");
                        adjacencyList[node].push(j + ((i - 1)) * GRID_SIZE);
                    } else {
                        console.log("obstacle lmao");
                    }
                }

                if(i < GRID_SIZE - 1){
                    if(!this.isObstacle(i + 1, j, obstacles)){
                        adjacencyList[node].push(j + ((i + 1)) * GRID_SIZE);
                    } else {
                        console.log("obstacle lmao");
                    }
                }

                if(j > 0){
                    if(!this.isObstacle(i, j - 1, obstacles)){
                        adjacencyList[node].push((j - 1) + (i * GRID_SIZE));
                    } else {
                        console.log("obstacle lmao");
                    }
                }

                if(j < GRID_SIZE - 1){
                    if(!this.isObstacle(i, j + 1, obstacles)){
                        adjacencyList[node].push((j + 1) + (i * GRID_SIZE));
                    } else {
                        console.log("obstacle lmao");
                    }
                }
            }
        }

        for(var i = 0; i < (GRID_SIZE * 4); i++){
            console.log("Row " + i);
            for(var j = 0; j < adjacencyList[i].length; j++){
                console.log("[" + adjacencyList[i][j] + "]");
            }
        }

        console.log("80th node" + adjacencyList[80])
        
        

        return adjacencyList;
    }
    
    isObstacle(row, column, obstacles){
        var isAnObstacle = false;

        // the condition in the if statement was wrong. Should be <= not >=
        obstacles.forEach((obstacle) => {
            if((row >= obstacle.gridX && row <= obstacle.gridWidth) &&
            (column >= obstacle.gridY && column <= obstacle.gridHeight)){
                isAnObstacle = true;
            }
        });
        

        return isAnObstacle;
    }

    generatePath(obstacles){

        // create a separate function to generate an adjacency list 1st
        // breadth first search function 2nd
        // shortest distance function 3rd

        let adjacencyList = this.createAdjacencyList(obstacles);

        return [
            {x: 1, y: 1},
            {x: 1, y: 2},
            {x: 1, y: 3},
            {x: 1, y: 4},
            {x: 1, y: 5}
        ];
    }
    // pathfind here
}

module.exports = {
    Vector,
    Player,
    Projectile,
    Obstacle,
    Enemy
}
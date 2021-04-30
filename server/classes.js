const { runInThisContext } = require("vm");
const { GRID_SIZE } = require("./constants") 
const tstl = require("tstl")
// the rectangles and shiz are wrong

class Vector{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

// check stack overflow for the solution to this thing lmao
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


    breadthFirstSearch(start, destination, adjacency_list, predecessor, distance){
        let queue = new tstl.Queue();
        // test this later
        // try and test whiel getting rid of predecessor and distance
        let nodes = GRID_SIZE * GRID_SIZE;
        let visited = Array(nodes).fill(false);

        distance.fill(1000);
        predecessor.fill(-1);

        visited[start] = true;
        distance[start] = 0;

        queue.push(start);

        while(!queue.empty()){
            // THIS WORKS MOTHERFUCKER LET'S GOOOOOOO
            let current = queue.front();
            queue.pop();
            console.log("Current: " + current);
            

            for(var i = 0; i < adjacency_list[current].length; i++){
                if(!visited[adjacency_list[current][i]]) {
                    visited[adjacency_list[current][i]] = true;
                    distance[adjacency_list[current][i]] = distance[current] + 1;
                    predecessor[adjacency_list[current][i]] = current;
                    queue.push(adjacency_list[current][i]);

                    if(adjacency_list[current][i] == destination){
                        return true;
                    }
                }
            }
        }
        // deal with error here lmaooo

        return false;
    }

    createAdjacencyList(obstacles){
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
        let nodes = GRID_SIZE * GRID_SIZE;

        let predecessor = new Array();
        let distance = new Array();
        
        for(var i = 0; i < nodes; i++){
            predecessor.push(0);
            distance.push(0)
        }

        var start = 3;
        var end = 38;
        // it only works if the end is 1... there is something wrong with the algorithm

        // forgot to add distance
        if (!this.breadthFirstSearch(start, end, adjacencyList, predecessor, distance)){
            // for some reason source and destination are still not connected...
            console.log("Source and destination are not connected");
            return;
        } else {
            console.log("Woot woot! We in business motherfucker")
        }



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
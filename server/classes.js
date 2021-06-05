const { runInThisContext } = require("vm");
const { GRID_SIZE } = require("./constants") 
const tstl = require("tstl");
const { PassThrough } = require("stream");
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

        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;

        this.gridX = x;
        this.gridY = y;


        // it's back to front
        // do pop for finding currentGoal
        this.path = this.generatePath(obstacles, this.gridX, this.gridY);
        // test this outVVV
        // tomorrow
        this.goal = this.path.pop();
        // forgot to rename goal to currentGoal
        console.log("Enemy Current Goal: " + this.goal);
        this.velocity = new Vector();
        this.setAngledVelocity();

        // create method that creates velocity angle based on goal
    }

    getGridX(){
        // I FORGOT THE FORMULAS LMAO
        // I'M STUPID FOR DELETING THE COORDS THING BRUH
        // RE-LEARN THE FORMULA FOR GETTING GRID X AND Y
        // it was in the comments too why did i do that?
        // never delete comments again

        return Math.floor(this.x / this.gridWidth);
    }

    getGridY(){
        return Math.floor(this.y / this.gridHeight);
    }

    setAngledVelocity(){
        // test this mf
        let goalX = this.goal % GRID_SIZE;
        let goalY = Math.floor(this.goal / GRID_SIZE);

        // it's going the right way, but doesnt stop to turn
        let angle = Math.atan2(this.gridY - goalY, this.gridX - goalX);
        // review logic from blob shooter game
        console.log("Angle: " + angle)
        // did i switch it up??
        console.log("Supposed X velocity: " + Math.cos(angle));
        console.log("Supposed Y Velocity: " + Math.sin(angle));
        // test this out later
        
        // test if it still overlaps
        this.velocity.x = Math.cos(angle) * 2;
        this.velocity.y = Math.sin(angle) * 2;
        // let velocity = new Vector(10, 10);
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
            // test this motherfucker out later
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

    generatePath(obstacles, x, y){

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

        // convert current x and y to start and end
        var start = x + (y * GRID_SIZE);
        var end = 121;

        // console.log("Start Node: " + start + " Coordinates: (" + x + " ," + y + ")");
        // console.log("End Node: " + end + " Coordinates: (" + (end % GRID_SIZE) + " ," + (Math.floor(end / GRID_SIZE)) + ")")

        // forgot to add distance
        if (!this.breadthFirstSearch(start, end, adjacencyList, predecessor, distance)){
            // for some reason source and destination are still not connected...
            console.log("Source and destination are not connected");
            return;
        } else {
            console.log("Woot woot! We in business motherfucker")
        }

        // work on making the path for the thing to cross :D


        let path = new Array();
        let crawl = end;

        while(predecessor[crawl] != -1){
            path.push(predecessor[crawl]);
            crawl = predecessor[crawl];
        }

        path.unshift(end);

        console.log("The shortest path length is: " + path.length)
        
        // double check the for loop
        for(let i = 0; i < path.length; i++){
            // it's back to front
            // x -> 0
            let x = path[i] % GRID_SIZE;
            let y = Math.floor(path[i] / GRID_SIZE);
            console.log(i + " Node Number: " + path[i] + " Coordinates: (" + x + " ," + y + ")");
        }

        // if nodes form a line with no turns, reduce it.
        /*

        Given a string of coordinates:
        (1, 0)
        (2, 0)
        (3, 0)
        (4, 0)
        (5, 0)
        (5, 1)
        (5, 2)
        (5, 3)
        (5, 4)
        (6, 4)
        (7, 4)
        (8, 4)

        note this:
        (4, 0)
        (5, 0)
        (5, 1)

        Remove the starting coordinate and the unecessary ones
        (5, 0)
        (5, 4)
        (8, 4)

        figure out a solution to this
        // probably involves for loops

        */

        // it's like traversing a linked list(??)
        let shortenedPath = new Array();
        // direction should be array because it is two dimensional
        let direction = new Array();

        /*
        for(let i = 1; i < path.length - 1; i++){
            // TRAVERSE THROUGH THE ARRAY BACKWARDS!!!
            // implement this tomorrow
            // ^^
            // print values of x and y for both previous and current
            let previous = new Array();
            // previous.push(path[i - 1] % GRID_SIZE);
            // previous.push(Math.floor(path[i] / GRID_SIZE));
            previous[0] = path[i - 1] % GRID_SIZE;
            previous[1] = Math.floor(path[i - 1] / GRID_SIZE);

            let current = new Array();
            // current.push(path[i] % GRID_SIZE);
            // current.push(Math.floor(path[i] / GRID_SIZE));
            current[0] = path[i] % GRID_SIZE;
            current[1] = Math.floor(path[i] / GRID_SIZE);
            // right idea, but we are getting the first instead of the last...
            // re-structure algorithm
            let currentDirection = new Array();
            // what???
            currentDirection[0] = previous[0] - current[0];
            currentDirection[1] = previous[1] - current[1];

            // change this to and?
            // test this..
            if(direction[0] != currentDirection[0] || direction[1] != currentDirection[1]){
                shortenedPath.push(previous);
                direction = currentDirection;
                // this is still kinda wrong lol
            }

            // refine logic here

            let next = new Array();
            previous.push(path[i + 1] % GRID_SIZE);
            previous.push(Math.floor(path[i] / GRID_SIZE));

            // convert these to (x, y)

            
        }
        */

        // test if this works tomorrow
        for(let i = path.length - 2; i > 0; i--){
            let previous = new Array();
            let current = new Array();
            
            // test this tomorrow
            // THIS WORKSSSS
            // implement goal system now
            previous[0] = path[i + 1] % GRID_SIZE;
            previous[1] = Math.floor(path[i + 1] / GRID_SIZE);

            current[0] = path[i] % GRID_SIZE;
            current[1] = Math.floor(path[i] / GRID_SIZE);
            // right idea, but we are getting the first instead of the last...
            // what if we switch current and previous???
            // would that produce a different output?
            // re-structure algorithm
            let currentDirection = new Array();
            // what???
            currentDirection[0] = previous[0] - current[0];
            currentDirection[1] = previous[1] - current[1];
            // make it detect the last part of the  array

            // it almost works?
            // it doesn't take into account the first node tho
            if(direction[0] != currentDirection[0] || direction[1] != currentDirection[1]){
                // instead of push, shift??
                shortenedPath.unshift(previous);
                direction = currentDirection;
                // this is still kinda wrong lol
            }

            // refine logic here
            /*
            let next = new Array();
            previous.push(path[i + 1] % GRID_SIZE);
            previous.push(Math.floor(path[i] / GRID_SIZE));
            */

            // convert these to (x, y)
        }


        console.log("----------------- SHORTENED PATH HERE -----------------")
        for(let i = 0; i < shortenedPath.length; i++){
            // lmao this doesn't work
            // shortened path is an array of two numbers
            // convert these to nodes

            // get formula on how to convert from coords to nodes lol
            console.log(i + " Coordinates: (" + shortenedPath[i][0] + ", " + shortenedPath[i][1] + ") ");
        }

        // test doing it front to back and back to front
        // test this later
        return shortenedPath;
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
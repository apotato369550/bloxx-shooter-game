const { runInThisContext } = require("vm");
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

        this.grid_x = x;
        this.grid_y = y;
        this.grid_width = width;
        this.grid_height = height;
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
    // try and understand the purpose of a left/right/top/bottom function
}

module.exports = {
    Vector,
    Player,
    Projectile,
    Obstacle
}
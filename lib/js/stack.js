/**
 * Responsible for handling values for Stack.
 * @class
 */
class Node{
    /**
     * @constructor
     * @param {*} val value assigned to the Node
     */
    constructor(val){
        this.val = val;
        this.next = null;
    }
}

/**
 * Responsible for storing information in Node.
 * Can interact with the stack directly.
 * @author Mahdi Shadkafarrokhi
 * @class
 */
class Stack{
    /**
     * @constructor
     */
    constructor(){
        this.root = null;
        this._length = 0;
    }

    /**
     * Returns the length of the stack.
     * @returns {Number} the length of the stack
     */
    get length(){
        return this._length;
    }

    /**
     * Adds value to top of stack.
     * @param {*} val value to be added to top of stack
     */
    add(val){
        const newNode = new Node(val);
        newNode.next = this.root;
        this.root = newNode;
        this._length++;
    }

    /**
     * Retuns the top value of the stack.
     * Does not modify the stack.
     */
    peek(){
        if(this.empty()) return null;        
        return this.root.val;
    }

    /**
     * Checks of stack is empty.
     * 
     * @returns {boolean} returns true if stack is empty, false otherwise
     */
    empty(){
        return this.root === null;
    }

    /**
     * Removes the top value from the stack, returning it.
     * @returns {*} the value of the top node being removed
     */
    pop(){
        if(this.empty()) return null;
        const val = this.root.val;
        this.root = this.root.next;
        this._length--;
        return val;
    }
}


const stack = new Stack();
function setup(){
    createCanvas(400,600);
}

function draw(){
    background("#454545");
    drawStack(stack);
}

/**
 * Draws the given stack to the canvas.
 * @param {Stack} stack stack to be visualized
 */
const drawStack = function(stack){
    const x = width/2;
    let y;
    if(stack.empty()){
        y = height/2;
        textBox("[Stack Empty]", x, y);
    }else{
        y = 100;
        currentNode = stack.root;
        for(let i = 0; i<stack.length; i++){
            textBox(currentNode.val,x,y);
            currentNode = currentNode.next;
            y += 75;
        }
    }
}

const textBox = function(str, x, y){
    // box around text
    fill("white");
    strokeWeight(2);
    stroke("black");
    rectMode(CENTER,CENTER);
    rect(x,y-8, 200, 50);
    
    // text
    textAlign(CENTER);  
    fill("red");
    noStroke();
    textSize(20);
    text(str, x, y);
}

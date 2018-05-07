// data/words_dictionary.json
// A text file containing 370k English words
// 5.8MB file

/**
 * Responsible for adding new words to growing word tree and querying the tree.
 * @class
 */
class Trie{
    constructor(){
        this.root = new Node;
    }

    /**
     * Main method for adding words to the growing dictionary.
     * @param {String} word word to be added
     */
    addWord(word){
        // Adding "." at end to signify complete word
        this.root.addChildred(word.replace(/[^A-z]/g, "").toLowerCase() + "*");
    }

    /**
     * Returns last node of string if it exists.
     * @param {String} word word to be found
     * @return {*} undefined if not found, a Node if found
     */
    findLastNode(word){
        let i = 0;
        let currentNode = this.root.c.find(x=>x.l === word[i++]);

        while(word[i] && currentNode){
            currentNode = currentNode.c.find(x=>x.l === word[i++]);
        }
        
        return currentNode;
    }

    /**
     * Checks dictionary if word exists.
     * 
     * @param {String} word a word
     * @returns {boolean} true if word exists, false if not
     */
    wordCheck(word){
        return !!this.findLastNode(word);
    }
}

/**
 * Responsible for handling a string value for Trie node.
 * @class
 */
class Node{
    /**
     * Will create new nodes appropriately.
     * @constructor
     * @param {String} letter 
     */
    constructor(letter){
        this.c = [];
        if(letter){
            this.l = letter[0];
            if(letter.length>0) this.addChildred(letter.slice(1));
        } 
    }

    /**
     * Adds children appropriately to chain of letters.
     * Main method used in conjunction with Trie to add nodes to growing dictionary.
     * 
     * @param {String} word word to be added to nodes children recursively
     */
    addChildred(word){
        if(word.length>0){
            const letter = word[0];
            const found = this.findChild(letter);
            if(found) found.addChildred(word.slice(1));
            else this.c.push(new Node(word));
        }
    }

    /**
     * Returns letter, if it exists, among Node's children.
     * 
     * @param {String} letter a letter to be found
     */
    findChild(letter){
        return this.c.find(x=>x.l===letter);
    }

    /**
     * Returns true if this Node is the last letter in chain.
     */
    lastLetter(){
        return !!this.c.find(x=>x.l==="*");
    }
}

///////////
//CONFIGS//
///////////
const NODE_SIZE = 20;
const LEVEL_DIST = 50;
const Y_OFFSET = 3;
///////////////
//CONFIGS END//
///////////////

let input, button, inputChecker;
const trie = new Trie;
//creates a download button and file for any plain text
let makeTextFile = function (file_name,data) {
    var data = new Blob([JSON.stringify(data)], { type: 'application/json' });    
    // returns a URL you can use as a href
    $("body").append($("<a />", {
        href: window.URL.createObjectURL(data),
        text: `Download "${file_name}"` ,
        download: file_name
    }));
    return text;
};

$.ajax({
    url:"data/words_dictionary.json",
    success: data=>{
        console.log("Storing data...");
        // json = JSON.parse(data);
        for(datum in data){
            trie.addWord(datum);
        }
        console.log("Finished!");
    },
    error: err => console.log(err)
});

function setup (){
    createElement("label","Add word:");
    input = createInput();
    
    button = createButton("Submit");
    button.mousePressed(()=>{trie.addWord(input.value());input.value("")});
    
    createElement("label","Check for word:");
    inputChecker = createInput();

    createCanvas(800,800);
}

function draw(){
    background("#454545");
    displayTrie();
}

function displayRoot(){
    fill("white");
    stroke("black");
    strokeWeight(2);
    line(width/2,LEVEL_DIST/2, width/2, LEVEL_DIST);    
    rectMode(CENTER,CENTER);
    rect(width/2,NODE_SIZE, LEVEL_DIST, LEVEL_DIST/2 );
    textAlign(CENTER);
    fill("black");    
    text("ROOT", width/2, 20 + Y_OFFSET);
}

function displayTrie(){
    displayRoot();
    let level = 1;
    const word = inputChecker.value().replace(/[^A-z]/g, "").toLowerCase();
    let currentNode = trie.root;
    for(let letter of word){
        if(currentNode) {
            currentNode = currentNode.findChild(letter);
            stroke("blue");
            strokeWeight(2);
            if(currentNode) displayNode(currentNode, level);
            else displayError(level);
        }
        level++;
    }
    if(currentNode) displayChildren(currentNode.c,level);
}

function displayError(level){
    fill("white");
    stroke("black");
    strokeWeight(2);
    line(width/2,level * LEVEL_DIST, width/2, level * LEVEL_DIST);    
    rectMode(CENTER,CENTER);
    rect(width/2, level * LEVEL_DIST, 25, 25 );
    textAlign(CENTER);
    fill("black");
    text("Error", width/2, level * LEVEL_DIST);
};

function displayLetter(letter, x, y){
    fill("white");
    noStroke();
    rectMode(CENTER,CENTER);
    ellipseMode(CENTER,CENTER);
    ellipse(x, y, NODE_SIZE);
    fill("black");
    textAlign(CENTER);    
    text(letter.toUpperCase(), x, y + Y_OFFSET);
}

function displayNode(node, level){
    const y = level * LEVEL_DIST;
    const x = width/2;
    if(node.c.length>0){
        stroke("black");
        strokeWeight(2);
        line(x,y, x, y + LEVEL_DIST);
    }
    displayLetter(node.l, x, y);
}

function displayChildren(children, level){
    const y = level * LEVEL_DIST + LEVEL_DIST/2;
    const childrenCount = children.length;
    const widthBetweenChildren = width/childrenCount;
    const sideMargins = widthBetweenChildren/2;
    let currentX = sideMargins;
    
    stroke("black");
    strokeWeight(2);
    for(let child of children){
        line(width/2,level*LEVEL_DIST, currentX, y);
        currentX += widthBetweenChildren;
        
    }

    currentX = sideMargins;
    for(let child of children){
        displayLetter(child.l, currentX, y);
        currentX += widthBetweenChildren;
    }    
}


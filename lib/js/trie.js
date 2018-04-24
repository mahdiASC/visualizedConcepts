/**
 * Responsible for adding new words to growing word tree and querying the tree.
 * @class
 */
class Trie{
    constructor(){
        this.root = new Node;
    }

    addWord(word){
        this.root.addChildred(word);
    }

    findLastNode(word){
        let i = 0;
        let currentNode = this.root.children.find(x=>x.letter === word[i++]);

        while(word[i] && currentNode){
            currentNode = currentNode.children.find(x=>x.letter === word[i++]);
        }
        
        return currentNode;
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
        this.children = [];
        if(letter){
            this.letter = letter[0];
            if(letter.length>0) this.addChildred(letter.slice(1));
        } 
    }

    addChildred(word){
        if(word.length>0){
            const _letter = word[0];
            const found = this.children.find(x=>x.letter === _letter);
            if(found) found.addChildred(letter.slice(1));
            else this.children.push(new Node(word));
        }
    }

    findChild(letter){
        return this.children.find(x=>x.letter===letter);
    }
}

let input, button, inputChecker;
const trie = new Trie;

function setup (){
    createElement("label","Add word:");
    input = createInput();
    
    createElement("label","Check for word:");
    inputChecker = createInput();

    button = createButton("Submit");
    button.mousePressed(()=>trie.addWord(input.value()));
    
    createCanvas(500,500);
}

function draw(){
    background("#454545");
    displayTrie();
}

function displayTrie(){
    let level = 0;
    const word = inputChecker.value();
    let currentNode = trie.root;
    for(let letter of word){
        currentNode = currentNode.findChild(letter);
        level++;
        displayNode(currentNode, level);
    }
}

function displayChildren(level, mainNode){
    if(!mainNode) {

    }else{

    }
}
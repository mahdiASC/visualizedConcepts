class KmeansPoint{
    /* The main building block for Kmeans data
    * params cluster integer representing this objects true clusterID
    * params x integer representing the x coordinate
    * params y integer representing the y coordinate
    * params flag boolean true if Point is a true cluster center
    */
    constructor(clusterID, x, y, flag=false){
        this.clusterID = clusterID;
        this.x = x;
        this.y = y;
        this.flag = flag;
    }
    
    drawPoint(blankFlag = false){
        // uses p5.js to draw point on the canvas
        // blankFlag is a boolean to indicate no distinguishing color 
        let size = 10;
        if(blankFlag){
            fill("black");
        }else{
            let colors = [
                "red",
                "blue",
                "green",
                "black"
            ]
    
            fill( colors[ this.clusterID - 1 ] );
        }
        
        if(this.flag){
            let nodeSize = 20;
            let fontSize = 20;
            let fontColor = "#ffffff";
            stroke(0);
            rectMode(CENTER,CENTER);
            textAlign(CENTER,CENTER);
            textSize(fontSize);
            
            rect(this.x, this.y, nodeSize, nodeSize);
            fill(fontColor);
            text(this.clusterID,this.x,this.y);
        }else{
            noStroke();
            ellipse( this.x , this.y , size );
        }
    }

    storeData(arr){
        this.storedData = arr.filter(x=>x.clusterID == this.clusterID);
    }

    drawClusterLines(){
        // assuming this object is a main cluster center, will draw line from itself to each point that belongs to it
        this.storedData.forEach(x=>line(x.x,x.y, this.x,this.y));
    }
}

class Kmeans{
    /* The main object dealing with Kmeans data
    * params w integer representing the canvas width 
    * params h integer representing the canvas height 
    */
    constructor(w,h){
        // creates a new set of random data with a random number of "real" clusters and a random variation within each cluster
        // 100 clustering attempts are done to decide the most effective cluster centers
        // the final data is visualized using p5.js
        let scaleFactor = 0.80;
        this.w = w || width * scaleFactor;
        this.h = h || height * scaleFactor;
        this.createData();
    }

    createData(){
        // creates data and stores within this object as an array of points on euclidean graph
        // creating "real" cluster centers
        let trueClusterNumber = myRandom(2,5); //random number between 2 and 4
        this.trueClusterCenters=[];
        while(this.trueClusterCenters.length<trueClusterNumber){
            this.trueClusterCenters.push(
                new KmeansPoint( 
                    this.trueClusterCenters.length+1, // trueClusterID
                    myRandom(this.w + (width-this.w)/2), // random x
                    myRandom(this.h + (height-this.h)/2), // random y
                    true
                )
            )
        }
        
        // creating data around "real" cluster centers
        this.data = [];
        let pointsPerCenter = Math.floor(100/this.trueClusterCenters.length);

        for( let cluster of this.trueClusterCenters ){
            let x = cluster.x;
            let y = cluster.y;
            
            let variance = myRandom(20,100);
            for ( let i = 0; i < pointsPerCenter; i++ ){
                let pointX, pointY;

                pointX = x + myRandom( -variance , variance );
                pointY = y + myRandom( -variance , variance );

                this.data.push(
                    new KmeansPoint(
                        cluster.clusterID,
                        pointX,
                        pointY
                    )
                );
            }
            // storing data for later drawing lines
            cluster.storeData(this.data);
        }
    }

    drawData(){
        // draws the data to the canvas
        this.trueClusterCenters.forEach(x=>x.drawClusterLines());
        this.data.forEach(x=>x.drawPoint());
        this.trueClusterCenters.forEach(x=>x.drawPoint());
    }
}
let x;
function setup(){
    createCanvas(400,400);
    background(123);
    x = new Kmeans();
    x.drawData();
}

function draw(){    
    // console.log(mouseX,mouseY);
}
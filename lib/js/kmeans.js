// Fill out documentation
// add user adjustments/predictions
// include visualing and running optimization algorithm (http://www.saedsayad.com/clustering_kmeans.htm)
// refactor KmeansCenter
class KmeansPoint{
    /* The main building block for Kmeans data
    * params cluster integer representing this objects true clusterID
    * params x integer representing the x coordinate
    * params y integer representing the y coordinate
    * params flag boolean true if Point is a true cluster center
    */
    constructor(clusterID, x, y){
        this.clusterID = clusterID;
        this.x = x;
        this.y = y;
        this.colors = [
            "red",
            "blue",
            "green",
            "purple",
            "orange",
            "grey"
        ]
    }
    
    drawPoint(blankFlag = false){
        // uses p5.js to draw point on the canvas
        // blankFlag is a boolean to indicate no distinguishing color 
        let size = 10;
        if(blankFlag){
            fill("black");
        }else{
            fill( this.colors[ this.clusterID - 1 ] );
        }
        
        noStroke();
        ellipse( this.x , this.y , size );
    }
}

class KmeansCenter extends KmeansPoint{

    drawPoint(){
        fill( this.colors[ this.clusterID - 1 ] );
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
    }

    storeData(arr){
        // stores only other KmeansPoints that properly belong to this cluster center
        this.storedData = arr.filter(x=>x.clusterID == this.clusterID);
    }

    drawClusterLines(){
        // draws lines from self to each point that belongs to this cluster center
        stroke(0);
        this.storedData.forEach(x=>line(x.x,x.y, this.x,this.y));
        this.storedData.forEach(x=>x.drawPoint());
        this.drawPoint();
    }

    reassignCenter(){
        // reassigns this objects center to be the actual center of the data related to it
        this.x = this.storedData.map(x=>x.x).avg
        this.y = this.storedData.map(x=>x.y).avg
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
        this.createRealData();
    }

    createRealData(){
        // creates data and stores within this object as an array of points on euclidean graph
        this.createRealCenters();
        this.createDataPoints();
        this.reassignRealCenters();
    }

    createDataPoints(){
        // creating data around "real" cluster centers
        this.data = [];
        let pointsPerCenter = Math.floor(100/this.trueClusterCenters.length);

        for( let cluster of this.trueClusterCenters ){
            let x = cluster.x;
            let y = cluster.y;
            
            let variance = myRandom(40,90);
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

    createRealCenters(){
        // creating "real" cluster centers
        let trueClusterNumber = myRandom(2,7); //random number between 2 and 4
        this.trueClusterCenters=[];
        while(this.trueClusterCenters.length<trueClusterNumber){
            this.trueClusterCenters.push(
                new KmeansCenter( 
                    this.trueClusterCenters.length+1, // trueClusterID
                    myRandom(this.w) + (width-this.w)/2, // random x
                    myRandom(this.h) + (height-this.h)/2 // random y
                )
            )
        }
    }

    reassignRealCenters(){
        // reassigns the true centers for the cluster based on the data's actual center
        this.trueClusterCenters.forEach(x=>x.reassignCenter());
    }
    
    createRandomCenters(k){
        // creates k random centers from data

    }

    calcRealCenter(points){
        // using array of points, will return a KmeanCenter object with the actual center of data
        
    }

    nextOptimumStep(){
        // Algorithm		
        //     Clusters the data into k groups where k  is predefined.
        //     Select k points at random as cluster centers.
        //     Assign objects to their closest cluster center according to the Euclidean distance function.
        //     Calculate the centroid or mean of all objects in each cluster.
        //     Repeat steps 2, 3 and 4 until the same points are assigned to each cluster in consecutive rounds.
    }

    drawTruth(){
        // draws the true data to the canvas
        this.trueClusterCenters.forEach(x=>x.drawClusterLines());
    }

    drawData(){
        // draws raw data to the canvas
        this.data.forEach(x=>x.drawPoint(true));
    }
}
let x;
function setup(){
    createCanvas(700,700);
    background("white");
    x = new Kmeans();
    x.drawData();
}

function draw(){    
    // console.log(mouseX,mouseY);
}
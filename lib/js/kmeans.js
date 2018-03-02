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
        this.clusterID = clusterID; // true parent ID
        this.parent = null; // points to iterating parent centroid
        this.x = x;
        this.y = y;
    }
    

    distance(centroid){
        // returns distance between this point and provided centroid
        // if no centroid given, assumed to be parent
        if(!centroid){
            centroid = this.parent;
        }
        return dist(centroid.x, centroid.y, this.x, this.y);
    }

    drawPoint(flag){
        // uses p5.js to draw point on the canvas
        // blankFlag is a boolean to indicate no distinguishing color 
        let size = 10;
        
        switch(flag){
            case "blank":
                fill( "black" );
                break;
            case "truth":
                fill( this.constructor.colors[ this.clusterID - 1 ] );
                break;
            default:
                fill( this.constructor.colors[ this.parent.clusterID -1 ]);
        }

        noStroke();
        ellipse( this.x , this.y , size );
    }
}

Object.defineProperty(KmeansPoint,"colors", {
    get: ()=>{
        return [
            "red",
            "blue",
            "green",
            "purple",
            "orange",
            "grey"
        ]
    }
})

class KmeansCenter extends KmeansPoint{

    drawPoint(){
        fill( this.constructor.colors[ this.clusterID - 1 ] );
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

    storeData(points){
        // stores only KmeansPoints that properly belong to this cluster center
        this.storedData = points.filter(x=>x.clusterID == this.clusterID);
    }

    drawClusterLines(){
        // draws lines from self to each point that belongs to this cluster center
        stroke(0);
        this.storedData.forEach(x=>line(x.x,x.y, this.x,this.y));
        this.storedData.forEach(x=>x.drawPoint("truth"));
    }

    reassignCenter(points){
        // reassigns this objects center to be the actual center of the array of points that 
        this.x = points.map(x=>x.x).avg
        this.y = points.map(x=>x.y).avg
    }
}

class KmeansRandomCenter extends KmeansCenter{
    
    constructor(clusterID, x, y){
        super(clusterID, x, y);
        
        // for random centroids
        this.iteration = {
            current:1,
            lastX:0,
            lastY:0
        }
    }

    tagPoints(points){
        // assesses distance and assigns points to this node if its closest
        points.forEach(x=>{
            let distance = x.distance(this);
            if(x.distance()>distance){
                x.parent = this;
            }
        })
    }

    iterate(points){
        // moves iteration forward and handles tagging points
        console.log(this.iteration.current);
        this.iteration.lastX = this.x;
        this.iteration.lastY = this.y;

        this.tagPoints(points);
        this.reassignCenter(this.myPoints(points));
        this.iteration.current++;
    }

    done(){
        // returns true if iteration is completed
        return this.x === this.iteration.lastX && this.y === this.iteration.lastY;
    }

    myPoints(points){
      // returns array of points that belong to this centroid
      return points.filter(x=>x.parent === this);
    }

    drawClusterLines(points){
        // draws lines from self to each point that belongs to this cluster center
        stroke(0);
        let filtered = this.myPoints(points);
        filtered.forEach(x=>line(x.x,x.y, this.x,this.y));
        filtered.forEach(x=>x.drawPoint());
    }
}

class Kmeans{
    /* The main object dealing with Kmeans logic
    * params w integer representing the canvas width 
    * params h integer representing the canvas height 
    * params k integer representing the user's guess of # of data groups
    */
    constructor(k,w,h){
        // creates a new set of random data with a random number of "real" clusters and a random variation within each cluster
        // 100 clustering attempts are done to decide the most effective cluster centers
        // the final data is visualized using p5.js
        let scaleFactor = 0.80;
        this.k = k || 2;
        this.w = w || width * scaleFactor;
        this.h = h || height * scaleFactor;

        this.randomCenters; // stores centers for iterations
        this.attempts = 0; // tracks number of full kmeans solutions
        this.solutions = [];

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
        // this.trueClusterCenters = this.createRandomCenters(myRandom(2,7), true);
        this.trueClusterCenters = this.createRandomCenters(3, true);
    }

    reassignRealCenters(){
        // reassigns the true centers for the cluster based on the data's actual center
        this.trueClusterCenters.forEach(x=>x.reassignCenter(x.storedData));
    }
    
    createRandomCenters(k=2, flag){
        // returns array of length k random KmeanCenters (k must be 2 or more)
        if (k<2) throw new Error("Number of clusters must be at least 2 or more");
        let output = [];
        let objMaker = KmeansRandomCenter;
        if(flag){
            objMaker = KmeansCenter;
        }
            
        while(output.length<k){
            output.push(
                new objMaker( 
                    output.length+1, // trueClusterID
                    myRandom(this.w) + (width-this.w)/2, // random x
                    myRandom(this.h) + (height-this.h)/2 // random y
                )
            )
        }
        return output;
    }
    
    resetStep(){
        // resets pertinent variables for iteration step
        if(this.randomCenters){
            // storing optimized random centers
            this.solutions.push(this.randomCenters);
        }
        this.randomCenters = this.createRandomCenters(this.k);
        this.data.forEach(x=>x.parent = this.randomCenters[0]);
        this.attempts++;
    }

    nextStep(){
        // Algorithm		
        //     Clusters the data into k groups where k  is predefined.
        //     Select k points at random as cluster centers.
        //     Assign objects to their closest cluster center according to the Euclidean distance function.
        //     Calculate the centroid or mean of all objects in each cluster.
        //     Repeat steps 2, 3 and 4 until the same points are assigned to each cluster in consecutive rounds.
        
        this.randomCenters.forEach(x=>{
            x.iterate(this.data);
        })

        this.drawIteration();
    }

    drawTruth(){
        // draws the true data to the canvas
        this.trueClusterCenters.forEach(x=>x.drawClusterLines());
        this.trueClusterCenters.forEach(x=>x.drawPoint("truth"));
    }

    drawIteration(){
        // draws the randomized iterated data to the canvas
        this.randomCenters.forEach(x=>x.drawClusterLines(this.data));
        this.randomCenters.forEach(x=>x.drawPoint("truth"));
    }

    drawData(){
        // draws raw data to the canvas
        this.data.forEach(x=>x.drawPoint("blank"));
    }
}

// Drawing w/p5.js
let x;
function setup(){
    createCanvas(500,500);
    x = new Kmeans(3);
    x.drawData();
    x.resetStep();
    frameRate(3);
}

function draw(){    
    background(230);
    if(x.randomCenters.every(x=>x.done())){
        x.drawTruth();
        noLoop();
    }else{
        x.nextStep();
    }
}
class KmeansPoint{
    /* The main building block for Kmeans data
    * params cluster integer representing this objects true clusterID
    * params x integer representing the x coordinate
    * params y integer representing the y coordinate
    */
    constructor(cluster, x, y){
        this.cluster = cluster;
        this.x = x;
        this.y = y;
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
        this.w = w || width - width * 0.15;
        this.h = h || height - height * 0.15;
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
                    this.trueClusterCenters.length+1,   // trueClusterID
                    myRandom(this.w),                     // random x
                    myRandom(this.h)                      // random y
                )
            )
        }
        
        
        
        // this.data = [];
        // while(this.data.length<100){
        //     this.data.push( 
        //         new KmeansPoint( 
        //             random(trueClusterNumber)+1,
        //             random(this.w),
        //             random(this.h)
        //         )
        //     )
        // }
    }

    drawRealClusters(){
        // uses p5.js to draw true cluster centers to the canvas
        let nodeSize = 20;
        let nodeColor = "#323232";
        let fontSize = 20;
        let fontColor = "#ffffff";
        
        noStroke();
        rectMode(CENTER,CENTER);
        textAlign(CENTER,CENTER);
        textSize(fontSize);
        
        this.trueClusterCenters.forEach(node=>{
            fill(nodeColor);
            rect(node.x, node.y, nodeSize, nodeSize);
            fill(fontColor);
            text(node.cluster,node.x,node.y);
        })
    }
}

let x;
function setup(){
    createCanvas(400,400);
    background(123);
    x = new Kmeans();
    x.drawRealClusters();
}

function draw(){    
    // console.log(mouseX,mouseY);
}
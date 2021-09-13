numGenes = 250;
vel = 15;
numBalls = 100;
mutationRate = 0.02;
avgFitness = 0;
generation = 0;
balls = [];

document.addEventListener("DOMContentLoaded", setup);        

class Rat{

    constructor(x,y,ctx){
        this.ratImg = this.ratImg;
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.r = 7; // radius
        this.index = 0;
        this.fitness = 0;
        this.done = false;
    }
    draw(){

        /*this.ctx.fillstyle = 'rgb(157, 255, 128)';
        //if ball is in zone change color
        if(this.done){
            this.ctx.fillstyle='rgb(98, 245, 123)';
        }*/
        imageMode(CENTER);
        new Image(this.ratImg,0, 0, this.r + 10, this.r);
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false); 
        this.ctx.fill();
    }

    update(){
         //if ball is in zone move change to true
        if (380 < this.x && 420 > this.x && 745 < this.y && 785 > this.y) {
            this.done = true;
            this.index++;
        }
        else if (this.index < numGenes){
            //reset each balls x & y velocity 
            this.x += vel*this.genes[this.index][0];
            this.y += vel*this.genes[this.index][1];
            this.index++;
        }
    }
    
    setGenes(genes){
        this.genes=genes;
    }

    setRandomGenes(){
        //make genes into an array
        this.genes = [];
        for (let i = 0; i < numGenes; i++) {
            //random x & y vector
            this.genes[i] = [Math.random()-0.5, Math.random()-0.5]
        }
    }

    calcFitness(){
        var d = Math.sqrt((this.x - 400) ** 2 + (this.y - 765) ** 2);
        this.fitness = Math.max(0, 1 - d/800);
    }
}

function setup(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ratImg = loadImage('rat.png');
    for(i=0;i<numBalls;i++){
        //make balls 
        var species = new Rat(395,25,ctx);
        species.setRandomGenes();
        balls.push(species);
    }

    animationLoop();
}
    function loop(){
        
        if (generation == 2000) {
            return
        }
        for (let j = 0; j < numGenes; j++) {
            for (let i = 0; i < numBalls; i++) {
                balls[i].update();
            }
        }
        nextGen()
        
        loop();
    }
    

    
    function animationLoop(){
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        requestAnimationFrame(animationLoop);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < numBalls; i++) {
            var b = balls[i];
            b.update();
            b.draw();
        }
    
    // draw zone and text
    ctx.fillStyle = 'rgb(173, 216, 230)';
    ctx.fillRect(380, 745, 40, 40);
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.font = "25px Arial";
    ctx.fillText("Generation: " + generation.toString(), 15, 45);
    ctx.fillText("Avg fitness: " + avgFitness.toFixed(2).toString(), 15, 90);

    if (balls[0].index == numGenes) {
      newGen()
    }
}




function newGen(){
    generation++;
    console.log("Generation", generation);
    console.log(2.99e2+1);
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    //mating
    var children =[];
    var totFitness =0;
    for (let i = 0; i < numBalls; i++) {
        var child = balls[i];
        child.calcFitness();
        totFitness += child.fitness; 
        for (let j = 0; j < (2 ** (child.fitness * 10)); j++) {
            children.push(child);
        }
    }
    avgFitness = totFitness / numBalls;
    console.log("Average fitness", avgFitness);

    //reproduce
    var newBalls = [];
    for(let i = 0; i < numBalls;i++){
         // dad 
         var dad = children[Math.floor(Math.random() * children.length)];
         // mom
         var mom = children[Math.floor(Math.random() * children.length)];
         // baby
         var baby = new Rat(395, 25, ctx);
         // baby's genes
         var genes = [];
         
         for (let j = 0; j < numGenes; j++) {
             // choose random gene MUTATION_RATE % of time (currently 5%)
             if (Math.random() < mutationRate) {
                 genes.push([Math.random()-0.5, Math.random()-0.5]);
             }
             else if (j % 2) { 
                 // dad's genes first half
                 genes.push(dad.genes[j]);
             }
             else { 
                 // mom's genes second
                 genes.push(mom.genes[j]);
             }
    }
    baby.setGenes(genes);
    newBalls.push(baby);
    }
    //replace with new children
    balls = newBalls;
}   
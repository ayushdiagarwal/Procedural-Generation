var rcanvas = document.querySelector("#random")
rcanvas.width = window.innerWidth - 50;
rcanvas.height = 250;

var pcanvas = document.querySelector("#perlin");
pcanvas.width = window.innerWidth - 50;
pcanvas.height = 250;

var pctx = pcanvas.getContext('2d');
var rctx = rcanvas.getContext('2d');

class PsuedoRandom {
    constructor(seed) {
        this.seed = seed;
    }

    // Generates a random number between 0 and 1
    random() {
        const x = Math.sin(this.seed++)*10000;
        return x - Math.floor(x); 
    }

    randInt(min, max) {
        return Math.floor(this.random() * (max-min)) + min;
    }

    randFloat(min, max) {
        return this.random() * (max-min) + min;
    }

    // Generate an array of n random numbers
    randArray(n, min, max) {
        return Array(n).fill(0).map(() => this.randFloat(min, max));
    }
}

class Dot {
    constructor(x, y, ctx,color="blue", size="4") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.ctx = ctx;
    }

    drawDot() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}


function lerp(a, b, t) {
    return a + t * (b - a); // t is a value between 0 and 1
}

function cosineInterpolation(a,b,t) {
    const tRemapped = (1 - Math.cos(t*Math.PI))/2;
    return a + tRemapped * (b-a);
}


class RandPop {
    constructor(size, ctx) {
        this.dots = [];
        this.ctx = ctx;
        let posX = 10;
        const rng1 = new PsuedoRandom(Date.now());
        let positionsY = rng1.randArray(size, 1, rcanvas.height);

        // Random line generation
        for(let i=0; i<size; i++) {
            this.dots[i] = new Dot(posX, positionsY[i], this.ctx);
        
            // draw the path
            this.ctx.beginPath();
            this.ctx.moveTo(posX, positionsY[i]);
            posX += 50;
            this.ctx.bezierCurveTo(posX, positionsY[i+1]);
            this.ctx.stroke();

            this.dots[i].drawDot();
        }
    }
}

class RandSmoothPopCosine {
    constructor(size, ctx) {

        this.dots = [];
        this.ctx = ctx;
        let posX = 10;

        // Generate random points
        const rng1 = new PsuedoRandom(Date.now());
        let positionsY = rng1.randArray(size, 1, rcanvas.height);

        for(let i=0; i<size; i++) {
            this.dots.push(new Dot(posX, positionsY[i], this.ctx));
            posX += rcanvas.width/size;

            this.dots[i].drawDot();
        }


        // To make subdivsions
        this.size = size;
        this.smoothstep = [];
        this.subdivisons = 20;
        for (let i=0; i<size -1; i++) {
            const a = this.dots[i];
            const b = this.dots[i+1];

            // Interpolate the values between a and b
            for (let t=0; t<1; t+=1/this.subdivisons) {

                const interpolatedY = cosineInterpolation(a.y, b.y, t);
                const interpolatedX = lerp(a.x, b.x, t); // Smooth interpolation of X
                this.smoothstep.push({ x: interpolatedX, y: interpolatedY });
            }
        }

        this.drawSmoothCurve();
    }

    drawSmoothCurve() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.smoothstep[0].x, this.smoothstep[0].y);

        for (let i = 1; i < this.smoothstep.length; i++) {
            this.ctx.lineTo(this.smoothstep[i].x, this.smoothstep[i].y);
        }

        this.ctx.strokeStyle = "purple";
        this.ctx.stroke();
    }
}

function gameLoop() {
    // clear screen
    // rctx.clearRect(0,0, rcanvas.width, rcanvas.height)
    // draw population
    const popy = new RandSmoothPopCosine(20, rctx);
    const popi = new RandSmoothPopCosine(100, pctx);


    // requestAnimationFrame(gameLoop);

}

gameLoop()
var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth - 50;
canvas.height = 250;

var ctx = canvas.getContext('2d');

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
    constructor(x, y, color="blue", size="4") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
    }

    drawDot() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
}

function smoothstep(a,b,t) {
    return t * t * (b -a * t); // Cubic smoothing
}

function cosineInterpolation(a,b,t) {
    const tRemapped = (1 - Math.cos(t*Math.PI))/2;
    return a + tRemapped * (b-a);
}


class RandPop {
    constructor(size) {
        this.dots = [];
        let posX = 10;
        const rng1 = new PsuedoRandom(Date.now());
        let positionsY = rng1.randArray(size, 1, canvas.height);

        // Random line generation
        for(let i=0; i<size; i++) {
            this.dots[i] = new Dot(posX, positionsY[i]);
        
            // draw the path
            ctx.beginPath();
            ctx.moveTo(posX, positionsY[i]);
            posX += 50;
            ctx.bezierCurveTo(posX, positionsY[i+1]);
            ctx.stroke();

            this.dots[i].drawDot();
        }
    }
}

class RandSmoothPopCosine {
    constructor(size) {

        this.dots = [];
        let posX = 10;

        // Generate random points
        const rng1 = new PsuedoRandom(Date.now());
        let positionsY = rng1.randArray(size, 1, canvas.height);

        for(let i=0; i<size; i++) {
            this.dots.push(new Dot(posX, positionsY[i]));
            posX += 50;

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
        ctx.beginPath();
        ctx.moveTo(this.smoothstep[0].x, this.smoothstep[0].y);

        for (let i = 1; i < this.smoothstep.length; i++) {
            ctx.lineTo(this.smoothstep[i].x, this.smoothstep[i].y);
        }

        ctx.strokeStyle = "purple";
        ctx.stroke();
    }
}

class RandSmoothPop {
    constructor(size) {
        this.dots = [];
        let posX = 10;
        const rng1 = new PsuedoRandom(Date.now());
        let positionsY = rng1.randArray(size, 1, canvas.height);

        // Draw smoothed line
        ctx.beginPath();
        ctx.moveTo(posX, positionsY[0]); // Start at the first point

        for (let i = 1; i < size - 1; i++) {
            const x1 = posX;
            const y1 = positionsY[i - 1];
            const x2 = posX + 50;
            const y2 = positionsY[i];
            const x3 = posX + 100;
            const y3 = positionsY[i + 1];

            // Control points for cubic Bézier
            const cp1x = x1 + 25; // Midpoint between x1 and x2
            const cp1y = y1;
            const cp2x = x2 - 25; // Midpoint between x2 and x3
            const cp2y = y2;

            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);

            posX += 50;
        }

        ctx.stroke();

        // Draw dots
        posX = 10;
        for (let i = 0; i < size; i++) {
            this.dots[i] = new Dot(posX, positionsY[i]);
            this.dots[i].drawDot();
            posX += 50;
        }
    }
}


function hash(x) {
    return Math.sin(x * 127.1) * 43758.5453 % 1; // Random-like output
}


function lerp(a, b, t) {
    return a + t * (b - a); // t is a value between 0 and 1
}




class Pop {
    constructor(size) {
        this.dots = [];
        this.posX = 10;

        for (let i=0; i<size; i++) {
            this.dots[i] = new Dot(posX, )
        }
        
    }
}

function gameLoop() {
    // clear screen
    // ctx.clearRect(0,0, canvas.width, canvas.height)
    // draw population
    const popy = new RandSmoothPopCosine(50);

    // requestAnimationFrame(gameLoop);

}

gameLoop()
let alpha, beta, phi, A, B;

let alphaSlider, betaSlider, phiSlider, ASlider, BSlider;

let container;

function setup() {
    container = document.getElementById('canvas-container');

    let canvas = createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.parent('canvas-container');

    alphaSlider = document.getElementById('alphaSlider');
    betaSlider = document.getElementById('betaSlider');
    phiSlider = document.getElementById('phiSlider');
    ASlider = document.getElementById('ASlider');
    BSlider = document.getElementById('BSlider');

    updateParameters();
}

function windowResized() {
    resizeCanvas(container.offsetWidth, container.offsetHeight);
}


function draw() {
    updateParameters();

    background(20);

    translate(width / 2, height / 2);

    drawLissajous();
}

function updateParameters() {
    alpha = float(alphaSlider.value);
    beta = float(betaSlider.value);
    phi = float(phiSlider.value);

    let maxAmplitude = width / 2 * 0.95; // Use 95% of the half-width
    A = map(float(ASlider.value), 50, 200, 0.1 * maxAmplitude, maxAmplitude);
    B = map(float(BSlider.value), 50, 200, 0.1 * maxAmplitude, maxAmplitude);

    document.getElementById('alphaValue').textContent = alpha;
    document.getElementById('betaValue').textContent = beta;
    document.getElementById('phiValue').textContent = nf(phi, 0, 2);
    document.getElementById('AValue').textContent = ASlider.value; // Show original slider value
    document.getElementById('BValue').textContent = BSlider.value; // Show original slider value
}

function drawLissajous() {
    noFill();
    stroke(0, 255, 150);
    strokeWeight(2);

    beginShape();

    const steps = 1000;
    const t_max = TWO_PI;

    for (let i = 0; i <= steps; i++) {
        let t = map(i, 0, steps, 0, t_max);

        let x = A * sin(alpha * t);
        let y = B * sin(beta * t + phi);

        vertex(x, y);
    }

    endShape();

    let time = frameCount * 0.05;
    let currentX = A * sin(alpha * time);
    let currentY = B * sin(beta * time + phi);

    fill(255, 50, 50);
    noStroke();
    circle(currentX, currentY, 10);
}
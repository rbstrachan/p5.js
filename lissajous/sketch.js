let alpha, beta, phi, A, B;

let alphaSlider, betaSlider, phiSlider, ASlider, BSlider;

const CANVAS_SIZE = 500;

function setup() {
    let canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);

    canvas.parent('canvas-container');

    alphaSlider = document.getElementById('alphaSlider');
    betaSlider = document.getElementById('betaSlider');
    phiSlider = document.getElementById('phiSlider');
    ASlider = document.getElementById('ASlider');
    BSlider = document.getElementById('BSlider');

    updateParameters();
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
    A = float(ASlider.value);
    B = float(BSlider.value);

    document.getElementById('alphaValue').textContent = alpha;
    document.getElementById('betaValue').textContent = beta;
    document.getElementById('phiValue').textContent = nf(phi, 0, 2);
    document.getElementById('AValue').textContent = A;
    document.getElementById('BValue').textContent = B;
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
}
// by [reiwa](github.com/reiwa)
// inspiration from the [Mathologer](https://www.youtube.com/@Mathologer) [video](https://www.youtube.com/watch?v=uNemXgZ-MWY)
// tbp.js code adapted from [xianqui](https://github.com/xianqiu/Bankrupt)

// TODO
// - add a blue rectangle (like the grey rectangle) to half way point if estate is more than half of total debt to hide unwanted rectagnle outline
// - fix position of inputs - put them half way between edge of debt rectangle and edge of screen

let debts = [];
let awards = [];
let numDebts, numDebtsVal, debtTotal, maxDebt;
let estateValue, estateValueInput;
let currentEstateValue = 120;
let dragging = false;
let estateLineY, topY, bottomY;
let randomizeButton;

const INPUT_WIDTH = 60;
const VERTICAL_MARGIN = 50;

function setup() {
    createCanvas(displayWidth * 3 / 4, displayHeight * 2 / 3);
    window.addEventListener('wheel', handleScroll);

    topY = VERTICAL_MARGIN;
    bottomY = height - VERTICAL_MARGIN;

    createLabel("n", width - 270, 6);
    numDebts = createSlider(2, 10, 5);
    numDebts.position(width - 250, 20);
    numDebts.changed(updateDebts);
    numDebtsVal = createLabel(numDebts.value(), width - 66, 6);

    createLabel("E", width - 270, 36);
    estateValueInput = createInput(currentEstateValue.toString(), "number");
    estateValueInput.position(width - 250, 50);
    estateValueInput.size(INPUT_WIDTH);
    estateValueInput.input(validateEstateValue);

    createLabel("Debts", width - 230, 65);
    initializeDebts([100, 200, 300, 400, 500]);

    calcDebtTotal();
}

function draw() {
    background(220);

    let spacing = min(36, 36 - debts.length * 2);
    let drawingWidth = (3.5 / 7 + 1 / 42 * (numDebts.value() - 3)) * width;
    let containerWidth = Math.max((drawingWidth - (debts.length + 1) * spacing) / debts.length, 20);

    maxDebt = Math.max(...debts.map(debtInput => parseInt(debtInput.value())));
    estateValue = constrain(parseInt(estateValueInput.value()), 0, debtTotal);

    awards = cg(estateValue, debts.map(debtInput => parseInt(debtInput.value())));
    awards.sort((a, b) => b - a);

    let x = drawingWidth - containerWidth - spacing;
    let sortedDebts = [...debts].sort((a, b) => parseInt(b.value()) - parseInt(a.value()));

    sortedDebts.forEach((debtInput, index) => {
        let debt = parseInt(debtInput.value());
        let debtHeight = map(debt / 2, 0, maxDebt, 0, bottomY - topY);

        fill(200, 200, 200);
        drawDebtRectangles(x, topY, bottomY, containerWidth, debtHeight);

        if (!index) {
            stroke(200);
            rect(x + 5, (topY + bottomY) / 2 - 1, containerWidth - 10, 6)
            stroke(0);
        }

        drawDebtLabels(x, topY, bottomY, containerWidth, index, debt, awards[index]);

        x -= containerWidth + spacing;
    })

    drawBoundaryLines(topY, bottomY, drawingWidth);

    if (!isNaN(estateValue)) {
        drawEstateLine(maxDebt, topY, bottomY, drawingWidth, containerWidth, spacing, sortedDebts);
    }

    if (mouseY >= estateLineY - 10 && mouseY <= estateLineY + 10) {
        document.body.style.cursor = 'grab';
    } else {
        document.body.style.cursor = 'default';
    }
}

function mousePressed() {
    if (mouseY >= estateLineY - 15 && mouseY <= estateLineY + 15) {
        dragging = true;
    }
}

function mouseReleased() {
    dragging = false;
}

function mouseDragged() {
    if (dragging) {
        estateLineY = constrain(mouseY, topY, bottomY);
        estateValue = calculateEstateValueFromLineY(estateLineY, topY, bottomY);
        estateValueInput.value(estateValue.toFixed(0));
        validateEstateValue();
    }
}

function calculateEstateValueFromLineY(lineY, topY, bottomY) {
    let awards = cg(debtTotal, debts.map(debtInput => parseInt(debtInput.value())));
    awards.sort((a, b) => b - a);

    for (let i = 0; i <= debtTotal; i++) {
        let tempAwards = cg(i, debts.map(debtInput => parseInt(debtInput.value())));
        tempAwards.sort((a, b) => b - a);
        let tempLineY = constrain(topY + (bottomY - topY) * (1 - (tempAwards[0] / maxDebt)), topY, bottomY);
        if (Math.abs(tempLineY - lineY) < 1) {
            estateValue = i;
            break;
        }
    }
    return estateValue;
}

function createLabel(text, x, y) {
    return createP(text).position(x, y);
}

function initializeDebts(initialValues) {
    initialValues.forEach((value, index) => {
        let debtInput = createInput(value.toString(), "number");
        debtInput.position(width - 250, 110 + index * 30);
        debtInput.size(INPUT_WIDTH);
        debtInput.changed(calcDebtTotal);
        debtInput.input(validateDebtInput);
        debts.push(debtInput);
    });

    randomizeButton = createButton('Randomize Debt Amounts');
    randomizeButton.position(width - 250, 110 + initialValues.length * 30);
    randomizeButton.mousePressed(randomizeDebts);
}

function handleScroll(event) {
    let delta = event.deltaY;
    let changeAmount = Math.max(0.5, Math.round(Math.log10(debtTotal + 1)));
    let currentEstate = parseInt(estateValueInput.value());

    if (delta > 0) {
        estateValueInput.value(Math.min(currentEstate + changeAmount, debtTotal));
    } else {
        estateValueInput.value(Math.max(currentEstate - changeAmount, 0));
    }

    validateEstateValue();
}

function randomizeDebts() {
    debts.forEach(debtInput => {
        let randomValue = Math.floor(Math.random() * 1000) + 1;
        debtInput.value(randomValue);
    });

    calcDebtTotal();
}

function validateEstateValue() {
    let enteredValue = parseInt(estateValueInput.value());

    if (isNaN(enteredValue) || enteredValue < 0) {
        estateValueInput.value(0);
    } else if (enteredValue > debtTotal) {
        estateValueInput.value(debtTotal);
    }
}

function validateDebtInput() {
    let enteredValue = parseInt(this.value());
    if (isNaN(enteredValue) || enteredValue < 1) {
        this.value(1);
    }
}

function updateDebts() {
    let n = parseInt(numDebts.value());
    let currentDebtsLength = debts.length;

    if (n > currentDebtsLength) {
        for (let i = currentDebtsLength; i < n; i++) {
            let debtInput = createInput("100", "number");
            debtInput.size(INPUT_WIDTH);
            debtInput.position(width - 250, 110 + i * 30);
            debtInput.changed(calcDebtTotal);
            debts.push(debtInput);
        }
    } else if (n < currentDebtsLength) {
        for (let i = currentDebtsLength - 1; i >= n; i--) {
            debts[i].remove();
            debts.pop();
        }
    }

    numDebtsVal.remove();
    numDebtsVal = createP(numDebts.value()).position(width - 66, 6);

    randomizeButton.position(width - 250, 110 + numDebts.value() * 30);
    console.log('here');

    calcDebtTotal();
}

function calcDebtTotal() {
    debtTotal = debts.reduce((total, debtInput) => total + parseInt(debtInput.value()), 0);
    validateEstateValue();
}

function drawDebtRectangles(x, topY, bottomY, containerWidth, debtHeight) {
    let remainingHeight = debtHeight;
    while (remainingHeight > 0) {
        let pushHeight = Math.min(remainingHeight, (bottomY - topY) / 2);
        line(x + containerWidth / 2, topY, x + containerWidth / 2, bottomY);
        rect(x, topY + debtHeight - remainingHeight, containerWidth, -pushHeight);
        rect(x, bottomY - (debtHeight - remainingHeight) - pushHeight, containerWidth, pushHeight);
        remainingHeight -= pushHeight;
    }
}

function drawDebtLabels(x, topY, bottomY, containerWidth, index, debt, award) {
    strokeWeight(1);
    fill(0);
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text(index + 1, x + containerWidth / 2, topY - 5);
    text("$" + award.toFixed(2), x + containerWidth / 2, bottomY + 20);
    text((award.toFixed(2) * 100 / debt).toFixed(2) + "%", x + containerWidth / 2, bottomY + 34);
    strokeWeight(5);
}

function drawBoundaryLines(topY, bottomY, drawingWidth) {
    stroke(0);
    strokeWeight(5);
    line(0, topY, drawingWidth, topY);
    line(0, bottomY, drawingWidth, bottomY);
}

function drawEstateLine(maxDebt, topY, bottomY, drawingWidth, containerWidth, spacing, sortedDebts) {
    estateLineY = constrain(topY + (bottomY - topY) * (1 - (awards[0] / maxDebt)), topY, bottomY);
    let estateLinePosition = map(estateLineY, bottomY, topY, 0, bottomY - topY)

    x = drawingWidth - containerWidth - spacing;
    for (let debtInput of sortedDebts) {
        let debt = parseInt(debtInput.value());
        let debtHeight = map(debt, 0, maxDebt, 0, bottomY - topY);
        let debtBTop = debtHeight / 2;
        let debtBBottom = bottomY;
        let debtTTop = topY;
        let debtTBottom = topY + debtHeight / 2;

        let fillBTop = Math.min(estateLinePosition, debtBTop);
        let fillBBottom = Math.min(bottomY, debtBBottom);
        let fillTTop = estateLinePosition;
        let fillTBottom = debtTBottom;

        fill(0, 135, 168); // blue
        // fill(0, 135, 108); // green
        strokeWeight(0);
        rect(x + 2, height - VERTICAL_MARGIN - fillBTop + 2, containerWidth - 4, fillBTop - 4);
        strokeWeight(5);

        if (bottomY - topY - estateLinePosition < topY + debtHeight / 2 - VERTICAL_MARGIN) {
            rect(x, estateLineY, containerWidth, fillTBottom - estateLineY);
        }

        // stroke(0,108,86);
        // fill(0,108,86);
        stroke(0, 108, 146);
        fill(0, 108, 146);
        line(0, estateLineY, drawingWidth, estateLineY);
        triangle(drawingWidth, estateLineY, drawingWidth + 20, estateLineY + 10, drawingWidth + 20, estateLineY - 10);
        stroke(0);
        // text("E", drawingWidth + 20, estateLineY)

        x -= containerWidth + spacing;
    }
}
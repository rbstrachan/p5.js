// TODO
// - add identifiers to the debt inputs
// - make E bar draggable?
// - allow drawingWidth to increase if too many debts are added, up to a certain limit (15?)

let debts = [];
let numDebts;
let maxDebt;
let debtTotal;
let estateValueInput;
let estateValue;
let awards = [];
let currentEstateValue = 120;
let numDebtsVal;

function setup() {
  createCanvas(displayWidth * 2/3, displayHeight * 2/3);
  
  window.addEventListener('wheel', handleScroll);
  
  createP("n").position(width - 270, 6);
  numDebts = createSlider(2, 7, 3);
  numDebts.position(width - 250, 20);
  numDebts.changed(updateDebts);
  numDebtsVal = createP(numDebts.value()).position(width - 66, 6);

  createP("E").position(width - 270, 36);
  estateValueInput = createInput("120", "number");
  estateValueInput.position(width - 250, 50);
  estateValueInput.size(60);
  estateValueInput.input(validateEstateValue);
  
  createP("Debts").position(width - 230, 65)
  debts.push(createInput("300", "number"));
  debts.push(createInput("200", "number"));
  debts.push(createInput("100", "number"));

  for (let i = 0; i < debts.length; i++) {
    debts[i].position(width - 250, 110 + i * 30);
    debts[i].size(60);
    debts[i].changed(calcDebtTotal);
  }
  
  calcDebtTotal();
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

function updateDebts() {
  let n = parseInt(numDebts.value());
  let currentDebtsLength = debts.length;
  
  if (n > currentDebtsLength) {
    for (let i = currentDebtsLength; i < n; i++) {
      let debtInput = createInput("100", "number");
      debtInput.size(50);
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
  
  calcDebtTotal();
}

function calcDebtTotal() {
  debtTotal = 0;
  for (let debtInput of debts) {
    debtTotal += parseInt(debtInput.value());
  }
}

function cea(estate, d) {
  const k = d.length;
  const x = Array(k).fill(0);

  if (k === 0) {
    return x;
  }

  const sortedClaimsWithIndices = d.map((claim, index) => ({ claim, index })).sort((a, b) => a.claim - b.claim);
  const dSorted = sortedClaimsWithIndices.map(item => item.claim);

  for (let i = 0; i < k; i++) {
    x[i] = dSorted[i] <= estate / (k - i) ? dSorted[i] : estate / (k - i);
    estate -= x[i];
  }

  const reorderedX = Array(k).fill(0);
  for (let i = 0; i < k; i++) {
    reorderedX[sortedClaimsWithIndices[i].index] = x[i];
  }

  return reorderedX;
}

function cg(estate, d) {
  const totalClaim = d.reduce((sum, claim) => sum + claim, 0);
  const dHalf = d.map(claim => claim / 2);

  if (estate >= totalClaim) {
    return d;
  }

  if (estate < totalClaim / 2) {
    return cea(estate, dHalf);
  } else {
    const lost = cea(totalClaim - estate, dHalf);
    return d.map((claim, i) => claim - lost[i]);
  }
}

function draw() {
  background(220);

  let topY = 50;
  let bottomY = height - 50;
  let spacing = min(36, 36 - debts.length * 2);
  let drawingWidth = (3.5/7 + 1/42 * (numDebts.value() - 3)) * width;

  let containerWidth = Math.max((drawingWidth - (debts.length + 1) * spacing) / debts.length, 20);
  
  maxDebt = 0;
  for (let debtInput of debts) {
    let debt = parseInt(debtInput.value());
    maxDebt = Math.max(maxDebt, debt);
  }

  estateValue = constrain(parseInt(estateValueInput.value()), 0, debtTotal);
  
  awards = cg(estateValue, debts.map(debtInput => parseInt(debtInput.value())));
  awards.sort((a, b) => b - a);
  
  let x = drawingWidth - containerWidth - spacing;

  let sortedDebts = [...debts].sort((a, b) => parseInt(b.value()) - parseInt(a.value()));

  sortedDebts.forEach((debtInput, index) => {
    let debt = parseInt(debtInput.value());
    let debtHeight = map(debt/2, 0, maxDebt, 0, bottomY - topY);

    fill(200, 200, 200);
    // rect(x, topY, containerWidth, debtHeight);

    let remainingHeight = debtHeight;
    while (remainingHeight > 0) {
      let pushHeight = Math.min(remainingHeight, (bottomY - topY) / 2);
      line(x+containerWidth / 2, topY, x+containerWidth/2, bottomY)
      rect(x, topY + debtHeight - remainingHeight, containerWidth, -pushHeight);      
      rect(x, bottomY - (debtHeight - remainingHeight) - pushHeight, containerWidth, pushHeight);
      remainingHeight -= pushHeight;
    }
    if (!index) {
      stroke(200);
      rect(x + 5, (topY + bottomY) / 2 - 1, containerWidth - 10, 6)
      stroke(0);
    }
    
    strokeWeight(1);
    fill(0); // Black text
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text(index + 1, x + containerWidth / 2, topY - 5);
    text("$" + awards[index].toFixed(2), x + containerWidth / 2, bottomY + 20);
    text((awards[index].toFixed(2) * 100 / debt).toFixed(2) + "%", x + containerWidth / 2, bottomY + 34);
    text((awards[index].toFixed(2) * 100 / debtTotal).toFixed(2) + "%", x + containerWidth / 2, bottomY + 48);
    strokeWeight(5);
    
    x -= containerWidth + spacing;
  })

  stroke(0);
  strokeWeight(5);
  line(0, topY, drawingWidth, topY);
  line(0, bottomY, drawingWidth, bottomY);
  
  if (!isNaN(estateValue)) {
    let estateLineY = constrain(topY + (bottomY - topY) * (1 - (awards[0] / maxDebt)), topY, bottomY);
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
      rect(x + 2, height - 50 - fillBTop + 2, containerWidth - 4, fillBTop - 4);
      strokeWeight(5);
      
      if (bottomY - topY - estateLinePosition < topY + debtHeight / 2 - 50) {
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
}
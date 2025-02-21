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
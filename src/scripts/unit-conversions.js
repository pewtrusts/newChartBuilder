function picaToInches(d) {
    const split = d.split('p');
    return split[0] / 6 + split[1] / 12;
}
function pixelsToInches(px) {
    return Number((px / 96 / 1.3333).toFixed(3));
}
function inchesToPixels(inches) {
    return inches * 96 * 1.3333;
}

export default {
    picaToInches,
    pixelsToInches,
    inchesToPixels
};
const hexToRgb = (hex) => {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
};

function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col,16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
}

const rgbToHex = (rgb) => {
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

const checksRGB = (color) => {
  if (color <= 0.03928) {
    return (color / 12.92);
  } else {
    return (Math.pow(((color + 0.055)/1.055), 2.4));
  }
}

const calculateRatio = (color1, color2) => {
  const colorOneR = color1.r/255;
  const colorOneG = color1.g/255;
  const colorOneB = color1.b/255;
  const colorTwoR = color2.r/255;
  const colorTwoG = color2.g/255;
  const colorTwoB = color2.b/255;
  const colorOneRsRGB = checksRGB(colorOneR);
  const colorOneGsRGB = checksRGB(colorOneG);
  const colorOneBsRGB = checksRGB(colorOneB);
  const colorTwoRsRGB = checksRGB(colorTwoR);
  const colorTwoGsRGB = checksRGB(colorTwoG);
  const colorTwoBsRGB = checksRGB(colorTwoB);
  const colorOneL = ((0.2126 * colorOneRsRGB) + (0.7152 * colorOneGsRGB) + (0.0722 * colorOneBsRGB));
  const colorTwoL = ((0.2126 * colorTwoRsRGB) + (0.7152 * colorTwoGsRGB) + (0.0722 * colorTwoBsRGB));
  if (colorOneL > colorTwoL) {
      return ((colorOneL + 0.05)/(colorTwoL + 0.05));
  } else {
      return ((colorTwoL + 0.05)/(colorOneL + 0.05));
  }
}

const contrast = (color) => {
  const colorOneBright = Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114))/1000);
  const colorLight = Math.round(((255 * 299) + (255 * 587) + (255 * 114))/1000);
  if (Math.abs(colorOneBright) < (colorLight / 2)) {
    return '#FFFFFF';
  } else {
    return '#000000';
  }
}

const colorOne = document.querySelector('#color1');
const colorTwo = document.querySelector('#color2');
const colorOneContainer = document.querySelector('.color1');
const colorTwoContainer = document.querySelector('.color2');
const colorOneTextBox = document.querySelector('.color1 .text-box');
const colorTwoTextBox = document.querySelector('.color2 .text-box');
const scoreBox = document.querySelector('.score');
const colorOneRange = colorOneContainer.querySelector('.input-range');
const colorTwoRange = colorTwoContainer.querySelector('.input-range');

const updateAll = () => {
  colorOneContainer.style.backgroundColor = colorOne.value;
  colorTwoContainer.style.backgroundColor = colorTwo.value;
  colorOneTextBox.style.backgroundColor = colorTwo.value;
  colorOneTextBox.style.color = colorOne.value;
  colorTwoTextBox.style.backgroundColor = colorOne.value;
  colorTwoTextBox.style.color = colorTwo.value;
  let colorOneHex = hexToRgb(colorOne.value);
  let colorTwoHex = hexToRgb(colorTwo.value);
  colorOneRange.style.color = contrast(colorOneHex);
  colorTwoRange.style.color = contrast(colorTwoHex);
  const message = scoreBox.querySelector('.message');
  const verdict = scoreBox.querySelector('.verdict');
  if (calculateRatio(colorOneHex, colorTwoHex).toFixed(2) > 4.5) {
    scoreBox.querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="approved">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `Yes, go for it.`;
    message.innerHTML = `You can indeed use <span>${colorOne.value}</span> with <span>${colorTwo.value}</span>.<br><br><a href="#" class="verdict-link">Learn More</a>`;
  } else if (calculateRatio(colorOneHex, colorTwoHex).toFixed(2) < 5.0 && calculateRatio(colorOneHex, colorTwoHex).toFixed(2) > 4.5) {
    scoreBox.querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="approved">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `Yes, but use with caution.`;
    message.innerHTML = `You can use <span>${colorOne.value}</span> with <span>${colorTwo.value}</span>, but you're close to 4.5 so consider making some adjustments.<br><br><a href="#" class="verdict-link">Explain please?</a>`;
  } else if (calculateRatio(colorOneHex, colorTwoHex).toFixed(2) < 4.5 && calculateRatio(colorOneHex, colorTwoHex).toFixed(2) > 4.0) {
    scoreBox.querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="nope">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `No, but very close.`;
    message.innerHTML = `You <span>can't</span> use <span>${colorOne.value}</span> with <span>${colorTwo.value}</span>.<br />You're close to 4.5, so try a darker or lighter variation of a color.<br><br><a href="#" class="verdict-link">Explain please?</a>`;
  } else {
    scoreBox.querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="nope">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `No.`;
    message.innerHTML = `You <span>can't</span> use <span>${colorOne.value}</span> with <span>${colorTwo.value}</span>.<br><br><a href="#" class="verdict-link">Why not?</a>`;
  }
}

window.onload = () => {
  updateAll();

  [... document.querySelectorAll('input[type="text"]')].forEach(input => {
    input.addEventListener('focus', () => {
      input.setSelectionRange(0, input.value.length);
    });
    input.addEventListener('blur', () => {
      if ((!(input.value === 0) && !(input.value.substring(0, 1) === '#'))) {
        input.value = `#${input.value}`;
      }
    });
    input.addEventListener('change', () => {
      if (!(input.value.substring(0, 1) === '#')) {
        input.value = `#${input.value}`;
      }
      input.parentElement.parentElement.querySelector('.input-adjust').value = "0";
      updateAll();
    });
  });
  [... document.querySelectorAll('input[type="range"]')].forEach(input => {
    const inputValue = parseInt(input.value);
    let currentHex;
    input.addEventListener('focus', (evt) => {
      console.log('hello');
      if (inputValue === 0) {
        currentHex = input.parentElement.parentElement.querySelector('.colorInput').value;
      }
    });
    input.addEventListener('input', (evt) => {
      const inputValue = parseInt(input.value);
      let newHex;
      let value = 0;
      if (!(inputValue === 0)) {
        if (inputValue > 0) {
          value = 0 + (inputValue);
        } else if (inputValue < 0) {
          value = 0 + (inputValue);
        }
      }
      console.log(currentHex);
      if (inputValue > 0) {
        newHex = LightenDarkenColor(currentHex, value);
      } else if (inputValue < 0) {
        newHex = LightenDarkenColor(currentHex, value);
      } else if (inputValue === 0) {
        newHex = LightenDarkenColor(currentHex, 0);
      }
      input.parentElement.parentElement.querySelector('.colorInput').value = newHex;
      updateAll();
    });
  });
};

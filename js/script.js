/* HEX to RGB function */
const hexToRgb = (hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
};

/* RGB to HEX function */
const rgbToHex = (rgb) => {
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

/* Function to lighten or darken the passed color */
const lightenDarkenColor = (col, amt) => {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col,16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if  (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + amt;
  if (b > 255) b = 255;
  else if  (b < 0) b = 0;
  let g = (num & 0x0000FF) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound?"#":"") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
}

/* Function that gets the sRGB value of a color brightness value */
const checksRGB = (color) => {
  if (color <= 0.03928) {
    return (color / 12.92);
  } else {
    return (Math.pow(((color + 0.055)/1.055), 2.4));
  }
}

/* Function that returns a color object */
const getColorObject = (color) => {
  const colorObj = {
    r: checksRGB(color.r/255),
    g: checksRGB(color.g/255),
    b: checksRGB(color.b/255)
  };
  return colorObj;
};

/* Function that calculates the ratio between two colors */
const calculateRatio = (color1, color2) => {
  const colorOneObject = getColorObject(color1);
  const colorTwoObject = getColorObject(color2);
  const colorOneL = ((0.2126 * colorOneObject.r) + (0.7152 * colorOneObject.g) + (0.0722 * colorOneObject.b));
  const colorTwoL = ((0.2126 * colorTwoObject.r) + (0.7152 * colorTwoObject.g) + (0.0722 * colorTwoObject.b));
  if (colorOneL > colorTwoL) {
      return ((colorOneL + 0.05)/(colorTwoL + 0.05));
  } else {
      return ((colorTwoL + 0.05)/(colorOneL + 0.05));
  }
}

/* Function that updates all the color values on the page */
const updateAll = () => {
  const colorOne = document.querySelector('#color1-value').value;
  const colorTwo = document.querySelector('#color2-value').value;
  const colorOneContainer = document.querySelector('[data-color-one]');
  const colorTwoContainer = document.querySelector('[data-color-two]');
  const colorOneTextbox = colorOneContainer.querySelector('.text-box');
  const colorTwoTextbox = colorTwoContainer.querySelector('.text-box');
  const contrastRatio = document.querySelector('.sidebar__score--ratio');
  const colorOneRgb = hexToRgb(colorOne);
  const colorTwoRgb = hexToRgb(colorTwo);
  colorOneContainer.style.backgroundColor = colorOne;
  colorTwoContainer.style.backgroundColor = colorTwo;
  colorOneTextbox.style.backgroundColor = colorTwo;
  colorTwoTextbox.style.backgroundColor = colorOne;
  colorOneContainer.style.color = colorOne;
  colorTwoContainer.style.color = colorTwo;

  if (colorOneRgb && colorTwoRgb) {
    if (calculateRatio(colorOneRgb, colorTwoRgb).toFixed(2) > 4.5) {
      contrastRatio.innerHTML = `Contrast Ratio: <span class="approved">${calculateRatio(colorTwoRgb, colorOneRgb).toFixed(2)}</span>`;
    } else {
      contrastRatio.innerHTML = `Contrast Ratio: <span class="nope">${calculateRatio(colorTwoRgb, colorOneRgb).toFixed(2)}</span>`;
    }
  }
}

/* Click handler for the adjust color buttons */
const clickHandler = (evt, cnt, hex) => {
  evt.stopPropagation();
  if (hex.length === 4) {
    let expandedHex = hex.split('');
    hex = expandedHex[0] + expandedHex[1] + expandedHex[1] + expandedHex[2] + expandedHex[2] + expandedHex[3] + expandedHex[3];
  }
  const newHex = lightenDarkenColor(hex, cnt);
  evt.currentTarget.parentElement.parentElement.querySelector('input').value = newHex;
  updateAll();
}

window.onload = () => {
  const launchBtn = document.querySelector('[data-launch-widget]');
  launchBtn.addEventListener('click', (evt) => {
    window.open('https://marijohannessen.github.io/color-contrast-checker/', '', 'width=390, height=450, menubar=no, resizable=no');
  });

  const colorOne = document.querySelector('#color1-value');
  const colorTwo = document.querySelector('#color2-value');
  let mainHexOne = colorOne.value;
  let mainHexTwo = colorTwo.value;
  let prevMainHexOne;
  let prevMainHexTwo;

  if (colorOne.value.length > 2 && colorTwo.value.length > 2) {
    updateAll();
  }

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
      updateAll();
    });
  });

  colorOne.addEventListener('input', () => {
    if (!(colorOne.value.substring(0, 1) === '#')) {
      colorOne.value = `#${colorOne.value}`;
    }
    if (colorOne.value.length > 2) {
      mainHexOne = colorOne.value;
      updateAll();
    }
  });

  colorTwo.addEventListener('input', () => {
    if (!(colorTwo.value.substring(0, 1) === '#')) {
      colorTwo.value = `#${colorTwo.value}`;
    }
    if (colorTwo.value.length > 2) {
      mainHexTwo = colorTwo.value;
      updateAll();
    }
  });

  let counter = 0;
  let counter2 = 0;
  let count = 0;

  document.querySelector('[data-undo-one]').addEventListener('click', (evt) => {
    colorOne.value = mainHexOne;
    updateAll();
    evt.currentTarget.classList.remove('is-shown');
    counter = 0;
  });

  document.querySelector('[data-undo-two]').addEventListener('click', (evt) => {
    colorTwo.value = mainHexTwo;
    updateAll();
    evt.currentTarget.classList.remove('is-shown');
    counter2 = 0;
  });

  document.querySelector('[data-adjust-darken-one]').addEventListener('click', (evt) => {
    const undoBtn = evt.currentTarget.parentElement.parentElement.querySelector('[data-undo-one]');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="white"]').classList.remove('is-pressed');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="black"]').classList.remove('is-pressed');
    undoBtn.classList.add('is-shown');
    counter = counter-5;
    if (counter === 0) {
      undoBtn.classList.remove('is-shown');
    }
    clickHandler(evt, counter, mainHexOne);
  });
  document.querySelector('[data-adjust-lighten-one]').addEventListener('click', (evt) => {
    const undoBtn = evt.currentTarget.parentElement.parentElement.querySelector('[data-undo-one]');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="white"]').classList.remove('is-pressed');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="black"]').classList.remove('is-pressed');
    undoBtn.classList.add('is-shown');
    counter = counter+5;
    if (counter === 0) {
      undoBtn.classList.remove('is-shown');
    }
    clickHandler(evt, counter, mainHexOne);
  });
  document.querySelector('[data-adjust-darken-two]').addEventListener('click', (evt) => {
    const undoBtn = evt.currentTarget.parentElement.parentElement.querySelector('[data-undo-two]');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="white"]').classList.remove('is-pressed');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="black"]').classList.remove('is-pressed');
    undoBtn.classList.add('is-shown');
    counter2 = counter2-5;
    if (counter2 === 0) {
      undoBtn.classList.remove('is-shown');
    }
    clickHandler(evt, counter2, mainHexTwo);
  });
  document.querySelector('[data-adjust-lighten-two]').addEventListener('click', (evt) => {
    const undoBtn = evt.currentTarget.parentElement.parentElement.querySelector('[data-undo-two]');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="white"]').classList.remove('is-pressed');
    evt.currentTarget.parentElement.parentElement.querySelector('[data-adjust-bw="black"]').classList.remove('is-pressed');
    undoBtn.classList.add('is-shown');
    counter2 = counter2+5;
    if (counter2 === 0) {
      undoBtn.classList.remove('is-shown');
    }
    clickHandler(evt, counter2, mainHexTwo);
  });

  const toggleBlackWhite = (evt) => {
    evt.stopPropagation();
    const button = evt.currentTarget;
    let parentInput = button.parentElement.parentElement.querySelector('input');
    const color = button.dataset.adjustBw;
    const colorNumber = parentInput.dataset.colorInput;
    let currentValue = colorNumber === 'one' ? mainHexOne : mainHexTwo;
    let undoButton = colorNumber === 'one' ? '[data-undo-one]' : '[data-undo-two]';
    if (color === 'black') {
      if (parentInput.value === '#000000') {
        parentInput.parentElement.querySelector(undoButton).classList.remove('is-shown');
        button.classList.remove('is-pressed');
        parentInput.value = currentValue;
      } else {
        evt.currentTarget.classList.add('is-pressed');
        parentInput.value = '#000000';
      }
    } else if (color === 'white') {
      if (parentInput.value === '#FFFFFF') {
        parentInput.parentElement.querySelector(undoButton).classList.remove('is-shown');
        button.classList.remove('is-pressed');
        parentInput.value = currentValue;
      } else {
        evt.currentTarget.classList.add('is-pressed');
        parentInput.value = '#FFFFFF';
      }
    }
    updateAll();
  };

  [... document.querySelectorAll('[data-adjust-bw]')].forEach(btn => {
    btn.addEventListener('click', (evt) => {
      toggleBlackWhite(evt);
    });
  });
};

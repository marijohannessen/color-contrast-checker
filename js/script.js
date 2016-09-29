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

const getColorObject = (color) => {
  const colorObj = {
    r: checksRGB(color.r/255),
    g: checksRGB(color.g/255),
    b: checksRGB(color.b/255)
  };
  return colorObj;
};

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

const contrast = (color) => {
  const colorOneBright = Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114))/1000);
  const colorLight = Math.round(((255 * 299) + (255 * 587) + (255 * 114))/1000);
  if (Math.abs(colorOneBright) < (colorLight / 2)) {
    return '#FFFFFF';
  } else {
    return '#000000';
  }
}

const updateAll = () => {
  document.querySelector('[data-color-one]').querySelector('.color__hex').style.backgroundColor = document.querySelector('#color1').value;
  document.querySelector('[data-color-two]').querySelector('.color__hex').style.backgroundColor = document.querySelector('#color2').value;
  // document.querySelector('[data-color-one]').querySelector('.color__input').value = document.querySelector('#color1').value;

  document.querySelector('#color1').style.backgroundColor = document.querySelector('#color2').value;
  document.querySelector('#color2').style.backgroundColor = document.querySelector('#color1').value;
  document.querySelector('#color2').style.color = document.querySelector('#color2').value;
  document.querySelector('#color1').style.color = document.querySelector('#color1').value;
  document.querySelector('.color1').style.backgroundColor = document.querySelector('#color1').value;
  document.querySelector('.color2').style.backgroundColor = document.querySelector('#color2').value;
  document.querySelector('.color1 .text-box').style.backgroundColor = document.querySelector('#color2').value;
  document.querySelector('.color1 .text-box').style.color = document.querySelector('#color1').value;
  document.querySelector('.color2 .text-box').style.backgroundColor = document.querySelector('#color1').value;
  document.querySelector('.color2 .text-box').style.color = document.querySelector('#color2').value;
  let colorOneHex = hexToRgb(document.querySelector('#color1').value);
  let colorTwoHex = hexToRgb(document.querySelector('#color2').value);
  const message = document.querySelector('.score').querySelector('.message');
  const verdict = document.querySelector('.score').querySelector('.verdict');
  if (calculateRatio(colorOneHex, colorTwoHex).toFixed(2) > 4.5) {
    document.querySelector('.score').querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="approved">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `Yes, go for it.`;
    message.innerHTML = `You can use <span>${document.querySelector('#color1').value}</span> with <span>${document.querySelector('#color2').value}</span>.`;
  } else if (calculateRatio(colorOneHex, colorTwoHex).toFixed(2) < 5.0 && calculateRatio(colorOneHex, colorTwoHex).toFixed(2) > 4.5) {
    document.querySelector('.score').querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="approved">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `Yes, but use with caution.`;
    message.innerHTML = `You can use <span>${document.querySelector('#color1').value}</span> with <span>${document.querySelector('#color2').value}</span>, but you're close to 4.5 so consider making some adjustments.`;
  } else if (calculateRatio(colorOneHex, colorTwoHex).toFixed(2) < 4.5 && calculateRatio(colorOneHex, colorTwoHex).toFixed(2) > 4.0) {
    document.querySelector('.score').querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="nope">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `No, but very close.`;
    message.innerHTML = `You can't use <span>${document.querySelector('#color1').value}</span> with <span>${document.querySelector('#color2').value}</span>.<br />You're close to 4.5, so try a darker or lighter variation of a color.`;
  } else {
    document.querySelector('.score').querySelector('.numbers').innerHTML = `Contrast Ratio: <span class="nope">${calculateRatio(colorTwoHex, colorOneHex).toFixed(2)}</span>`;
    verdict.textContent = `No.`;
    message.innerHTML = `You can't use <span>${document.querySelector('#color1').value}</span> with <span>${document.querySelector('#color2').value}</span>.`;
  }
}

const clickHandler = (evt, cnt, hex) => {
  evt.stopPropagation();
  console.log(hex);
  let newHex = lightenDarkenColor(hex, cnt);
  evt.currentTarget.parentElement.parentElement.querySelector('input').value = newHex;
  if (evt.target.parentElement.parentElement.querySelector('input').dataset.colorInput === "one") {
    document.querySelector('#color1').value = evt.currentTarget.parentElement.parentElement.querySelector('input').value;
  } else {
    document.querySelector('#color2').value = evt.currentTarget.parentElement.parentElement.querySelector('input').value;
  }
  updateAll();
}

window.onload = () => {
  updateAll();

  const inputOne = document.querySelector('#color1-small');
  const inputTwo = document.querySelector('#color2-small');
  const inputMainOne = document.querySelector('#color1');
  const inputMainTwo = document.querySelector('#color2');
  let mainHexOne = document.querySelector('#color1-small').value;
  let mainHexTwo = document.querySelector('#color2-small').value;
  if (inputOne.value === '') {
    inputOne.value = inputMainOne.value;
  }
  if (inputTwo.value === '') {
    inputTwo.value = inputMainTwo.value;
  }

  inputOne.addEventListener('input', () => {
    if (!(inputOne.value.substring(0, 1) === '#')) {
      inputOne.value = `#${inputOne.value}`;
    }
    if (!(inputMainOne.value.substring(0, 1) === '#')) {
      inputMainOne.value = `#${inputMainOne.value}`;
    }
    inputMainOne.value = inputOne.value;
    mainHexOne = inputMainOne.value;
    updateAll();
  });
  inputTwo.addEventListener('input', () => {
    if (!(inputTwo.value.substring(0, 1) === '#')) {
      inputTwo.value = `#${inputTwo.value}`;
    }
    if (!(inputMainTwo.value.substring(0, 1) === '#')) {
      inputMainTwo.value = `#${inputMainTwo.value}`;
    }
    inputMainTwo.value = inputTwo.value;
    mainHexTwo = inputMainTwo.value;
    updateAll();
  });
  inputMainOne.addEventListener('input', () => {
    if (!(inputOne.value.substring(0, 1) === '#')) {
      inputOne.value = `#${inputOne.value}`;
    }
    if (!(inputMainOne.value.substring(0, 1) === '#')) {
      inputMainOne.value = `#${inputMainOne.value}`;
    }
    inputOne.value = inputMainOne.value;
    mainHexOne = inputOne.value;
    updateAll();
  });
  inputMainTwo.addEventListener('input', () => {
    if (!(inputTwo.value.substring(0, 1) === '#')) {
      inputTwo.value = `#${inputTwo.value}`;
    }
    if (!(inputMainTwo.value.substring(0, 1) === '#')) {
      inputMainTwo.value = `#${inputMainTwo.value}`;
    }
    inputTwo.value = inputMainTwo.value;
    mainHexTwo = inputTwo.value;
    updateAll();
  });

  [... document.querySelectorAll('input[type="text"]')].forEach(input => {
    input.addEventListener('focus', () => {
      input.setSelectionRange(0, input.value.length);
    });
    input.addEventListener('blur', () => {
      if ((!(input.value === 0) && !(input.value.substring(0, 1) === '#'))) {
        input.value = `#${input.value}`;
      }
    });
  });
  let counter = 0;
  let counter2 = 0;
  document.querySelector('[data-adjust-darken-one]').addEventListener('click', (evt) => {
    counter = counter-5;
    clickHandler(evt, counter, mainHexOne);
  });
  document.querySelector('[data-adjust-lighten-one]').addEventListener('click', (evt) => {
    counter = counter+5;
    clickHandler(evt, counter, mainHexOne);
  });
  document.querySelector('[data-adjust-darken-two]').addEventListener('click', (evt) => {
    counter2 = counter2-5;
    clickHandler(evt, counter2, mainHexTwo);
  });
  document.querySelector('[data-adjust-lighten-two]').addEventListener('click', (evt) => {
    counter2 = counter2+5;
    clickHandler(evt, counter2, mainHexTwo);
  });
};

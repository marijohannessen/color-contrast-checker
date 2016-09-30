# Color Contrast Checker
### <a href="https://marijohannessen.github.io/color-contrast-checker/" target="_blank">Click here for live version</a>
### Based on the <a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html">WCAG 2.0 level AA</a> color contrast requirements. Made for <a href="https://a-k-apart.com/">10k Apart Contest</a>.

### How to use

- Input two color HEX values to calculate the contrast ratio. 
- If the constrast ratio is below 4.5 (red), adjust a color by clicking on 'Lighten' or 'Darken' until the contrast ratio is above 4.5 (green). Note: The approved ratio is 3 for large text.
- Toggle a color to be white or black by clicking on 'Black' or 'White'.

<img src="https://cloud.githubusercontent.com/assets/5447411/19009625/6b540fae-873b-11e6-98fe-1189f680bb1f.png" width="700px" />

### Widget

Click on 'Launch Widget' to open the page in a new window adjusted to the size of the calculator (only available on bigger devices). This provides the user to have the calculator open while developing / designing without having to change tabs.

<img src="https://cloud.githubusercontent.com/assets/5447411/19009624/6b5291ec-873b-11e6-8f9a-ca1ed384984a.png" width="300px" />

### Run Locally

1. Fork and clone this repo
2. Run `npm install`
3. Run `gulp`
4. The website will automatically open in a new tab

### Made with:
- HTML
- SCSS
- Vanilla JS

### Web page stats:

- Performance grade: 100
- Page size: 7.5kb
- Faster than 99% of tested sites on <a href="https://tools.pingdom.com">pingdom</a> (Tested from their San Jose, CA location)

### In Development:

- Chrome extension with color picker

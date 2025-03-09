// This script converts ANSI color codes to HTML
const Convert = require('ansi-to-html');
const fs = require('fs');

// Configure the converter with options to preserve colors
const convert = new Convert({
  fg: '#f8f8f8',
  bg: '#1e1e1e',
  newline: true,
  escapeXML: true,
  colors: {
    0: '#000000',  // black
    1: '#ff0000',  // red
    2: '#00ff00',  // green
    3: '#ffff00',  // yellow
    4: '#0000ff',  // blue
    5: '#ff00ff',  // magenta
    6: '#00ffff',  // cyan
    7: '#ffffff',  // white
    8: '#808080',  // gray
    9: '#ff0000',  // bright red
    10: '#00ff00', // bright green
    11: '#ffff00', // bright yellow
    12: '#0000ff', // bright blue
    13: '#ff00ff', // bright magenta
    14: '#00ffff', // bright cyan
    15: '#ffffff'  // bright white
  }
});

const inputFile = process.argv[2];
const outputFile = process.argv[3];

try {
  // Read the content from input file
  const content = fs.readFileSync(inputFile, 'utf8');
  
  // Convert ANSI to HTML
  const htmlContent = convert.toHtml(content);
  
  // Append to the output file
  fs.appendFileSync(outputFile, htmlContent);
  
  console.log('Successfully converted ANSI to HTML');
} catch (err) {
  console.error('Error converting ANSI to HTML:', err);
  fs.appendFileSync(outputFile, 'Error converting ANSI to HTML: ' + err.message);
  process.exit(1);
} 
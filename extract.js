const fs = require('fs');

const file = 'c:/Users/Indraneel Bose/Desktop/my-website/index.html';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split(/\r?\n/);

const sections = [
  { id: 'sec-proj-graphy', file: 'projects/graphy.html', start: 289, end: 399 },
  { id: 'sec-proj-debate', file: 'projects/debate_model.html', start: 400, end: 425 },
  { id: 'sec-proj-tempestra', file: 'projects/tempestra.html', start: 426, end: 452 },
  { id: 'sec-proj-ridescout', file: 'projects/ridescout.html', start: 453, end: 477 },
  { id: 'sec-proj-ghostshell', file: 'projects/ghostshell.html', start: 478, end: 502 },
  { id: 'sec-proj-exo', file: 'projects/exoplanets.html', start: 503, end: 529 },
  { id: 'sec-case-exo', file: 'cases/nasa_exoplanet_scorer.html', start: 558, end: 856 }
];

let resultLines = [];
let currentLineIdx = 0;

for (const sec of sections) {
    // Add everything up to the start div (including)
    while (currentLineIdx < sec.start - 1) {
        resultLines.push(lines[currentLineIdx]);
        currentLineIdx++;
    }
    
    // Write out the start div with a data-src attribute and an empty loaded flag
    // The previous div had id="sec-proj-graphy", class="term-section"
    // Let's regex replace it to keep the exact formatting but add data-src
    let startDivLine = lines[sec.start - 1]; // e.g. <div class="term-section" id="sec-proj-graphy">
    startDivLine = startDivLine.replace('">', `" data-src="${sec.file}">`);
    resultLines.push(startDivLine);
    resultLines.push('                    <!-- Content loaded dynamically via fetch -->');
    
    // Now extract content
    let extractedContent = [];
    currentLineIdx++; // point to inner content (sec.start)
    while (currentLineIdx < sec.end - 1) { // up to sec.end - 1
        extractedContent.push(lines[currentLineIdx]);
        currentLineIdx++;
    }
    fs.writeFileSync('c:/Users/Indraneel Bose/Desktop/my-website/' + sec.file, extractedContent.join('\n'));
    
    // Add the closing div
    resultLines.push(lines[sec.end - 1]);
    currentLineIdx++; // point to next line
}

// Add the rest
while (currentLineIdx < lines.length) {
    resultLines.push(lines[currentLineIdx]);
    currentLineIdx++;
}

fs.writeFileSync(file, resultLines.join('\n'));
console.log('Extraction complete!');

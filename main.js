const fs = require('fs');
const R = require('ramda');

const sourceFile = process.argv[2];
const targetFile = process.argv[3];

let getWordsToFillTheLine = function (length, words) {
  let word;
  let i = length;
  for (i; i >= 0; i--) {
    if (i <= length && words[i] && words[i].length > 0) {
      word = words[i].pop();
      break;
    }
  }
  if (word && word.length === length) {
    return [word];
  } else if (word && word.length < length) {
    return [word].concat(getWordsToFillTheLine(length - word.length - 1, words));
  }
  return [];
};

const input = fs.readFileSync(sourceFile, 'utf8');

let words = R.compose(
  R.sortBy(w => w.length),
  R.reject(w => w === ''),
  R.split(/\s/)
)(input);

const totalNumberOfWords = words.length;

const wordsLengthMap = R.reduce((map, w) => {
  const length = w.length;
  if (!map[length]) {
    map[length] = []
  }
  map[length].push(w);
  return map;
}, {}, words);

const results = [];
const lineLength = 80;
let wordCounter = 0;

while (true) {
  let foundWords = getWordsToFillTheLine(lineLength, wordsLengthMap);
  wordCounter += foundWords.length;
  results.push(foundWords.join(' '));
  if (wordCounter >= totalNumberOfWords) {
    break;
  }
}

fs.writeFileSync(targetFile, results.join('\n'));

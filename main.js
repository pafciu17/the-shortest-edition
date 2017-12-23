const fs = require('fs');
const R = require('ramda')

const sourceFile = process.argv[2];
const targetFile = process.argv[3];

let getWordsToFillTheLine = function (length, words) {
  let word;
  let i = 0;
  for (i; i < words.length; i++) {
    word = words[i];
    if (word.length <= length) {
      break;
    }
  }

  if (word && word.length === length) {
    return [word]
  } else if (word && word.length < length) {
    return [word].concat(getWordsToFillTheLine(length - word.length - 1, words.slice(i + 1)))
  }
  return [];
};

const input = fs.readFileSync(sourceFile, 'utf8');

let words = R.compose(
  R.reverse,
  R.sortBy(w => w.length),
  R.reject(w => w === ''),
  R.split(/\s/),
)(input);

const results = [];
const lineLength = 80;

while (true) {
  if (words.length === 0) {
    break;
  } else {
    let foundWords = getWordsToFillTheLine(lineLength, words);

    foundWords.forEach(foundWord => {
      const index = words.indexOf(foundWord);
      if (index !== -1) {
        words.splice(index, 1);
      }
    });

    results.push(foundWords.join(' '));
  }
}

fs.writeFileSync(targetFile, results.join('\n'));

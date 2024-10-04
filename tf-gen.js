const { removeStopwords } = require("stopword");
const removePunc = require("remove-punctuation");



let documents = [];
const fs = require("fs");
const path = require("path");
const N = 2874;
for (let i = 1; i <= N; i++) {
  const str = path.join(__dirname, "Problems");
  const str1 = path.join(str, `problem_text_${i}.txt`);
  console.log(str1);
  const question = fs.readFileSync(str1).toString();
  documents.push(question);
}

let docKeywords = [];
for (let i = 0; i < documents.length; i++) {
  const lines = documents[i].split("\n");
  const docWords = [];
  for (let k = 0; k < lines.length; k++) {
    const temp1 = lines[k].split(" ");
    // carriage return characters , we wont be able see some characters
    temp1.forEach((e) => {
      e = e.split("\r");
      //  some times just carriage char might be there
      if (e[0].length) docWords.push(e[0]);
    });
  }
  const newString = removeStopwords(docWords);
  newString.sort();
  let temp = [];
  for (let j = 0; j < newString.length; j++) {
    newString[j] = newString[j].toLowerCase();
    newString[j] = removePunc(newString[j]);
    if (newString[j] !== "") temp.push(newString[j]);
  }

  docKeywords.push(temp);
}


let sum = 0;

for (let i = 0; i < N; i++) {
  const length = docKeywords[i].length;
  sum += length;
  fs.appendFileSync("length.txt", length + "\n");
  console.log(length);
}


let keywords = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < docKeywords[i].length; j++) {
    if (keywords.indexOf(docKeywords[i][j]) === -1)
      keywords.push(docKeywords[i][j]);
  }
}

keywords.sort();
const W = keywords.length;
keywords.forEach((word) => {
  fs.appendFileSync("keywords.txt", word + "\n");
});

let TF = new Array(N);                      // size N i.e., no of documents
for (let i = 0; i < N; i++) {
    TF[i] = new Array(W).fill(0);           //making all zero, ans size W i.e., total no of keywords
    let map = new Map();                    // just a hashmap 
    docKeywords[i].forEach((key) => {
      return map.set(key, 0);
    });

    docKeywords[i].forEach((key) => {
      let cnt = map.get(key);
      cnt++;
      return map.set(key, cnt);
    });

    docKeywords[i].forEach((key) => {
      const id = keywords.indexOf(key);
      if (id !== -1) {
        TF[i][id] = map.get(key) / docKeywords[i].length;
      }
    });
}

for (let i = 0; i < N; i++) {
  for (let j = 0; j < W; j++) {
    if (TF[i][j] != 0)                // if we store all values , it is big , we store only values of words which are there, and remaining are zero
      fs.appendFileSync("TF.txt", i + " " + j + " " + TF[i][j] + "\n");
  }

}


let IDF = new Array(W);
for (let i = 0; i < W; i++) {
  let cnt = 0;
  for (let j = 0; j < N; j++) {
    if (TF[j][i]) {
      cnt++;
    }
  }
  // cnt is no of documents in which that keyword is there. 
  if (cnt) IDF[i] = Math.log((N - cnt + 0.5) / (cnt + 0.5) + 1) + 1; // BM 25 formula
}


IDF.forEach((word) => {
  fs.appendFileSync("IDF.txt", word + "\n");
});
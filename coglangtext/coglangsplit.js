const runFromCli = typeof require !== "undefined" && require.main === module;
if (!runFromCli) return;

const fs = require("fs");

fs.readFile("coglangwords.txt", "utf8", function (err, data) {
  if (err) throw err;
  const lines = data.split("\n");
  writeEnglishWords(lines);
  writeCognateLanguageWords(lines);
  const englishWords = [];
  for (let i = 0; i < lines.length; i++) {
    const englishWord = lines[i].split(",")[1];
    englishWords.push(englishWord);
  }
  useModelToEmbedAllWords(englishWords, fs);
});

function writeEnglishWords(lines) {
  fs.writeFile("out_english.txt", "", function (err) {
    if (err) throw err;
    console.log("Cleared English file.");
  });
  let englishOutput = "";
  for (let i = 0; i < lines.length; i++) {
    const word = lines[i].split(",")[1];
    const addNewLine = i === 0 ? "" : "\n";
    englishOutput += addNewLine + word;
    console.log(`Added English word ${i + 1}!`);
  }
  fs.appendFile("out_english.txt", englishOutput, function (err) {
    if (err) throw err;
  });
}

function writeCognateLanguageWords(lines) {
  fs.writeFile("out_coglang.txt", "", function (err) {
    if (err) throw err;
    console.log("Cleared cognate language file.");
  });
  let cognateLanguageOutput = "";
  for (let i = 0; i < lines.length; i++) {
    const word = lines[i].split(",")[0];
    const addNewLine = i === 0 ? "" : "\n";
    cognateLanguageOutput += addNewLine + word;
    console.log(`Added cognate language word ${i + 1}!`);
  }
  fs.appendFile("out_coglang.txt", cognateLanguageOutput, function (err) {
    if (err) throw err;
  });
}

function useModelToEmbedAllWords(words, fs) {
  require("@tensorflow/tfjs-node");
  const use = require("@tensorflow-models/universal-sentence-encoder");
  // uses Universal Sentence Encoder (U.S.E.):
  use.load().then((model) => {
    embedAllSentences(model, words, fs);
  });
}

function embedAllSentences(model, words, fs) {
  fs.writeFile("embeddings.txt", "", function (err) {
    if (err) throw err;
    console.log("Cleared embeddings file.");
  });
  model.embed(words).then((embeddings) => {
    const embeds = embeddings.arraySync();
    if (fs) {
      let embeddingsOutput = "";
      for (let i = 0; i < embeds.length; i++) {
        const embed = embeds[i];
        const addNewLine = i === 0 ? "" : "\n";
        embeddingsOutput += addNewLine + embed;
        console.log(`Added embedding ${i + 1}!`);
      }
      fs.appendFile("embeddings.txt", embeddingsOutput, function (err) {
        if (err) throw err;
      });
      console.log("Done adding all embeddings (mapped by index).");
    }
  });
}

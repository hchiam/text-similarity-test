const fs = require("fs");
require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

(async () => {
  const inputWord = "canine";
  let mostSimilarWords = await useModel(inputWord);
  console.log(`
top 5 words most similar to ${inputWord}: ${mostSimilarWords.join(", ")}
`);
})();

async function useModel(inputWord) {
  // uses Universal Sentence Encoder (U.S.E.):
  const mostSimilarWords = await use.load().then(async (model) => {
    return await getEmbedding(model, inputWord);
  });
  return mostSimilarWords;
}

function getEmbedding(model, inputWord) {
  return model
    .embed([inputWord])
    .then((inputEmbeddings) => {
      const embeds = inputEmbeddings.arraySync();
      const wordEmbedding = embeds[0];

      const embedsData = readFile("embeddings.txt");
      const lines = embedsData.split("\n");
      if (lines.length === 0) return []; // exit if no data

      const similarities = getAllSimilarityScores(wordEmbedding, embedsData);
      const top5 = getTop5Similarities(similarities);

      const englishData = readFile("out_english.txt");
      const mostSimilarWords = getMostSimilarWordsFromFile(top5, englishData);
      // console.log(mostSimilarWords);
      return mostSimilarWords;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function getAllSimilarityScores(wordEmbedding, data) {
  const lines = data.split("\n");
  if (lines.length === 0) return []; // exit if no data
  const similarities = []; // TODO: use a max heap instead? Reference: https://github.com/hchiam/learning-google-closure-library/blob/master/goog-closure-example.js
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const referenceEmbedding = line.split(",").map((n) => Number(n));
    if (referenceEmbedding.length === 0) continue; // skip empty line
    const similarity = getSimilarityPercent(wordEmbedding, referenceEmbedding);
    similarities.push({ similarity, index });
  }
  // console.log("similarities.length: " + similarities.length);
  return similarities;
}

function getSimilarityPercent(wordEmbedding, referenceEmbedding) {
  const similarity = cosineSimilarity(wordEmbedding, referenceEmbedding);
  // cosine similarity -> % when doing text comparison, since cannot have -ve term frequencies: https://en.wikipedia.org/wiki/Cosine_similarity
  return similarity;
}

function cosineSimilarity(a, b) {
  // https://towardsdatascience.com/how-to-build-a-textual-similarity-analysis-web-app-aa3139d4fb71

  const magnitudeA = Math.sqrt(dotProduct(a, a));
  const magnitudeB = Math.sqrt(dotProduct(b, b));
  if (magnitudeA && magnitudeB) {
    // https://towardsdatascience.com/how-to-measure-distances-in-machine-learning-13a396aa34ce
    return dotProduct(a, b) / (magnitudeA * magnitudeB);
  } else {
    return 0;
  }
}

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function getTop5Similarities(similarities) {
  return similarities
    .sort(function descending(a, b) {
      return b.similarity - a.similarity;
    })
    .slice(0, 5);
  // console.log("top 5 similar indices: " + top5.map((x) => x.index));
  // console.log("top 5 similarities: " + top5.map((x) => x.similarity));
}

function getMostSimilarWordsFromFile(top5, data) {
  const mostSimilarWords = [];
  const lines = data.split("\n");
  top5.forEach((similarity) => {
    const index = similarity.index;
    const word = lines[index];
    mostSimilarWords.push(word);
  });
  // console.log("most similar words: " + mostSimilarWords);
  return mostSimilarWords;
}

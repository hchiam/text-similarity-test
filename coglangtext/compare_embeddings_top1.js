const fs = require("fs");
require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

const inputWord = "canine";
let mostSimilarWord = "";

useModel(inputWord);

async function useModel(inputWord) {
  // uses Universal Sentence Encoder (U.S.E.):
  const output = await use.load().then(async (model) => {
    const similarityFraction = await getEmbedding(model, inputWord);
    return Math.round(similarityFraction * 100 * 100) / 100 + "%";
  });
  return output;
}

async function getEmbedding(model, inputWord) {
  return await model.embed([inputWord]).then(async (embeddings) => {
    const embeds = await embeddings.arraySync();
    const wordEmbedding = embeds[0];

    fs.readFile("embeddings.txt", "utf8", async function (err, data) {
      if (err) throw err;
      const lines = data.split("\n");
      if (lines.length === 0) return; // exit if no data
      let maxSimilarityPercent = 0;
      let indexOfMaxSimilarityPercent = -1;
      for (let i = 0; i < lines.length; i++) {
        const referenceEmbedding = lines[i].split(",").map((n) => Number(n));
        if (referenceEmbedding.length === 0) continue; // skip empty line
        const similarity = await getSimilarityPercent(
          wordEmbedding,
          referenceEmbedding
        );
        // maxSimilarityPercent = Math.max(similarity, maxSimilarityPercent);
        if (similarity > maxSimilarityPercent) {
          indexOfMaxSimilarityPercent = i;
          maxSimilarityPercent = similarity;
        }
        // console.log(similarityPercent);
      }
      console.log("input word: " + inputWord);
      console.log("max similarity: " + maxSimilarityPercent);
      console.log("index: " + indexOfMaxSimilarityPercent);
      fs.readFile("out_english.txt", "utf8", async function (err, data) {
        if (err) throw err;
        const lines = data.split("\n");
        if (indexOfMaxSimilarityPercent > -1) {
          mostSimilarWord = lines[indexOfMaxSimilarityPercent];
          console.log("most similar word: " + mostSimilarWord);
        } else {
          console.log("no similar word found");
        }
      });
    });
  });
}

async function getSimilarityPercent(wordEmbedding, referenceEmbedding) {
  const similarity = await cosineSimilarity(wordEmbedding, referenceEmbedding);
  // cosine similarity -> % when doing text comparison, since cannot have -ve term frequencies: https://en.wikipedia.org/wiki/Cosine_similarity
  return similarity;
}

async function cosineSimilarity(a, b) {
  // https://towardsdatascience.com/how-to-build-a-textual-similarity-analysis-web-app-aa3139d4fb71

  const magnitudeA = await Math.sqrt(dotProduct(a, a));
  const magnitudeB = await Math.sqrt(dotProduct(b, b));
  if (magnitudeA && magnitudeB) {
    // https://towardsdatascience.com/how-to-measure-distances-in-machine-learning-13a396aa34ce
    return (await dotProduct(a, b)) / (magnitudeA * magnitudeB);
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

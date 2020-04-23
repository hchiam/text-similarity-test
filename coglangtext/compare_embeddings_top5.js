const fs = require("fs");
require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

const inputWord = "canine";
let mostSimilarWords = [];

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

      const similarities = []; // TODO: use a max heap instead? Reference: https://github.com/hchiam/learning-google-closure-library/blob/master/goog-closure-example.js
      for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        const referenceEmbedding = line.split(",").map((n) => Number(n));
        if (referenceEmbedding.length === 0) continue; // skip empty line
        const similarity = await getSimilarityPercent(
          wordEmbedding,
          referenceEmbedding
        );
        similarities.push({ similarity, index });
      }

      console.log("similarities.length: " + similarities.length);

      const top5 = similarities
        .sort(function descending(a, b) {
          return b.similarity - a.similarity;
        })
        .slice(0, 5);

      console.log("top 5 similar indices: " + top5.map((x) => x.index));
      console.log("top 5 similarities: " + top5.map((x) => x.similarity));

      fs.readFile("out_english.txt", "utf8", async function (err, data) {
        if (err) throw err;
        const lines = data.split("\n");
        top5.forEach((similarity) => {
          const index = similarity.index;
          const word = lines[index];
          mostSimilarWords.push(word);
        });
        console.log("most similar words: " + mostSimilarWords);
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

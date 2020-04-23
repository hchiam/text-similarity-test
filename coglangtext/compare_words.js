require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");

const input = "Hi!";
const reference = "Hey.";
let similarityPercent;

compare(input, reference).then((result) => {
  similarityPercent = result;
  console.log(`\n${similarityPercent}\n`);
});

async function compare(input, reference) {
  return await useModel(input, reference);
}

async function useModel(sentence1, sentence2) {
  // uses Universal Sentence Encoder (U.S.E.):
  const output = await use.load().then(async (model) => {
    const similarityFraction = await embedSentences(
      model,
      sentence1,
      sentence2
    );
    return Math.round(similarityFraction * 100 * 100) / 100 + "%";
  });
  return output;
}

async function embedSentences(model, sentence1, sentence2) {
  const sentences = [sentence1, sentence2];
  return await model.embed(sentences).then(async (embeddings) => {
    const embeds = await embeddings.arraySync();
    const sentence1Embedding = embeds[0];
    const sentence2Embedding = embeds[1];
    const similarityPercent = await getSimilarityPercent(
      sentence1Embedding,
      sentence2Embedding
    );
    return similarityPercent;
  });
}

async function getSimilarityPercent(embed1, embed2) {
  const similarity = await cosineSimilarity(embed1, embed2);
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

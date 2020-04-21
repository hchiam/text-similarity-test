/**
 * References:
 *
 * https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder
 * https://towardsdatascience.com/how-to-build-a-textual-similarity-analysis-web-app-aa3139d4fb71
 * https://github.com/jinglescode/demos/tree/master/src/app/components/nlp-sentence-encoder
 * https://towardsdatascience.com/how-to-measure-distances-in-machine-learning-13a396aa34ce
 * https://en.wikipedia.org/wiki/Cosine_similarity
 *
 * */

// require("@tensorflow/tfjs-node");
// const use = require("@tensorflow-models/universal-sentence-encoder");
// <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
// <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder"></script>

// const sentence1 = "How's it going?";
// const sentence2 = "How are you?";
// useModel(sentence1, sentence2, output);
function useModel(sentence1, sentence2, callback) {
  // uses Universal Sentence Encoder (U.S.E.):
  use.load().then((model) => {
    embedSentences(model, sentence1, sentence2, callback);
  });
}

function embedSentences(model, sentence1, sentence2, callback) {
  const sentences = [sentence1, sentence2];
  model.embed(sentences).then((embeddings) => {
    const embeds = embeddings.arraySync();
    const sentence1Embedding = embeds[0];
    const sentence2Embedding = embeds[1];
    getSimilarityPercent(sentence1Embedding, sentence2Embedding, callback);
  });
}

function getSimilarityPercent(embed1, embed2, callback) {
  const similarity = cosineSimilarity(embed1, embed2);
  // cosine similarity -> % when doing text comparison, since cannot have -ve term frequencies: https://en.wikipedia.org/wiki/Cosine_similarity
  if (callback) callback(similarity);
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

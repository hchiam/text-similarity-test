# Text Similarity Test (using [TensorFlow.js](https://github.com/hchiam/learning-tensorflow))

![version](https://img.shields.io/github/release/hchiam/text-similarity-test)

It outputs a percent similarity between two sentences.

This tool could possibly be used to check whether a free-form answer closely matches the expected answer in meaning. For best results, you probably should constrain responses to short sentences (i.e. short answer questions only).

Powered by a [universal sentence encoder TensorFlow.js model](https://tfhub.dev/google/universal-sentence-encoder/).

## Try it in your browser

<https://codepen.io/hchiam/pen/oNjzQRa>

## Try it from your own computer

`open index.html` or [`yarn start`](https://github.com/hchiam/learning-yarn) or `npm start`

You can run `useModelToEmbedAllSentences` from CLI with `node tfjs-stuff.js`

## Import it into your own project

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/universal-sentence-encoder"></script>
<script src="https://cdn.jsdelivr.net/gh/hchiam/text-similarity-test@1.0.0/tfjs-stuff.js"></script>
```

```js
var sentence1 = "Hello there!";
var sentence2 = "Hi, nice to see you!";
function callback(similarityScore) {
  alert(Math.round(similarityScore * 100 * 100) / 100 + "%");
}
useModel(sentence1, sentence2, callback); // useModel comes from tfjs-stuff.js
```

## Another example

<https://codepen.io/hchiam/pen/abJGGox>

<https://github.com/hchiam/text-similarity-test/blob/master/summary-test.html>

## More things I'm testing

(See the `coglangtext` sub-folder.)

## Useful references used

- https://github.com/tensorflow/tfjs-models/tree/master/universal-sentence-encoder
- https://towardsdatascience.com/how-to-build-a-textual-similarity-analysis-web-app-aa3139d4fb71
- https://github.com/jinglescode/demos/tree/master/src/app/components/nlp-sentence-encoder
- https://towardsdatascience.com/how-to-measure-distances-in-machine-learning-13a396aa34ce
- https://en.wikipedia.org/wiki/Cosine_similarity

## Related repos

<https://github.com/hchiam/learning-tensorflow>

<https://github.com/hchiam/text-similarity-test-microservice>

function getSimilarityOfInput() {
  document.getElementById("get-similarity").style.display = "none";
  document.getElementById("spinner").style.visibility = "visible";
  document.getElementById("input").setAttribute("disabled", true);
  document.getElementById("input").classList.add("disabled");
  const sentence1 = document.getElementById("sentence1").value;
  const sentence2 = document.getElementById("input").value;
  useModel(sentence1, sentence2, showOutput);
}

function showOutput(similarity) {
  const percent = similarity * 100;
  document.getElementById("similarity").innerText = get2Decimals(percent) + "%";
  document.getElementById("output").style.visibility = "visible";
  document.getElementById("get-similarity").style.display = "block";
  document.getElementById("spinner").style.visibility = "hidden";
  document.getElementById("input").setAttribute("disabled", false);
  document.getElementById("input").classList.remove("disabled");
}

function get2Decimals(number) {
  return Math.round(number * 100) / 100;
}

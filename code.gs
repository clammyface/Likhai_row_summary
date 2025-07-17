function LIKHAI_ROW(range, prompt, tryActual = false, model = "", ...headers) {
  return likhaiRowHandler(range, prompt, tryActual, model, headers);
}

function LIKHAI_SUMMARY(inputRange, prompt, tryActual = false, model = "") {
  return likhaiSummaryHandler(inputRange, prompt, tryActual, model);
}

function callLiteLLM(prompt, model, apiKey) {
  const payload = {
    model: model,
    prompt: prompt,
    max_tokens: 500,
    temperature: 0,
  };

  const response = UrlFetchApp.fetch("https://dev-litellm.leadschool.in/completions", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {
      Authorization: "Bearer " + apiKey,
    },
    muteHttpExceptions: true,
  });

  const json = JSON.parse(response.getContentText());
  return json.choices?.[0]?.text?.trim() || "❌ Empty response";
}
